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
});
