"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { reviews } from "@/constants";
import { useSubmissions } from "@/components/SubmissionsProvider";
import { Check, ArrowRight } from "lucide-react";
import InitialAvatar from "@/components/InitialAvatar";

const departments = reviews;

const DepartmentsListPage = () => {
  const router = useRouter();
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const { submittedDepartments } = useSubmissions();
  const remainingSlots = Math.max(0, 2 - (submittedDepartments?.length ?? 0));
  const selectedIds = departments
    .filter((dept) => selectedDepartments.includes(dept.name))
    .map((dept) => dept.id);

  const toggleDepartment = (departmentName) => {
    if (submittedDepartments.includes(departmentName)) {
      toast.error(`You have already submitted an application for ${departmentName}.`);
      return;
    }
    if (remainingSlots <= 0) {
      toast.error("You have already submitted the maximum allowed (2) applications.");
      return;
    }
    setSelectedDepartments((current) => {
      if (current.includes(departmentName)) {
        return current.filter((name) => name !== departmentName);
      }
      if (current.length >= remainingSlots) {
        toast.error(`You can select at most ${remainingSlots} department(s).`);
        return current;
      }
      return [...current, departmentName];
    });
  };

  const goToApplication = () => {
    if (!selectedIds.length) return;
    router.push(`/join/${selectedIds.join("/")}`);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <NavBar />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Step 01 · Select
        </p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Pick your departments
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Select up to <strong className="text-foreground">two</strong> departments.
              {submittedDepartments?.length > 0 && (
                <span> Already submitted: {submittedDepartments.join(", ")}</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border px-3 py-1 text-xs font-semibold">
              {selectedDepartments.length} / 2 selected
            </span>
            <button
              type="button"
              onClick={goToApplication}
              disabled={selectedIds.length === 0}
              className="group inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition hover:-translate-y-0.5 disabled:translate-none disabled:opacity-40 disabled:shadow-none"
            >
              Continue
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${(selectedDepartments.length / 2) * 100}%` }}
          />
        </div>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {departments.map((department) => {
            const isSelected = selectedDepartments.includes(department.name);
            const isSubmitted = submittedDepartments.includes(department.name);
            const DeptIcon = department.icon;
            return (
              <li
                key={department.id}
                onClick={() => !isSubmitted && toggleDepartment(department.name)}
                className={`group relative cursor-pointer overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                  isSelected ? "border-transparent ring-2 ring-primary" : ""
                } ${isSubmitted ? "cursor-not-allowed opacity-60" : ""}`}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ backgroundColor: department.tone || "var(--primary)" }}
                />
                <span className="flex items-start justify-between gap-3">
                  <span className="flex min-w-0 items-start gap-3">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${department.tone || "#4285F4"}1a` }}
                    >
                      {DeptIcon && <DeptIcon width={24} height={24} />}
                    </span>
                    <span className="min-w-0">
                      <strong className="text-base">{department.name}</strong>
                      {isSubmitted && (
                        <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium">
                          Submitted
                        </span>
                      )}
                      <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                        {department.description}
                      </span>
                      {department.leads?.length > 0 && (
                        <span className="mt-2.5 flex flex-wrap items-center gap-1.5">
                          {department.leads.map((l) => (
                            <span
                              key={l.name}
                              className="inline-flex items-center gap-1.5 rounded-full border bg-background py-0.5 pl-0.5 pr-2.5 text-[11px] font-medium"
                            >
                              <InitialAvatar
                                name={l.name}
                                color={department.tone}
                                size="xs"
                              />
                              {l.name}
                            </span>
                          ))}
                        </span>
                      )}
                    </span>
                  </span>
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
                      isSelected || isSubmitted
                        ? "border-primary bg-primary text-primary-foreground"
                        : "text-transparent group-hover:border-primary"
                    }`}
                  >
                    <Check className="h-4 w-4" />
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      <Footer />
    </main>
  );
};

export default DepartmentsListPage;
