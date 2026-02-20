/**
 * GET /api/auth/login
 * 发起 Discord OAuth2 登录流程
 *
 * 1. 生成加密的 state 参数（含 CSRF nonce + 原始路径）
 * 2. 将 state 写入 HttpOnly cookie（用于回调时验证）
 * 3. 重定向到 Discord 授权页
 */

import { buildStateCookie } from "../../lib/cookie";
import {
  buildAuthorizationURL,
  encryptState,
  getRedirectUri,
} from "../../lib/discord";
import type { Env, OAuthState } from "../../types";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);

  // 获取用户想要访问的原始路径（由中间件通过 query 传入）
  const returnTo = url.searchParams.get("returnTo") || "/";

  // 生成 CSRF nonce（16 字节随机值，Hex 编码）
  const nonceBytes = crypto.getRandomValues(new Uint8Array(16));
  const nonce = Array.from(nonceBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // 构建 state 对象
  const stateData: OAuthState = {
    nonce,
    returnTo,
    ts: Math.floor(Date.now() / 1000),
  };

  // 加密 state
  const encryptedState = await encryptState(stateData, env.STATE_SECRET);

  // 构建 Discord 授权 URL
  const redirectUri = getRedirectUri(request);
  const authUrl = buildAuthorizationURL(
    env.DISCORD_CLIENT_ID,
    redirectUri,
    encryptedState,
  );

  // 返回重定向响应，同时设置 state cookie
  return new Response(null, {
    status: 302,
    headers: {
      Location: authUrl,
      "Set-Cookie": buildStateCookie(encryptedState),
      "Cache-Control": "no-store",
    },
  });
};
