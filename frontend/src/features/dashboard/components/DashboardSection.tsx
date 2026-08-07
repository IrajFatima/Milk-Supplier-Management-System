import type { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

export default function DashboardSection({ title, children }: Props) {
  return (
    <section className="space-y-4">
      <h2
        className="text-xl font-semibold"
        style={{ color: "var(--color-text)" }}
      >
        {title}
      </h2>

      {children}
    </section>
  );
}