---
date: 2024-08-29
category:
  - 刷题笔记
tag:
  - 树
---

# 树

## 二叉树的递归遍历【LC 144 145 94题】

递归序

按照如下函数，遍历完每个节点都会经过三次。

以下图为例：首先经过**recursion(2)**->**recursion(1)**->recursion(1.left)【null 返回】->**recursion(1)**

- >recursion(1.right)【null 返回】->**recursion(1)**>**recursion(2)**【返回】
- >**recursion(3)**>recursion(3.left)【null 返回】->**recursion(3)**
- >recursion(3.right)【null 返回】->**recursion(3)**>**recursion(2)**【最终返回，方法执行完】

```java
public void recursion(TreeNode head){
    if (head==null) return;
    // 1
    recursion(head.left);
    // 2
    recursion(head.right);
    // 3
}
```

先序、中序、后序都可以从递归序中来

1. 先序遍历【根左右】

在第一次来到节点的时候，打印

```java
public void recursion(TreeNode head){
    if (head==null) return;
    System.out.println(head.val);
    recursion(head.left);
    // 2
    recursion(head.right);
    // 3
}
```

1. 中序遍历【左根右】

在第二次来到节点的时候，打印

```java
public void recursion(TreeNode head){
    if (head==null) return;
    // 1
    recursion(head.left);
    System.out.println(head.val);
    recursion(head.right);
    // 3
}
```

1. 后序遍历【左右根】

在第三次回到节点的时候，打印

```java
public void recursion(TreeNode head){
    if (head==null) return;
    // 1
    recursion(head.left);
    // 2
    recursion(head.right);
    System.out.println(head.val);
}
```

## 二叉树的非递归遍历【LC 144 145 94题】

任何递归函数都可以改成非递归函数。【利用栈**先进后出**的特性】

1. 先序遍历【根左右】

<aside>
💡 压头节点弹出并打印，接着如果右节点存在先push右节点，如果左节点存在再push左节点。

</aside>

```java
public static void preOrder(TreeNode head){ //根左右
    Stack<TreeNode> stack=new Stack<>();
    stack.push(head);
    while (!stack.isEmpty()){
        TreeNode node=stack.pop();
        System.out.println(node.val);
        if (node.right!=null) stack.push(node.right);
        if (node.left!=null) stack.push(node.left);
    }
}
```

1. 后序遍历【左右根】

<aside>
💡 在先序的基础上，换成【根右左】，再逆序打印，得出后序遍历。

</aside>

```java
public static void postOrder(TreeNode head){    //左右根
    Stack<TreeNode> stack=new Stack<>();
    Stack<Integer> tempstack=new Stack<>();
    stack.push(head);
    while (!stack.isEmpty()){
        TreeNode node=stack.pop();
        tempstack.add(node.val);
        if (node.left!=null) stack.push(node.left);
        if (node.right!=null) stack.push(node.right);
    }
    while (!tempstack.isEmpty()){
        System.out.println(tempstack.pop());
    }
}
```

1. 中序遍历【左根右】

<aside>
💡 沿着左侧一直往下，没有左节点之后，弹出并输出，push右节点。对右节点进行同样的操作。

</aside>

```java
public static void inOrder(TreeNode head){    //左根右
    Stack<TreeNode> stack=new Stack<>();
    if (head==null) return;
    while (!stack.isEmpty() || head!=null){
        if (head!=null){
            stack.push(head);
            head=head.left;
        }else{
            head=stack.pop();
            System.out.println(head.val);
            head=head.right;
        }
    }
}
```

## 二叉树的层序遍历【LC 102题】

层序遍历用**队列**。

> 记录一下上一层一共有多少节点。对每个节点 进行左右子树的遍历。
> 

```java
public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> res=new ArrayList<>();
    if (root==null) return res;
    Queue<TreeNode> queue=new LinkedList<>();
    queue.add(root);
    while (!queue.isEmpty()){
        int size=queue.size();	//记录一下上一层一共有多少节点
        ArrayList<Integer> list=new ArrayList<>();
        for (int i = 0; i < size; i++) {
            //对每个节点 进行左右子树的遍历
            TreeNode temp=queue.poll();
            list.add(temp.val);
            if (temp.left!=null) queue.add(temp.left);
            if (temp.right!=null) queue.add(temp.right);
        }
        res.add(list);
    }
    return res;
}
```

## 二叉树的**锯齿形层序遍历【LC 103题】**

给你二叉树的根节点 `root` ，返回其节点值的 **锯齿形层序遍历** 。（即先从左往右，再从右往左进行下一层遍历，以此类推，层与层之间交替进行）。

<aside>
💡 大体和层序遍历类似。只是在加入每一层的节点时，记录这一层是奇数层还是偶数层，从而使用不同的api(add和addFirst)

</aside>

```java
class Solution {
    public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
        List<List<Integer>> res=new ArrayList<>();
        if (root==null) {
            return res;
        }
        Queue<TreeNode> queue=new LinkedList<>();
        queue.add(root);
        boolean oddFlag=true;
        while (!queue.isEmpty()) {
            int size=queue.size();
            List<Integer> tmpList=new ArrayList<>();
            for (int i = 0; i < size; i++) {
                TreeNode temp=queue.poll();
                if (oddFlag) {
                    tmpList.add(temp.val);   
                }else{
                    tmpList.addFirst(temp.val);
                }
                if(temp.left!=null) queue.add(temp.left);
                if(temp.right!=null) queue.add(temp.right);   
            }
            oddFlag=!oddFlag;
            res.add(tmpList);
        }
        return res;
    }
}

```

## 翻转二叉树【LC 226题】

给你一棵二叉树的根节点 `root` ，翻转这棵二叉树，并返回其根节点。

