import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Using service key since there's no hashing
);

export async function POST(req: Request) {
  const { handle, password } = await req.json();

  // Fetch user from Supabase
  const { data, error } = await supabase
    .from("user_auth")
    .select("password")
    .eq("codeforces_handle", handle)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Invalid handle or password" }, { status: 401 });
  }

  if (data.password !== password) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  return NextResponse.json({ success: true, handle });
}
