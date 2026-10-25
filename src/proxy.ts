import type { NextRequest } from "next/server";

import { auth } from "@/lib/auth/server";

const handle = auth.middleware({
  loginUrl: "/login",
});

export function proxy(request: NextRequest) {
  return handle(request);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
