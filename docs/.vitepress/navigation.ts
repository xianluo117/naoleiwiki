/**
 * ====================================================
 *  统一导航数据源
 *  修改此文件即可同时更新「顶部导航栏」和「左侧侧边栏」
 * ====================================================
 *
 *  📌 使用说明：
 *  - 新增页面：在对应 section 的 items 中添加 { text, link }
 *  - 新增分区：在 sections 数组末尾追加一个 Section 对象
 *  - text      → 显示在顶部导航栏的文字
 *  - sidebarText → 显示在侧边栏的文字（可选，默认与 text 相同）
 *  - icon      → 侧边栏标题前的 emoji 图标
 *  - link      → 该分区的主链接
 *  - items     → 子页面列表
 */

export interface Section {
  /** 顶部导航栏显示文字 */
  text: string;
  /** 侧边栏显示文字（默认与 text 相同） */
  sidebarText?: string;
  /** 侧边栏标题前的 emoji */
  icon?: string;
  /** 分区主链接 */
  link: string;
  /** 子页面列表 */
  items?: { text: string; link: string }[];
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
    text: "社区规则",
    icon: "📋",
    link: "/community-rules/",
    items: [
      { text: "规则总览", link: "/community-rules/" },
      { text: "基础规则", link: "/community-rules/basic-rules" },
      { text: "子区规则", link: "/community-rules/subarea-rules" },
    ],
  },
  {
    text: "酒馆基础",
    sidebarText: "酒馆基础问题",
    icon: "🍺",
    link: "/st-basics/",
    items: [
      { text: "基础总览", link: "/st-basics/" },
      { text: "什么是酒馆", link: "/st-basics/what-is-st" },
      { text: "Windows 部署", link: "/st-basics/install-windows" },
      { text: "Linux / MacOS 部署", link: "/st-basics/install-linux" },
      { text: "Android 部署", link: "/st-basics/install-android" },
      { text: "更新与备份迁移", link: "/st-basics/update-backup" },
    ],
  },
  {
    text: "常见问题",
    sidebarText: "酒馆常见问题",
    icon: "❓",
    link: "/faq/",
    items: [{ text: "问题总览", link: "/faq/" }],
  },
  {
    text: "新手教程",
    sidebarText: "新手宝宝教程",
    icon: "🍼",
    link: "/beginner-guide/",
    items: [{ text: "教程总览", link: "/beginner-guide/" }],
  },
];

// ============================================
//  自动生成顶部导航栏
// ============================================
export function generateNav() {
  return sections.map((section) => {
    // 有多个子项 → 下拉菜单
    if (section.items && section.items.length > 1) {
      return {
        text: section.text,
        items: section.items,
      };
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

    // 有子项 → 分组展开
    return {
      text: displayText,
      collapsed: false,
      items: section.items,
    };
  });
}
