import { createClient } from "https://esm.sh/@supabase/supabase-js@2";



Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, content-type",
      },
    });
  }
  const { email } = await req.json();

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SERVICE_ROLE_KEY")!;

  const supabase = createClient(supabaseUrl, serviceKey);

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");
  const { data: { user } } = await supabase.auth.getUser(token);

  if (user?.user_metadata?.role !== "admin") {
    return new Response(JSON.stringify({ error: "Forbidden: Admins only" }), { status: 403 });
  }

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: { role: "admin" },
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  return new Response(
    JSON.stringify({ message: "Admin invited!", data }),
    { headers: { "Content-Type": "application/json" } }
  );
});