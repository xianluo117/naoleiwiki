/**
 * 全局认证中间件
 * 拦截所有请求，验证用户是否已登录且为服务器成员
 *
 * 白名单路径（无需认证）：
 * - /api/auth/*  — 认证端点自身
 * - 静态资源    — CSS/JS/图片/字体等
 */

import { COOKIE_NAME, getCookie } from "./lib/cookie";
import { loginPage } from "./lib/html";
import { verifyJWT } from "./lib/jwt";
import type { Env } from "./types";

/** 不需要认证的路径前缀 */
const PUBLIC_PATH_PREFIXES = ["/api/auth/"];

/** 不需要认证的静态资源扩展名 */
const STATIC_EXTENSIONS = [
  ".css",
  ".js",
  ".mjs",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".svg",
  ".ico",
  ".webp",
  ".woff",
  ".woff2",
  ".ttf",
  ".eot",
  ".map",
  ".json",
];

/**
 * 检查路径是否为公开路径（不需要认证）
 */
function isPublicPath(pathname: string): boolean {
  // 认证端点
  if (PUBLIC_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return true;
  }

  // 静态资源
  const lowerPath = pathname.toLowerCase();
  if (STATIC_EXTENSIONS.some((ext) => lowerPath.endsWith(ext))) {
    return true;
  }

  return false;
}

/**
 * 返回登录页面 HTML 响应
 */
function loginResponse(request: Request): Response {
  const url = new URL(request.url);
  const returnTo = url.pathname + url.search;
  const loginUrl = `/api/auth/login?returnTo=${encodeURIComponent(returnTo)}`;

  return new Response(loginPage(loginUrl), {
    status: 401,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // ── 1. 公开路径直接放行 ──────────────────────────────
  if (isPublicPath(url.pathname)) {
    return next();
  }

  // ── 2. 检查 session cookie ──────────────────────────
  const token = getCookie(request.headers.get("Cookie"), COOKIE_NAME);

  if (!token) {
    return loginResponse(request);
  }

  // ── 3. 验证 JWT ─────────────────────────────────────
  const payload = await verifyJWT(token, env.JWT_SECRET);

  if (!payload) {
    // JWT 无效或过期，清除 cookie 并显示登录页
    return loginResponse(request);
  }

  // ── 4. 验证通过，放行请求 ─────────────────────────────
  // 可选：将用户信息注入请求头，供后续 Function 使用
  const modifiedRequest = new Request(request);
  // 注意：这些头只在 Functions 间传递，不会暴露给客户端
  // 如果需要在页面中使用用户信息，可通过 /api/me 端点获取

  const response = await next();

  // 添加安全响应头
  const securedResponse = new Response(response.body, response);
  securedResponse.headers.set("X-Content-Type-Options", "nosniff");
  securedResponse.headers.set("X-Frame-Options", "DENY");
  securedResponse.headers.set(
    "Referrer-Policy",
    "strict-origin-when-cross-origin",
  );

  return securedResponse;
};
