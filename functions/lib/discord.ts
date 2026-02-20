/**
 * Discord API 工具库
 * 封装 OAuth2 流程和用户/服务器查询
 */

import type {
  DiscordGuildMember,
  DiscordTokenResponse,
  DiscordUser,
  Env,
  OAuthState,
} from "../types";

// ─── 常量 ──────────────────────────────────────────────────

const DISCORD_API_BASE = "https://discord.com/api/v10";
const DISCORD_OAUTH2_AUTHORIZE = "https://discord.com/oauth2/authorize";
const DISCORD_OAUTH2_TOKEN = `${DISCORD_API_BASE}/oauth2/token`;

/** OAuth2 所需的 scope（使用 guilds.members.read 代替 guilds 以保护用户隐私） */
const OAUTH2_SCOPES = "identify guilds.members.read";

// ─── OAuth2 State 加密/解密 ─────────────────────────────────

/**
 * 生成加密的 OAuth2 state 参数（防 CSRF）
 * 使用 AES-GCM 加密，确保 state 不可被伪造
 */
export async function encryptState(
  state: OAuthState,
  secret: string,
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(state));

  // 从 secret 派生 AES 密钥
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret).buffer as ArrayBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode("leinao-oauth-state").buffer as ArrayBuffer,
      iterations: 1000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );

  // 生成随机 IV
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // 加密
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    data.buffer as ArrayBuffer,
  );

  // 拼接 IV + 密文，Base64URL 编码
  const combined = new Uint8Array(iv.length + new Uint8Array(encrypted).length);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);

  return btoa(String.fromCharCode(...combined))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * 解密 OAuth2 state 参数
 */
export async function decryptState(
  encrypted: string,
  secret: string,
): Promise<OAuthState | null> {
  try {
    const encoder = new TextEncoder();

    // Base64URL 解码
    let base64 = encrypted.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) base64 += "=";
    const combined = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

    // 提取 IV 和密文
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    // 派生密钥（与加密时相同）
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret).buffer as ArrayBuffer,
      { name: "PBKDF2" },
      false,
      ["deriveKey"],
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: encoder.encode("leinao-oauth-state").buffer as ArrayBuffer,
        iterations: 1000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"],
    );

    // 解密
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      ciphertext.buffer as ArrayBuffer,
    );

    const stateStr = new TextDecoder().decode(decrypted);
    const state: OAuthState = JSON.parse(stateStr);

    // 检查 state 是否过期（5 分钟）
    const now = Math.floor(Date.now() / 1000);
    if (now - state.ts > 300) return null;

    return state;
  } catch {
    return null;
  }
}

// ─── OAuth2 URL 构建 ───────────────────────────────────────

/**
 * 构建 Discord OAuth2 授权 URL
 */
export function buildAuthorizationURL(
  clientId: string,
  redirectUri: string,
  state: string,
): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: OAUTH2_SCOPES,
    state,
    prompt: "none",
  });

  return `${DISCORD_OAUTH2_AUTHORIZE}?${params.toString()}`;
}

/**
 * 获取 OAuth2 回调 URL
 */
export function getRedirectUri(request: Request): string {
  const url = new URL(request.url);
  return `${url.origin}/api/auth/callback`;
}

// ─── Discord API 调用 ──────────────────────────────────────

/**
 * 用授权码换取 Access Token
 */
export async function exchangeCode(
  code: string,
  redirectUri: string,
  env: Env,
): Promise<DiscordTokenResponse> {
  const body = new URLSearchParams({
    client_id: env.DISCORD_CLIENT_ID,
    client_secret: env.DISCORD_CLIENT_SECRET,
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
  });

  const response = await fetch(DISCORD_OAUTH2_TOKEN, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Discord token exchange failed: ${response.status} ${errorText}`,
    );
  }

  return response.json();
}

/**
 * 获取当前用户信息
 */
export async function fetchUser(accessToken: string): Promise<DiscordUser> {
  const response = await fetch(`${DISCORD_API_BASE}/users/@me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error(`Discord user fetch failed: ${response.status}`);
  }

  return response.json();
}

/**
 * 获取用户在指定服务器中的成员信息
 * 使用 guilds.members.read scope，仅查询指定服务器，不暴露用户所有服务器列表
 *
 * @param accessToken - OAuth2 access token
 * @param guildId     - 目标服务器 ID
 * @returns 成员信息，若用户不在该服务器则返回 null
 */
export async function fetchGuildMember(
  accessToken: string,
  guildId: string,
): Promise<DiscordGuildMember | null> {
  const response = await fetch(
    `${DISCORD_API_BASE}/users/@me/guilds/${guildId}/member`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (response.status === 404 || response.status === 403) {
    // 用户不在该服务器，或无权访问
    return null;
  }

  if (!response.ok) {
    throw new Error(`Discord guild member fetch failed: ${response.status}`);
  }

  return response.json();
}

/**
 * 检查用户是否在指定服务器中且拥有任一指定身份组
 *
 * @param accessToken - OAuth2 access token
 * @param guildId     - 目标服务器 ID
 * @param roleIds     - 允许的身份组 ID 列表（逗号分隔的字符串）
 * @returns { inGuild, hasRole, matchedRoles, member } 验证结果
 */
export async function verifyMembership(
  accessToken: string,
  guildId: string,
  roleIds: string,
): Promise<{
  inGuild: boolean;
  hasRole: boolean;
  matchedRoles: string[];
  member: DiscordGuildMember | null;
}> {
  const member = await fetchGuildMember(accessToken, guildId);

  if (!member) {
    return { inGuild: false, hasRole: false, matchedRoles: [], member: null };
  }

  // 解析逗号分隔的身份组 ID 列表，去除空白
  const allowedRoles = roleIds
    .split(",")
    .map((id) => id.trim())
    .filter((id) => id.length > 0);

  // 找出用户拥有的匹配身份组
  const matchedRoles = allowedRoles.filter((roleId) =>
    member.roles.includes(roleId),
  );

  const hasRole = matchedRoles.length > 0;
  return { inGuild: true, hasRole, matchedRoles, member };
}
