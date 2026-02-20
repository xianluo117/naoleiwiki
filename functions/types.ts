/**
 * Cloudflare Pages Functions 类型定义
 * 定义环境变量绑定和通用类型
 */

/** Cloudflare Pages Functions 环境变量绑定 */
export interface Env {
  /** Discord OAuth2 应用 Client ID */
  DISCORD_CLIENT_ID: string;
  /** Discord OAuth2 应用 Client Secret（机密，仅存在于环境变量中） */
  DISCORD_CLIENT_SECRET: string;
  /** 要验证的 Discord 服务器 ID */
  DISCORD_GUILD_ID: string;
  /** 要验证的 Discord 身份组 ID（用户必须拥有此身份组才能访问） */
  DISCORD_ROLE_ID: string;
  /** JWT 签名密钥（至少 32 字符随机字符串） */
  JWT_SECRET: string;
  /** OAuth2 state 加密密钥（至少 16 字符随机字符串） */
  STATE_SECRET: string;
}

/** Discord OAuth2 Token 响应 */
export interface DiscordTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

/** Discord 用户信息 */
export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  global_name: string | null;
}

/** Discord Guild（服务器）简要信息 */
export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
}

/** Discord Guild Member（服务器成员信息，guilds.members.read 返回） */
export interface DiscordGuildMember {
  /** 用户对象 */
  user?: DiscordUser;
  /** 服务器内昵称 */
  nick: string | null;
  /** 用户头像 hash（服务器内） */
  avatar: string | null;
  /** 用户拥有的身份组 ID 列表 */
  roles: string[];
  /** 加入服务器时间 */
  joined_at: string;
  /** 是否被禁言 */
  mute: boolean;
  /** 是否被服务器静音 */
  deaf: boolean;
}

/** JWT Payload 结构 */
export interface JWTPayload {
  /** Discord 用户 ID */
  sub: string;
  /** Discord 用户名 */
  username: string;
  /** Discord 显示名 */
  display_name: string;
  /** Discord 头像 hash */
  avatar: string | null;
  /** 签发时间 (Unix timestamp) */
  iat: number;
  /** 过期时间 (Unix timestamp) */
  exp: number;
}

/** OAuth2 State 数据 */
export interface OAuthState {
  /** 随机 nonce 防 CSRF */
  nonce: string;
  /** 用户原始请求的路径，认证后重定向回此路径 */
  returnTo: string;
  /** state 创建时间 (Unix timestamp) */
  ts: number;
}
