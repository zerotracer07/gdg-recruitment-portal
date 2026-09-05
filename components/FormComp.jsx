import React, { useEffect, useMemo, useState } from "react";
import * as z from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { ChevronDown, Clock, Megaphone, UsersRound, X } from "lucide-react";
import { QuestionnaireData } from "@/constants";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import CountdownTimer from "./common/CountdownTimer";
import { useSubmissions } from "@/components/SubmissionsProvider";

const normaliseQuestion = (question) => (
  typeof question === "string"
    ? { name: question, type: "generic", placeholder: "2-3 sentences" }
    : question
);

const FormComp = ({ dept1, dept2, isLoading, setIsLoading }) => {
  // Use Better Auth's useSession hook directly
  const { data: session, isPending, error } = authClient.useSession();
  
  const user = session?.user;
  const isSignedIn = !!user;
  const isLoaded = !isPending;

  // Track prior auth so an expired mid-form session shows the right message
  // (and users know their draft answers are preserved locally).
  const [wasSignedIn, setWasSignedIn] = useState(false);
  useEffect(() => {
    if (isSignedIn) setWasSignedIn(true);
  }, [isSignedIn]);

  // Form lifecycle state
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);

  const router = useRouter();
  const { submittedDepartments: contextSubmitted, markDepartmentsSubmitted } = useSubmissions();
  const [submittedDepartments, setSubmittedDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDraftReady, setIsDraftReady] = useState(false);
  const departmentNames = useMemo(
    () => [dept1, dept2].filter(Boolean).map((department) => typeof department === "string" ? department : department.name),
    [dept1, dept2]
  );
  const draftKey = user?.email && departmentNames.length
    ? `recruitment-draft:${user.email}:${[...departmentNames].sort().join("|")}`
    : null;

  // Check application count when user is loaded
  useEffect(() => {
    if (user) {
      const userEmail = user.email;
      checkApplicationCount(userEmail);
    }
  }, [user]);

  // Function to check application count
  async function checkApplicationCount(userEmail) {
    const checkResponse = await fetch(
      `/api/check-applications?email=${userEmail}`
    );
    const { count } = await checkResponse.json();

    if (count >= 2) {
      setErrorMessage(
        "Remember that you can only submit upto 2 unique applications"
      );
      setIsSubmitting(false);
      return;
    }
  }

  const normalizeDeptName = (str) => (str ? str.trim().toLowerCase().replace(/\s*\/\s*/g, "/") : "");

  const questionData = useMemo(
    () => [...new Set(departmentNames.flatMap((department) =>
      (QuestionnaireData.find((item) => normalizeDeptName(item.department) === normalizeDeptName(department))?.questions ?? [])
        .map(normaliseQuestion)
        .map((question) => question.name)
    ))],
    [departmentNames]
  );

  const schemaObj = {
    Name: z.string().min(1, "Name is required"),
    RegistrationNumber: z
      .string()
      .min(1, "Registration number is required")
      .regex(
        /^\d{2}[A-Z]{3}\d{4}$/,
        "Registration number must be 2 numbers, 3 uppercase letters, and 4 numbers (e.g. 25BCE5612)"
      ),
    Email: z.string(),
    Phone: z
      .string()
      .min(1, "Phone is required")
      .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
    Gender: z.string().min(1, "Please select your gender"),
    "Year of Study": z.string().min(1, "Please select your year of study"),
    "Why do you want to join GDG VITC?": z.string().min(1, "This answer is required"),
  };

  questionData.forEach((qd) => {
    schemaObj[qd] = z.string().min(1, "This answer is required");
  });

  const formSchema = z.object(schemaObj);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Name: "",
      RegistrationNumber: "",
      Email: "",
      Phone: "",
      Gender: "",
      "Year of Study": "",
      "Why do you want to join GDG VITC?": "",
    },
  });

  useEffect(() => {
    if (!isLoaded || !user || !draftKey) return;

    const email = user.email;
    let isActive = true;
    setIsDraftReady(false);

    try {
      const savedDraft = JSON.parse(localStorage.getItem(draftKey) || "{}");
      form.reset({ ...form.getValues(), ...savedDraft.values, Email: email });
    } catch {
      form.setValue("Email", email);
    }

    async function initialiseForm() {
      const savedDraft = JSON.parse(localStorage.getItem(draftKey) || "{}");
      let remoteSubmitted = contextSubmitted || [];

      if (!remoteSubmitted.length) {
        const cacheKey = `submitted_depts_${email}`;
        const cached = typeof window !== "undefined" ? sessionStorage.getItem(cacheKey) : null;

        if (cached) {
          try {
            remoteSubmitted = JSON.parse(cached);
          } catch {}
        } else {
          try {
            const response = await fetch(`/api/check-applications?email=${encodeURIComponent(email)}`);
            const result = await response.json();
            if (result?.submittedDepartments) {
              remoteSubmitted = result.submittedDepartments;
              if (typeof window !== "undefined") {
                sessionStorage.setItem(cacheKey, JSON.stringify(remoteSubmitted));
              }
            }
          } catch (err) {
            console.error("Failed to check applications:", err);
          }
        }
      }

      if (!isActive) return;
      const completed = [...new Set([...(savedDraft.submittedDepartments || []), ...remoteSubmitted])];
      setSubmittedDepartments(completed);
      if (departmentNames.length > 0 && departmentNames.every((dept) => completed.includes(dept))) {
        setErrorMessage(`You have already submitted an application for ${departmentNames.join(" and ")}.`);
      }
      localStorage.setItem(draftKey, JSON.stringify({ values: form.getValues(), submittedDepartments: completed }));
      setLoading(false);
      setIsDraftReady(true);
    }

    initialiseForm().catch(() => {
      if (isActive) {
        setLoading(false);
        setIsDraftReady(true);
      }
    });

    return () => { isActive = false; };
  }, [contextSubmitted, departmentNames, draftKey, form, isLoaded, user]);

  const watchedValues = useWatch({ control: form.control });

  useEffect(() => {
    if (!isDraftReady || !draftKey) return;
    try {
      localStorage.setItem(draftKey, JSON.stringify({ values: watchedValues, submittedDepartments }));
      setLastSavedAt(new Date());
    } catch {
      // storage full/blocked — form still works, draft just won't persist
    }
  }, [draftKey, isDraftReady, submittedDepartments, watchedValues]);

  // Check if user is authenticated
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <span className="mx-auto mb-4 block h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    const expired = wasSignedIn;
    return (
      <div className="mx-auto flex min-h-[40vh] max-w-md items-center justify-center">
        <div className="w-full rounded-2xl border bg-card p-8 text-center shadow-sm">
          <p className="text-xl font-bold">
            {expired ? "Session expired" : "Sign In Required"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {expired
              ? "Your session ended, but your draft answers are saved on this device. Sign in again to continue."
              : "Please sign in to access the application form."}
          </p>
          <Button onClick={() => router.push("/auth/signin")} className="mt-5 w-full bg-blue-600 hover:bg-blue-700">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  // User is authenticated
  const userEmail = user?.email;

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setErrorMessage("");

    const pendingDepartments = departmentNames.filter((department) => !submittedDepartments.includes(department));

    if (!pendingDepartments.length) {
      toast.success("Your applications have already been submitted.");
      setIsSubmitting(false);
      router.push("/departments");
      return;
    }

    const basicDetails = {
      Name: values.Name,
      RegistrationNumber: values.RegistrationNumber,
      Email: values.Email,
      Phone: values.Phone,
      Gender: values.Gender || "",
      "Year of Study": values["Year of Study"] || "",
      "Why do you want to join GDG VITC?": values["Why do you want to join GDG VITC?"] || "",
    };

    const submitDepartment = async (department) => {
      const questions = (QuestionnaireData.find((item) => normalizeDeptName(item.department) === normalizeDeptName(department))?.questions ?? [])
        .map(normaliseQuestion);

      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...basicDetails,
          Department: department,
          Questions: questions.reduce((answers, question) => ({ ...answers, [question.name]: values[question.name] || "" }), {}),
        }),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Could not submit ${department}.`);
      }
      return { department, success: true };
    };

    try {
      const results = await Promise.allSettled(pendingDepartments.map(submitDepartment));
      const successful = results
        .filter((result) => result.status === "fulfilled" && result.value.success)
        .map((result) => result.value.department);
      const failures = results.flatMap((result, index) =>
        result.status === "rejected"
          ? [{ department: pendingDepartments[index], reason: result.reason?.message }]
          : []
      );
      const failed = failures.map((f) => f.department);
      const completed = [...new Set([...submittedDepartments, ...successful])];

      setSubmittedDepartments(completed);
      markDepartmentsSubmitted(completed);
      if (draftKey) localStorage.setItem(draftKey, JSON.stringify({ values, submittedDepartments: completed }));
      if (typeof window !== "undefined" && values?.Email) {
        sessionStorage.setItem(`submitted_depts_${values.Email}`, JSON.stringify(completed));
      }
      successful.forEach((department) => toast.success(`Application submitted for ${department}.`));

      if (failed.length) {
        const firstReason = failures.find((f) => f.reason)?.reason;
        setErrorMessage(
          `${successful.length ? `Submitted ${successful.join(", ")}. ` : "Submitted no applications. "}` +
          `Please retry ${failed.join(", ")}.${firstReason ? ` Reason: ${firstReason}` : ""}`
        );
      } else {
        router.push("/departments");
      }
    } catch {
      setErrorMessage("Your applications could not be submitted. Your saved answers will be kept for retrying.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <p>Checking your application status...</p>
      </div>
    );
  }

  if (!isFormOpen) {
    return (
      <div>
        <p>Recruitment Closed</p>
        <p>Recruitment has now been terminated.</p>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
      {errorMessage && !isSubmitting && (
        <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm font-medium text-destructive">{errorMessage}</p>
          <button
            type="button"
            onClick={() => router.push("/departments")}
            className="mt-2 rounded-md border px-3 py-1.5 text-xs font-semibold hover:bg-accent"
          >
            Go Back
          </button>
        </div>
      )}

      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Step 02 · Apply
      </p>
      <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">Application Form</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Applying to: <strong className="text-foreground">{departmentNames.join(", ")}</strong>
        {isDraftReady && lastSavedAt && (
          <span className="ml-2 text-xs" aria-live="polite">
            · Draft auto-saved {lastSavedAt.toLocaleTimeString()}
          </span>
        )}
      </p>

      <hr className="my-6" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <section className="rounded-2xl border bg-background/60 p-5 sm:p-6">
            <h2 className="text-base font-bold">About You</h2>
            <p className="mb-4 text-xs text-muted-foreground">
              Tell us who you are — this goes with every application.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="Name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Jane Doe" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="RegistrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. 25BCE5612" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        value={field.value || ""}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="" disabled>
                          Select Gender
                        </option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (WhatsApp)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="9876543210" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Year of Study"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year of Study</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        value={field.value || ""}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="" disabled>
                          Select year
                        </option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="Why do you want to join GDG VITC?"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Why do you want to join GDG VITC?</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} placeholder="2-3 Sentences" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <hr className="my-2" />

          {renderDepartmentQuestions(departmentNames[0], QuestionnaireData, form)}
          {departmentNames[1] && renderDepartmentQuestions(departmentNames[1], QuestionnaireData, form)}

          <div className="mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-shine w-full rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition hover:-translate-y-0.5 disabled:translate-none disabled:opacity-50 sm:w-auto sm:px-8"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </Form>
    </main>
  );
};

const renderDepartmentQuestions = (department, QuestionnaireData, form) => {
  const normalize = (str) => (str ? str.trim().toLowerCase().replace(/\s*\/\s*/g, "/") : "");
  const questions = (
    QuestionnaireData.find(qd => normalize(qd.department) === normalize(department))?.questions ?? []
  )
    .map(normaliseQuestion)
    .filter((question) => question.name !== "Why do you want to join GDG VITC?" && question.name !== "Why do you want to join DWASFW?");

  if (!questions.length) return null;

  return (
    <section className="rounded-2xl border bg-background/60 p-5 sm:p-6">
      <h2 className="text-base font-bold">{department} Questions</h2>
      <p className="mb-4 text-xs text-muted-foreground">
        Answer in your own words — there are no trick questions.
      </p>
      <div className="space-y-5">
        {questions.map((question) => {
          const isCompact = question.type === "short-text";

          return (
            <div key={question.name}>
              <FormField
                control={form.control}
                name={question.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{question.name}</FormLabel>
                    <FormControl>
                      {isCompact ? (
                        <Input
                          {...field}
                          placeholder={question.placeholder || "Answer..."}
                        />
                      ) : (
                        <Textarea
                          {...field}
                          rows={4}
                          placeholder={question.placeholder || "2-3 sentences"}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FormComp;
