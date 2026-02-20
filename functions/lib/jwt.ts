/**
 * JWT 工具库
 * 使用 Web Crypto API 实现 HMAC-SHA256 签名的 JWT
 * 兼容 Cloudflare Workers 运行时（无 Node.js 依赖）
 */

import type { JWTPayload } from "../types";

// ─── 内部工具函数 ────────────────────────────────────────────

/** 将字符串编码为 Uint8Array */
function encode(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

/** Base64URL 编码（无填充） */
function base64urlEncode(data: Uint8Array): string {
  const binStr = Array.from(data, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binStr)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/** Base64URL 解码 */
function base64urlDecode(str: string): Uint8Array {
  // 还原标准 Base64
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  // 补齐填充
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  const binStr = atob(base64);
  return Uint8Array.from(binStr, (c) => c.charCodeAt(0));
}

/** 将字符串编码为 Base64URL JSON */
function jsonToBase64url(obj: Record<string, unknown>): string {
  return base64urlEncode(encode(JSON.stringify(obj)));
}

/** 导入 HMAC-SHA256 密钥 */
async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encode(secret).buffer as ArrayBuffer,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

// ─── 公开 API ──────────────────────────────────────────────

/** JWT Token 有效期：7 天 */
const TOKEN_EXPIRY_SECONDS = 7 * 24 * 60 * 60;

/**
 * 创建 JWT Token
 *
 * @param payload - JWT 负载数据（不含 iat/exp）
 * @param secret  - 签名密钥
 * @returns 签名后的 JWT 字符串
 */
export async function createJWT(
  payload: Omit<JWTPayload, "iat" | "exp">,
  secret: string,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  const fullPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp: now + TOKEN_EXPIRY_SECONDS,
  };

  // Header
  const header = { alg: "HS256", typ: "JWT" };

  // 编码 Header 和 Payload
  const headerB64 = jsonToBase64url(
    header as unknown as Record<string, unknown>,
  );
  const payloadB64 = jsonToBase64url(
    fullPayload as unknown as Record<string, unknown>,
  );
  const signingInput = `${headerB64}.${payloadB64}`;

  // 签名
  const key = await importKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encode(signingInput) as unknown as ArrayBuffer,
  );

  const signatureB64 = base64urlEncode(new Uint8Array(signature));

  return `${signingInput}.${signatureB64}`;
}

/**
 * 验证并解析 JWT Token
 *
 * @param token  - JWT 字符串
 * @param secret - 签名密钥
 * @returns 解析后的 payload，验证失败返回 null
 */
export async function verifyJWT(
  token: string,
  secret: string,
): Promise<JWTPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;
    const signingInput = `${headerB64}.${payloadB64}`;

    // 验证签名
    const key = await importKey(secret);
    const signatureBytes = base64urlDecode(signatureB64);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes.buffer as ArrayBuffer,
      encode(signingInput).buffer as ArrayBuffer,
    );

    if (!valid) return null;

    // 解析 payload
    const payloadBytes = base64urlDecode(payloadB64);
    const payloadStr = new TextDecoder().decode(payloadBytes);
    const payload: JWTPayload = JSON.parse(payloadStr);

    // 检查过期时间
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;

    return payload;
  } catch {
    return null;
  }
}
