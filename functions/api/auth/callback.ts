/**
 * GET /api/auth/callback
 * Discord OAuth2 回调处理器
 *
 * 流程：
 * 1. 验证 state 参数（防 CSRF）
 * 2. 用 authorization code 换取 access_token
 * 3. 获取用户信息
 * 4. 验证用户是否在目标服务器中且拥有指定身份组
 * 5. 签发 JWT session cookie
 * 6. 重定向到用户原始请求的页面
 */

import {
  buildClearStateCookie,
  buildSessionCookie,
  getCookie,
  STATE_COOKIE_NAME,
} from "../../lib/cookie";
import {
  decryptState,
  exchangeCode,
  fetchUser,
  getRedirectUri,
  verifyMembership,
} from "../../lib/discord";
import { errorPage, notInGuildPage } from "../../lib/html";
import { createJWT } from "../../lib/jwt";
import type { Env } from "../../types";

/** HTML 响应辅助函数 */
function htmlResponse(
  body: string,
  status: number = 200,
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);

  // ── 1. 检查 Discord 返回的错误 ─────────────────────────
  const error = url.searchParams.get("error");
  if (error) {
    const desc = url.searchParams.get("error_description") || "未知错误";
    return htmlResponse(
      errorPage("授权失败", `Discord 返回错误: ${desc}`),
      400,
    );
  }

  // ── 2. 获取 authorization code ─────────────────────────
  const code = url.searchParams.get("code");
  if (!code) {
    return htmlResponse(errorPage("参数缺失", "未收到授权码，请重新登录"), 400);
  }

  // ── 3. 验证 state 参数（CSRF 防护） ────────────────────
  const stateParam = url.searchParams.get("state");
  const stateCookie = getCookie(
    request.headers.get("Cookie"),
    STATE_COOKIE_NAME,
  );

  if (!stateParam || !stateCookie) {
    return htmlResponse(
      errorPage(
        "安全验证失败",
        "缺少 state 参数或 cookie，可能是 CSRF 攻击。请重新登录。",
      ),
      403,
    );
  }

  // state 参数和 cookie 中的值必须一致
  if (stateParam !== stateCookie) {
    return htmlResponse(
      errorPage("安全验证失败", "state 参数不匹配，请重新登录。"),
      403,
    );
  }

  // 解密并验证 state
  const stateData = await decryptState(stateParam, env.STATE_SECRET);
  if (!stateData) {
    return htmlResponse(
      errorPage("验证过期", "登录请求已过期（5分钟），请重新登录。"),
      403,
    );
  }

  // ── 4. 用 code 换取 access_token ───────────────────────
  let accessToken: string;
  try {
    const redirectUri = getRedirectUri(request);
    const tokenData = await exchangeCode(code, redirectUri, env);
    accessToken = tokenData.access_token;
  } catch (err) {
    console.error("Token exchange failed:", err);
    return htmlResponse(
      errorPage("登录失败", "无法与 Discord 服务器通信，请稍后重试。"),
      500,
    );
  }

  // ── 5. 获取用户信息 ────────────────────────────────────
  let user;
  try {
    user = await fetchUser(accessToken);
  } catch (err) {
    console.error("User fetch failed:", err);
    return htmlResponse(
      errorPage("获取信息失败", "无法获取 Discord 用户信息，请稍后重试。"),
      500,
    );
  }

  // ── 6. 验证用户是否在目标服务器中且拥有指定身份组 ──────
  let inGuild: boolean;
  let hasRole: boolean;
  try {
    const result = await verifyMembership(
      accessToken,
      env.DISCORD_GUILD_ID,
      env.DISCORD_ROLE_ID,
    );
    inGuild = result.inGuild;
    hasRole = result.hasRole;
  } catch (err) {
    console.error("Membership check failed:", err);
    return htmlResponse(
      errorPage("验证失败", "无法验证服务器成员身份，请稍后重试。"),
      500,
    );
  }

  if (!inGuild) {
    // 用户不在目标服务器，显示提示页面
    // 你可以在这里设置你的 Discord 服务器邀请链接
    return htmlResponse(
      notInGuildPage(/* "https://discord.gg/你的邀请码" */),
      403,
      { "Set-Cookie": buildClearStateCookie() },
    );
  }

  if (!hasRole) {
    // 用户在服务器中但没有指定身份组
    return htmlResponse(
      errorPage(
        "权限不足",
        "您已加入社区服务器，但尚未获得访问知识库所需的身份组。请联系管理员获取权限。",
        true,
      ),
      403,
      { "Set-Cookie": buildClearStateCookie() },
    );
  }

  // ── 7. 签发 JWT ────────────────────────────────────────
  const token = await createJWT(
    {
      sub: user.id,
      username: user.username,
      display_name: user.global_name || user.username,
      avatar: user.avatar,
    },
    env.JWT_SECRET,
  );

  // ── 8. 设置 session cookie 并重定向 ───────────────────
  const returnTo = stateData.returnTo || "/";

  return new Response(null, {
    status: 302,
    headers: [
      ["Location", returnTo],
      ["Set-Cookie", buildSessionCookie(token)],
      ["Set-Cookie", buildClearStateCookie()],
      ["Cache-Control", "no-store"],
    ],
  });
};
