import { NextResponse } from "next/server";

// Himoyalangan yo'llar
const protectedRoutes = ["/", "/dashboard", "/profile"];

// Proxy funksiyasi 
export function proxy(request) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  // Path himoyalanganmi yoki yo'qligini tekshiramiz
  const isProtectedRoute = protectedRoutes.some((route) =>
    route === "/" ? pathname === "/" : pathname.startsWith(route)
  );

  // Token yo'q bo'lsa va foydalanuvchi himoyalangan sahifaga kirmoqchi bo'lsa kira olmaydi
  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL("/login", request.url);
    // loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Agar token bor bo'lsa va foydalanuvchi login yoki register sahifasiga kirmoqchi bo'lsa dashboardga o'tadi
  if ((pathname === "/login" || pathname === "/register") && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Qaysi marshrutlarda bu proxy ishlashini belgilash
export const config = {
  matcher: ["/", "/dashboard/:path*", "/profile/:path*", "/login", "/register"],
};
