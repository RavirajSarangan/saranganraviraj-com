import { convexAuth, getAuthUserId } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import type { QueryCtx, MutationCtx } from "./_generated/server";

/**
 * Single super-admin auth.
 *
 * Password provider only — no OAuth, no magic links, and critically **no open
 * sign-up**: `ADMIN_EMAIL` is the allow-list, so even though Convex Auth's Password
 * provider exposes a sign-up flow, an address that is not the configured admin is
 * rejected before an account is ever created.
 *
 * Set in the Convex dashboard (not in .env.local — these are server-side):
 *   ADMIN_EMAIL=...
 */
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params) {
        const email = String(params.email ?? "").toLowerCase().trim();
        const allowed = (process.env.ADMIN_EMAIL ?? "").toLowerCase().trim();

        // Fail closed: if ADMIN_EMAIL was never configured, nobody gets in.
        if (!allowed || email !== allowed) {
          throw new Error("Not authorised.");
        }
        return { email };
      },
    }),
  ],
});

/**
 * Guard for every mutation and admin-only query. Throws rather than returning null
 * so a forgotten check fails loudly instead of silently writing as an anonymous user.
 */
export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Unauthorised.");
  return userId;
}
