import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = "https://bsqeegnamhbndgdsmcpn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzcWVlZ25hbWhibmRnZHNtY3BuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NTA3NzksImV4cCI6MjA2ODEyNjc3OX0.DG_9fUdMu5WzBqUAmqgm0CiPr3iHWbmzCEH9AZ4Udqk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      // storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
