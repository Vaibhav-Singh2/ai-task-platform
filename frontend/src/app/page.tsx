import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center p-6 sm:p-10">
      <section className="card animate-rise w-full max-w-2xl p-8 sm:p-12">
        <p className="mb-3 text-xs font-extrabold tracking-[0.2em] text-blue-700 uppercase">
          AI Task Processing Platform
        </p>
        <h1 className="text-4xl font-black tracking-tight">Precision Curator</h1>
        <p className="muted mt-4 text-base leading-relaxed">
          Frontend migration is complete. Use any route below to preview the
          generated app pages in Next.js.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link className="sidebar-link active" href="/login">
            Login
          </Link>
          <Link className="sidebar-link" href="/register">
            Register
          </Link>
          <Link className="sidebar-link" href="/dashboard">
            Dashboard
          </Link>
          <Link className="sidebar-link" href="/tasks">
            My Tasks
          </Link>
          <Link className="sidebar-link" href="/tasks/new">
            Create Task
          </Link>
          <Link className="sidebar-link" href="/tasks/AI-9823-X">
            Task Details
          </Link>
        </div>
      </section>
    </main>
  );
}
