import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
};

export function Button({
  children,
  className = "",
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-extrabold tracking-wide transition active:scale-[0.98] ${className}`}
    >
      {children}
    </button>
  );
}

type FieldProps = {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
};

export function Input({ label, id, type = "text", placeholder }: FieldProps) {
  return (
    <label className="grid gap-2">
      <span className="text-[11px] font-extrabold uppercase tracking-[0.15em] muted">
        {label}
      </span>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border border-(--line) bg-(--surface-soft) px-4 py-3 text-sm outline-none focus:border-(--primary)"
      />
    </label>
  );
}

export function Textarea({ label, id, placeholder }: Omit<FieldProps, "type">) {
  return (
    <label className="grid gap-2">
      <span className="text-[11px] font-extrabold uppercase tracking-[0.15em] muted">
        {label}
      </span>
      <textarea
        id={id}
        placeholder={placeholder}
        rows={9}
        className="w-full rounded-xl border border-(--line) bg-(--surface-soft) px-4 py-3 text-sm outline-none focus:border-(--primary)"
      />
    </label>
  );
}

type SelectProps = {
  label: string;
  id: string;
  options: Array<{ value: string; label: string }>;
};

export function Select({ label, id, options }: SelectProps) {
  return (
    <label className="grid gap-2">
      <span className="text-[11px] font-extrabold uppercase tracking-[0.15em] muted">
        {label}
      </span>
      <select
        id={id}
        className="w-full rounded-xl border border-(--line) bg-(--surface) px-4 py-3 text-sm font-semibold outline-none focus:border-(--primary)"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`card ${className}`}>{children}</section>;
}

export function StatusBadge({
  status,
}: {
  status: "pending" | "running" | "success" | "failed";
}) {
  return (
    <span className={`status-pill status-${status}`}>
      <span className="dot bg-current" />
      {status}
    </span>
  );
}
