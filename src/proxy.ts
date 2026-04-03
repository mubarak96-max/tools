import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const basicAuth = req.headers.get("authorization");

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1] ?? "";
    const [user, pwd] = Buffer.from(authValue, "base64").toString("utf8").split(":");

    const adminUser = process.env.ADMIN_USERNAME || "admin";
    const adminPass = process.env.ADMIN_PASSWORD || "password";

    if (user === adminUser && pwd === adminPass) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Admin Area"',
    },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
