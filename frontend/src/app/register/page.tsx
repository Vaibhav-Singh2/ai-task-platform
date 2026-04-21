import Link from "next/link";

import { Button, Input } from "@/components/ui";

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen bg-[var(--bg)] p-4 sm:p-8 lg:grid-cols-[1.25fr_1fr] lg:p-12">
      <section className="relative hidden overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-12 lg:block">
        <p className="mb-8 text-xs font-extrabold uppercase tracking-[0.24em] text-blue-700">
          Systems Integrity
        </p>
        <h1 className="text-6xl font-black leading-[0.92] tracking-tight">
          Precision Curator
          <br />
          <span className="italic text-[var(--primary)]">AI Engine v2.4</span>
        </h1>
        <p className="muted mt-6 max-w-xl text-lg">
          Experience next-generation task management where algorithmic
          complexity meets surgical precision.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-5 text-sm">
          <article className="rounded-2xl bg-[var(--surface-soft)] p-5">
            <h3 className="font-extrabold">Intelligent Curation</h3>
            <p className="muted mt-2">
              AI parses intent with 99.4% accuracy across multilingual datasets.
            </p>
          </article>
          <article className="rounded-2xl bg-[var(--surface-soft)] p-5">
            <h3 className="font-extrabold">Dynamic Scalability</h3>
            <p className="muted mt-2">
              Auto-optimizing workloads evolve with project complexity.
            </p>
          </article>
        </div>

        <div className="absolute -right-24 -top-20 h-72 w-72 rounded-full bg-blue-100 blur-3xl" />
      </section>

      <section className="flex items-center justify-center p-4 sm:p-10">
        <div className="card animate-rise w-full max-w-md p-7 sm:p-9">
          <h2 className="text-3xl font-black tracking-tight">
            Initialize Access
          </h2>
          <p className="muted mt-2 text-sm">
            Configure your operator profile to begin processing.
          </p>
          <form className="mt-8 grid gap-5">
            <Input id="name" label="Name" placeholder="John Doe" />
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="operator@precision.ai"
            />
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••••••"
            />
            <Button className="bg-[var(--primary)] text-white" type="submit">
              Register Operator
            </Button>
          </form>
          <p className="muted mt-6 text-sm">
            Existing operator?{" "}
            <Link href="/login" className="font-extrabold text-blue-700">
              Access Terminal
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
