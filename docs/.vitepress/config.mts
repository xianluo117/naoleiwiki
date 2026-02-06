import { defineConfig } from "vitepress";

export default defineConfig({
  title: "类脑社区知识库",
  description: "类脑ΟΔΥΣΣΕΙΑ 社区知识库",
  lang: "zh-CN",
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    search: {
      provider: "local",
    },
    nav: [
      { text: "首页", link: "/" },
      { text: "社区规则", link: "/community-rules/" },
    ],
    sidebar: {
      "/community-rules/": [
        {
          text: "社区规则",
          items: [
            { text: "规则总览", link: "/community-rules/" },
            { text: "基础规则", link: "/community-rules/basic-rules" },
            { text: "子区规则", link: "/community-rules/subarea-rules" },
          ],
        },
      ],
    },
    footer: {
      message: "Community Knowledge Base by LeiNao",
      copyright: "Copyright © 2026",
    },
  },
});
