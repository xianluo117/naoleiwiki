import { defineConfig } from "vitepress";
import { generateNav, generateSidebar } from "./navigation";

// Cloudflare Pages 部署时使用根路径，GitHub Pages 使用 /naoleiwiki/
const base = process.env.CF_PAGES ? "/" : "/naoleiwiki/";

/**
 * 兼顾中文与英文的简易分词：
 * - 中文：按单字 + 邻接双字切分（提升“删除”这类词的命中率）
 * - 英文/数字：按连续词切分
 */
function zhTokenizer(text: string | null | undefined): string[] {
  if (typeof text !== "string" || text.length === 0) {
    return [];
  }

  const normalized = text.toLowerCase();
  const tokens = new Set<string>();

  // 英文、数字、下划线按词切分
  const latinWords = normalized.match(/[a-z0-9_]+/g) ?? [];
  for (const word of latinWords) {
    tokens.add(word);
  }

  // 中文按字切分，并补充双字 token
  const cjkChars = normalized.match(/[\u4e00-\u9fff]/g) ?? [];
  for (let i = 0; i < cjkChars.length; i++) {
    tokens.add(cjkChars[i]);
    if (i < cjkChars.length - 1) {
      tokens.add(`${cjkChars[i]}${cjkChars[i + 1]}`);
    }
  }

  return [...tokens];
}

export default defineConfig({
  base,
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
        miniSearch: {
          options: {
            tokenize: zhTokenizer,
          },
          searchOptions: {
            prefix: true,
            fuzzy: 0.1,
          },
        },
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

    // ⭐ 从 navigation.ts 统一生成，只需维护一处数据源
    nav: generateNav(),
    sidebar: generateSidebar(),

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
      message: "类脑ΟΔΥΣΣΕΙΑ · SillyTavern 中文 Discord 社区",
      copyright: "Copyright © 2026 LeiNao Community",
    },
  },
});
