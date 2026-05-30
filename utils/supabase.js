import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// This initializes a client instance that handles authentication cookies automatically
export const supabase = createClientComponentClient();