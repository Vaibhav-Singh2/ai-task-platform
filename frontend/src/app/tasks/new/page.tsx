import { AppShell } from "@/components/app-shell";
import { Button, Card, Input, Select, Textarea } from "@/components/ui";

const operations = [
  { value: "uppercase", label: "Uppercase" },
  { value: "lowercase", label: "Lowercase" },
  { value: "reverse", label: "Reverse" },
  { value: "word_count", label: "Word Count" },
];

export default function NewTaskPage() {
  return (
    <AppShell
      active="create"
      title="Configure AI Pipeline"
      subtitle="Define your text processing parameters with surgical precision."
    >
      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="p-6 sm:p-8">
          <div className="grid gap-6">
            <Input
              id="title"
              label="Task Title"
              placeholder="Marketing Copy Sanitization"
            />
            <Textarea
              id="input"
              label="Input Text"
              placeholder="Paste your raw input text for processing..."
            />
          </div>
        </Card>

        <div className="grid gap-6">
          <Card className="p-6">
            <div className="grid gap-5">
              <Select id="operation" label="Operation" options={operations} />
              <div>
                <div className="mb-2 flex items-center justify-between text-xs font-extrabold uppercase tracking-[0.14em] muted">
                  <span>Complexity Score</span>
                  <span className="text-blue-700">Low</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-strong)]">
                  <div className="h-full w-1/3 rounded-full bg-[var(--primary)]" />
                </div>
              </div>
              <Button className="bg-[var(--primary)] text-white" type="submit">
                Run Task
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xs font-extrabold uppercase tracking-[0.18em] muted">
              Guidelines
            </h3>
            <ul className="mt-4 grid gap-3 text-sm text-[var(--ink-muted)]">
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
