import { defineConfig } from "vitepress";

export default defineConfig({
  base: "/naoleiwiki/",
  title: "类脑社区知识库",
  description: "类脑ΟΔΥΣΣΕΙΑ 社区知识库 - 面向创作者与技术探索者的中文知识库",
  lang: "zh-CN",
  cleanUrls: false,
  lastUpdated: true,

  head: [
    ["meta", { name: "theme-color", content: "#3b82f6" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
    ],
  ],

  themeConfig: {
    siteTitle: "类脑ΟΔΥΣΣΕΙΑ · 社区知识库",

    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索",
            buttonAriaLabel: "搜索",
          },
          modal: {
            noResultsText: "没有找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
              closeText: "关闭",
            },
          },
        },
      },
    },

    nav: [
      { text: "首页", link: "/" },
      {
        text: "社区规则",
        items: [
          { text: "规则总览", link: "/community-rules/" },
          { text: "基础规则", link: "/community-rules/basic-rules" },
          { text: "子区规则", link: "/community-rules/subarea-rules" },
        ],
      },
      { text: "常见问题", link: "/faq/" },
      { text: "新手教程", link: "/beginner-guide/" },
    ],

    sidebar: [
      {
        text: "🏠 首页",
        link: "/",
      },
      {
        text: "📋 社区规则",
        collapsed: false,
        items: [
          { text: "规则总览", link: "/community-rules/" },
          { text: "基础规则", link: "/community-rules/basic-rules" },
          { text: "子区规则", link: "/community-rules/subarea-rules" },
        ],
      },
      {
        text: "❓ 酒馆常见问题",
        collapsed: false,
        items: [{ text: "问题总览", link: "/faq/" }],
      },
      {
        text: "🍼 新手宝宝教程",
        collapsed: false,
        items: [{ text: "教程总览", link: "/beginner-guide/" }],
      },
    ],

    outline: {
      level: [2, 3],
      label: "本页目录",
    },

    lastUpdated: {
      text: "最后更新于",
    },

    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },

    returnToTopLabel: "回到顶部",
    sidebarMenuLabel: "菜单",
    darkModeSwitchLabel: "外观",
    darkModeSwitchTitle: "切换主题",

    footer: {
      message: "类脑ΟΔΥΣΣΕΙΑ · SillyTavern 最大中文 Discord 社区",
      copyright: "Copyright © 2026 LeiNao Community",
    },
  },
});
