# 类脑社区知识库（VitePress）

本仓库采用 VitePress 构建社区知识库，文档源目录为 [`docs/`](docs)。

## 目录层级（已确保 README 不进入站点可读范围）

```text
.
├─ README.md                  # 仓库说明（仅代码仓库可见，不会被站点构建）
├─ .github/workflows/         # CI/CD 工作流
└─ docs/                      # 站点内容根目录（仅此目录参与 VitePress 构建）
   ├─ .vitepress/
   ├─ index.md
   └─ community-rules/
```

关键点：

- 线上可访问内容来自 [`docs/`](docs) 构建产物。
- 根目录 [`README.md`](README.md) 不在构建源目录内，不会出现在站点域名可访问路径中。

---

## 本地运行

1. 安装依赖

```bash
npm i -D vitepress
```

1. 启动开发

```bash
npx vitepress dev docs
```

1. 构建静态站点

```bash
npx vitepress build docs
```

构建产物默认位于 [`docs/.vitepress/dist`](docs/.vitepress/dist)。

---

## 方案一：GitHub Actions + GitHub Pages 部署

已提供工作流示例：[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

### 启用步骤

1. 推送代码到默认分支（如 `main`）。
2. 在仓库 Settings -> Pages 中，将 Source 设置为 **GitHub Actions**。
3. 工作流会自动构建并发布到 Pages。

### 触发条件

- 推送到 `main`
- 手动触发（workflow_dispatch）

---

## 方案二：Cloudflare Pages 部署

1. 在 Cloudflare Pages 新建项目并连接 GitHub 仓库。  
2. 构建命令填写：

```bash
npx vitepress build docs
```

1. 输出目录填写：

```text
docs/.vitepress/dist
```

1. Node 版本建议 `20`（在 Cloudflare 构建设置里配置）。

---

## 方案三：VPS 部署（Nginx）

### 1) 在服务器构建

```bash
npm i -D vitepress
npx vitepress build docs
```

### 2) 将构建产物发布到 Web 根目录

将 [`docs/.vitepress/dist`](docs/.vitepress/dist) 同步到例如 `/var/www/naoleiwiki`。

### 3) Nginx 配置示例

```nginx
server {
  listen 80;
  server_name your-domain.com;

  root /var/www/naoleiwiki;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

---

## 权限建议（多人维护）

- 内容变更走 PR，保护 `main` 分支。
- 使用 [`CODEOWNERS`](.github/CODEOWNERS) 做规则目录审批。
- 部署凭据放在 GitHub Secrets / Cloudflare 环境变量中，避免硬编码。
