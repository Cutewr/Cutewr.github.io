import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  // "/demo/",
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
      {
        text: "排序算法",
        prefix: "Sort/",
        children: [
          {text: "快速排序的基准选取及优化",link: "快速排序的基准选取及优化"},
          {text: "排序算法总结",link: "排序算法总结",},
          {text: "MySQL日志",link: "3log"},
          {text: "MySQL事务",link: "4transaction",},
        ],
      },
    ],
  },
  {
    text: "数据库",
    prefix: "DataBase/",
    children: [
      {
        text: "MySQL",
        prefix: "MySQL/",
        children: [
          {text: "MySQL基础",link: "1basic"},
          {text: "MySQL索引",link: "2index",},
          {text: "MySQL日志",link: "3log"},
          {text: "MySQL事务",link: "4transaction",},
        ],
      },
      {
        text: "Redis",
        prefix: "Redis/",
        children: [
          { text: "Redis基础", link: "1" },
          { text: "Redis线程模型", link: "2" },
          { text: "Redis持久化", link: "2" },
          { text: "Redis生产问题", link: "2" },
        ],
      },
      {text: "MongoDB",link: "MongoDB"},
    ]
  },
  {
    text: "计算机基础",
    prefix: "408/",
    children: [
      {
        text: "计算机网络",
        prefix: "ComputerNetwork/",
        children: [
          { text: "计算机网络分层模型",  link: "Part" },
          { text: "计算机网络各层协议",  link: "protocol" },
        ],
      },
      {
        text: "操作系统",
        prefix: "OS/",
        children: [
          { text: "进程管理", link: "process" },
          { text: "内存管理", link: "memory" },
          { text: "文件管理", link: "file" },
        ],
      }
    ]
  },
  "/云原生/",
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
  "/其他博客/"
  // {
  //   text: "V2 文档",
  //   icon: "book",
  //   link: "https://theme-hope.vuejs.press/zh/",
  // },
]);
