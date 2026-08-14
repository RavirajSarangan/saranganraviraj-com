"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Lock, LoaderCircle } from "lucide-react";
import { login, type LoginState } from "../actions";

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    {},
  );

  return (
    <form action={formAction} className="mt-12">
      <input type="hidden" name="next" value={next} />

      <label htmlFor="password" className="label block">
        Password
      </label>

      <div className="relative mt-3">
        <Lock
          aria-hidden
          size={15}
          strokeWidth={1.6}
          className="absolute top-1/2 left-4 -translate-y-1/2 text-muted"
        />
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          // Surfaces the error to assistive tech, not just visually
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "login-error" : undefined}
          className="w-full rounded-full border border-line bg-surface py-3.5 pr-5 pl-11 text-sm text-fg transition-colors duration-300 outline-none placeholder:text-faint focus:border-accent"
          placeholder="••••••••••••"
        />
      </div>

      {state.error && (
        <p id="login-error" role="alert" className="mt-4 text-sm text-red-400">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="group mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-fg px-7 py-3.5 font-mono text-[0.6875rem] tracking-[0.16em] text-ink uppercase transition-colors duration-500 hover:bg-accent disabled:opacity-60"
      >
        {pending ? (
          <>
            <LoaderCircle aria-hidden size={14} className="animate-spin" />
            Signing in
          </>
        ) : (
          <>
            Sign in
            <span
              aria-hidden
              className="transition-transform duration-500 group-hover:translate-x-1"
            >
              →
            </span>
          </>
        )}
      </button>
    </form>
  );
}
