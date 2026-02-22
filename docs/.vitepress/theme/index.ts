import DefaultTheme from "vitepress/theme";
import { h } from "vue";
import "./custom.css";

export default {
  extends: DefaultTheme,
  Layout: () => {
    const banner = () =>
      h("div", { class: "global-top-banner-row" }, [
        h("div", { class: "global-top-banner" }, [
          "若未查找到对应内容请前往",
          h(
            "a",
            {
              href: "https://discord.com/channels/1134557553011998840/1337107956499615744",
              target: "_blank",
              rel: "noreferrer",
            },
            "答疑区",
          ),
          "。",
        ]),
      ]);

    return h(DefaultTheme.Layout, null, {
      "layout-top": banner,
    });
  },
};
