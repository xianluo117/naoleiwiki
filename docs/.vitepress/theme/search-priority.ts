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
  return cleaned.replace(/\/index\.html$/, "").replace(/\/$/, "");
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
      const items = Array.from(
        list.querySelectorAll<HTMLLIElement>("li"),
      ).filter((item) => item.querySelector("a[href]"));

      if (items.length === 0) {
        continue;
      }

      const currentItem = items.find((item) => {
        const link = item.querySelector<HTMLAnchorElement>("a[href]");
        if (!link) {
          return false;
        }
        return getLinkPath(link) === currentPath;
      });

      if (!currentItem || list.firstElementChild === currentItem) {
        continue;
      }

      list.insertBefore(currentItem, list.firstElementChild);
    }
  }
};

export default defineComponent({
  name: "SearchPriority",
  setup() {
    const route = useRoute();
    let observer: MutationObserver | null = null;

    const installObserver = () => {
      if (observer) {
        observer.disconnect();
      }

      observer = new MutationObserver(() => {
        prioritizeCurrentPage();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      prioritizeCurrentPage();
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
        prioritizeCurrentPage();
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
