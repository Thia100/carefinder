import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Verify the caller is logged in
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user: caller }, error: callerError } = await supabase.auth.getUser(token);

    if (callerError || !caller) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if a user with this email already exists.
    // listUsers doesn't support filtering by email directly across all SDK versions,
    // so we page through — fine for small/medium user bases.
    let existingUser = null;
    let page = 1;
    const perPage = 200;

    while (true) {
      const { data: pageData, error: listError } = await supabase.auth.admin.listUsers({
        page,
        perPage,
      });

      if (listError) {
        return new Response(JSON.stringify({ error: listError.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const found = pageData.users.find(
        (u) => u.email?.toLowerCase() === email.toLowerCase()
      );

      if (found) {
        existingUser = found;
        break;
      }

      if (pageData.users.length < perPage) break; // no more pages
      page++;
    }

    if (existingUser) {
      // User already exists — promote them to admin instead of inviting
      const { data, error } = await supabase.auth.admin.updateUserById(existingUser.id, {
        user_metadata: {
          ...existingUser.user_metadata,
          role: "admin",
        },
      });

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify({ message: "Existing user promoted to admin!", data }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // User doesn't exist — send a fresh invite
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: { role: "admin" },
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Admin invited!", data }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});