/**
 * ====================================================
 *  统一导航数据源
 *  修改此文件即可同时更新「顶部导航栏」和「左侧侧边栏」
 * ====================================================
 *
 *  📌 使用说明：
 *  - 新增页面：在对应 section 的 items 中添加 { text, link }
 *  - 新增分区：在 sections 数组末尾追加一个 Section 对象
 *  - 支持嵌套：items 内可以再嵌套 items，实现多级侧边栏
 *
 *  字段说明：
 *  - text        → 显示在顶部导航栏的文字
 *  - sidebarText → 显示在侧边栏的文字（可选，默认与 text 相同）
 *  - icon        → 侧边栏标题前的 emoji 图标
 *  - link        → 该分区的主链接
 *  - items       → 子页面列表（支持递归嵌套）
 *  - collapsed   → 嵌套分组是否默认折叠
 */

/** 递归侧边栏项：既可以是页面链接，也可以是嵌套分组 */
export interface SidebarItem {
  text: string;
  link?: string;
  collapsed?: boolean;
  items?: SidebarItem[];
}

export interface Section {
  /** 顶部导航栏显示文字 */
  text: string;
  /** 侧边栏显示文字（默认与 text 相同） */
  sidebarText?: string;
  /** 侧边栏标题前的 emoji */
  icon?: string;
  /** 分区主链接 */
  link: string;
  /** 子页面列表（支持嵌套分组） */
  items?: SidebarItem[];
}

// ============================================
//  👇 在这里维护所有导航数据（唯一数据源）
// ============================================

export const sections: Section[] = [
  {
    text: "首页",
    icon: "🏠",
    link: "/",
  },
  {
    text: "酒馆基础",
    sidebarText: "酒馆基础问题",
    icon: "🍺",
    link: "/st-basics/",
    items: [
      { text: "基础总览", link: "/st-basics/" },
      { text: "什么是酒馆", link: "/st-basics/what-is-st" },
      {
        text: "部署安装",
        collapsed: false,
        items: [
          { text: "Windows 部署", link: "/st-basics/install/windows" },
          { text: "Linux / MacOS 部署", link: "/st-basics/install/linux" },
          { text: "Android 部署", link: "/st-basics/install/android" },
        ],
      },
      { text: "更新与备份迁移", link: "/st-basics/update-backup" },
      {
        text: "进阶知识",
        collapsed: false,
        items: [
          { text: "斜杠命令", link: "/st-basics/slash-commands" },
          { text: "文件结构", link: "/st-basics/file-structure" },
          { text: "正则功能", link: "/st-basics/regex" },
        ],
      },
    ],
  },
  {
    text: "常见问题",
    sidebarText: "常见问题",
    icon: "❓",
    link: "/faq/",
    items: [
      { text: "问题总览", link: "/faq/" },
      { text: "酒馆使用问题", link: "/faq/st-usage" },
      { text: "Discord 相关问题", link: "/faq/discord" },
    ],
  },
  {
    text: "报错对照",
    sidebarText: "报错对照表",
    icon: "🚨",
    link: "/troubleshooting/",
    items: [
      { text: "报错总览", link: "/troubleshooting/" },
      {
        text: "Gemini",
        collapsed: false,
        items: [
          { text: "AI Studio API", link: "/troubleshooting/gemini-api" },
          { text: "CLI2api", link: "/troubleshooting/gemini-cli" },
          { text: "Build2api", link: "/troubleshooting/gemini-build" },
        ],
      },
      { text: "Claude Cookie反代", link: "/troubleshooting/claude" },
      { text: "DeepSeek", link: "/troubleshooting/deepseek" },
      { text: "各LLM通用", link: "/troubleshooting/general" },
    ],
  },
  {
    text: "致谢",
    icon: "🙏",
    link: "/credits/",
    items: [{ text: "致谢", link: "/credits/" }],
  },
];

// ============================================
//  自动生成顶部导航栏
// ============================================

/** 将嵌套 SidebarItem 树展平为 { text, link } 列表（用于顶部导航下拉菜单） */
function flattenItems(items: SidebarItem[]): { text: string; link: string }[] {
  const result: { text: string; link: string }[] = [];
  for (const item of items) {
    if (item.link) {
      result.push({ text: item.text, link: item.link });
    }
    if (item.items) {
      result.push(...flattenItems(item.items));
    }
  }
  return result;
}

export function generateNav() {
  return sections.map((section) => {
    if (section.items && section.items.length > 0) {
      const flat = flattenItems(section.items);
      // 有多个叶子链接 → 下拉菜单
      if (flat.length > 1) {
        return {
          text: section.text,
          items: flat,
        };
      }
    }
    // 无子项或只有一个子项 → 简单链接
    return {
      text: section.text,
      link: section.link,
    };
  });
}

// ============================================
//  自动生成左侧侧边栏
// ============================================
export function generateSidebar() {
  return sections.map((section) => {
    const displayText = section.icon
      ? `${section.icon} ${section.sidebarText || section.text}`
      : section.sidebarText || section.text;

    // 无子项 → 一级标题 + 可点击跳转（如首页）
    if (!section.items || section.items.length === 0) {
      return {
        text: displayText,
        link: section.link,
        items: [], // 空数组使其渲染为 level-0 分组标题
      };
    }

    // 有子项 → 分组展开（items 可以包含嵌套分组，VitePress 原生支持）
    return {
      text: displayText,
      collapsed: false,
      items: section.items,
    };
  });
}
