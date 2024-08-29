---
date: 2024-08-29
category:
  - 刷题笔记
tag:
  - 图
---

# 图

图的表示方式

1. 邻接表
2. 邻接矩阵

稀疏图适合用邻接表，稠密图适合用邻接矩阵

## 岛屿数量【LC 200题】

一个矩阵中只有0和1两种值，每个位置都可以和自己的上、下、左、右 四个位置相连，如果有一片1连在一起，这个部分叫做一个岛，求一个矩阵中有多少个岛？
【举例】
001010
111010
100100
000000
这个矩阵中有三个岛

<aside>
💡 遍历这个数组，如果遇到1的位置，就把res++。然后调用infect函数，把周围相邻的1都设置成0。

</aside>

```java
public class NumIslands {
    public int numIslands(char[][] grid) {
        if (grid==null) return 0;
        int res=0;
        int N=grid.length;
        int M=grid[0].length;
        for (int i=0;i<N;i++){
            for (int j=0;j<M;j++){
                if (grid[i][j]=='1'){
                    res++;
                    infect(grid,i,j,N,M);
                }
            }
        }
        return res;
    }

    private void infect(char[][] grid, int i, int j, int N, int M) {
      //我只关心这个1能在我和我的周围传递下去，如果不能就直接返回
      // 注意这个判断条件 不等于1 也传递不下去了 不要忘了
        if (i<0 || i>=N || j<0 || j>=M || grid[i][j]!='1') return;
        grid[i][j]='0';
        infect(grid,i+1,j,N,M);
        infect(grid,i,j+1,N,M);
        infect(grid,i-1,j,N,M);
        infect(grid,i,j-1,N,M);
    }
}
```

【进阶】
如何设计一个并行算法解决这个问题。

每个核心分到一部分区域，分别计算这个区域内的岛屿数量。【这样计算出来的岛屿数量可能会比实际岛屿数量多，因为分割区域可能会把一个完整的岛屿分成多个不同的岛屿】

所以重点需要处理 **不同区域的岛屿合并问题**

<aside>
💡 使用并查集

每个cpu核心在记录岛屿并更新数据的时候，还需记录边界上的点属于自己记录的哪个岛屿。再进行岛屿合并的时候，如果边界上的岛屿遇到了，就通过**并查集**将这两个岛屿信息合并，总岛屿数量–1【已经属于一个集合就不用合并，不属于的话把数量少的那个集合接在数量多的集合根节点上】。

</aside>

## 腐烂的橘子【LC 994题】

在给定的 `m x n` 网格 `grid` 中，每个单元格可以有以下三个值之一：

- 值 `0` 代表空单元格；
- 值 `1` 代表新鲜橘子；
- 值 `2` 代表腐烂的橘子。

每分钟，腐烂的橘子 **周围 4 个方向上相邻** 的新鲜橘子都会腐烂。

返回 *直到单元格中没有新鲜橘子为止所必须经过的最小分钟数。如果不可能，返回 `-1`* 。

<aside>
💡 使用count记录新鲜橘子的数量，使用int[]队列记录腐烂橘子的坐标。

解题过程：

1. 遍历数组，记录count和int[]队列
2. 遍历这俩参数，当count=0或者队列为空就退出循环
3. 每一轮利用队列中弹出的腐烂橘子去感染周围的新鲜橘子，并把新感染的新鲜橘子加入队列，下一轮用新感染的橘子去感染别的橘子
</aside>

```java
class Solution {
    public int orangesRotting(int[][] grid) {
        int M=grid.length; int N=grid[0].length;
        int count=0;    //记录新鲜橘子的数量
        Queue<int []> queue=new LinkedList<>();  //int []队列记录腐烂的橘子坐标
        for(int i=0;i<M;i++){
            for(int j=0;j<N;j++){
                if(grid[i][j]==1)   count++;
                else if(grid[i][j]==2) queue.add(new int[]{i,j});
            }
        }
        int round=0;    //记录腐烂的轮数
        while(count>0 && !queue.isEmpty()){
            round++;
            //记录每一轮橘子腐烂的数量
            int s=queue.size();
            for(int a=0;a<s;a++){
                int []size=queue.poll();
                int i=size[0],j=size[1];
                if(i-1>=0&&grid[i-1][j]==1){
                    grid[i-1][j]=2;
                    count--;
                    queue.add(new int[]{i-1,j});
                }
                if(i+1<M&&grid[i+1][j]==1){
                    grid[i+1][j]=2;
                    count--;
                    queue.add(new int[]{i+1,j});
                }
                if(j-1>=0&&grid[i][j-1]==1){
                    grid[i][j-1]=2;
                    count--;
                    queue.add(new int[]{i,j-1});
                }
                if(j+1<N&&grid[i][j+1]==1){
                    grid[i][j+1]=2;
                    count--;
                    queue.add(new int[]{i,j+1});
                }
            }
        }
        if(count>0) return -1;
        else return round;
    }
}
```

## 课程表【LC 207题】

你这个学期必须选修 `numCourses` 门课程，记为 `0` 到 `numCourses - 1` 。

