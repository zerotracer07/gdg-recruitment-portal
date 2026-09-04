import React from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import NavBar from "@/components/NavBar";
import { connect, serializeFirestoreData } from "@/lib/db";
import { auth } from "@/lib/auth";
import AdminContent from "@/components/AdminContent";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "admin") {
    return (
      <main>
        <NavBar />
        <div className="mx-auto max-w-md p-8 text-center">
          <h1 className="text-xl font-bold">Access Denied</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You are not authorized to view this page.
          </p>
        </div>
      </main>
    );
  }

  const db = await connect();
  const snapshot = await db.collection("formData").get();
  const applicants = snapshot.docs.map((doc) => ({
    id: doc.id,
    _id: doc.id,
    ...serializeFirestoreData(doc.data()),
  }));

  return (
    <main>
      <NavBar />
      <AdminContent applicants={applicants} />
    </main>
  );
}
