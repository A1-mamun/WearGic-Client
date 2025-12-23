import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "./services/currentUser";

type Role = keyof typeof roleBasedPrivateRoutes;

const authRoutes = ["/signin"];

const roleBasedPrivateRoutes = {
  USER: [/^\/checkout/],
  ADMIN: [/^\/dashboard/],
};

export const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  const userInfo = getCurrentUser(request);

  if (!userInfo) {
    if (authRoutes.includes(pathname)) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(
        new URL(`/signin?redirectPath=${pathname}`, request.url)
      );
    }
  }

  if (userInfo?.role && roleBasedPrivateRoutes[userInfo?.role as Role]) {
    const routes = roleBasedPrivateRoutes[userInfo?.role as Role];
    if (routes.some((route) => pathname.match(route))) {
      return NextResponse.next();
    }
  }

  return NextResponse.redirect(new URL("/", request.url));
};

export const config = {
  matcher: [
    "/signin",
    "/checkout",
    "/checkout/:path*",
    "/dashboard",
    "/dashboard/:path*",
  ],
};
