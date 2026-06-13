// Session refresh + admin route protection used by the root middleware.
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseConfigured } from "./env";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Before the app is connected to Supabase, skip auth so the public site is
  // still browsable. The admin area simply can't authenticate until configured.
  if (!supabaseConfigured) return response;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: getUser() revalidates the token with Supabase Auth.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isAdminArea = path.startsWith("/admin");
  const isLoginPage = path === "/admin/login";

  // Gate the admin area: unauthenticated users are sent to the login page.
  if (isAdminArea && !isLoginPage && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  // Authenticated users on the login page are forwarded into the dashboard.
  if (isLoginPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
