import { defineConfig } from "vitepress";

export default defineConfig({
  base: "/naoleiwiki/",
  title: "类脑社区知识库",
  description: "类脑ΟΔΥΣΣΕΙΑ - 汇聚技术探索者与自由创作者的绅士绿洲",
  lang: "zh-CN",
  cleanUrls: false,
  lastUpdated: true,

  // 强制启用深色模式以适配 Cyberpunk 主题
  appearance: "dark",

  head: [
    [
      "link",
      {
        rel: "icon",
        href: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧠</text></svg>",
      },
    ],
    ["meta", { name: "theme-color", content: "#7c3aed" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      {
        name: "apple-mobile-web-app-status-bar-style",
        content: "black-translucent",
      },
    ],
  ],

  themeConfig: {
    logo: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧠</text></svg>",
    siteTitle: "类脑ΟΔΥΣΣΕΙΑ",

    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
            },
          },
        },
      },
    },

    nav: [
      { text: "🏠 首页", link: "/" },
      { text: "📜 社区规则", link: "/community-rules/" },
      { text: "📚 基础规则", link: "/community-rules/basic-rules" },
    ],

    sidebar: {
      "/community-rules/": [
        {
          text: "⚖️ 社区规则",
          items: [
            { text: "规则总览", link: "/community-rules/" },
            { text: "基础规则", link: "/community-rules/basic-rules" },
            { text: "子区规则", link: "/community-rules/subarea-rules" },
          ],
        },
      ],
    },

    socialLinks: [
      // 预留 Github 链接位置，如果有的话
      // { icon: 'github', link: 'https://github.com/...' }
    ],

    footer: {
      message: "探索 · 创造 · 分享 | Released under MIT License",
      copyright: "Copyright © 2026 类脑ΟΔΥΣΣΕΙΑ",
    },

    docFooter: {
      prev: "上一页",
      next: "下一页",
    },

    outline: {
      label: "页面导航",
      level: [2, 3],
    },

    lastUpdatedText: "最后更新于",
    returnToTopLabel: "回到顶部",
    sidebarMenuLabel: "菜单",
    darkModeSwitchLabel: "主题",
  },
});
