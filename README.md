# 类脑ΟΔΥΣΣΕΙΑ · 社区知识库

本仓库使用 [VitePress](https://vitepress.dev/) 构建，部署于 GitHub Pages。

> **线上地址**：`https://<用户名>.github.io/naoleiwiki/`

---

## 📁 项目结构

```text
.
├─ README.md                          # 仓库说明 & 编写指南（不参与站点构建）
├─ package.json
├─ .gitignore
├─ .github/workflows/deploy.yml       # GitHub Actions 自动部署
│
└─ docs/                               # ⭐ 站点内容根目录
   ├─ index.md                         # 首页
   ├─ .vitepress/
   │   ├─ config.mts                   # 核心配置（搜索 / 主题 / 页脚等）
   │   ├─ navigation.ts                # ⭐ 统一导航数据源（顶栏 + 侧边栏）
   │   └─ theme/
   │       ├─ index.ts                 # 主题入口
   │       └─ custom.css               # 全局自定义样式
   │
   ├─ community-rules/                 # 社区规则
   │   ├─ index.md                     # 规则总览
   │   ├─ basic-rules.md               # 基础规则
   │   └─ subarea-rules.md             # 子区规则
   │
   ├─ faq/                             # 常见问题
   │   └─ index.md
   │
   └─ beginner-guide/                  # 新手教程
       └─ index.md
```

**关键点**：

- 只有 `docs/` 目录参与站点构建，根目录文件（如本 README）不会出现在线上站点中。
- **导航配置统一维护** — `docs/.vitepress/navigation.ts` 是顶栏和侧边栏的唯一数据源。
- `config.mts` 通过 `generateNav()` 和 `generateSidebar()` 自动生成导航结构，无需手动同步。

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

### 链接写法

```markdown
<!-- 站内链接 —— 使用绝对路径（基于 docs/ 目录） -->
[基础规则](/community-rules/basic-rules)

<!-- 同目录下的相对链接 -->
[子区规则](./subarea-rules)

<!-- 外部链接 -->
[Discord 社区准则](https://discord.com/guidelines)
```

---

## 🔧 配置速查

`docs/.vitepress/config.mts` 核心字段：

| 文件 / 字段             | 说明                                      |
| ----------------------- | ----------------------------------------- |
| `navigation.ts`         | ⭐ 统一导航数据源，自动生成 nav 和 sidebar |
| `config.mts` → `base`   | 站点基础路径，当前为 `/naoleiwiki/`       |
| `config.mts` → `title`  | HTML `<title>` 标签文字                   |
| `themeConfig.siteTitle` | 导航栏左侧显示的站点名称                  |
| `themeConfig.search`    | 本地搜索及中文翻译                        |
| `themeConfig.outline`   | 右侧「本页目录」层级                      |
| `themeConfig.footer`    | 页脚文字                                  |

---

## 🚢 部署

### GitHub Pages（当前方案）

1. 推送代码到 `main` 分支
2. GitHub Actions 自动触发构建和部署（见 `.github/workflows/deploy.yml`）
3. 仓库 Settings → Pages → Source 设为 **GitHub Actions**

### 其他部署方式

| 平台             | 构建命令                   | 输出目录                |
| ---------------- | -------------------------- | ----------------------- |
| Cloudflare Pages | `npx vitepress build docs` | `docs/.vitepress/dist`  |
| Vercel           | `npx vitepress build docs` | `docs/.vitepress/dist`  |
| VPS (Nginx)      | `npx vitepress build docs` | 将 dist 复制到 web root |

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
| 修改页脚/搜索等配置 | 编辑 `config.mts` → `themeConfig`                                |
| 本地预览            | `npx vitepress dev docs`                                         |