<aside>
💡 递归返回条件：当前节点为空 或者 当前节点的左右节点同时为空

翻转二叉树的右子树，返回右子树的根节点right；

翻转二叉树的左子树，返回左子树的根节点left；

root.left=right; root.right=left;

</aside>

```java
package Tree;

import DataStruct.TreeNode;

public class Reverse {
    public TreeNode invertTree(TreeNode root) {
        if (root==null || (root.left==null && root.right==null)) return root;
        TreeNode right=invertTree(root.right);
        TreeNode left=invertTree(root.left);
        root.left=right;
        root.right=left;
        return root;
    }
}
```

## 对称二叉树【LC 101题】

给你一个二叉树的根节点 `root` ， 检查它是否轴对称。

<aside>
💡 先判断 如果二叉树只有0或1个节点 直接返回true

再递归判断 root.left和root.right

递归判断：

先进行left和right判断。

再对**left.right、right.left** 和**left.left、right.right**进行判断。【这里是重点】

</aside>

```java
package Tree;

import DataStruct.TreeNode;

public class IsSymmeric {
    public boolean isSymmetric(TreeNode root) {
        if (root==null || (root.right==null && root.left==null)) return true;
        return f(root.left,root.right);
    }

    private boolean f(TreeNode left, TreeNode right) {
        if (left==null && right==null) return true;
        if (left==null || right==null) return false;
        if (left.val!=right.val) return false;
        return f(left.right,right.left) && f(left.left,right.right);
    }
}
```

## 二叉树的最大深度【LC 104题】

给定一个二叉树 `root` ，返回其最大深度。

二叉树的 **最大深度** 是指从根节点到最远叶子节点的最长路径上的节点数。

<aside>
💡 二叉树的最大深度就是 根节点的高度

递归返回条件：root==null，返回0

最大深度=本节点深度1+max(左子树深度，右子树深度)

</aside>

```java
package Tree;

import DataStruct.TreeNode;

public class MaxDepth {
    public int maxDepth(TreeNode root) {
        if (root==null) return 0;
        return 1+Math.max(maxDepth(root.left),maxDepth(root.right));
    }
}
```

## 二叉树的最小深度【LC 111题】

