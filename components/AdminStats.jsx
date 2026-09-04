"use client";

import React, { useMemo } from "react";
import { APPLICATION_STATUSES, DECIDED_STATUSES } from "@/constants";

const fmtDays = (d) =>
  d == null || Number.isNaN(d) ? "—" : d < 1 ? "<1 day" : `${d.toFixed(1)} days`;

export default function AdminStats({ applicants = [] }) {
  const stats = useMemo(() => {
    const total = applicants.length;
    const byDept = {};
    const byStatus = { applied: 0, under_review: 0, interview: 0, accepted: 0, rejected: 0 };
    let decidedMs = [];
    let shortlisted = 0;

    for (const a of applicants) {
      const dept = a.Department || "Unknown";
      byDept[dept] = (byDept[dept] || 0) + 1;
      const st = a.status || "applied";
      if (st in byStatus) byStatus[st] += 1;
      if (a.shortlisted) shortlisted += 1;
      if (DECIDED_STATUSES.includes(st) && a.createdAt && a.updatedAt) {
        const ms = new Date(a.updatedAt) - new Date(a.createdAt);
        if (!Number.isNaN(ms) && ms >= 0) decidedMs.push(ms);
      }
    }

    const decided = byStatus.accepted + byStatus.rejected;
    return {
      total,
      byDept: Object.entries(byDept).sort((x, y) => y[1] - x[1]),
      byStatus,
      decided,
      acceptRate: total ? (byStatus.accepted / total) * 100 : 0,
      shortlistRate: total ? (shortlisted / total) * 100 : 0,
      avgDecisionDays:
        decidedMs.length > 0
          ? decidedMs.reduce((s, v) => s + v, 0) / decidedMs.length / 86400000
          : null,
    };
  }, [applicants]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total applications", value: stats.total },
          { label: "Decided", value: stats.decided },
          { label: "Acceptance rate", value: `${stats.acceptRate.toFixed(1)}%` },
          { label: "Avg. time to decision", value: fmtDays(stats.avgDecisionDays) },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl border bg-card p-4 shadow-sm">
            <p className="text-2xl font-extrabold">{c.value}</p>
            <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {c.label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-4 shadow-sm">
          <h2 className="text-sm font-bold">Applications per department</h2>
          <ul className="mt-3 space-y-2">
            {stats.byDept.length === 0 && (
              <li className="text-sm text-muted-foreground">No applications yet.</li>
            )}
            {stats.byDept.map(([dept, n]) => (
              <li key={dept} className="flex items-center gap-3 text-sm">
                <span className="w-40 shrink-0 truncate font-medium">{dept}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                  <span
                    className="block h-full rounded-full bg-primary"
                    style={{ width: `${stats.total ? (n / stats.total) * 100 : 0}%` }}
                  />
                </span>
                <span className="w-8 text-right font-bold">{n}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-sm">
          <h2 className="text-sm font-bold">Status funnel</h2>
          <ul className="mt-3 space-y-2">
            {APPLICATION_STATUSES.map((s) => {
              const n = stats.byStatus[s.value] || 0;
              return (
                <li key={s.value} className="flex items-center gap-3 text-sm">
                  <span className="flex w-40 shrink-0 items-center gap-2 font-medium">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: s.color }}
                    />
                    {s.label}
                  </span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                    <span
                      className="block h-full rounded-full"
                      style={{
                        width: `${stats.total ? (n / stats.total) * 100 : 0}%`,
                        backgroundColor: s.color,
                      }}
                    />
                  </span>
                  <span className="w-8 text-right font-bold">{n}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
