"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { authApi, session } from "@/lib/api";

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
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  const token = useSyncExternalStore(
    (listener) => {
      if (typeof window === "undefined") {
        return () => undefined;
      }

      window.addEventListener("storage", listener);
      return () => window.removeEventListener("storage", listener);
    },
    session.getToken,
    () => "",
  );

  useEffect(() => {
    if (!mounted) return; // Wait for hydration so token isn't incorrectly ""

    const validate = async () => {
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        await authApi.me(token);
      } catch {
        session.clearToken();
        router.replace("/login");
      }
    };

    void validate();
  }, [router, token, mounted]);

  async function handleLogout() {
    if (token) {
      try {
        await authApi.logout(token);
      } catch {
        // Ignore logout API failures and clear local session anyway.
      }
    }

    session.clearToken();
    router.replace("/login");
  }

  if (!mounted) {
    return null; // Wait for client hydration
  }

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
          <button
            type="button"
            className="sidebar-link text-left"
            onClick={handleLogout}
          >
            Logout
          </button>
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
        <main className="p-4 pb-24 sm:p-8 sm:pb-8">{children}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 flex border-t border-(--line) bg-[rgba(255,255,255,0.9)] p-2 backdrop-blur lg:hidden pb-safe">
        {nav.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={`flex-1 flex items-center justify-center rounded-lg py-3 text-center text-[10px] font-extrabold uppercase tracking-wider sm:tracking-widest ${
              active === item.key
                ? "bg-blue-100 text-blue-800"
                : "text-(--ink-muted) hover:bg-(--surface-soft)"
            }`}
          >
            {item.label}
          </Link>
        ))}
        <button
          type="button"
          onClick={handleLogout}
          className="flex-1 flex items-center justify-center rounded-lg py-3 text-center text-[10px] font-extrabold uppercase tracking-wider sm:tracking-widest text-red-600 hover:bg-red-50"
        >
          Logout
        </button>
      </nav>
    </div>
  );
}