在选修某些课程之前需要一些先修课程。 先修课程按数组 `prerequisites` 给出，其中 `prerequisites[i] = [ai, bi]` ，表示如果要学习课程 `ai` 则 **必须** 先学习课程  `bi` 。

- 例如，先修课程对 `[0, 1]` 表示：想要学习课程 `0` ，你需要先完成课程 `1` 。

请你判断是否可能完成所有课程的学习？如果可以，返回 `true` ；否则，返回 `false` 。

💡 拓扑排序。

解题过程：

1. 根据课程数组构建出图结构：记录节点的总入度count，最后遍历完，总入度为0则存在拓扑排序；记录每个节点的入度int []deg；记录有向边`List<List<Integer>>`，队列保存目前入度为0的节点
2. 遍历队列和有向边，删除图中的边和入度，如果遇到入度为0的点，就加入队列中。

```java
class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        int total=0;    //节点的总入度
        int []deg=new int[numCourses];  //记录每个节点的入度
        ArrayList<ArrayList<Integer>> path=new ArrayList<>();

        //初始化path
        for(int i=0;i<numCourses;i++){
            path.add(new ArrayList<>());
        }

        //根据数组加入有向边
        for(int []temp:prerequisites){
            deg[temp[0]]++;
            path.get(temp[1]).add(temp[0]);
            total++;
        }

        LinkedList<Integer> queue=new LinkedList<>();
        for(int i=0;i<numCourses;i++){
            if (deg[i]==0) {
                queue.add(i);   //先加入入度为0的点
            }
        }

        while (!queue.isEmpty()) {
            for(int a:path.get(queue.poll())){
                deg[a]--;
                total--;
                if (deg[a]==0) {
                    queue.add(a);
                }
            }
        }
        return total==0;
    }
}
```

## 前缀树【LC 208题】

可以方便的查询字符串是否以某个前缀开头。

请你实现 Trie 类：

- `Trie()` 初始化前缀树对象。
- `void insert(String word)` 向前缀树中插入字符串 `word` 。
- `boolean search(String word)` 如果字符串 `word` 在前缀树中，返回 `true`（即，在检索之前已经插入）；否则，返回 `false` 。
- `boolean startsWith(String prefix)` 如果之前已经插入的字符串 `word` 的前缀之一为 `prefix` ，返回 `true` ；否则，返回 `false`

```java
class Trie {
    private TrieNode root; 
    public Trie() {
        root=new TrieNode();
    }
    
    public void insert(String word) {
        if(word==null) return;
        char[] chs=word.toCharArray();
        TrieNode node=root;
        node.pass++;
        int index=0;
        for(int i=0;i<chs.length;i++){
            index=chs[i]-'a';
            if(node.nexts[index]==null){
                node.nexts[index]=new TrieNode();
            }
            node.nexts[index].pass++;
            node=node.nexts[index];
        }
        node.end++;
    }
    
    public boolean search(String word) {
        char[] chars = word.toCharArray();
        TrieNode node=root;
        for(int i=0;i<chars.length-1;i++){
            int index=chars[i]-'a';
            if(node.nexts[index]==null){
                return false;
            }
            node=node.nexts[index];
        }
        if(node.nexts[chars[chars.length-1]-'a']==null||node.nexts[chars[chars.length-1]-'a'].end==0) return false;
        return true;
    }
    
    public boolean startsWith(String prefix) {
        char[] chars = prefix.toCharArray();
        TrieNode node=root;
        for(int i=0;i<chars.length;i++){
            int index=chars[i]-'a';
            if(node.nexts[index]==null){
                return false;
            }
            node=node.nexts[index];
        }
        return true;
    }

    class TrieNode{
        public int pass;
        public int end;
        public TrieNode[] nexts;
        public TrieNode(){
            pass=0;
            end=0;
            nexts=new TrieNode[26];
        }
    }
}
```

## 图的遍历

#### 图的宽度优先遍历

bfs用**队列**实现

```java
public static void bfs(Node node){
    if (node==null) return;
    Queue<Node> queue=new LinkedList<>();
    HashSet<Node> nodes=new HashSet<>();
    queue.add(node);
    nodes.add(node);
    while (!queue.isEmpty()){
        Node temp=queue.poll();
        System.out.println(temp.value);
        for (Node next : temp.next) {
            if (!nodes.contains(next)){ //集合中不存在，再放到队列中
                nodes.add(next);    //避免环的出现造成循环结束不了
                queue.add(next);
            }
        }
    }
}
```

#### 图的广度优先遍历

dfs用**栈**实现

```java
public static void bfs(Node node) {
    if (node==null) return;
    HashSet<Node> set=new HashSet<>();
    Stack<Node> stack=new Stack<>();
    stack.add(node);
    set.add(node);
    while (!stack.isEmpty()){
        Node temp=stack.pop();
        for (Node next : temp.next) {
            if (!set.contains(next)){
                stack.push(next);
                set.add(next);
                System.out.println(next.value);
                break;  //找到第一个没遍历过的节点，就break 一条路先走到头
            }
        }
    }
}
```

