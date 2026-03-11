# 脑类自研 · 常见答疑知识库

本仓库使用 [VitePress](https://vitepress.dev/) 构建，支持 Cloudflare Pages / GitHub Pages 双平台部署。

> **线上地址**：
>
> - Cloudflare Pages：`https://<项目名>.pages.dev/`（或自定义域名）
> - GitHub Pages：`https://<用户名>.github.io/naoleiwiki/`

---

## 📁 项目结构

```text
.
├─ README.md                          # 仓库说明 & 编写指南（不参与站点构建）
├─ SETUP-AUTH.md                      # Discord OAuth 认证配置指南
├─ package.json
├─ .gitignore
├─ .github/workflows/deploy.yml       # GitHub Actions 自动部署
│
├─ functions/                          # Cloudflare Pages Functions（Discord OAuth）
│   ├─ _middleware.ts                  # 鉴权中间件
│   ├─ types.ts                        # 类型定义
│   ├─ api/auth/                       # OAuth 路由
│   │   ├─ login.ts
│   │   ├─ callback.ts
│   │   └─ logout.ts
│   └─ lib/                            # 工具库
│       ├─ cookie.ts
│       ├─ discord.ts
│       ├─ html.ts
│       └─ jwt.ts
│
└─ docs/                               # ⭐ 站点内容根目录
   ├─ index.md                         # 首页
   ├─ public/
   │   └─ ico.jpg                      # 网站 favicon
   ├─ .vitepress/
   │   ├─ config.mts                   # 核心配置（搜索 / 主题 / 页脚等）
   │   ├─ navigation.ts                # ⭐ 统一导航数据源（顶栏 + 侧边栏）
   │   └─ theme/
   │       ├─ index.ts                 # 主题入口（含全局提示横幅）
   │       └─ custom.css               # 全局自定义样式
   │
   ├─ beginner-guide/                  # 新手教程
   │   └─ index.md
   ├─ credits/                         # 致谢
   │   └─ index.md
   ├─ faq/                             # 常见问题
   │   ├─ index.md
   │   ├─ discord.md                   # Discord 相关
   │   └─ st-usage.md                  # 酒馆使用问题
   ├─ st-basics/                       # 酒馆基础
   │   ├─ index.md
   │   ├─ what-is-st.md
   │   ├─ file-structure.md
   │   ├─ regex.md
   │   ├─ slash-commands.md
   │   ├─ update-backup.md
   │   └─ install/                     # 部署安装
   │       ├─ windows.md
   │       ├─ linux.md
   │       └─ android.md
   └─ troubleshooting/                 # 报错对照表
       ├─ index.md                     # 渠道总览
       ├─ general.md                   # 通用问题
       ├─ gemini-api.md
       ├─ gemini-build.md
       ├─ gemini-cli.md
       ├─ claude.md
       └─ deepseek.md
```

**关键点**：

- 只有 `docs/` 目录参与站点构建，根目录文件（如本 README）不会出现在线上站点中。
- **导航配置统一维护** — `docs/.vitepress/navigation.ts` 是顶栏和侧边栏的唯一数据源。
- `config.mts` 通过 `generateNav()` 和 `generateSidebar()` 自动生成导航结构，无需手动同步。
- `functions/` 目录为 Cloudflare Pages Functions，实现 Discord OAuth 登录鉴权。
- `docs/public/` 存放静态资源（如 favicon），构建时会原样复制到输出根目录。

---

## 🚀 本地开发

```bash
# 1. 安装依赖（首次）
npm install

# 2. 启动开发服务器（热更新）
npx vitepress dev docs

# 3. 构建静态站点（可选，用于本地预览构建产物）
npx vitepress build docs
npx vitepress preview docs
```

开发服务器默认运行在 `http://localhost:5173/naoleiwiki/`。

---

## ✏️ 编写指南：如何新增内容

### 第一步：创建 Markdown 文件

在 `docs/` 目录下对应分区创建 `.md` 文件。

**示例**：在「常见问题」下新增一篇《安装报错排查》

```text
docs/faq/install-errors.md    ← 新建此文件
```

文件命名规则：

- 使用 **英文小写 + 短横线**（如 `install-errors.md`、`basic-rules.md`）
- 目录的首页文件统一命名为 `index.md`
- 避免中文文件名（URL 兼容性更好）

### 第二步：编写页面内容

参考以下模板：

```markdown
# 🚀 安装报错排查

::: tip 💡 提示
这里写一段引导性的简介文字。
:::

---

## 问题一：xxxx

问题描述和解决方案……

---

## 问题二：xxxx

问题描述和解决方案……

---

## 快速链接

- 🏠 [返回首页](/)
- ❓ [常见问题](/faq/)
```

### 第三步：注册到导航（顶栏 + 侧边栏自动同步）

打开 `docs/.vitepress/navigation.ts`，在对应分区的 `items` 中添加新条目：

```ts
// navigation.ts → sections 数组中找到对应分区
{
  text: "常见问题",
  sidebarText: "酒馆常见问题",
  icon: "❓",
  link: "/faq/",
  items: [
    { text: "问题总览", link: "/faq/" },
    { text: "安装报错排查", link: "/faq/install-errors" },  // ← 新增这一行
  ],
},
```

> ⭐ **只需改 `navigation.ts` 一个文件**，顶部导航栏和左侧侧边栏会自动同步生成，无需分别修改。

### 第四步（可选）：新增一个全新分区

如果要创建一个全新的内容分类（如「进阶技巧」）：

1. 创建目录和首页文件：

   ```text
   docs/advanced-tips/index.md
   ```

2. 在 `navigation.ts` 的 `sections` 数组末尾追加新分区：

   ```ts
   {
     text: "进阶技巧",        // 顶栏显示文字
     sidebarText: "进阶技巧",  // 侧边栏显示文字（可选，默认同 text）
     icon: "🎯",              // 侧边栏图标
     link: "/advanced-tips/",
     items: [
       { text: "技巧总览", link: "/advanced-tips/" },
     ],
   },
   ```

3. 在首页 `docs/index.md` 的「快速入口」中添加链接：

   ```markdown
   - [🎯 进阶技巧](/advanced-tips/)
   ```

---

## 📝 Markdown 写法规范

### 提示框（Containers）

站点支持 VitePress 内置的提示框语法，推荐在适当位置使用：

```markdown
::: tip 💡 标题
提示信息。一般用于引导、建议。
:::

::: info 📌 标题
信息补充。一般用于背景说明、适用范围。
:::

::: warning ⚠️ 标题
警告信息。用于需要注意的事项。
:::

::: danger ⛔ 标题
危险/红线警告。用于严禁行为。
:::
```

### 表格

推荐用表格呈现结构化信息：

```markdown
| 列 A | 列 B | 列 C |
| ---- | ---- | ---- |
| 内容 | 内容 | 内容 |
```

### Emoji 图标

为标题和列表项添加 emoji 增强可读性，当前常用约定：

| 图标 | 用途      | 图标 | 用途      |
| ---- | --------- | ---- | --------- |
| 📋    | 规则/规范 | 🏠    | 首页      |
| ✅    | 基础/核心 | ❓    | 问题/FAQ  |
| 📦    | 资源/子区 | 🍼    | 新手/入门 |
| 🚀    | 安装/部署 | ⚙️    | 配置/设置 |
| 🃏    | 角色卡    | 🎨    | 美化/界面 |
| 🔧    | 插件/工具 | ⚠️    | 警告/报错 |
| 💡    | 提示      | 📌    | 说明/备注 |
| 🚫    | 禁止      | ⛔    | 红线      |

### 页面结构建议

```
# emoji + 标题

::: tip / info 引导框
一段简介
:::

---

## 正文章节 1
内容……

---

## 正文章节 2
内容……

---

## 快速链接
返回首页 / 相关页面链接
```

---

## ❓ 酒馆使用问题：聊天记录超过一定楼层无法保存

当聊天记录楼层太多时，保存可能失败。通常是反向代理的请求体大小/超时时间限制导致上传被中断。

**解决方案（Nginx）：**

1. 打开 Nginx 配置文件（通常在 `/etc/nginx/nginx.conf` 或 `sites-enabled` 中对应站点文件）。
2. 在对应的 `server` 或 `location` 块内加入以下配置（建议上限 ≥ 10MB，并延长超时）：

```nginx
client_max_body_size 10m;
client_header_timeout 2m;
client_body_timeout 2m;
proxy_connect_timeout 2m;
proxy_read_timeout 2m;
proxy_send_timeout 2m;
```

1. 语法检查并重启：

```bash
nginx -t
systemctl restart nginx
```

### 链接写法

```markdown
<!-- 站内链接 —— 使用绝对路径（基于 docs/ 目录） -->
[报错对照表](/troubleshooting/)

<!-- 同目录下的相对链接 -->
[酒馆使用问题](./st-usage)

<!-- 外部链接 -->
[Discord 社区准则](https://discord.com/guidelines)
```

---

## 🔧 配置速查

`docs/.vitepress/` 核心文件与字段：

| 文件 / 字段             | 说明                                                                    |
| ----------------------- | ----------------------------------------------------------------------- |
| `navigation.ts`         | ⭐ 统一导航数据源，自动生成 nav 和 sidebar                               |
| `config.mts` → `base`   | 站点基础路径（自动判断：CF Pages → `/`，GitHub Pages → `/naoleiwiki/`） |
| `config.mts` → `head`   | HTML `<head>` 注入（favicon、meta 标签等）                              |
| `config.mts` → `title`  | HTML `<title>` 标签文字                                                 |
| `theme/index.ts`        | 主题入口，含 `doc-before` 全局提示横幅                                  |
| `theme/custom.css`      | 全局自定义样式                                                          |
| `public/ico.jpg`        | 网站 favicon 图标                                                       |
| `themeConfig.siteTitle` | 导航栏左侧显示的站点名称                                                |
| `themeConfig.search`    | 本地搜索及中文翻译                                                      |
| `themeConfig.outline`   | 右侧「本页目录」层级                                                    |
| `themeConfig.footer`    | 页脚文字                                                                |

---

## 🚢 部署

### 方案一：GitHub Pages

1. 推送代码到 `main` 分支
2. GitHub Actions 自动触发构建和部署（见 `.github/workflows/deploy.yml`）
3. 仓库 Settings → Pages → Source 设为 **GitHub Actions**
4. `config.mts` 中 `base` 保持为 `/naoleiwiki/`

访问地址：`https://<用户名>.github.io/naoleiwiki/`

### 方案二：Cloudflare Pages（推荐）

#### 关于 `base` 路径

项目已通过环境变量自动切换 `base`，无需手动修改：

```ts
// docs/.vitepress/config.mts（已实现）
const base = process.env.CF_PAGES ? "/" : "/naoleiwiki/";
```

Cloudflare Pages 构建时会自动设置 `CF_PAGES` 环境变量，`base` 会自动切换为 `/`。

#### Cloudflare 控制台配置

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create application** → **Pages**
2. 选择 **Connect to Git** → 连接 GitHub 仓库
3. 填写构建配置：

| 配置项                     | 值                         |
| -------------------------- | -------------------------- |
| **Production branch**      | `main`                     |
| **Framework preset**       | None                       |
| **Build command**          | `npx vitepress build docs` |
| **Build output directory** | `docs/.vitepress/dist`     |
| **Root directory**         | `/`（默认）                |

1. 在 **Environment variables** 中添加：

| 变量名         | 值   | 说明                                       |
| -------------- | ---- | ------------------------------------------ |
| `NODE_VERSION` | `20` | 指定 Node.js 版本                          |
| `CF_PAGES`     | `1`  | Cloudflare 自动提供，用于环境变量切换 base |

1. 点击 **Save and Deploy**

#### 自定义域名（可选）

1. 部署成功后，Cloudflare 会分配 `项目名.pages.dev` 域名
2. 如需自定义域名：Pages 项目 → **Custom domains** → **Set up a custom domain**
3. Cloudflare 会自动配置 DNS 记录和 SSL 证书

#### 自动部署

连接 GitHub 后，每次 push 到 `main` 分支都会自动触发 Cloudflare Pages 重新构建和部署。

#### 常见问题

| 问题                     | 解决方案                                                |
| ------------------------ | ------------------------------------------------------- |
| 构建失败提示 Node 版本低 | 添加环境变量 `NODE_VERSION` = `20`                      |
| 页面 404 / 资源加载失败  | 检查 `config.mts` 中 `base` 是否为 `/`                  |
| 样式/路由异常            | 确认 `Build output directory` 为 `docs/.vitepress/dist` |

### 方案三：其他平台

| 平台        | 构建命令                   | 输出目录                | 备注                 |
| ----------- | -------------------------- | ----------------------- | -------------------- |
| Vercel      | `npx vitepress build docs` | `docs/.vitepress/dist`  | `base: "/"`          |
| VPS (Nginx) | `npx vitepress build docs` | 将 dist 复制到 web root | 需手动配置 try_files |

---

## 👥 协作建议

- 内容变更走 **Pull Request**，保护 `main` 分支
- Commit 信息使用中文，格式如：`docs: 新增安装报错排查页面`
- 大幅改动前先在 Issue 中讨论
- 部署凭据放在 GitHub Secrets 中，不要硬编码

---

## 📌 常用操作速查表

| 我想…               | 操作                                                             |
| ------------------- | ---------------------------------------------------------------- |
| 新增一篇文章        | 在对应目录创建 `.md` → 在 `navigation.ts` 对应 section 添加 item |
| 新增一个分区        | 创建目录 + `index.md` → 在 `navigation.ts` 追加 section          |
| 修改导航栏/侧边栏   | 编辑 `navigation.ts`（顶栏 + 侧边栏自动同步）                    |
| 修改样式            | 编辑 `docs/.vitepress/theme/custom.css`                          |
| 修改全局提示横幅    | 编辑 `docs/.vitepress/theme/index.ts`（`doc-before` 插槽）       |
| 更换网站 favicon    | 替换 `docs/public/ico.jpg`                                       |
| 修改页脚/搜索等配置 | 编辑 `config.mts` → `themeConfig`                                |
| 本地预览            | `npx vitepress dev docs`                                         |
