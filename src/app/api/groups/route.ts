import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);
export async function POST(req: Request) {
  const { handle } = await req.json();

  const { data, error } = await supabase
    .from("groupting")
    .select("name, member")
    .contains("member", [handle]); // Check if handle is in the array

  if (error) {
    return NextResponse.json({ error: "Failed to fetch groups" }, { status: 500 });
  }

  return NextResponse.json({ groups: data });
}
