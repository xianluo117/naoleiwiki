/**
 * GET /api/auth/logout
 * 登出处理器
 *
 * 清除 session cookie 并重定向到首页（登录页）
 */

import { buildClearSessionCookie } from "../../lib/cookie";
import type { Env } from "../../types";

export const onRequestGet: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
      "Set-Cookie": buildClearSessionCookie(),
      "Cache-Control": "no-store",
    },
  });
};
