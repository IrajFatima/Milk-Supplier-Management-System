// src/features/auth/pages/LoginPage.tsx

import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[var(--color-text)]">
            Milk Supplier Management System
          </h1>

          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Sign in to continue
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}