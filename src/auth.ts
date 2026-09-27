import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      if (user?.email) {
        try {
          const supabase = getSupabaseAdminClient();
          const { data: existingUser } = await supabase
            .from("users")
            .select("id")
            .eq("email", user.email)
            .maybeSingle();

          if (!existingUser) {
            await supabase.from("users").insert({
              id: user.id || crypto.randomUUID(),
              email: user.email,
              nama: user.name || user.email.split("@")[0],
              avatar_url: user.image || null,
              role: "guru",
            });
          } else {
            await supabase
              .from("users")
              .update({
                nama: user.name || undefined,
                avatar_url: user.image || undefined,
                updated_at: new Date().toISOString(),
              })
              .eq("id", existingUser.id);
          }
        } catch (err) {
          console.warn("[NextAuth signIn callback] Supabase sync note:", err);
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (token?.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "modulin-secure-auth-secret-key-32chars",
});
