import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  // 配置 "posts/java" 路径下的侧边栏
  "/posts/Java/": [
    {
      text: "Java",
      icon: "book",
      children: "structure", // 自动生成子项结构
    }
  ],

    // 配置 "posts/interview" 路径下的侧边栏
    "/posts/interview/": [
      {
        text: "面试复盘",
        icon: "book",
        children: "structure", // 自动生成子项结构
      }
    ],

    // 配置 "posts/interview" 路径下的侧边栏
    "/posts/LCNotes/": [
      {
        text: "刷题笔记",
        icon: "book",
        children: "structure", // 自动生成子项结构
      }
    ],

    // 配置 "posts/interview" 路径下的侧边栏
    "/posts/MySQL/": [
      {
        text: "MySQL",
        icon: "book",
        children: "structure", // 自动生成子项结构
      }
    ],

  // 配置根路径 "/" 的侧边栏
  "/": [
    {
      text: "如何使用",
      icon: "laptop-code",
      prefix: "demo/",
      link: "demo/",
      children: "structure",
    },
    {
      text: "文章",
      icon: "book",
      prefix: "posts/",
      children: "structure",
    },
    "intro",
    {
      text: "幻灯片",
      icon: "person-chalkboard",
      link: "https://plugin-md-enhance.vuejs.press/zh/guide/content/revealjs/demo.html",
    },
  ],
});
