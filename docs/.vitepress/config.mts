import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitepress";
import { generateNav, generateSidebar } from "./navigation";

// Cloudflare Pages 部署时使用根路径，GitHub Pages 使用 /naoleiwiki/
const base = process.env.CF_PAGES ? "/" : "/naoleiwiki/";

/**
 * 兼顾中文与英文的简易分词：
 * - 中文：按邻接双字切分（降低单字误匹配）
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

  // 中文按双字切分（避免单字命中导致误匹配）
  const cjkChars = normalized.match(/[\u4e00-\u9fff]/g) ?? [];
  for (let i = 0; i < cjkChars.length; i++) {
    if (i < cjkChars.length - 1) {
      tokens.add(`${cjkChars[i]}${cjkChars[i + 1]}`);
    }
  }

  return [...tokens];
}

const miniSearchOptions = {
  tokenize: zhTokenizer,
} as unknown as { tokenize: typeof zhTokenizer };

export default defineConfig({
  base,
  title: "脑类自研 · 常见答疑知识库",
  description: "脑类自研 · 常见答疑知识库 - 面向创作者与技术探索者的中文知识库",
  lang: "zh-CN",
  cleanUrls: false,
  lastUpdated: true,

  head: [
    ["link", { rel: "icon", href: `${base}ico.jpg`, type: "image/jpeg" }],
    ["meta", { name: "theme-color", content: "#3b82f6" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
    ],
  ],

  vite: {
    plugins: [
      {
        name: "export-local-search-index",
        apply: "build",
        closeBundle() {
          try {
            const configDir = path.dirname(fileURLToPath(import.meta.url));
            const distDir = path.resolve(configDir, "dist");
            const chunksDir = path.join(distDir, "assets", "chunks");

            if (!fs.existsSync(chunksDir)) {
              return;
            }

            const indexFile = fs
              .readdirSync(chunksDir)
              .find(
                (file) =>
                  file.startsWith("@localSearchIndexroot") &&
                  file.endsWith(".js"),
              );

            if (!indexFile) {
              return;
            }

            const indexPath = path.join(chunksDir, indexFile);
            const content = fs.readFileSync(indexPath, "utf-8");
            const match = content.match(/const i='([\s\S]*?)';export/);
            if (!match) {
              return;
            }

            const outputPath = path.join(distDir, "local-search-index.json");
            fs.writeFileSync(outputPath, match[1]);
          } catch (error) {
            console.warn("[search-index] export failed:", error);
          }
        },
      },
    ],
  },
  themeConfig: {
    siteTitle: "脑类自研 · 常见答疑知识库",

    search: {
      provider: "local",
      options: {
        miniSearch: {
          options: miniSearchOptions,
          searchOptions: {
            prefix: true,
            fuzzy: 0,
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
      message: "脑类自研 · SillyTavern 中文 Discord 社区",
      copyright: "Copyright © 2026 LeiNao Community",
    },
  },
});
