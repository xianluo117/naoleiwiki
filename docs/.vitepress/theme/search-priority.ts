import { useRoute } from "vitepress";
import {
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  watch,
} from "vue";

const safeDecode = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const normalizePath = (value: string) => {
  const cleaned = safeDecode(value).split("#")[0].split("?")[0];
  return cleaned
    .replace(/\/index\.html$/, "")
    .replace(/\.html$/, "")
    .replace(/\/$/, "");
};

const getCurrentPath = () => normalizePath(window.location.pathname);

const getLinkPath = (link: HTMLAnchorElement) => {
  const href = link.getAttribute("href") || link.href || "";
  try {
    const url = new URL(href, window.location.origin);
    return normalizePath(url.pathname);
  } catch {
    return normalizePath(href);
  }
};

const worksPathMatcher = /\/works(?:\/|$)/;
const isWorksPath = (path: string) => worksPathMatcher.test(path);
const recentFaqMatcher = /\/faq\/recent(?:\/|$)/;
const isRecentFaqPath = (path: string) => recentFaqMatcher.test(path);

const filterWorksResults = (list: HTMLUListElement, currentPath: string) => {
  if (isWorksPath(currentPath)) {
    return;
  }

  const items = Array.from(list.querySelectorAll<HTMLLIElement>("li"));
  for (const item of items) {
    const link = item.querySelector<HTMLAnchorElement>("a[href]");
    if (!link) {
      continue;
    }
    if (isWorksPath(getLinkPath(link))) {
      item.remove();
    }
  }
};

const detailedDefaultAttribute = "data-detailed-default";

const updateToggleButtonLabel = (toggleButton: HTMLButtonElement) => {
  const label = toggleButton.classList.contains("detailed-list")
    ? "显示精简列表"
    : "显示详细列表";
  toggleButton.setAttribute("title", label);
  toggleButton.setAttribute("aria-label", label);
};

const ensureDetailedList = (container: HTMLElement) => {
  const toggleButton = container.querySelector<HTMLButtonElement>(
    ".toggle-layout-button",
  );
  if (!toggleButton) {
    return;
  }

  if (
    !toggleButton.classList.contains("detailed-list") &&
    container.getAttribute(detailedDefaultAttribute) !== "true"
  ) {
    toggleButton.click();
    container.setAttribute(detailedDefaultAttribute, "true");
  }

  updateToggleButtonLabel(toggleButton);
};

const prioritizeListItems = (list: HTMLUListElement, currentPath: string) => {
  const items = Array.from(list.querySelectorAll<HTMLLIElement>("li")).filter(
    (item) => item.querySelector("a[href]"),
  );

  if (items.length === 0) {
    return;
  }

  const currentItems: HTMLLIElement[] = [];
  const recentItems: HTMLLIElement[] = [];
  const otherItems: HTMLLIElement[] = [];

  for (const item of items) {
    const link = item.querySelector<HTMLAnchorElement>("a[href]");
    if (!link) {
      continue;
    }

    const path = getLinkPath(link);
    if (isRecentFaqPath(path)) {
      recentItems.push(item);
      continue;
    }

    if (path === currentPath) {
      currentItems.push(item);
      continue;
    }

    otherItems.push(item);
  }

  for (const item of [...recentItems, ...currentItems, ...otherItems]) {
    list.appendChild(item);
  }
};

const prioritizeCurrentPage = () => {
  const containers = Array.from(
    document.querySelectorAll<HTMLElement>(".VPLocalSearchBox, .VPDocSearch"),
  );
  if (containers.length === 0) {
    return;
  }

  const currentPath = getCurrentPath();

  for (const container of containers) {
    ensureDetailedList(container);
    const lists = Array.from(
      container.querySelectorAll<HTMLUListElement>("ul"),
    );

    for (const list of lists) {
      filterWorksResults(list, currentPath);
      prioritizeListItems(list, currentPath);
    }
  }
};

export default defineComponent({
  name: "SearchPriority",
  setup() {
    const route = useRoute();
    let observer: MutationObserver | null = null;
    let isApplyingPriority = false;
    let scheduled = false;

    const runPriorityUpdate = () => {
      if (isApplyingPriority) {
        return;
      }

      isApplyingPriority = true;
      try {
        prioritizeCurrentPage();
      } finally {
        isApplyingPriority = false;
      }
    };

    const schedulePriorityUpdate = () => {
      if (scheduled) {
        return;
      }

      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        runPriorityUpdate();
      });
    };

    const installObserver = () => {
      if (observer) {
        observer.disconnect();
      }

      observer = new MutationObserver(() => {
        if (isApplyingPriority) {
          return;
        }
        schedulePriorityUpdate();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      runPriorityUpdate();
    };

    onMounted(() => {
      if (typeof window === "undefined") {
        return;
      }
      installObserver();
    });

    watch(
      () => route.path,
      async () => {
        await nextTick();
        schedulePriorityUpdate();
      },
    );

    onBeforeUnmount(() => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    });

    return () => null;
  },
});
