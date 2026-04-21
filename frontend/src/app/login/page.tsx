import Link from "next/link";

import { Button, Input } from "@/components/ui";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-background p-4 sm:p-8 lg:grid-cols-2 lg:p-12">
      <section className="relative hidden overflow-hidden rounded-3xl border border-(--line) bg-(--surface) p-12 lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="mb-8 text-xs font-extrabold uppercase tracking-[0.24em] text-blue-700">
            Precision Curator
          </p>
          <h1 className="text-6xl font-black leading-[0.95] tracking-tight">
            Orchestrate <span className="text-(--primary)">Intelligence</span>
          </h1>
          <p className="muted mt-6 max-w-md text-lg">
            Access the advanced AI task engine for surgical precision in data
            processing and automated analysis.
          </p>
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-(--ink-muted)">
          Platform Status: Optimal
        </p>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-100 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-100 blur-3xl" />
      </section>

      <section className="flex items-center justify-center p-4 sm:p-10">
        <div className="card animate-rise w-full max-w-md p-7 sm:p-9">
          <h2 className="text-3xl font-black tracking-tight">Welcome Back</h2>
          <p className="muted mt-2 text-sm">Enter your credentials to access your cockpit.</p>

          <form className="mt-8 grid gap-5">
            <Input id="email" label="Email" type="email" placeholder="operator@precision.ai" />
            <Input id="password" label="Password" type="password" placeholder="••••••••••" />
            <Button className="bg-(--primary) text-white" type="submit">
              Initialize Session
            </Button>
          </form>

          <p className="muted mt-6 text-sm">
            New operator?{" "}
            <Link href="/register" className="font-extrabold text-blue-700">
              Request Registration
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
