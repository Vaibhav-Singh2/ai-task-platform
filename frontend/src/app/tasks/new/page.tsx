"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { AppShell } from "@/components/app-shell";
import { Button, Card } from "@/components/ui";
import { session, tasksApi, type TaskOperation } from "@/lib/api";

const operations = [
  { value: "uppercase", label: "Uppercase" },
  { value: "lowercase", label: "Lowercase" },
  { value: "reverse", label: "Reverse" },
  { value: "word_count", label: "Word Count" },
];

export default function NewTaskPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [inputText, setInputText] = useState("");
  const [operation, setOperation] = useState<TaskOperation>("uppercase");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const token = session.getToken();

    if (!token) {
      router.push("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await tasksApi.create(token, {
        title,
        inputText,
        operation,
      });
      router.push(`/tasks/${response.task.id}`);
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to create task",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AppShell
      active="create"
      title="Configure AI Pipeline"
      subtitle="Define your text processing parameters with surgical precision."
    >
      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="p-6 sm:p-8">
          <form className="grid gap-6" onSubmit={handleSubmit}>
            <label className="grid gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.15em] muted">
                Task Title
              </span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Marketing Copy Sanitization"
                className="w-full rounded-xl border border-(--line) bg-(--surface-soft) px-4 py-3 text-sm outline-none focus:border-(--primary)"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.15em] muted">
                Input Text
              </span>
              <textarea
                rows={10}
                value={inputText}
                onChange={(event) => setInputText(event.target.value)}
                placeholder="Paste your raw input text for processing..."
                className="w-full rounded-xl border border-(--line) bg-(--surface-soft) px-4 py-3 text-sm outline-none focus:border-(--primary)"
              />
            </label>
          </form>
        </Card>

        <div className="grid gap-6">
          <Card className="p-6">
            <form className="grid gap-5" onSubmit={handleSubmit}>
              <label className="grid gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.15em] muted">
                  Operation
                </span>
                <select
                  value={operation}
                  onChange={(event) =>
                    setOperation(event.target.value as TaskOperation)
                  }
                  className="w-full rounded-xl border border-(--line) bg-(--surface) px-4 py-3 text-sm font-semibold outline-none"
                >
                  {operations.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <div>
                <div className="mb-2 flex items-center justify-between text-xs font-extrabold uppercase tracking-[0.14em] muted">
                  <span>Complexity Score</span>
                  <span className="text-blue-700">
                    {inputText.length > 500 ? "High" : inputText.length > 100 ? "Medium" : "Low"}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-(--surface-strong)">
                  <div 
                    className="h-full rounded-full bg-(--primary) transition-all duration-300"
                    style={{ width: inputText.length > 500 ? "100%" : inputText.length > 100 ? "66%" : "33%" }}
                  />
                </div>
              </div>
              {error ? (
                <p className="text-sm font-semibold text-red-600">{error}</p>
              ) : null}
              <Button className="bg-(--primary) text-white" type="submit">
                {isSubmitting ? "Running..." : "Run Task"}
              </Button>
            </form>
          </Card>

          <Card className="p-6">
            <h3 className="text-xs font-extrabold uppercase tracking-[0.18em] muted">
              Guidelines
            </h3>
            <ul className="mt-4 grid gap-3 text-sm text-(--ink-muted)">
              <li>Input text should not exceed 10,000 characters.</li>
              <li>JSON structures are detected and escaped automatically.</li>
              <li>Use concise titles for easier tracking in task lists.</li>
            </ul>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}
