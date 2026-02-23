# Discord OAuth2 认证部署指南

本文档详细说明如何为脑类自研 · 常见答疑知识库配置 Discord OAuth2 全站认证。

---

## 📋 前置条件

- GitHub 仓库（建议设为**私有**以保护源码内容）
- Cloudflare 账号（免费即可）
- Discord 账号（需有目标服务器的管理权限或知道服务器 ID）

---

## 第一步：创建 Discord 应用

1. 访问 [Discord Developer Portal](https://discord.com/developers/applications)
2. 点击 **New Application** → 输入应用名称（如 `类脑知识库认证`）→ 点击 **Create**
3. 进入应用设置页面

### 配置 OAuth2

1. 左侧菜单点击 **OAuth2** → **General**
2. 记录 **Client ID** 和 **Client Secret**（⚠️ Secret 只显示一次，务必妥善保存）
3. 在 **Redirects** 中添加回调 URL：

   ```
   https://你的域名.pages.dev/api/auth/callback
   ```

   > 如果使用自定义域名，也需要添加：
>
   > ```
   > https://你的自定义域名.com/api/auth/callback
   > ```

### 配置 OAuth2 URL Generator（Scopes 勾选）

在 Discord Developer Portal → 你的应用 → **OAuth2** → **OAuth2 URL Generator** 页面，需要正确勾选以下选项：

#### SCOPES（权限范围）

| 选项                  |  是否勾选  | 说明                                         |
| --------------------- | :--------: | -------------------------------------------- |
| `identify`            | ✅ **必选** | 获取用户基本信息（用户名、头像、ID）         |
| `guilds.members.read` | ✅ **必选** | 查询用户在指定服务器中的成员信息和身份组     |
| `guilds`              |  ❌ 不勾选  | 会暴露用户所有已加入的服务器列表（隐私风险） |
| `email`               |  ❌ 不勾选  | 不需要用户邮箱                               |
| `bot`                 |  ❌ 不勾选  | 我们不使用 Bot，仅使用 OAuth2                |
| `connections`         |  ❌ 不勾选  | 不需要用户的第三方平台连接信息               |
| `guilds.join`         |  ❌ 不勾选  | 不需要自动拉人进服务器                       |
| `messages.read`       |  ❌ 不勾选  | 不需要读取用户消息                           |
| 其他所有选项          |  ❌ 不勾选  | 遵循最小权限原则                             |

> 💡 **隐私优先**：使用 `guilds.members.read` 而非 `guilds`。前者只查询用户在**指定服务器**中的成员信息（含身份组），不会暴露用户所有服务器列表，用户更放心授权。

#### REDIRECT URL

在下方 **Redirect URL** 下拉框中选择你在上一步添加的回调地址：

```
https://你的域名.pages.dev/api/auth/callback
```

#### 生成的 URL（仅供参考）

页面底部会生成一个授权 URL，格式如下：

```
https://discord.com/oauth2/authorize?client_id=你的CLIENT_ID&response_type=code&redirect_uri=你的回调URL&scope=identify+guilds.members.read
```

> ⚠️ **注意**：这个生成的 URL 仅供测试参考。实际使用中，登录流程由 `functions/api/auth/login.ts` 自动生成授权 URL，无需手动复制此链接。

### 获取服务器 ID 和身份组 ID

1. 在 Discord 客户端 → 用户设置 → 高级 → 打开「开发者模式」
2. 右键点击目标服务器名称 → **复制服务器 ID**
3. 获取身份组 ID：
   - 进入目标服务器 → **服务器设置** → **身份组**
   - 找到要用于验证的身份组，右键点击 → **复制身份组 ID**
   - 或者在聊天中输入 `\@身份组名称`，发送后会显示 `<@&身份组ID>` 格式

---

## 第二步：生成安全密钥

你需要两个随机密钥。在任意终端运行以下命令生成：

### JWT 签名密钥（至少 32 字符）

```bash
# Linux / macOS
openssl rand -hex 32

# 或使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Windows PowerShell
[System.Convert]::ToHexString([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

### State 加密密钥（至少 16 字符）

```bash
# 使用同样的方式生成另一个密钥
openssl rand -hex 16

# 或
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

> ⚠️ **安全提醒**：这些密钥绝对不能提交到代码仓库中！

---

## 第三步：配置 Cloudflare Pages

### 3.1 创建项目

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 左侧菜单 → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. 选择你的 GitHub 仓库（支持私有仓库）
4. 填写构建配置：

| 配置项                     | 值                         |
| -------------------------- | -------------------------- |
| **Production branch**      | `main`                     |
| **Framework preset**       | None                       |
| **Build command**          | `npx vitepress build docs` |
| **Build output directory** | `docs/.vitepress/dist`     |
| **Root directory**         | `/`（默认）                |

### 3.2 配置环境变量

在 Cloudflare Pages 项目 → **Settings** → **Environment variables** 中添加以下变量：

| 变量名                  | 值                                | 类型     |
| ----------------------- | --------------------------------- | -------- |
| `NODE_VERSION`          | `20`                              | 明文     |
| `CF_PAGES`              | `1`                               | 明文     |
| `DISCORD_CLIENT_ID`     | 你的 Discord 应用 Client ID       | 明文     |
| `DISCORD_CLIENT_SECRET` | 你的 Discord 应用 Client Secret   | **加密** |
| `DISCORD_GUILD_ID`      | 你的 Discord 服务器 ID            | 明文     |
| `DISCORD_ROLE_IDS`      | 允许的身份组 ID（多个用逗号分隔） | 明文     |
| `JWT_SECRET`            | 第二步生成的 JWT 签名密钥         | **加密** |
| `STATE_SECRET`          | 第二步生成的 State 加密密钥       | **加密** |

> 💡 Cloudflare 的「加密」变量在设置后不可查看，只能覆盖。适合存放密钥。

> ⚠️ **Production** 和 **Preview** 环境需要分别设置，或选择「All environments」。

### 3.3 部署

点击 **Save and Deploy**，Cloudflare 将自动：

1. 克隆仓库
2. 执行 `npx vitepress build docs` 构建静态站点
3. 检测 `functions/` 目录并自动编译 Pages Functions
4. 部署到 `项目名.pages.dev`

---

## 第四步：验证部署

1. 访问 `https://你的项目名.pages.dev/`
2. 应该看到 Discord 登录页面
3. 点击「使用 Discord 登录」
4. 在 Discord 授权页面点击「授权」
5. 如果你在目标服务器中且拥有指定身份组 → 自动重定向到知识库首页
6. 如果不在目标服务器中 → 显示「请先加入服务器」提示页
7. 如果在服务器中但没有指定身份组 → 显示「权限不足」提示页

---

## 第五步：仓库设为私有（强烈建议）

为了保护知识库内容不被直接从 GitHub 访问：

1. GitHub 仓库 → **Settings** → **General** → 滚动到最下方 **Danger Zone**
2. 点击 **Change repository visibility** → 选择 **Make private**
3. Cloudflare Pages 的 Git 连接不受影响，私有仓库仍可正常部署

---

## 🔧 可选配置

### 设置 Discord 服务器邀请链接

编辑 `functions/api/auth/callback.ts`，找到 `notInGuildPage()` 调用，取消注释并填入邀请链接：

```ts
// 修改前
return htmlResponse(
  notInGuildPage(/* "https://discord.gg/你的邀请码" */),
  403,
);

// 修改后
return htmlResponse(
  notInGuildPage("https://discord.gg/你的邀请码"),
  403,
);
```

### 自定义域名

1. Cloudflare Pages 项目 → **Custom domains** → **Set up a custom domain**
2. 输入你的域名 → Cloudflare 自动配置 DNS 和 SSL
3. 记得在 Discord 应用的 OAuth2 Redirects 中添加新域名的回调 URL

### 调整 Token 有效期

编辑 `functions/lib/jwt.ts`，修改 `TOKEN_EXPIRY_SECONDS`：

```ts
// 默认 7 天
const TOKEN_EXPIRY_SECONDS = 7 * 24 * 60 * 60;

// 改为 1 天
const TOKEN_EXPIRY_SECONDS = 1 * 24 * 60 * 60;

// 改为 30 天
const TOKEN_EXPIRY_SECONDS = 30 * 24 * 60 * 60;
```

---

## 🔒 安全架构说明

| 安全要素        | 实现方式                                                      |
| --------------- | ------------------------------------------------------------- |
| **密钥保护**    | 所有密钥存储在 Cloudflare 环境变量中，不进入代码仓库          |
| **CSRF 防护**   | OAuth2 state 参数使用 AES-GCM 加密 + Cookie 双重验证          |
| **Cookie 安全** | `HttpOnly` + `Secure` + `SameSite=Lax`，防 XSS 和 CSRF        |
| **JWT 防篡改**  | HMAC-SHA256 签名，服务端验证                                  |
| **Token 过期**  | JWT 内置 7 天过期时间，过期后需重新授权                       |
| **State 过期**  | OAuth2 state 参数 5 分钟过期，防重放攻击                      |
| **安全头**      | 中间件自动添加 `X-Content-Type-Options`、`X-Frame-Options` 等 |
| **源码保护**    | 仓库设为私有，避免 Markdown 原文被直接访问                    |

---

## 📁 认证相关文件结构

```text
functions/                        # Cloudflare Pages Functions
├─ _middleware.ts                  # 全局认证中间件（拦截所有请求）
├─ types.ts                        # 类型定义（Env, JWT, Discord 等）
├─ tsconfig.json                   # Functions TypeScript 配置
├─ lib/
│   ├─ jwt.ts                      # JWT 签发与验证（Web Crypto API）
│   ├─ cookie.ts                   # 安全 Cookie 操作
│   ├─ discord.ts                  # Discord OAuth2 & API 封装
│   └─ html.ts                     # 登录页/错误页 HTML 模板
└─ api/
    └─ auth/
        ├─ login.ts                # GET /api/auth/login — 发起登录
        ├─ callback.ts             # GET /api/auth/callback — OAuth2 回调
        └─ logout.ts               # GET /api/auth/logout — 登出
```

---

## ❓ 常见问题

### Q: 构建失败提示 Node 版本过低

添加环境变量 `NODE_VERSION` = `20`。

### Q: 登录后显示 「安全验证失败」

检查 `STATE_SECRET` 环境变量是否在 Production 和 Preview 环境都已设置。

### Q: 授权后提示「登录失败」

1. 检查 Discord 应用的 **Redirects** 是否包含正确的回调 URL
2. 确认 `DISCORD_CLIENT_ID` 和 `DISCORD_CLIENT_SECRET` 正确

### Q: 提示「您尚未加入社区服务器」但实际已加入

确认 `DISCORD_GUILD_ID` 是否正确（18 位数字字符串）。

### Q: 提示「权限不足」但我已经在服务器中

你在服务器中但没有任何允许的身份组。请检查：

1. `DISCORD_ROLE_IDS` 环境变量是否正确（多个 ID 用逗号分隔，如 `123456,789012,345678`）
2. 联系服务器管理员为你分配对应的身份组（拥有其中任意一个即可）
3. 身份组 ID 可通过「开发者模式」右键身份组获取

### Q: 能否保留 GitHub Pages 同时使用 Cloudflare Pages？

可以，但不建议。GitHub Pages 版本无法进行认证保护。`config.mts` 中的 `base` 已通过 `CF_PAGES` 环境变量自动切换。

### Q: 静态资源（CSS/JS/图片）是否也需要认证？

不需要。中间件已自动放行常见静态资源扩展名，确保登录页面能正常加载样式。
