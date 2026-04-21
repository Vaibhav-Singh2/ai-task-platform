"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { Card, StatusBadge } from "@/components/ui";
import { session, tasksApi, type TaskItem } from "@/lib/api";

const fallbackStats = {
  total: 1284,
  running: 12,
  completed: 1268,
  failed: 4,
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = session.getToken();

    if (!token) {
      window.location.href = "/login";
      return;
    }

    const load = async () => {
      try {
        const response = await tasksApi.list(token);
        setTasks(response.tasks);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load dashboard",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  const stats = useMemo(() => {
    if (!tasks.length) {
      return fallbackStats;
    }

    return {
      total: tasks.length,
      running: tasks.filter((task) => task.status === "running").length,
      completed: tasks.filter((task) => task.status === "success").length,
      failed: tasks.filter((task) => task.status === "failed").length,
    };
  }, [tasks]);

  return (
    <AppShell
      active="dashboard"
      title="Systems Online"
      subtitle="Welcome back. Your AI engines are actively processing workflows."
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] muted">
            Total Tasks
          </p>
          <p className="mt-3 text-4xl font-black tracking-tight">
            {stats.total}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] muted">
            Running Tasks
          </p>
          <p className="mt-3 text-4xl font-black tracking-tight">
            {stats.running}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] muted">
            Completed Tasks
          </p>
          <p className="mt-3 text-4xl font-black tracking-tight">
            {stats.completed}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] muted">
            Failed Tasks
          </p>
          <p className="mt-3 text-4xl font-black tracking-tight">
            {stats.failed}
          </p>
        </Card>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="p-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight">
                Processing Velocity
              </h2>
              <p className="muted text-sm">
                Real-time throughput analysis across active clusters.
              </p>
            </div>
            <div className="rounded-lg bg-(--surface-soft) px-3 py-2 text-xs font-extrabold">
              24H
            </div>
          </div>
          <div className="grid h-52 grid-cols-12 items-end gap-2">
            {[72, 52, 64, 81, 42, 76, 94, 66, 84, 58, 76, 85].map((v) => (
              <div
                key={v}
                style={{ height: `${v}%` }}
                className="rounded-t-lg bg-blue-200"
              />
            ))}
          </div>
        </Card>

        <Card className="bg-linear-to-br from-blue-700 to-blue-500 p-6 text-white">
          <h2 className="text-xl font-black tracking-tight">
            Efficiency Rating
          </h2>
          <p className="mt-2 text-sm text-blue-100">
            AI logic paths optimized by 14.2% since last update.
          </p>
          <p className="mt-8 text-6xl font-black leading-none">98.4%</p>
          <p className="mt-3 text-xs font-extrabold uppercase tracking-[0.18em] text-blue-100">
            Optimal State
          </p>
        </Card>
      </section>

      <Card className="mt-6 p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tight">
            Active Task Stream
          </h2>
          <Link href="/tasks" className="text-sm font-extrabold text-blue-700">
            View All
          </Link>
        </div>
        <div className="grid gap-3">
          {isLoading ? (
            <p className="muted text-sm">Loading live tasks...</p>
          ) : error ? (
            <p className="text-sm font-semibold text-red-600">{error}</p>
          ) : (
            tasks.slice(0, 3).map((task) => (
              <article
                key={task.id}
                className="rounded-xl border border-(--line) bg-(--surface-soft) p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-extrabold">{task.title}</h3>
                    <p className="muted text-sm">
                      {task.operation} • {task.createdAt}
                    </p>
                  </div>
                  <StatusBadge status={task.status} />
                </div>
              </article>
            ))
          )}
        </div>
      </Card>
    </AppShell>
  );
}
