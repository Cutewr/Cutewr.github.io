import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  "/demo/",
  "/SpringBoot/",
  {
    text: "Java",
    prefix: "posts/Java/",
    children: [
      { text: "Java基础", link: "JavaBasic" },
      { text: "Java集合", link: "JavaCollection" },
      { text: "Java并发编程", link: "JUC" },
      { text: "Java虚拟机", link: "JVM" },
    ],
  },
  {
    text: "刷题笔记",
    prefix: "posts/LCNotes/",
    children: [
      {
        text: "数组",
        link: "1array",
      },
      {
        text: "矩阵【二维数组】",
        link: "matrix"
      },
      {
        text: "哈希表",
        link: "3hash"
      },
      {
        text: "链表",
        link: "4linkedlist",
      },
      {
        text: "栈和队列",
        link: "5stack"
      },
      {
        text: "双指针",
        link: "6double",
      },
      {
        text: "树",
        link: "7tree"
      },
      {
        text: "图",
        link: "8graph",
      },
      {
        text: "多路归并",
        link: "K-wayMerge",
      },
    ],
  },
  {
    text: "MySQL",
    prefix: "posts/MySQL/",
    children: [
      {
        text: "MySQL基础",
        link: "1basic"
      },
      {
        text: "MySQL索引",
        link: "2index",
      },
      {
        text: "MySQL日志",
        link: "3log"
      },
      {
        text: "MySQL事务",
        link: "4transaction",
      },
    ],
  },
  {
    text: "非关系型数据库",
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
    children: [
      {
        text: "计算机网络",
        prefix: "apple/",
        children: [
          { text: "苹果1",  link: "1" },
          { text: "苹果2",  link: "2" },
        ],
      },
      {
        text: "操作系统",
        prefix: "Java/",
        children: [
          { text: "进程管理", link: "1" },
          { text: "苹果2", link: "2" },
        ],
      }
    ]
  },
  {
    text: "面试复盘",
    prefix: "posts/interview/",
    children: [
      {
        text: "八股问答",
        link: "knows"
      },
      {
        text: "项目问答",
        link: "project",
      },
      {
        text: "算法题",
        link: "algorithm",
      },
    ],
  },
  {
    text: "其他博文",
    prefix: "/other/",
    children: [
      {
        text: "Github+picGo搭建图床",
        link: "Github+picGo搭建图床",
      },

    ],
  },
  // {
  //   text: "V2 文档",
  //   icon: "book",
  //   link: "https://theme-hope.vuejs.press/zh/",
  // },
]);
