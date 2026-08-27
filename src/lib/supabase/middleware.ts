import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { env } from "../env";

const PUBLIC_PATHS = [
  '/login',
  '/auth',
  '/register',
  '/forget-password',
  '/update-password',
  '/account-disabled',
  '/clear-cookies',
];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Guard against HTTP 431: Purge any oversized legacy cookies (> 1500 chars)
  const incomingCookies = request.cookies.getAll();
  incomingCookies.forEach((c) => {
    if (c.value && c.value.length > 1500) {
      response.cookies.delete(c.name);
    }
  });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies
            .getAll()
            .filter((c) => !c.value || c.value.length <= 1500);
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isPublic =
    pathname === "/" ||
    PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  if (user && pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }
  return response;
}