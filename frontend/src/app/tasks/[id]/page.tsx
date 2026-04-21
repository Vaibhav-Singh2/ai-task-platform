"use client";

import { useEffect, useMemo, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { Card, StatusBadge } from "@/components/ui";
import { session, tasksApi, type TaskItem } from "@/lib/api";
import { useParams } from "next/navigation";

export default function TaskDetailsPage() {
  const { id }: { id: string } = useParams();
  const [task, setTask] = useState<TaskItem | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = session.getToken();

    if (!token) {
      window.location.href = "/login";
      return;
    }

    let isSubscribed = true;
    let timeoutId: ReturnType<typeof setTimeout>;

    const load = async () => {
      try {
        const response = await tasksApi.detail(token, id);
        if (!isSubscribed) return;
        
        setTask(response.task);
        
        if (response.task.status === "pending" || response.task.status === "running") {
          timeoutId = setTimeout(load, 2000);
        }
      } catch (loadError) {
        if (isSubscribed) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load task",
          );
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isSubscribed = false;
      clearTimeout(timeoutId);
    };
  }, [id]);

  const timeline = useMemo(() => {
    if (!task) {
      return [];
    }

    return [
      {
        step: "Task Created",
        time: task.createdAt ? new Date(task.createdAt).toLocaleString() : "",
        state: "success",
        detail: task.title,
      },
      {
        step: `Operation: ${task.operation}`,
        time: task.logs && task.logs.length > 0 && task.logs[task.logs.length - 1].at ? new Date(task.logs[task.logs.length - 1].at!).toLocaleString() : "Pending",
        state: task.status,
        detail: task.inputText ?? "",
      },
    ];
  }, [task]);

  return (
    <AppShell
      active="tasks"
      title={`Task ${id}`}
      subtitle="Detailed execution timeline, logs, and live synthesis outputs."
    >
      <section className="grid gap-6 lg:grid-cols-12">
        <Card className="p-6 lg:col-span-4">
          <h2 className="text-xs font-extrabold uppercase tracking-[0.18em] muted">
            Task Info
          </h2>
          {isLoading ? (
            <p className="mt-5 text-sm muted">Loading live task...</p>
          ) : error ? (
            <p className="mt-5 text-sm font-semibold text-red-600">{error}</p>
          ) : (
            <dl className="mt-5 grid gap-4 text-sm">
              <div className="flex items-center justify-between border-b border-(--line) pb-3">
                <dt className="muted">Title</dt>
                <dd className="font-extrabold">{task?.title}</dd>
              </div>
              <div className="flex items-center justify-between border-b border-(--line) pb-3">
                <dt className="muted">Operation</dt>
                <dd className="font-extrabold capitalize">{task?.operation}</dd>
              </div>
              <div className="flex items-center justify-between border-b border-(--line) pb-3">
                <dt className="muted">Input Text</dt>
                <dd className="font-extrabold truncate max-w-50" title={task?.inputText}>{task?.inputText}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="muted">Status</dt>
                <dd className="font-extrabold capitalize">{task?.status}</dd>
              </div>
            </dl>
          )}
        </Card>

        <Card className="p-6 lg:col-span-8">
          <h2 className="text-xs font-extrabold uppercase tracking-[0.18em] muted">
            Status Timeline
          </h2>
          <div className="mt-5 grid gap-5">
            {timeline.map((item) => (
              <article
                key={item.step}
                className="rounded-xl border border-(--line) bg-(--surface-soft) p-4"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="font-extrabold">{item.step}</h3>
                  <StatusBadge
                    status={
                      item.state as "pending" | "running" | "success" | "failed"
                    }
                  />
                </div>
                <p className="muted text-xs font-bold uppercase tracking-[0.14em]">
                  {item.time}
                </p>
                <p className="mt-2 text-sm text-(--ink-muted)">{item.detail}</p>
              </article>
            ))}
          </div>
        </Card>

        <Card className="bg-slate-950 p-6 font-mono text-sm text-slate-300 lg:col-span-6">
          <h2 className="mb-4 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">
            Logs
          </h2>
          <div className="grid gap-2 overflow-y-auto pr-1">
            {task?.logs && task.logs.length > 0 ? (
              task.logs.map((log, index) => {
                const timeStr = log.at ? new Date(log.at).toLocaleTimeString() : "";
                return (
                  <p key={index}>
                    {timeStr && `[${timeStr}] `}
                    <span className="uppercase font-semibold">{log.level}</span> {log.message}
                  </p>
                );
              })
            ) : (
              <p className="text-slate-500 italic">No logs available.</p>
            )}
          </div>
        </Card>

        <Card className="p-6 lg:col-span-6">
          <h2 className="text-xs font-extrabold uppercase tracking-[0.18em] muted">
            Result Output
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <article className="rounded-xl bg-(--surface-soft) p-4">
              <p className="muted text-xs font-extrabold uppercase tracking-[0.14em]">
                Operation
              </p>
              <p className="mt-2 text-xl font-black text-blue-700 capitalize">{task?.operation}</p>
            </article>
            <article className="rounded-xl bg-(--surface-soft) p-4">
              <p className="muted text-xs font-extrabold uppercase tracking-[0.14em]">
                Result Length
              </p>
              <p className="mt-2 text-xl font-black">{task?.result?.length ?? 0}</p>
            </article>
          </div>
          <article className="mt-4 rounded-xl border-l-4 border-blue-600 bg-blue-50 p-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-700">
              {task?.status === "success" ? "Result Output" : "Pending Output"}
            </p>
            <p className="mt-2 text-sm text-(--ink-muted) wrap-break-word whitespace-pre-wrap">
              {task?.result || "No result available yet."}
            </p>
          </article>
        </Card>
      </section>
    </AppShell>
  );
}
