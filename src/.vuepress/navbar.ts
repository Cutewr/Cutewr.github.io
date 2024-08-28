import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  "/demo/",
  {
    text: "Java",
    icon: "book",
    prefix: "posts/Java/",
    children: [
      { text: "Java基础", icon: "pen-to-square", link: "JavaBasic" },
      { text: "Java集合", icon: "pen-to-square", link: "JavaCollection" },
      { text: "Java并发编程", icon: "pen-to-square", link: "JUC" },
      { text: "Java虚拟机", icon: "pen-to-square", link: "JVM" },
    ],
  },
  {
    text: "刷题笔记",
    icon: "book",
    children: [
      {
        text: "矩阵【二维数组】",
        icon: "pen-to-square",
        link: "1"
      },
      {
        text: "香蕉 2",
        icon: "pen-to-square",
        link: "2",
      },
    ],
  },
  {
    text: "MySQL",
    icon: "book",
    children: [
      {
        text: "矩阵【二维数组】",
        icon: "pen-to-square",
        link: "1"
      },
      {
        text: "香蕉 2",
        icon: "pen-to-square",
        link: "2",
      },
    ],
  },
  {
    text: "非关系型数据库",
    icon: "book",
    children: [
      {
        text: "矩阵【二维数组】",
        icon: "pen-to-square",
        link: "1"
      },
      {
        text: "香蕉 2",
        icon: "pen-to-square",
        link: "2",
      },
    ],
  },
  {
    text: "计算机基础",
    icon: "book",
    children: [
      {
        text: "计算机网络",
        icon: "pen-to-square",
        prefix: "apple/",
        children: [
          { text: "苹果1", icon: "pen-to-square", link: "1" },
          { text: "苹果2", icon: "pen-to-square", link: "2" },
        ],
      },
      {
        text: "操作系统",
        icon: "pen-to-square",
        prefix: "Java/",
        children: [
          { text: "进程管理", icon: "pen-to-square", link: "1" },
          { text: "苹果2", icon: "pen-to-square", link: "2" },
        ],
      }
    ]
  },
  {
    text: "其他博文",
    icon: "pen-to-square",
    prefix: "/posts/",
    children: [
      {
        text: "刷题笔记",
        icon: "pen-to-square",
        prefix: "apple/",
        children: [
          { text: "苹果1", icon: "pen-to-square", link: "1" },
          { text: "苹果2", icon: "pen-to-square", link: "2" },
        ],
      },
      {
        text: "Java知识",
        icon: "pen-to-square",
        prefix: "java/",
        children: [
          {
            text: "香蕉 1",
            icon: "pen-to-square",
            link: "1",
          },
          {
            text: "香蕉 2",
            icon: "pen-to-square",
            link: "2",
          },
        ],
      },
      { text: "樱桃", icon: "pen-to-square", link: "cherry" },
      { text: "火龙果", icon: "pen-to-square", link: "dragonfruit" },
      "tomato",
      "strawberry",
    ],
  },
  {
    text: "V2 文档",
    icon: "book",
    link: "https://theme-hope.vuejs.press/zh/",
  },
]);