[题目链接](https://leetcode.cn/problems/minimum-depth-of-binary-tree/description/)

给定一个二叉树，找出其最小深度。

最小深度是从根节点到最近叶子节点的最短路径上的节点数量。

<aside>
💡 和上题类似，只是这道题是最小深度。

递归返回条件：root==null,返回0

判断条件不同：

计算出minLeft和minRight

1. 如果左右子树都不为空，返回这两者的较小值加1
2. 左右子树都为null，返回1
3. 左右子树有一者为null，返回另一者的值加1.

因此后两种情况可以统一为minLeft+minRight+1

</aside>

```java
public int minDepth(TreeNode root) {
    if (root==null) return 0;
    int minLeft=minDepth(root.left);
    int minRight=minDepth(root.right);
    if (root.left!=null && root.right!=null) return Math.min(minLeft,minRight)+1;
    else return minLeft+minRight+1;
}
```

<aside>
💡 还可以直接用bfs，如果在当前层找到叶子节点，就返回当前层的深度

</aside>

```java
//bfs
public int minDepth2(TreeNode root) {
    if (root==null) return 0;
    Queue<TreeNode> queue=new LinkedList<>();
    queue.offer(root);
    int depth=1;
    while (!queue.isEmpty()){
        int size=queue.size();
        for (int i = 0; i < size; i++) {
            TreeNode temp=queue.poll();
            if (temp.left==null && temp.right==null) return depth;
            if (temp.left!=null) queue.offer(temp.left);
            if (temp.right!=null) queue.offer(temp.right);
        }
        depth++;
    }
    return depth;
}
```

## 完全二叉树的节点个数【LC 222题】

给你一棵 **完全二叉树** 的根节点 `root` ，求出该树的节点个数。

> 
> 

## 平衡二叉树【LC 110题】

给定一个二叉树，判断它是否是 平衡二叉树

<aside>
💡 如果子树不是平衡二叉树，那直接返回-1；在左右子树都是平衡二叉树的前提下，如果左右子树的深度差超过1，返回-1；如果满足上面两个条件，再返回该节点的最大深度，Math.max(left,right)+1

【后序遍历 向左右子树要 左右子树最大深度的信息】

</aside>

```java
public boolean isBalanced(TreeNode root) {
    if (root==null) return true;
    return maxDepth(root)!=-1;
}

private int maxDepth(TreeNode root) {
    if (root==null) return 0;
    int left=maxDepth(root.left);
    if (left==-1) return -1;
    int right=maxDepth(root.right);
    if (right==-1) return -1;
    if (Math.abs(left-right)>1) return -1;
    return Math.max(left,right)+1;
}
```

## 二叉树的所有路径【LC 257题】

[题目链接](https://leetcode.cn/problems/binary-tree-paths/)

给你一个二叉树的根节点 `root` ，按 **任意顺序** ，返回所有从根节点到叶子节点的路径。

**叶子节点** 是指没有子节点的节点。

<aside>
💡 递归+回溯

如果当前节点是叶子节点，就把结果添加到结果集中；如果不是叶子节点，继续递归左右子节点。最后要撤销当前状态【通过设置StringBuilder的原始长度】

</aside>

```java
class Solution {
    public List<String> binaryTreePaths(TreeNode root) {
        List<String> list=new ArrayList<>();
        backTrack(root,new StringBuilder(),list);
        return list;
    }

    public void backTrack(TreeNode root,StringBuilder path, List<String> res){
        if(root==null) return;
        int len=path.length();
        path.append(root.val);
        if(root.left==null && root.right==null){
            res.add(path.toString());   //注意 这里不能return，因为找到了叶子节点，也还是要回溯回去
        }else{
            path.append("->");
            backTrack(root.left,path,res);
            backTrack(root.right,path,res);
        }
        path.setLength(len);
    }
}
```

## 左叶子之和【LC 404题】

[题目链接](https://leetcode.cn/problems/sum-of-left-leaves/)

给定二叉树的根节点 `root` ，返回所有左叶子之和。

<aside>
💡 左叶子：该节点是叶子节点，并且是它父节点的左孩子。

可以用一个flag记录当前节点是不是父节点的左孩子，然后就是无脑递归

</aside>

```java
package Tree;

import DataStruct.TreeNode;

public class SumOfLeftLeaves {
    public int res=0;
    public int sumOfLeftLeaves(TreeNode root) {
        if (root==null) return 0;
        traversal(root,false);
        return res;
    }

    private void traversal(TreeNode root, boolean flag) {
        if (root==null) return;
        if (root.left==null && root.right==null && flag){
            res+=root.val;
            return;
        }
        traversal(root.left,true);
        traversal(root.right,false);
    }

}
```

## 找树左下角的值【LC 513题】

给定一个二叉树的 **根节点** `root`，请找出该二叉树的 **最底层 最左边** 节点的值。

假设二叉树中至少有一个节点。

<aside>
💡 使用bfs，先往队列里放右子树，再往队列里面放左子树。这样最后一个出队的元素一定是最底层的最左节点

</aside>

```java
public int findBottomLeftValue(TreeNode root) {
    Queue<TreeNode> queue=new LinkedList<>();
    queue.add(root);
    TreeNode temp = null;
    while (!queue.isEmpty()){
        temp=queue.poll();
        if (temp.right!=null) queue.offer(temp.right);
        if (temp.left!=null) queue.offer(temp.left);
    }
    return temp.val;
}
```

<aside>
💡 使用dfs，每一次搜索到更深层的节点，就用当前节点的值更新结果值，先遍历左子树，再遍历右子树，这样就能保证第一次遍历到该层的节点一定是该层最左侧的节点

</aside>

```java
public int maxDepth,res;
public int findBottomLeftValue(TreeNode root) {
    dfs(root,1);	//这里注意 第一次的深度为1 因为根节点开始 就要更新res值
    return res;
}
    private void dfs(TreeNode root, int depth) {
    if (root==null) return;
    if (depth>maxDepth){
        maxDepth=depth;
        res=root.val;
    }
    dfs(root.left,depth+1);
    dfs(root.right,depth+1);
}
```

## 路径总和【LC 112题】

给你二叉树的根节点 `root` 和一个表示目标和的整数 `targetSum` 。判断该树中是否存在 **根节点到叶子节点** 的路径，这条路径上所有节点值相加等于目标和 `targetSum` 。如果存在，返回 `true` ；否则，返回 `false`

<aside>
💡 递归遍历：节点的左子树或者右子树是否满足条件

递归返回条件：当前节点为null，返回false【说明这一个节点不满足条件了】

</aside>

```java
package Tree;

import DataStruct.TreeNode;

public class HasPathSum {
    public boolean hasPathSum(TreeNode root, int targetSum) {
        if (root==null) return false;
        if (root.left==null && root.right==null) return root.val==targetSum;
        else {
            return hasPathSum(root.left,targetSum-root.val) || hasPathSum(root.right,targetSum-root.val);
        }
    }
}
```

## 路径总和|||【LC 436题】

给定一个二叉树的根节点 `root` ，和一个整数 `targetSum` ，求该二叉树里节点值之和等于 `targetSum` 的 **路径** 的数目。

**路径** 不需要从根节点开始，也不需要在叶子节点结束，但是路径方向必须是向下的（只能从父节点到子节点）。

<aside>
💡 和为k的子数组【LC 560题】的树形式

也是直接拨开了 外套 的回溯【直接就是树的形式】

使用前缀和，记录根节点到这个节点的路径总和，当targetSum=两前缀和相减，就说明出现了目标路径，

使用HashMap来保证不遗漏掉多个路径，key表示前缀和，value表示前缀和为这个值的节点数量。

先put进去(0,1)保证不遗漏掉根节点的值。

</aside>

```java
package Tree;

import DataStruct.TreeNode;

import java.util.HashMap;

public class PathSum {
    HashMap<Long,Integer> map=new HashMap<>();
    int target;
    public int pathSum(TreeNode root, int targetSum) {
        map.put(0L,1);
        target=targetSum;
        return backTrack(root,0L);
    }

    public int backTrack(TreeNode root,Long curSum){   //传入当前节点，和父节点的前缀和
        if(root==null) return 0;
        int res=0;
        curSum+=root.val;   //计算到当前节点的前缀和
        // 注意：是找前面路径总和= 当前前缀和-target的前缀和
        // 下面两句代码为什么先找到结果，再把当前节点放进去?
        // 因为是当前节点和之前的节点形成路径，放入自己，就有可能是自己和自己形成长度为0的路径
        res+=map.getOrDefault(curSum-target,0);    //统计到当前节点结束的符合路径
        map.put(curSum,map.getOrDefault(curSum,0)+1);   //把当前前缀和加入map
        int left=backTrack(root.left,curSum);   //递归寻找左右子树中的符合路径
        int right=backTrack(root.right,curSum);
        map.put(curSum,map.get(curSum)-1);      //回溯，返回上一层
        return res+left+right;  //返回符合路径数总和
    }
}
```

## 二叉搜索树的最近公共祖先【LC 235题、牛客BM 37题】

给定一个二叉搜索树, 找到该树中两个指定节点的最近公共祖先。

<aside>
💡 如果两个节点都小于当前节点val，往左遍历；如果两个节点都大于当前节点val，往右遍历；else return 当前节点。lc和牛客的区别就是一个是节点，一个是int，没有什么本质区别

</aside>

```java
public class Solution {
    public int lowestCommonAncestor (TreeNode root, int p, int q) {
        // write code here
        TreeNode cur=root;
        while(cur!=null){
            if(p<root.val && q<root.val) cur=cur.left;
            else if(p>root.val && q>root.val) cur=cur.right;
            return cur.val;
        }
        return cur.val;
    }

```

## 二叉树的最近公共祖先【LC 236题】

给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。

<aside>
💡 如果root==p || root==q ，那么说明两者的最近公共祖先为root

在root的左右子树上找p和q，返回结果left和right

如果两个返回都为null，那么说明找不到

如果一个为null，那么说明都在另一个树上，返回另一个寻找的返回值。

如果两个都不为null，说明一边的子树有一个节点，那么两个节点的最近公共祖先就是根节点

</aside>

```java
class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if(root==p || root==q || root==null) return root;
        TreeNode left=lowestCommonAncestor(root.left,p,q);
        TreeNode right=lowestCommonAncestor(root.right,p,q);
        if(left==null && right==null) return null;
        if(left==null) return right;
        if(right==null) return left;
        return root;
    }
}
```

## 构建二叉树系列

创建自己的build函数，传入原来的构建参数和自己给出的构建范围，使用递归的方式构建，缩小构建范围，分别构建出左子树和右子树。

## 从前序和中序遍历构造二叉树【LC 105题】

给定两个整数数组 `preorder` 和 `inorder` ，其中 `preorder` 是二叉树的**先序遍历**， `inorder` 是同一棵树的**中序遍历**，请构造二叉树并返回其根节点。

<aside>
💡 中序遍历：左根右；先序遍历：根左右。【通过先序遍历找到根节点在哪，在通过中序遍历找到左子树和右子树】

通过中序遍历数组建立起 元素和下标的对应关系。这样就能通过元素找到中序遍历元素的下标。

在主函数中建立map，build函数中通过传入的map和先序遍历数组来构建二叉树。

</aside>

```java
class Solution {
    public TreeNode buildTree(int[] preorder, int[] inorder) {
        HashMap<Integer,Integer> map=new HashMap<>();
        for(int i=0;i<inorder.length;i++){
            map.put(inorder[i],i);
        }
        return build(map,0,inorder.length-1,preorder,0,preorder.length-1);
    }

    public TreeNode build(HashMap<Integer,Integer> map,int inLeft,int inRight,int []preorder,int preLeft,int preRight){
        //递归返回
        if(inLeft>inRight || preLeft>preRight) return null;
        int inIndex=map.get(preorder[preLeft]);
        TreeNode root=new TreeNode(preorder[preLeft]);
        root.left=build(map,inLeft,inIndex-1,preorder,preLeft+1,preLeft+inIndex-inLeft);
        root.right=build(map,inIndex+1,inRight,preorder,preRight-inRight+inIndex+1,preRight);
        return root;
    }
}
```

## 从中序与后序遍历序列构造二叉树【LC 106题】

给定两个整数数组 `inorder` 和 `postorder` ，其中 `inorder` 是二叉树的中序遍历， `postorder` 是同一棵树的后序遍历，请你构造并返回这颗 *二叉树* 。

<aside>
💡 中序遍历：左根右；后序遍历：左右根；【通过后序遍历找到根节点在哪，再通过中序遍历找到左子树和右子树】

需要建立起中序遍历，元素和下标的对应关系。

</aside>

```java
package Tree;
import DataStruct.TreeNode;

import java.util.HashMap;

public class BuildTree {
    // 左根右 左右根
    public TreeNode buildTree(int[] inorder, int[] postorder) {
        int inLen=inorder.length,postLen=postorder.length;
        if (inLen!=postLen) return null;
        HashMap<Integer,Integer> map=new HashMap<>();
        for (int i = 0; i < inLen; i++) {
            map.put(inorder[i],i);
        }
        return build(0,inLen-1,postorder,0,postLen-1,map);
    }

    private TreeNode build(int inleft, int inright, int[] postorder, int postleft, int postright, HashMap<Integer, Integer> map) {
        if (inleft>inright || postleft>postright) return null;
        int rootVal=postorder[postright];
        TreeNode root=new TreeNode(rootVal);
        int inIndex=map.get(rootVal);
        root.left=build(inleft,inIndex-1,postorder,postleft,postleft+inIndex-1-inleft,map);
        root.right=build(inIndex+1,inright,postorder,postright-inright+inIndex,postright-1,map);
        return root;
    }
}
```

## 最大二叉树【LC 654题】

给定一个不重复的整数数组 `nums` 。 **最大二叉树** 可以用下面的算法从 `nums` 递归地构建:

1. 创建一个根节点，其值为 `nums` 中的最大值。
2. 递归地在最大值 **左边** 的 **子数组前缀上** 构建左子树。
3. 递归地在最大值 **右边** 的 **子数组后缀上** 构建右子树。

返回 `*nums` 构建的* ***最大二叉树*** 。

<aside>
💡 因为左右子树构造最大二叉树的子问题过程和原问题一样，所以想到使用递归，不断缩小问题规模。

</aside>

```java
package Tree;

import DataStruct.TreeNode;

public class BuildMaxTree {
    public TreeNode constructMaximumBinaryTree(int[] nums) {
        return build(nums,0,nums.length-1);
    }

    private TreeNode build(int[] nums, int left, int right) {
        if (left>right) return null;
        int maxIndex=findMaxIndex(nums,left,right);
        TreeNode root=new TreeNode(nums[maxIndex]);
      //缩小问题规模，构建出最大左子树和最大右子树
        root.left=build(nums,left,maxIndex-1);	
        root.right=build(nums,maxIndex+1,right);
        return root;
    }

    private int findMaxIndex(int[] nums, int left, int right) {	//找到子数组中最大下标
        int maxIndex=left;
        for (int i = left+1; i <= right; i++) {
            maxIndex=(nums[maxIndex]<nums[i])? i :maxIndex;
        }
        return maxIndex;
    }
}
```

## 将有序数组转换为二叉搜索树【LC 108题】

给你一个整数数组 `nums` ，其中元素已经按 **升序** 排列，请你将其转换为一棵 平衡 二叉搜索树。

<aside>
💡 平衡二叉搜索树——二分法，用最中间的树作为root；再分别递归二分法构建左右子树

</aside>

```java
class Solution {
    public TreeNode sortedArrayToBST(int[] nums) {
        // 左闭右闭
        return build(nums,0,nums.length-1);
    }

    public TreeNode build(int []nums,int left,int right){
        if(left>right) return null;
        int mid=(left+right)/2;
        TreeNode root=new TreeNode(nums[mid]);
        root.left=build(nums,left,mid-1);
        root.right=build(nums,mid+1,right);
        return root;
    }
}
```

## 合并二叉树【LC 617题】

给你两棵二叉树： `root1` 和 `root2` 。

想象一下，当你将其中一棵覆盖到另一棵之上时，两棵树上的一些节点将会重叠（而另一些不会）。你需要将这两棵树合并成一棵新二叉树。合并的规则是：如果两个节点重叠，那么将这两个节点的值相加作为合并后节点的新值；否则，**不为** null 的节点将直接作为新二叉树的节点。

返回合并后的二叉树。

**注意:** 合并过程必须从两个树的根节点开始。

<aside>
💡 dfs合并，递归合并两棵树，把第二棵树的值加到第一棵树上。

递归返回条件：有一个树节点为null，返回另一个不为null的树

</aside>

```java
package Tree;

import DataStruct.TreeNode;

public class MergeTree {
    public TreeNode mergeTrees(TreeNode root1, TreeNode root2) {
        if (root1==null || root2==null) return root1==null?root2:root1;
        root1.val+= root2.val;
        root1.left=mergeTrees(root1.left,root2.left);
        root1.right=mergeTrees(root1.right,root2.right);
        return root1;
    }
}
```

---

## 二叉搜索树系列

利用二叉搜索树的特性：节点的左子树一定比节点小，节点的右子树一定比节点大

## 二叉搜索树中的搜索【LC 700题】

给定二叉搜索树（BST）的根节点 `root` 和一个整数值 `val`。

你需要在 BST 中找到节点值等于 `val` 的节点。 返回以该节点为根的子树。 如果节点不存在，则返回 `null`

<aside>
💡 补充知识：递归和迭代的区别。

递归：重复调用函数本体，并且有明确返回条件

迭代：重复调用代码过程，使用上一次的结果更新这一次的条件

</aside>

```java
package Tree;

import DataStruct.TreeNode;

public class SearchTree {
    //递归 反复调用函数本体
    public TreeNode searchBST(TreeNode root, int val) {
        if (root==null || root.val==val) return root;
        return (root.val<val) ? searchBST(root.right,val) : searchBST(root.left,val);
    }

    //迭代法 更新root变量
    public TreeNode searchBST2(TreeNode root, int val) {
        while (root!=null && root.val!=val){
            root=(root.val<val) ? root.right :root.left;
        }
        return root;
    }
}
```

## 验证二叉搜索树【LC 98题】

给你一个二叉树的根节点 `root` ，判断其是否是一个有效的二叉搜索树。

<aside>
💡 记录prev

先判断左子树是否满足二叉搜索树

再判断prev<root.val

此时更新prev=root.val，再判断右子树是否满足二叉搜索树

</aside>

```java
package Tree;

import DataStruct.TreeNode;

public class IsValidBST {
    long prev=Long.MIN_VALUE;
    public boolean isValidBST(TreeNode root) {
        if (root==null) return true;
        if (!isValidBST(root.left)) return false;
        if (prev>=root.val) return false;
        prev=root.val;
        return isValidBST(root.right);
    }
}
```

## 二叉搜索树的最小绝对差【LC 530题】

给你一个二叉搜索树的根节点 `root` ，返回 **树中任意两不同节点值之间的最小差值** 。

差值是一个正数，其数值等于两值之差的绝对值。

<aside>
💡 直观想法：中序遍历二叉搜索树得到一个有序数组，求这个有序数组相邻两个元素的最小差值

优化：直接用双指针记录相邻的两个元素，再进行遍历。不需要先遍历得到一个有序数组。

</aside>

```java
class Solution {
    public int res=Integer.MAX_VALUE;
    public TreeNode prev=null;
    public int getMinimumDifference(TreeNode root) {
        traversal(root);
        return res;
    }

    private void traversal(TreeNode root) {
        if (root==null) return;
        traversal(root.left); //遍历左子树的最小绝对差
        if (prev!=null) res=Math.min(res,root.val- prev.val);  //计算左子树和根节点的最小绝对差
        prev=root;
        traversal(root.right);  //计算右子树的最小绝对差
    }
}
```

## 二叉搜索树中的插入操作【LC 701题】

给定二叉搜索树（BST）的根节点 `root` 和要插入树中的值 `value` ，将值插入二叉搜索树。 返回插入后二叉搜索树的根节点。 输入数据 **保证** ，新值和原始二叉搜索树中的任意节点值都不同。

**注意**，可能存在多种有效的插入方式，只要树在插入后仍保持为二叉搜索树即可。 你可以返回 **任意有效的结果**

<aside>
💡 递归法：每次递归返回子树的头结点

</aside>

```java
package Tree;

import DataStruct.TreeNode;

public class InsertToBst {
    public TreeNode insertIntoBST(TreeNode root, int val) {
        if (root==null) return new TreeNode(val);   //如果root节点为null，就找到了
        if (root.val>val) root.left=insertIntoBST(root.left,val);
        else root.right=insertIntoBST(root.right,val);
        return root;
    }
}
```

## 删除二叉搜索树中的节点【LC 450题】

给定一个二叉搜索树的根节点 **root** 和一个值 **key**，删除二叉搜索树中的 **key** 对应的节点，并保证二叉搜索树的性质不变。返回二叉搜索树（有可能被更新）的根节点的引用。

一般来说，删除节点可分为两个步骤：

1. 首先找到需要删除的节点；
2. 如果找到了，删除它。

<aside>
💡 具体删除节点，一共有五种情况：

第一种情况：没找到删除的节点，遍历到空节点直接返回了
找到删除的节点
第二种情况：左右孩子都为空（叶子节点），直接删除节点， 返回NULL为根节点
第三种情况：删除节点的左孩子为空，右孩子不为空，删除节点，右孩子补位，返回右孩子为根节点
第四种情况：删除节点的右孩子为空，左孩子不为空，删除节点，左孩子补位，返回左孩子为根节点
第五种情况：左右孩子节点都不为空，则将删除节点的左子树头结点（左孩子）放到删除节点的右子树的最左面节点的左孩子上，返回删除节点右孩子为新的根节点。

</aside>

> 具体方法和上题类似，返回删除当前节点剩下部分的头结点
> 

```java
class Solution {
    public TreeNode deleteNode(TreeNode root, int key) {
        if (root == null) return null;
        if (root.val == key) {
            if (root.left == null) return root.right;
            if (root.right == null) return root.left;
            TreeNode t = root.left;
            while (t.right != null) t = t.right;
            t.right = root.right;
            return root.left;
        } else if (root.val < key) root.right = deleteNode(root.right, key);
        else root.left = deleteNode(root.left, key);
        return root;
    }
}
```

## 二叉搜索树第k小的元素【LC 230题】

给定一个二叉搜索树的根节点 `root` ，和一个整数 `k` ，请你设计一个算法查找其中第 `k` 小的元素（从 1 开始计数）。

<aside>
💡 由于二叉搜索树的左子树比root小，root比右子树小。可以根据左子树的节点个数，一步一步减小范围，从而锁定第K小的元素。

1. 如果左子树的元素个数==k-1,那么root为第k小的元素
2. 如果左子树的元素个数>k-1，那么在左子树中寻找第k小的元素
3. 如果左子树的元素个数n>k-1，那么在右子树中寻找第k-n-1小的元素
</aside>

```java
class Solution {
    public int kthSmallest(TreeNode root, int k) {
        int countLeft=countNodes(root.left);
        if(countLeft==k-1)  return root.val;
        else if(countLeft > k-1) return kthSmallest(root.left,k);
        else return kthSmallest(root.right,k-countLeft-1);
    }

    public int countNodes(TreeNode root){
        if(root==null) return 0;
        return countNodes(root.left)+countNodes(root.right)+1;
    }
}
```

## 修剪二叉搜索树【LC 669题】

给你二叉搜索树的根节点 `root` ，同时给定最小边界`low` 和最大边界 `high`。通过修剪二叉搜索树，使得所有节点的值在`[low, high]`中。修剪树 **不应该** 改变保留在树中的元素的相对结构 (即，如果没有被移除，原有的父代子代关系都应当保留)。 可以证明，存在 **唯一的答案** 。

所以结果应当返回修剪好的二叉搜索树的新的根节点。注意，根节点可能会根据给定的边界发生改变。

## 二叉树的最大宽度【LC 662题】

给你一棵二叉树的根节点 `root` ，返回树的 **最大宽度** 。

每一层的 **宽度** 被定义为该层最左和最右的非空节点（即，两个端点）之间的长度。将这个二叉树视作与满二叉树结构相同，两端点间会出现一些延伸到这一层的 `null` 节点，这些 **`null` 节点也计入长度**。

<aside>
💡 dfs，先对左子树dfs，再对右子树dfs。利用hashmap记录下每一层的第一个节点编号。【每一层第一个遍历到的一定是最小的编号】

</aside>

```java
HashMap<Integer,Integer> map=new HashMap<>();   //记录每一层第一个遍历到的节点编号
int res=1;
public int widthOfBinaryTree(TreeNode root) {
    dfs(0,1,root);
    return res;
}

private void dfs(int depth, int no, TreeNode root) {
    if(root==null) return;
    if (!map.containsKey(depth)) map.put(depth,no);     //放每一层最左侧的节点编号
    res= Math.max(res,no-map.get(depth)+1);
    dfs(depth+1,no<<1,root.left);
    dfs(depth+1,no<<1|1,root.right);
}
```

## 二叉树的右视图【LC 199题】

给定一个二叉树的 **根节点** `root`，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值。

<aside>
💡 bfs：层序遍历的方式，先访问右节点，每一层先加入结果集。【这样需要每一层的信息，就必须要保存每一层的size，当元素为该层最后一个元素时，再加入结果集】

dfs：在每次进入新的一层时，把最右侧节点加入结果集。

</aside>

```java
// BFS
class Solution {
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> res=new ArrayList<>();
        if(root==null) return res;
        Queue<TreeNode> queue=new LinkedList<>();
        queue.add(root);
        while(!queue.isEmpty()){
            int size=queue.size();
            for(int i=0;i<size;i++){
                TreeNode temp=queue.poll();
                if(temp.right!=null) queue.offer(temp.right);
                if(temp.left!=null) queue.offer(temp.left);
                if(i==0) res.add(temp.val);
            }
        }
        return res;
    }
}
```

```java
// DFS
class Solution {
    List<Integer> res=new ArrayList<>();
    int maxDepth=0;
    public List<Integer> rightSideView(TreeNode root) {
        dfs(root,1);
        return res;
    }

    public void dfs(TreeNode root,int Depth){
        if(root==null) return;
        if(Depth>maxDepth){
            maxDepth=Depth;
            res.add(root.val);
        }
        dfs(root.right,Depth+1);
        dfs(root.left,Depth+1);
    }
}
```

## 二叉树展开为链表【LC 114题】

给你二叉树的根结点 `root` ，请你将它展开为一个单链表：

- 展开后的单链表应该同样使用 `TreeNode` ，其中 `right` 子指针指向链表中下一个结点，而左子指针始终为 `null` 。
- 展开后的单链表应该与二叉树 [**先序遍历**](https://baike.baidu.com/item/%E5%85%88%E5%BA%8F%E9%81%8D%E5%8E%86/6442839?fr=aladdin) 顺序相同。

<aside>
💡 按照 根左右 的顺序

找到root左子树中最右的元素p

p.right=root.right;

root.right=root.left;

root.left=null;

然后再对root.right进行同样的操作

</aside>

```java
class Solution {
    public void flatten(TreeNode root) {
        while(root!=null){
            TreeNode p=root.left;
            //如果左子树有需要处理的
            if(p!=null){
                while(p.right!=null) p=p.right;
                p.right=root.right;
                root.right=root.left;
                root.left=null;
            }
            //如果左子树没有需要处理的 或者 左子树处理完成了
            root=root.right;
        }
    }
}
```

## 二叉树中的最大路径和【LC 124题】

二叉树中的 **路径** 被定义为一条节点序列，序列中每对相邻节点之间都存在一条边。同一个节点在一条路径序列中 **至多出现一次** 。该路径 **至少包含一个** 节点，且不一定经过根节点。

**路径和** 是路径中各节点值的总和。

给你一个二叉树的根节点 `root` ，返回其 **最大路径和** 。

<aside>
💡 本题有两个关键概念：

- 链：从叶子到当前节点的路径。其节点值之和是 dfs 的返回值。
- 直径：等价于由两条（或者一条）链拼成的路径。我们枚举每个 node，假设直径在这里「拐弯」，也就是计算由左右两条从叶子到 node 的链的节点值之和，去**更新答案的最大值。**

⚠注意：**dfs 返回的是链的节点值之和**，不是直径的节点值之和。

</aside>

```java
  int res=Integer.MIN_VALUE;
  public int maxPathSum(TreeNode root) {
      dfs(root);
      return res;
  }

  private int dfs(TreeNode root) {    //返回以当前节点为头结点的最大链和 or 0
      if (root==null) return 0;
      int left=dfs(root.left);    //以左右子树为头结点的最大链和
      int right=dfs(root.right);  
      res=Math.max(res,left+right+root.val);  //加上头结点的最大路径和
      return Math.max(Math.max(left,right)+root.val,0);  	//以root为头结点的最大链和
  }
```

## 判断是否为完全二叉树【LC 958题】

利用**层序遍历**，判断规则如下：

<aside>
💡 主要就是 在层序遍历中，判断false的情况 和 更新 leafFlag这个bool变量。

任意节点有右孩子，无左孩子，直接返回false；在条件1满足的情况下，如果节点不是有两个孩子的话【非全节点】，则之后的所有节点必须都是叶子节点。否则返回false。

</aside>

```java
public boolean isCompleteTree (TreeNode root) {
    if (root == null) return true;
    boolean leafFlag = false;
    Queue<TreeNode> queue = new LinkedList<>();
    queue.add(root);
    while (!queue.isEmpty()) {
        TreeNode temp = queue.poll();
        TreeNode left = temp.left;
        TreeNode right = temp.right;

        if (left == null && right != null)  return false;
        if (leafFlag && (left!=null)) return false;
        if (right==null) leafFlag=true;
        if(left!=null) queue.add(left);
        if(right!=null) queue.add(right);
    }
  return true;
}
```

## 判断是否为满二叉树

<aside>
💡 return 二叉树的节点个数==pow(2,二叉树深度)-1;

</aside>

```java
public static boolean isfullTree(TreeNode root){
    if (root == null) return true;
    TreeNode temp=root;
    int level=0;
    while (temp!=null){
        level++;
        temp=temp.left;
    }
    return countNodes(root)==(int)Math.pow(2,level)-1;
}

private static int countNodes(TreeNode root) {
    if (root==null) return 0;
    return countNodes(root.left)+countNodes(root.right)+1;
}
```

## 二叉搜索树的中序后继【LCR 53题】

给定一棵二叉搜索树和其中的一个节点 `p` ，找到该节点在树中的中序后继。如果节点没有中序后继，请返回 `null`

<aside>
💡 二叉搜索树中，节点 p 的后继是值比 p.val 大的节点中键值最小的节点。

具体做法：

1. 如果root.val>p.val，往左子树上找，找到那个最小的比p.val大的节点
2. 如果root.val<p.val，往右子树上找，同样找到那个最小的比p.val大的节点
3. 如果一直找不到比p.val大的节点，就返回null
</aside>

```java
public TreeNode inorderSuccessor(TreeNode root, TreeNode p) {
    TreeNode res=null;
    while (root!=null){
        if (root.val>p.val){
            res=root;
            root=root.left;
        }else {
            root=root.right;
        }
    }
    return res;
}
```

## 二叉树的中序后继

节点数据结构:TreeNode left；TreeNode right；TreeNode parent；

<aside>
💡 当前节点有右子树，返回右子树上的最左节点当前节点无右子树，一直往上看，看当前节点是不是父节点的左孩子；是的话就返回父节点一个节点，一直不是父节点的左孩子，它的后继为null

</aside>

```java
//获得p节点的下一个中序遍历节点
public static TreeNode getNextNode(TreeNode root,TreeNode p){
    if (p.right!=null){	//当前节点有右子树
        p=p.right;
        while (p.left!=null){
            p=p.left;	//返回右子树上最左边的节点
        }
        return p;
    }else{	//当前节点没有右子树
        while (p.parent!=null && p.parent.left!=p){	//沿着父节点往上 直到当前节点是父节点的左孩子
            p=p.parent;
        }
        return p.parent;
    }
}
```

## 二叉树的序列化和反序列化【LC 297题】

#### 1、先序遍历的序列化和反序列化

题目描述：建立“根左右”先序遍历的序列化字符串，根据序列化字符串还原回二叉树。null值用”##“代替。

1. 先序序列 序列化

```java
public String serialByPre(TreeNode root){
    if (root==null) return "##_";	//递归返回条件：当前节点为空
    String res=root.val+"_";	//如果当前节点不为空，则返回当前节点.val_+左子树序列化+右子树序列化
    res+=serialByPre(root.left);
    res+=serialByPre(root.right);
    return res;
}
```

1. 先序序列 反序列化

```java
public TreeNode reconByPre(String preStr){
    String[] values = preStr.split("_");
    Queue<String> queue=new LinkedList<>();
    for (String value : values) {
        queue.add(value);
    }
    return reconPreOrder(queue);
}

private TreeNode reconPreOrder(Queue<String> queue) {
    String value=queue.poll();
    if (value=="##") return null;	//递归返回条件：当前节点为空
    //如果当前节点不为空，则递归建立左子树和右子树
    TreeNode head=new TreeNode(Integer.valueOf(value));
    head.left=reconPreOrder(queue);
    head.right=reconPreOrder(queue);
    return head;
}
```

#### 2、层序遍历的序列化和反序列化

按照层序遍历的遍历方法。用**队列**

1. 序列化：对于null节点，也加入队列，不进行左右节点的判断了。

```java
public String serialize(TreeNode root) {
    if (root==null) return "[]";
    String res="[";
    Queue<TreeNode> queue=new LinkedList<>();
    queue.add(root);
    while (!queue.isEmpty()){
        TreeNode temp=queue.poll();
        if (temp!=null){
            res=res+temp.val+",";
            queue.add(temp.left);
            queue.add(temp.right);
        }else{
            res+="null,";
        }
    }
    return res.substring(0,res.length()-1)+"]";
}
```

1. 反序列化：按照队列顺序，先构建左子结点，再构建右子节点

```java
public TreeNode deserialize(String data) {
    if (data.equals("[]")||data==null) return null;
    String[] split = data.substring(1,data.length()-1).split(",");
    Queue<TreeNode> queue=new LinkedList<>();
    TreeNode root=new TreeNode(Integer.valueOf(split[0]));
    queue.add(root);
    int i=1;
    while (!queue.isEmpty()){
        TreeNode temp=queue.poll();
        if (!split[i].equals("null")){
            TreeNode left=new TreeNode(Integer.valueOf(split[i]));
            temp.left=left;
            queue.add(left);
        }
        i++;
        if (!split[i].equals("null")){
            TreeNode right=new TreeNode(Integer.valueOf(split[i]));
            temp.right=right;
            queue.add(right);
        }
        i++;
    }
    return root;
}
```

## 一张长纸条，反复对折，顺序输出凹凸状态

> 微软原题
> 

题目：给你一张长纸条及反复对折次数，展开后，顺序输出纸条折痕的凹凸状态

<aside>
💡 规律：每次对折后，上一次对折的折痕，上面的是一个新的凹折痕，下面是一个新的凸折痕。

</aside>

```java
public static void main(String[] args) {
    printAllFold(3);
}

public static void printAllFold(int N){
    foldPaper(1,N,true);
}
public static void foldPaper(int i,int N,boolean down){
    if (i>N) return;	//递归返回条件：超过我们要计算的对折次数
    foldPaper(i+1,N,true);	//上面是一个凹折痕
    System.out.println(down?"凹":"凸");
    foldPaper(i+1,N,false);	//下面是一个凸折痕
}
```

## 二叉树的直径【LC 543题】

给你一棵二叉树的根节点，返回该树的 **直径** 。

二叉树的 **直径** 是指树中任意两个节点之间最长路径的 **长度** 。这条路径可能经过也可能不经过根节点 `root` 。

两节点之间路径的 **长度** 由它们之间边数表示。

<aside>
💡 由二叉树的直径 联想到 二叉树的最大深度

以一个节点为root的直径 为maxDepth(left)+maxDepth(right)

所以可以在求最大深度的时候，不断更新全局变量res

</aside>

<aside>
💡 和二叉树的最大路径和那道题类似，那道题的dfs函数返回以root节点为头的最大链和，计算左子树和右子树的最大链和，不断更新全局变量res。

这道题也类似，求最大直径。dfs函数返回以root节点为头的最大深度，计算左子树和右子树的最大深度，不断更新全局变量res。

</aside>

```java
class Solution {
  int res=0;
  public int diameterOfBinaryTree(TreeNode root) {
      dfs(root);
      return res;
  }

  public int dfs(TreeNode root){
      if(root==null) return 0;
      int left=dfs(root.left);
      int right=dfs(root.right);
      res=Math.max(res,left+right);
      return Math.max(left,right)+1;
      }
}
```