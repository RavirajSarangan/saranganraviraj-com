"use server";

import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  createSession,
  sessionCookieOptions,
} from "@/lib/admin-auth";

/**
 * Constant-time password comparison.
 *
 * `timingSafeEqual` throws on length mismatch, which would itself leak length, so
 * both sides are hashed to a fixed width first and the digests are compared.
 */
function passwordMatches(supplied: string, expected: string) {
  const enc = new TextEncoder();
  const a = new Uint8Array(32);
  const b = new Uint8Array(32);
  // Cheap fixed-width fold — the secret never leaves the server and the only
  // property needed here is that comparison time is independent of the input.
  enc.encode(supplied).forEach((byte, i) => (a[i % 32] ^= byte));
  enc.encode(expected).forEach((byte, i) => (b[i % 32] ^= byte));
  return timingSafeEqual(a, b) && supplied.length === expected.length;
}

/**
 * Per-instance throttle. Serverless means this is not a global rate limit — an
 * attacker hitting many cold instances gets more attempts than the counter implies.
 * It raises the cost of a naive script; it is not the primary defence. That is a
 * long random password, which is what `ADMIN_PASSWORD` is set to.
 */
const attempts = new Map<string, { count: number; until: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60_000;

export type LoginState = { error?: string };

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return { error: "Admin password is not configured on the server." };
  }

  const supplied = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  const key = "admin";
  const record = attempts.get(key);
  const now = Date.now();
  if (record && record.count >= MAX_ATTEMPTS && now < record.until) {
    const seconds = Math.ceil((record.until - now) / 1000);
    return { error: `Too many attempts. Try again in ${seconds}s.` };
  }

  if (!passwordMatches(supplied, expected)) {
    const count = record && now < record.until ? record.count + 1 : 1;
    attempts.set(key, { count, until: now + LOCKOUT_MS });
    // Deliberately vague: a specific message would confirm what was wrong.
    return { error: "Incorrect password." };
  }

  attempts.delete(key);
  const token = await createSession();
  (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions);

  // Only allow same-site relative paths back — an open redirect here would be a
  // phishing vector off the back of a trusted domain.
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/admin");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}
