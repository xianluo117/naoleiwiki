/**
 * Cookie 工具库
 * 安全的 HttpOnly Cookie 操作
 */

/** Cookie 名称常量 */
export const COOKIE_NAME = "__leinao_session";
export const STATE_COOKIE_NAME = "__leinao_oauth_state";

/** Cookie 配置选项 */
interface CookieOptions {
  maxAge?: number;
  path?: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
}

/**
 * 构建 Set-Cookie 头字符串
 *
 * @param name    - Cookie 名称
 * @param value   - Cookie 值
 * @param options - Cookie 选项
 * @returns Set-Cookie 头值
 */
export function buildSetCookie(
  name: string,
  value: string,
  options: CookieOptions = {},
): string {
  const {
    maxAge,
    path = "/",
    httpOnly = true,
    secure = true,
    sameSite = "Lax",
  } = options;

  const parts: string[] = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    `Path=${path}`,
    `SameSite=${sameSite}`,
  ];

  if (httpOnly) parts.push("HttpOnly");
  if (secure) parts.push("Secure");
  if (maxAge !== undefined) parts.push(`Max-Age=${maxAge}`);

  return parts.join("; ");
}

/**
 * 构建会话 Cookie（JWT Token）
 * HttpOnly + Secure + SameSite=Lax，7 天过期
 */
export function buildSessionCookie(token: string): string {
  return buildSetCookie(COOKIE_NAME, token, {
    maxAge: 7 * 24 * 60 * 60,
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
  });
}

/**
 * 构建 OAuth2 state Cookie（短期，用于 CSRF 防护）
 * 5 分钟过期
 */
export function buildStateCookie(stateValue: string): string {
  return buildSetCookie(STATE_COOKIE_NAME, stateValue, {
    maxAge: 5 * 60,
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
  });
}

/**
 * 构建清除 Cookie 的 Set-Cookie 头（用于登出）
 */
export function buildClearSessionCookie(): string {
  return buildSetCookie(COOKIE_NAME, "", {
    maxAge: 0,
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
  });
}

/**
 * 构建清除 state Cookie 的 Set-Cookie 头
 */
export function buildClearStateCookie(): string {
  return buildSetCookie(STATE_COOKIE_NAME, "", {
    maxAge: 0,
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
  });
}

/**
 * 从 Cookie 头中解析指定 Cookie 的值
 *
 * @param cookieHeader - 请求的 Cookie 头字符串
 * @param name         - 要获取的 Cookie 名称
 * @returns Cookie 值，不存在返回 null
 */
export function getCookie(
  cookieHeader: string | null,
  name: string,
): string | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((c) => c.trim());
  const encodedName = encodeURIComponent(name);

  for (const cookie of cookies) {
    const eqIndex = cookie.indexOf("=");
    if (eqIndex === -1) continue;

    const cookieName = cookie.substring(0, eqIndex).trim();
    if (cookieName === encodedName || cookieName === name) {
      return decodeURIComponent(cookie.substring(eqIndex + 1).trim());
    }
  }

  return null;
}
