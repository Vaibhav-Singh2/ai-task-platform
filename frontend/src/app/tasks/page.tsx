"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { Card, StatusBadge } from "@/components/ui";
import { session, tasksApi, type TaskItem } from "@/lib/api";

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
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
        const response = await tasksApi.list(token, { status, search });
        setTasks(response.tasks);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load tasks",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [search, status]);

  return (
    <AppShell
      active="tasks"
      title="Task Control"
      subtitle="Monitor and curate the active processing pipeline."
    >
      <section className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <Card className="p-5">
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tasks..."
              className="min-w-56 rounded-full border border-(--line) bg-(--surface) px-4 py-2 text-sm outline-none"
            />
            <button
              onClick={() => setStatus("all")}
              className="rounded-full bg-blue-100 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-blue-800"
            >
              All Tasks
            </button>
            <button
              onClick={() => setStatus("running")}
              className="rounded-full bg-(--surface-soft) px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] muted"
            >
              Running
            </button>
            <button
              onClick={() => setStatus("pending")}
              className="rounded-full bg-(--surface-soft) px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] muted"
            >
              Pending
            </button>
            <button
              onClick={() => setStatus("success")}
              className="rounded-full bg-(--surface-soft) px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] muted"
            >
              Success
            </button>
            <button
              onClick={() => setStatus("failed")}
              className="rounded-full bg-(--surface-soft) px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] muted"
            >
              Failed
            </button>
          </div>
        </Card>

        <Card className="bg-linear-to-br from-blue-700 to-blue-500 p-5 text-white">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-100">
            Success Rate
          </p>
          <p className="mt-2 text-4xl font-black">98.4%</p>
        </Card>
      </section>

      <Card className="mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-(--surface-soft)">
              <tr>
                <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-[0.14em] muted">
                  Task Title
                </th>
                <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-[0.14em] muted">
                  Operation
                </th>
                <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-[0.14em] muted">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-[0.14em] muted">
                  Created At
                </th>
                <th className="px-6 py-4 text-right text-xs font-extrabold uppercase tracking-[0.14em] muted">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="px-6 py-5 text-sm muted" colSpan={5}>
                    Loading live tasks...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td className="px-6 py-5 text-sm text-red-600" colSpan={5}>
                    {error}
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id} className="border-t border-(--line)">
                    <td className="px-6 py-5">
                      <p className="font-extrabold">{task.title}</p>
                      <p className="muted text-xs">ID: {task.id}</p>
                    </td>
                    <td className="px-6 py-5 text-sm font-semibold text-(--ink-muted)">
                      {task.operation}
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge status={task.status} />
                    </td>
                    <td className="px-6 py-5 text-sm text-(--ink-muted)">
                      {task.createdAt}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link
                        href={`/tasks/${task.id}`}
                        className="rounded-lg border border-blue-200 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.12em] text-blue-700"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}
