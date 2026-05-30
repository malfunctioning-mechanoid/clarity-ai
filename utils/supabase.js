import { createBrowserClient } from "@supabase/ssr";

// This initializes the modern client bridge reading from your environment variables
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);