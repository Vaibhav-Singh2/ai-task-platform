import { AppShell } from "@/components/app-shell";
import { Card, StatusBadge } from "@/components/ui";
import { timeline } from "@/lib/mock-data";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TaskDetailsPage({ params }: Props) {
  const { id } = await params;

  return (
    <AppShell active="tasks" title={`Task ${id}`} subtitle="Detailed execution timeline, logs, and live synthesis outputs.">
      <section className="grid gap-6 lg:grid-cols-12">
        <Card className="p-6 lg:col-span-4">
          <h2 className="text-xs font-extrabold uppercase tracking-[0.18em] muted">Task Info</h2>
          <dl className="mt-5 grid gap-4 text-sm">
            <div className="flex items-center justify-between border-b border-(--line) pb-3">
              <dt className="muted">Task Engine</dt>
              <dd className="font-extrabold">Curator-v4.2</dd>
            </div>
            <div className="flex items-center justify-between border-b border-(--line) pb-3">
              <dt className="muted">Priority</dt>
              <dd className="font-extrabold text-(--error)">High</dd>
            </div>
            <div className="flex items-center justify-between border-b border-(--line) pb-3">
              <dt className="muted">Source Format</dt>
              <dd className="font-extrabold">JSON / Vector-DB</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="muted">Token Usage</dt>
              <dd className="font-extrabold">14,204</dd>
            </div>
          </dl>
        </Card>

        <Card className="p-6 lg:col-span-8">
          <h2 className="text-xs font-extrabold uppercase tracking-[0.18em] muted">Status Timeline</h2>
          <div className="mt-5 grid gap-5">
            {timeline.map((item) => (
              <article key={item.step} className="rounded-xl border border-(--line) bg-(--surface-soft) p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="font-extrabold">{item.step}</h3>
                  <StatusBadge status={item.state as "pending" | "running" | "success" | "failed"} />
                </div>
                <p className="muted text-xs font-bold uppercase tracking-[0.14em]">{item.time}</p>
                <p className="mt-2 text-sm text-(--ink-muted)">{item.detail}</p>
              </article>
            ))}
          </div>
        </Card>

        <Card className="bg-slate-950 p-6 font-mono text-sm text-slate-300 lg:col-span-6">
          <h2 className="mb-4 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">Logs</h2>
          <div className="grid gap-2 overflow-y-auto pr-1">
            <p>[10:42:01] INFO Bootstrapping agent node L-9...</p>
            <p>[10:42:04] INFO Connected to vector-db cluster-primary</p>
            <p>[10:44:02] WARN Latency detected in node_sh-02; rerouting traffic</p>
            <p>[10:45:10] INFO Embedding process initiated model=Ada-002</p>
            <p>[10:55:00] INFO Progress updated to 72%</p>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-6">
          <h2 className="text-xs font-extrabold uppercase tracking-[0.18em] muted">Result Output</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <article className="rounded-xl bg-(--surface-soft) p-4">
              <p className="muted text-xs font-extrabold uppercase tracking-[0.14em]">Confidence Score</p>
              <p className="mt-2 text-3xl font-black text-blue-700">94.8%</p>
            </article>
            <article className="rounded-xl bg-(--surface-soft) p-4">
              <p className="muted text-xs font-extrabold uppercase tracking-[0.14em]">Anomalies Found</p>
              <p className="mt-2 text-3xl font-black">12</p>
            </article>
          </div>
          <article className="mt-4 rounded-xl border-l-4 border-blue-600 bg-blue-50 p-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-700">Initial Insight</p>
            <p className="mt-2 text-sm text-(--ink-muted)">
              Atypical correlation detected between energy futures and logistical
              overheads in the European corridor.
            </p>
          </article>
        </Card>
      </section>
    </AppShell>
  );
}
