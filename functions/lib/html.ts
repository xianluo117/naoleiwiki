/**
 * HTML 模板库
 * 登录页、错误页等 HTML 页面模板
 */

/** 通用页面布局模板 */
function layout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - 类脑社区知识库</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #e2e8f0;
    }
    .card {
      background: rgba(30, 32, 44, 0.95);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 16px;
      padding: 48px;
      max-width: 480px;
      width: 90%;
      text-align: center;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
    }
    .logo {
      font-size: 48px;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 8px;
      color: #f1f5f9;
    }
    .subtitle {
      font-size: 14px;
      color: #94a3b8;
      margin-bottom: 32px;
      line-height: 1.6;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 14px 32px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }
    .btn-discord {
      background: #5865F2;
      color: white;
    }
    .btn-discord:hover {
      background: #4752c4;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(88, 101, 242, 0.4);
    }
    .btn-secondary {
      background: rgba(99, 102, 241, 0.1);
      color: #a5b4fc;
      border: 1px solid rgba(99, 102, 241, 0.3);
      margin-top: 16px;
    }
    .btn-secondary:hover {
      background: rgba(99, 102, 241, 0.2);
    }
    .discord-icon {
      width: 24px;
      height: 24px;
    }
    .error-icon {
      font-size: 56px;
      margin-bottom: 16px;
    }
    .info-text {
      font-size: 13px;
      color: #64748b;
      margin-top: 24px;
      line-height: 1.5;
    }
    .divider {
      height: 1px;
      background: rgba(99, 102, 241, 0.2);
      margin: 24px 0;
    }
  </style>
</head>
<body>
  <div class="card">
    ${body}
  </div>
</body>
</html>`;
}

/** Discord SVG 图标 */
const DISCORD_SVG = `<svg class="discord-icon" viewBox="0 0 24 24" fill="currentColor">
  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
</svg>`;

// ─── 公开页面模板 ──────────────────────────────────────────

/**
 * 登录页面 — 引导用户通过 Discord 授权
 */
export function loginPage(loginUrl: string): string {
  return layout(
    "登录验证",
    `
    <div class="logo">🧠</div>
    <h1>类脑ΟΔΥΣΣΕΙΑ · 社区知识库</h1>
    <p class="subtitle">
      本知识库仅对社区成员开放<br>
      请使用 Discord 账号登录，验证您的社区成员身份
    </p>
    <a href="${loginUrl}" class="btn btn-discord">
      ${DISCORD_SVG}
      使用 Discord 登录
    </a>
    <p class="info-text">
      🔒 我们仅获取您的基本信息和服务器列表<br>
      不会读取您的消息或执行任何操作
    </p>
    `,
  );
}

/**
 * 非服务器成员提示页面
 */
export function notInGuildPage(discordInviteUrl?: string): string {
  const inviteButton = discordInviteUrl
    ? `<a href="${discordInviteUrl}" class="btn btn-discord" target="_blank">
        ${DISCORD_SVG}
        加入 Discord 服务器
      </a>`
    : "";

  return layout(
    "访问受限",
    `
    <div class="error-icon">🚫</div>
    <h1>您尚未加入社区服务器</h1>
    <p class="subtitle">
      本知识库仅对 类脑ΟΔΥΣΣΕΙΑ Discord 服务器的成员开放。<br>
      请先加入我们的 Discord 服务器，然后重新登录。
    </p>
    ${inviteButton}
    <div class="divider"></div>
    <a href="/api/auth/login" class="btn btn-secondary">
      🔄 已加入？重新验证
    </a>
    <p class="info-text">
      如需帮助，请联系社区管理员
    </p>
    `,
  );
}

/**
 * 通用错误页面
 */
export function errorPage(
  title: string,
  message: string,
  showRetry: boolean = true,
): string {
  const retryButton = showRetry
    ? `<a href="/api/auth/login" class="btn btn-secondary">🔄 重试登录</a>`
    : "";

  return layout(
    title,
    `
    <div class="error-icon">⚠️</div>
    <h1>${title}</h1>
    <p class="subtitle">${message}</p>
    ${retryButton}
    `,
  );
}
