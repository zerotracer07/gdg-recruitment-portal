"use client";
import React from "react";
import { authClient } from "@/lib/auth-client";
import DataTable from "./DataTable";
import AdminStats from "./AdminStats";

const AdminContent = ({ applicants }) => {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <p className="p-8 text-center text-sm text-muted-foreground">Loading...</p>;
  }

  if (!session?.user) {
    return (
      <div className="mx-auto max-w-md p-8 text-center">
        <h2 className="text-xl font-bold">Authentication Required</h2>
        <p className="mt-2 text-sm text-muted-foreground">Please sign in to access the admin panel.</p>
        <button
          type="button"
          onClick={() => { window.location.href = "/auth/signin"; }}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (session.user.role !== "admin") {
    return (
      <div className="mx-auto max-w-md p-8 text-center">
        <h2 className="text-xl font-bold">Access Denied</h2>
        <p className="mt-2 text-sm text-muted-foreground">You are not authorized to view this page.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      <h1 className="text-2xl font-bold">Applicants ({applicants?.length ?? 0})</h1>
      <AdminStats applicants={applicants ?? []} />
      <DataTable data={applicants ?? []} />
    </div>
  );
};

export default AdminContent;