## 拓扑排序

从入度为0的点出发，消除这个节点已经它的影响。找下一个入度为0的点，循环。如果最后有节点消除不掉，不存在拓扑排序。

```java
public static List<Node> sortedTopology(graph graphTest){
    // 根据图信息 记录所有节点的入度信息 和 本身入度为0的节点
    HashMap<Node,Integer> inMap=new HashMap<>();   //所有节点的入度信息
    Queue<Node> zeroNodes=new LinkedList<>();   //保存入度为0的节点
    for (Node node : graphTest.nodes.values()) {
        inMap.put(node, node.in);
        if (node.in==0){
            zeroNodes.add(node);
        }
    }
    List<Node> result=new ArrayList<>();
    // 对queue进行操作
    // 将入度为0的点加入结果集 并消除它的影响【将它指向节点的入度减一】
    // 有新的入度为0的点，继续加入queue
    while (!zeroNodes.isEmpty()){
        Node cur=zeroNodes.poll();
        result.add(cur);
        for (Node next : cur.next) {
            inMap.put(next,inMap.get(next)-1);
            if (inMap.get(next)==0){
                zeroNodes.add(next);
            }
        }
    }
    return result;
}
```

## 无向图的最小生成树算法

最小生成树算法：在保证所有边都是连通的情况下，边权值之和最小的情况。加入边的时候查看加入这条边会不会形成环。

<aside>
💡 判断是否会形成环，通过集合算法，判断下一条加入的边关联的点，是不是已经在集合中。已经在集合中，则不加入边；否则加入新的边，以及边关联的点。

</aside>

#### kruskal算法

#### prim算法

#### Dijkstra算法

<aside>
💡 单源最短路径算法【规定出发点，找到出发点到其他所有节点的最短路径】

</aside>

使用范围：没有权值为负数的边

因为如果权值为负数的话，往后判断最小边的时候，每过一圈，经过这条负权值边，路径权值都变得更小。

## 并查集

并查集是一种用于管理元素所属集合的数据结构，实现为一个森林，其中每棵树表示一个集合，树中的节点表示对应集合中的元素。

顾名思义，并查集支持两种操作：

- 合并（Union）：首先判断这两个元素是否属于同一集合，不属于同一集合之后，再将数量少的集合根节点指向数量多的树的集合根节点。合并两个元素所属集合【合并对应的树】
- 查询（Find）：查询某个元素所属集合（查询对应的树的根节点），**根节点是否相同**对应两个元素是否属于同一集合

优化：在查找一个节点的根节点的时候，将经过的每个节点都和根节点**直接相连**，这样可以减少查询的时间复杂度。

```java
package leetcode.HashLearning;

import java.util.HashMap;
import java.util.List;
import java.util.Stack;

public class UnionFindSet {

  //把用户给的值封装一层，表示是并查集中的节点
    public static class Element<V>{
        public V value;
        public Element(V value){
            this.value=value;
        }
    }

    public static class UnionAndFind<V>{
        public HashMap<V,Element<V>> elementMap;    //包装用户输入的元素
        public HashMap<Element<V>,Element<V>> fatherMap;    //保存当前元素和它的父元素
        public HashMap<Element<V>,Integer> mapSize;     //记录一个集合有多少元素【只有这个根节点保存】
        public UnionAndFind(List<V> list){
            elementMap=new HashMap<>();
            fatherMap=new HashMap<>();
            mapSize=new HashMap<>();
            for (V v : list) {
                Element<V> element=new Element<>(v);
                elementMap.put(v,element);
                fatherMap.put(element,element);
                mapSize.put(element,1);
            }
        }

        // 返回这个集合的根节点
        public Element<V> findHead(Element<V> element){
            Stack<Element<V>> stack=new Stack<>();
            // 向上找到根节点
            while (element!=fatherMap.get(element)){
                stack.push(element);
                element=fatherMap.get(element);
            }
            // 并查集改进：每次查询，把经过路径的节点和根节点直接相连
            while (!stack.isEmpty()){
                Element<V> element1=stack.pop();
                fatherMap.put(element1,element);
            }
            return element;
        }

        //合并两个集合
        public void union(Element<V> a,Element<V> b){
            if (elementMap.containsKey(a) && elementMap.containsKey(b)){
                Element<V> aH=findHead(a);  //a集合的根节点
                Element<V> bH=findHead(b);  //b集合的根节点
                if (aH!=bH){
                    Element<V> bigHead=mapSize.get(aH)>mapSize.get(bH) ? aH : bH;
                    Element<V> smallHead=bigHead==aH ? bH :aH;
                    fatherMap.put(smallHead,bigHead);   //把节点少的集合连接到节点多的集合的根节点
                    fatherMap.remove(smallHead);    //删除掉原来的smallHead根节点
                }
            }
        }

        //查询两个元素是否是同一个集合
        public boolean isSameSet(Element<V> a,Element<V> b){
            if (elementMap.containsKey(a) && elementMap.containsKey(b)){
                return findHead(a)==findHead(b);
            }
            return false;
        }
    }
}
```