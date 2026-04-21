import Link from "next/link";
import type { ReactNode } from "react";

type ShellProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
  active: "dashboard" | "tasks" | "create";
};

const nav = [
  { key: "dashboard", href: "/dashboard", label: "Dashboard" },
  { key: "tasks", href: "/tasks", label: "My Tasks" },
  { key: "create", href: "/tasks/new", label: "Create Task" },
] as const;

export function AppShell({ children, title, subtitle, active }: ShellProps) {
  return (
    <div className="app-shell lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden border-r border-(--line) bg-(--surface) p-6 lg:flex lg:flex-col">
        <div className="mb-8">
          <p className="text-xl font-black tracking-tight">Precision Curator</p>
          <p className="muted text-xs font-bold uppercase tracking-[0.18em]">
            AI Task Engine
          </p>
        </div>

        <nav className="grid gap-2">
          {nav.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`sidebar-link ${active === item.key ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto grid gap-3 pt-6">
          <Link
            href="/tasks/new"
            className="rounded-xl bg-(--primary) px-4 py-3 text-center text-sm font-extrabold text-white"
          >
            New Analysis
          </Link>
          <Link className="sidebar-link" href="/login">
            Logout
          </Link>
        </div>
      </aside>

      <div>
        <header className="sticky top-0 z-10 border-b border-(--line) bg-[rgba(246,248,251,0.88)] px-4 py-3 backdrop-blur sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-black tracking-tight sm:text-2xl">
                {title}
              </h1>
              {subtitle ? <p className="muted text-sm">{subtitle}</p> : null}
            </div>
            <div className="hidden gap-2 md:flex">
              {nav.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-xs font-extrabold tracking-[0.14em] uppercase ${
                    active === item.key
                      ? "bg-blue-100 text-blue-800"
                      : "bg-(--surface) text-(--ink-muted)"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
