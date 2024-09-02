import { sidebar } from "vuepress-theme-hope";

export default sidebar({

  // 配置 "posts/java" 路径下的侧边栏
  "/408/": [
    {
      text: "计算机基础",
      icon: "book",
      children: [
        {
          expanded: true,
          collapsible: true,
          text: "计算机网络",
          prefix: "ComputerNetwork/",
          children: [
            { text: "计算机网络分层模型",  link: "Part" },
            { text: "计算机网络各层协议",  link: "protocol" },
          ],
        },
        {
          expanded: true,
          collapsible: true,
          text: "操作系统",
          prefix: "OS/",
          children: [
            { text: "进程管理", link: "process" },
            { text: "内存管理", link: "memory" },
            { text: "文件管理", link: "file" },
          ],
        }
      ]
    }
  ],


  // 配置 "posts/java" 路径下的侧边栏
  "/SpringBoot/": [
    {
      expanded: true,
      collapsible: true,
      text: "SpringBoot系列",
      children: "structure", // 自动生成子项结构
    }
  ],

    // 配置 "posts/java" 路径下的侧边栏
    "/云原生/": [
      {
        expanded: true,
        collapsible: true,
        text: "云原生",
        children: "structure", // 自动生成子项结构
      }
    ],
    
    // 配置 "posts/java" 路径下的侧边栏
    "/其他博客/": [
      {
        expanded: true,
        collapsible: true,
        text: "其他博客",
        children: "structure", // 自动生成子项结构
      }
    ],

  // 配置 "posts/java" 路径下的侧边栏
  "/posts/Java/": [
    {
      expanded: true,
      collapsible: true,
      text: "Java",
      children: "structure", // 自动生成子项结构
    }
  ],

    // 配置 "posts/interview" 路径下的侧边栏
    "/posts/interview/": [
      {
        expanded: true,
        collapsible: true,
        text: "面试复盘",
        children: "structure", // 自动生成子项结构
      }
    ],

    // 配置 "posts/interview" 路径下的侧边栏
    "/posts/LCNotes/": [
      {
        expanded: true,
        collapsible: true,
        text: "刷题笔记",
        icon: "book",
        children: [
          "1array.md",
          "matrix.md",
          "3hash.md",
          "4linkedlist.md",
          "5stack.md",
          "6double.md",
          "7tree.md",
          "8graph.md",
        ]
      },
      {
        expanded: true,
        collapsible: true,
        prefix: "Sort/",
        text: "排序算法",
        icon: "book",
        children: "structure", // 自动生成子项结构
      },
      {
        expanded: true,
        collapsible: true,
        prefix: "Algorithm/",
        text: "算法应用",
        icon: "book",
        children: "structure", // 自动生成子项结构
      },
    ],

    // 配置 "posts/interview" 路径下的侧边栏
    "/DataBase/": [
      {
        expanded: true,
        collapsible: true,
        text: "数据库",
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
