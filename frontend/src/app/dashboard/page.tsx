"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { Card, StatusBadge } from "@/components/ui";
import { session, tasksApi, type TaskItem } from "@/lib/api";


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
      return { total: 0, running: 0, completed: 0, failed: 0 };
    }

    return {
      total: tasks.length,
      running: tasks.filter((task) => task.status === "running").length,
      completed: tasks.filter((task) => task.status === "success").length,
      failed: tasks.filter((task) => task.status === "failed").length,
    };
  }, [tasks]);

  const velocityData = useMemo(() => {
    if (!tasks.length) return Array(12).fill(0);
    const now = new Date();
    const buckets = new Array(12).fill(0);
    tasks.forEach(task => {
      const d = new Date(task.createdAt);
      const diffHours = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));
      if (diffHours < 12 && diffHours >= 0) {
        buckets[11 - diffHours] += 1;
      }
    });
    const maxVal = Math.max(...buckets, 1);
    return buckets.map(val => (val / maxVal) * 100);
  }, [tasks]);

  const efficiencyRating = useMemo(() => {
    if (!tasks.length) return "100.0";
    const completed = tasks.filter(t => t.status === "success").length;
    const failed = tasks.filter(t => t.status === "failed").length;
    if (completed + failed === 0) return "100.0";
    return ((completed / (completed + failed)) * 100).toFixed(1);
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
                Real-time throughput analysis across active clusters (Last 12 Hours).
              </p>
            </div>
            <div className="rounded-lg bg-(--surface-soft) px-3 py-2 text-xs font-extrabold">
              12H
            </div>
          </div>
          <div className="grid h-52 grid-cols-12 items-end gap-2">
            {velocityData.map((v, i) => (
              <div
                key={i}
                style={{ height: `${Math.max(v, 2)}%` }}
                className="rounded-t-lg bg-blue-200 transition-all duration-500"
              />
            ))}
          </div>
        </Card>

        <Card className="bg-linear-to-br from-blue-700 to-blue-500 p-6 text-white border-transparent">
          <h2 className="text-xl font-black tracking-tight">
            Efficiency Rating
          </h2>
          <p className="mt-2 text-sm text-blue-100">
            Success rate of AI logic paths based on processed tasks.
          </p>
          <p className="mt-8 text-6xl font-black leading-none">{efficiencyRating}%</p>
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
