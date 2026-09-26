import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/**
 * Mendapatkan Supabase client untuk server-side API routes.
 * Jika authHeader (Bearer token dari Authorization header) disertakan,
 * client akan menjalankan request atas nama user tersebut (menghormati RLS).
 */
export function getSupabaseServerClient(authHeader?: string | null) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL or Anon Key is missing from environment variables.");
  }

  const options: Parameters<typeof createClient>[2] = {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  };

  if (authHeader) {
    options.global = {
      headers: {
        Authorization: authHeader,
      },
    };
  }

  return createClient(supabaseUrl, supabaseAnonKey, options);
}

/**
 * Mendapatkan Supabase admin client (Service Role) dengan hak akses penuh.
 * Digunakan untuk logging sistem (ai_generation_logs) atau operasi admin.
 */
export function getSupabaseAdminClient() {
  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing.");
  }

  const key = supabaseServiceRoleKey || supabaseAnonKey;
  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Helper untuk mengekstrak user_id dari Authorization header jika user login
 */
export async function getAuthUserId(authHeader?: string | null): Promise<string | null> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  try {
    const client = getSupabaseServerClient(authHeader);
    const {
      data: { user },
      error,
    } = await client.auth.getUser();

    if (error || !user) return null;
    return user.id;
  } catch {
    return null;
  }
}
