# 🤖 Discord 问题搜索机器人

本文档说明如何在 Cloudflare Pages Functions 中启用 Slash 命令 `/wenti-sousuo`（中文显示名：问题搜索）。

---

## 1. 创建 Discord 应用与 Bot

1. 进入 <https://discord.com/developers/applications>
2. 新建 Application
3. 在 **Bot** 页创建 Bot
4. 记录以下信息：
   - **Application ID**（应用 ID）
   - **Public Key**
   - **Bot Token**（仅显示一次）

### 1.1 勾选 Bot 权限与设置

在 **Bot** 页面：

- **Privileged Gateway Intents**：本机器人只处理 Slash 命令，保持默认即可（不需要开启额外 Intent）。
- **Presence/Server Members/Message Content Intent**：无需开启。

在 **OAuth2 → URL Generator** 页面：

1. 勾选 **Scopes**：
   - `bot`
   - `applications.commands`
2. **Bot Permissions** 勾选：
   - `Send Messages`
   - `Embed Links`（可选，如果未来要改用 Embed）
3. 复制生成的邀请链接，将 Bot 拉入服务器。

---

## 2. 配置 Cloudflare Pages 环境变量

在 Cloudflare Pages 项目 → **Settings** → **Environment variables** 中添加：

| 变量名               | 说明                |
| -------------------- | ------------------- |
| `DISCORD_PUBLIC_KEY` | 用于验证交互签名    |
| `DISCORD_BOT_TOKEN`  | 用于注册 Slash 命令 |
| `DISCORD_APP_ID`     | 用于注册 Slash 命令 |

---

## 2.1 Cloudflare Pages 部署流程（Functions）

1. 在 Cloudflare Dashboard → **Workers & Pages** → **Create application** → **Pages**
2. 选择 **Connect to Git** 并绑定此仓库
3. 构建设置：

| 配置项                 | 值                         |
| ---------------------- | -------------------------- |
| Production branch      | `main`                     |
| Build command          | `npx vitepress build docs` |
| Build output directory | `docs/.vitepress/dist`     |
| Root directory         | `/`                        |

1. 在 **Settings → Environment variables** 中添加：

| 变量名               | 值                  | 说明         |
| -------------------- | ------------------- | ------------ |
| `DISCORD_PUBLIC_KEY` | 从 Discord 应用复制 | 交互签名校验 |
| `DISCORD_BOT_TOKEN`  | 从 Discord 应用复制 | 注册命令     |
| `DISCORD_APP_ID`     | 应用 ID             | 注册命令     |

1. 保存并部署。部署成功后即可访问 `/api/discord/commands` 与 `/api/discord/interactions`。

## 3. 注册 Slash 命令

部署后请求以下接口注册命令：

```
POST https://<你的域名>/api/discord/commands
```

成功返回 `OK` 即注册完成（全局命令生效可能需要几分钟）。

---

## 4. 设置交互回调 URL

在 Discord Developer Portal → **General Information** 中：

- Interactions Endpoint URL：

```
https://<你的域名>/api/discord/interactions
```

保存后 Discord 会验证签名。

---

## 5. 使用命令

- 命令名：`/wenti-sousuo`
- 中文显示名：`问题搜索`
- 参数：`关键词`

返回格式：标题 + 链接 + 摘要（最多 5 条），默认隐藏 `/works/` 内容。
