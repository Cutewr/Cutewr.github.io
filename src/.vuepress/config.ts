import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "首页",
  description: "Cutewr的博客首页",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,

  head: [
    // ...

    // 导入相应链接
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    [
      "link",
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
    ],
    [
      "link",
      {
        href: "https://fonts.googleapis.com/css2?family=Zhi+Mang+Xing&display=swap",
        rel: "stylesheet",
      },
    ],

        // 导入相应链接
        ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
        [
          "link",
          { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        ],
        [
          "link",
          {
            href: "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@200..900&family=Zhi+Mang+Xing&display=swap",
            rel: "stylesheet",
          },
        ],

    [
      "link",
      {
        href: "https://chinese-fonts-cdn.deno.dev/packages/cqscbbt/dist/YunFengZiKuZhongQingShanChengBangBangTi-2/result.css",
        rel: "stylesheet",
      },
    ],

    [
      "link",
      {
        href: "https://chinese-fonts-cdn.deno.dev/packages/yozai/dist/Yozai-Medium/result.css",
        rel: "stylesheet",
      },
    ],

  ],

});
