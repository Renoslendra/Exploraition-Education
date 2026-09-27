import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://rjxcmyozmteejwgnjiiq.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqeGNteW96bXRlZWp3Z25qaWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0MDk0OTAsImV4cCI6MjEwNTk4NTQ5MH0.TQ2EbKl9ozc41j5CIwcB6Hr5cvzQUFvJJfwCeEbKlc4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
