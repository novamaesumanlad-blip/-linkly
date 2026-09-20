import { createClient } from "@supabase/supabase-js";
 
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
 
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. " +
    "Copy .env.example to .env and fill in your project's values " +
    "(Supabase dashboard → Settings → API)."
  );
}
 
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
 
// Usernames are the login identifier, but Supabase Auth needs an email
// under the hood — so every account gets a synthetic, never-shown email
// derived deterministically from its username. This must match exactly
// between signUp and signInWithPassword.
export function usernameToAuthEmail(username) {
  return `${username.trim().toLowerCase()}@veilo.local`;
}
 
// Used by Stranger Chat: guarantees a real Supabase session exists
// before calling match_stranger() (which needs a real auth.uid() to
// work). Falls back to signing the visitor in anonymously if they
// somehow reach this screen while logged out — requires "Anonymous
// sign-ins" turned on in Supabase → Authentication → Providers.
export async function ensureSession() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) return session;
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return data.session;
}
 
