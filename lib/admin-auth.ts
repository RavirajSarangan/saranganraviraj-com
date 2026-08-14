import { SignJWT, jwtVerify } from "jose";

/**
 * Single super-admin auth.
 *
 * Deliberately not Convex Auth: there is exactly one account, so a password in an
 * environment variable plus a signed session cookie is the whole requirement. That
 * avoids a pre-1.0 dependency (`@convex-dev/auth` is at 0.0.95) and leaves Convex as
 * purely the data layer.
 *
 * The split matters for where things run:
 *   - Password comparison happens in a Server Action (Node runtime) because it needs
 *     `crypto.timingSafeEqual`.
 *   - Session verification happens in middleware (Edge runtime), where `jose` works
 *     but Node's crypto does not.
 */

export const SESSION_COOKIE = "sr_admin";
const ISSUER = "saranganraviraj.com";
const AUDIENCE = "admin";
/** Short enough that a stolen cookie ages out; long enough not to be annoying. */
const MAX_AGE_SECONDS = 60 * 60 * 8;

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  // Fail closed and loudly. A missing secret must never silently degrade to
  // unsigned or predictably-signed sessions.
  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET is missing or shorter than 32 characters — refusing to sign sessions.",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createSession() {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secretKey());
}

/** Returns true only for a signature-valid, unexpired, correctly-scoped token. */
export async function verifySession(token: string | undefined) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  // Vercel always serves HTTPS; localhost would reject a Secure cookie over http.
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE_SECONDS,
};
