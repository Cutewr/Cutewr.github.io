---
date: 2024-9-2
category:
  - 刷题笔记
tag:
  - 回溯
---

# 回溯

## 总结

> 不要以全局思想练回溯！
> 
> 
> 拆解成**规模更小的子问题**去练！
> 

回溯就是暴力递归，暴力递归就是尝试

1. 把问题转化为规模缩小了的同类问题的子问题
2. 有明确的不需要继续进行递归的条件(base case)
3. 有当得到了子问题的结果之后的决策过程
4. 不记录每一个子问题的解

## 汉诺塔问题

如下图所示，从左到右有A、B、C三根柱子，其中A柱子上面有**从小叠到大**的n个圆盘，现要求将A柱子上的圆盘移到C柱子上去，期间只有一个原则：一次只能移到一个盘子且**大盘子不能在小盘子上面**，求移动的步骤和移动的次数

解题思路【分解成子问题】:

<aside>
💡 1、把n-1个橙色的盘子移到B上去【子问题】

2、再把最后一个盘子黄色移到C上去

3、把n-1个盘子从B移到C上去

</aside>

```java
public class Hanoi {
    public static void main(String[] args) {
        hanoi(3);
    }
    public static void hanoi(int n){
        if (n>0){
            func(n,"left","middle","right");
        }
    }

    private static void func(int n, String start, String other, String end) {
        if (n==1){
            System.out.println("Move 1 from "+start+" to "+end);
        }else {
            func(n-1,start,end,other);	//先把上面n-1个圆盘从左边挪到中间
            System.out.println("Move "+n+" from "+start+" to "+end);//把最后一个圆盘从左边挪到最后
            func(n-1,other,start,end);	//把n-1个圆盘从中间挪到最后
        }
    }
}
```

## 全部子序列

打印一个字符串的全部子序列，包括空字符串。

eg:

```java
public class AllSubString {
    public static void main(String[] args) {
        String str="abc";
        char[] charArray = str.toCharArray();
        allSubString(charArray,0);
    }

    public static void allSubString(char []chars,int i) {
        if (i==chars.length){   //到叶子节点了，打印并返回
            System.out.println(String.valueOf(chars));
            return;
        }
        allSubString(chars,i+1);    //要当前字符的路
        char temp=chars[i];
        chars[i]=0;
        allSubString(chars,i+1);    //不要当前字符的路
        chars[i]=temp;	//恢复刚刚置空的字符
    }
}
```

## 获胜者分数

给定一个整型数组arr，代表数值不同的纸牌排成一条线。玩家A和玩家B依次拿走每张纸牌，规定玩家A先拿，玩家B后拿，但是每个玩家每次只能拿走**最左或最右**的纸牌，玩家A和玩家B都绝顶聪明。请返回最后获胜者的分数。
【举例】
arr=[1,2,100,4]。
开始时，玩家A只能拿走1或4。如果开始时玩家A拿走1，则排列变为[2,100,4]，接下来玩家B可以拿走2或4，然后继续轮到玩家A…
如果开始时玩家A拿走4，则排列变为[1,2,100]，接下来玩家B可以拿走1或100，然后继续轮到玩家A…
玩家A作为绝顶聪明的人不会先拿4，因为拿4之后，玩家B将拿走100。所以玩家A会先拿1，让排列变为[2,100,4]，接下来玩家B不管怎么选，100都会被玩家A拿走。玩家A会获胜，分数为101。所以返回101。

**思路：**

> 分为先手和后手。
> 
> 
> 先手拿 f(arr,left,right)：递归返回条件【left==right】，return arr[left];
> 
>  子问题返回 max(拿左边+后序最优解,拿右边+后序最优解)
> 
> 后手拿 f(arr,left,right)：递归返回条件【left==right】，return 0;
> 
>  子问题返回 min(f(arr,i+1,j),f(arr,i,j-1))
> 

```java
public class WinnerScore {
    public static void main(String[] args) {
        int arr[]={1,2,100,4};
        System.out.println(Math.max(f(arr,0,arr.length-1),s(arr,0,arr.length-1)));
    }
    public static int f(int []arr,int left,int right){ //先手拿
        if (left==right){
            return arr[left];
        }
        return Math.max(arr[left]+s(arr,left+1,right),arr[right]+s(arr,left,right-1));
    }

    public static int s(int []arr,int left,int right){ //后手拿
        if (left==right){
            return 0;
        }
        // 后手拿，被别人拿走了一张；所以在下一轮轮到我先手
        return Math.min(f(arr,left+1,right),f(arr,left,right-1));
    }
}
```

## 组合总和【LC 39题】

给你一个 **无重复元素** 的整数数组 `candidates` 和一个目标整数 `target` ，找出 `candidates` 中可以使数字和为目标数 `target` 的 所有 **不同组合** ，并以列表形式返回。你可以按 **任意顺序** 返回这些组合。

`candidates` 中的 **同一个** 数字可以 **无限制重复被选取** 。如果至少一个数字的被选数量不同，则两种组合是不同的。

对于给定的输入，保证和为 `target` 的不同组合数少于 `150` 个。

<aside>
💡 这里没有限制元素的数量，所以树的层高并不确定，只要当前sum>target就返回。

为什么取5之后，只能在当前及后面的元素(5,3)中取值，避免重复选取。

</aside>

<aside>
💡 回溯三部

1. 递归函数参数
    
    给定集合candidates，target目标总和，sum当前集合的总和，startIndex当前遍历开始元素下标
    
    **本题还需要startIndex来控制for循环的起始位置，对于组合问题，什么时候需要startIndex呢？**
    
    如果是一个集合来求组合的话，就需要startIndex
    
    如果是多个集合取组合，各个集合之间相互不影响，那么就不用startIndex。【比如电话号码的字母组合】
    
2. 递归返回条件
    
    当sum>target，递归返回；
    
    当sum=target，收集结果，递归返回。
    
3. 单层递归的逻辑
    
    从startIndex开始，遍历candidates结束。
    
4. 剪枝操作
    
    如果sum>target就不进入for循环了。注意：**剪枝操作需要排序！**
    
</aside>

```java
package BackTrack;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class CombinationSum {
    List<List<Integer>> res=new ArrayList<>();
    List<Integer> list=new ArrayList<>();
	public List<List<Integer>> combinationSum(int[] candidates,int target) {
        Arrays.sort(candidates);    //剪枝操作需要排序！遍历到当前节点大于target就不需要在往后遍历了
        backTrack(candidates,target,0,0);
				return res;
    }

	private void backTrack(int[] candidates,int target,int sum,int startIndex) {
			if (sum==target){
            res.add(new ArrayList<>(list));
						return;
        }
			for (int i = startIndex; i < candidates.length && sum+candidates[i]<=target; i++) {
            sum+=candidates[i];
            list.add(candidates[i]);
            backTrack(candidates,target,sum,i);
            sum-=candidates[i];
            list.remove(list.size()-1);
        }
    }
}
```

## 组合总和||【LC 40题】

给定一个候选人编号的集合 `candidates` 和一个目标数 `target` ，找出 `candidates` 中所有可以使数字和为 `target` 的组合。【本题的candidates中是含有重复元素的，所以如果解集中不包含重复元素，我们就需要做去重】

`candidates` 中的每个数字在每个组合中只能使用 **一次** 。

**注意：**解集不能包含重复的组合。

<aside>
💡 这一题和前面的最大区别在于，要进行树层去重。后面相邻的相同元素注定会和前一个元素得出的集合一致。因此如果同层出现相同的元素，直接返回。

</aside>

```java
package BackTrack;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class CombinationSum2 {
    List<List<Integer>> res=new ArrayList<>();
    List<Integer> list=new ArrayList<>();
    boolean []used;
    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        used=new boolean[candidates.length];
        Arrays.sort(candidates);
        backTrack(candidates,target,0,0);
        return res;
    }

    private void backTrack(int[] candidates, int target, int sum, int startIndex) {
        if (sum==target){
            res.add(new ArrayList<>(list));
            return;
        }
        for (int i = startIndex; i < candidates.length && sum+candidates[i]<=target; i++) {
            if (i>0 && candidates[i]==candidates[i-1] && !used[i - 1]){	//同层的重复元素
                continue;
            }
          //下面就是回溯经典
            used[i]=true;
            sum+=candidates[i];
            list.add(candidates[i]);
            backTrack(candidates,target,sum,i+1);
            used[i]=false;
            sum-=candidates[i];
            list.remove(list.size()-1);
        }
    }
}
```

## 分割回文串【LC 131题】

给你一个字符串 `s`，请你将 `s` 分割成一些子串，使每个子串都是回文串。返回 `s` 所有可能的分割方案

<aside>
💡 回溯三部曲

1. 递归函数参数
    
    给定字符串s，startIndex当前开始元素下标表示切割位置
    
2. 递归返回条件
    
    当startIndex>=s.size，说明找到一组分组方案，收集结果，返回。
    
3. 单层递归的逻辑
    
    从startIndex开始，遍历字符串结束。
    
</aside>

```java
package BackTrack;

import java.util.ArrayList;
import java.util.List;

public class Partition {
    List<List<String>> res=new ArrayList<>();
    List<String> list=new ArrayList<>();
    public List<List<String>> partition(String s) {
        backTrack(s,0);
        return res;
    }

    private void backTrack(String s, int partitionIndex) {
        if (partitionIndex>=s.length()){
            res.add(new ArrayList<>(list));
            return;
        }
        for (int i = partitionIndex; i < s.length(); i++) {
            if (isPalindrome(s,partitionIndex,i)){
                String temp=s.substring(partitionIndex,i+1);
                list.add(temp);
            }else {
                continue;
            }
            backTrack(s,i+1);		//注意这里传入的是i+1，因为是在本次分割的基础上，往后分割
            list.remove(list.size()-1);
        }
    }

    private boolean isPalindrome(String s, int left, int right) {
        for (int i=left,j = right; j > i ; i++,j--) {
            if (s.charAt(i)!=s.charAt(j)) return false;
        }
        return true;
    }
}
```

## 复原IP地址【LC 93题】

**有效 IP 地址** 正好由四个整数（每个整数位于 `0` 到 `255` 之间组成，且不能含有前导 `0`），整数之间用 `'.'` 分隔。

- 例如：`"0.1.2.201"` 和`"192.168.1.1"` 是 **有效** IP 地址，但是 `"0.011.255.245"`、`"192.168.1.312"` 和 `"192.168@1.1"` 是 **无效** IP 地址。

给定一个只包含数字的字符串 `s` ，用以表示一个 IP 地址，返回所有可能的**有效 IP 地址**，这些地址可以通过在 `s` 中插入 `'.'` 来形成。你 **不能** 重新排序或删除 `s` 中的任何数字。你可以按 **任何** 顺序返回答案。

<aside>
💡 这道题是上一道【分割回文串】的进阶，拓展点在于递归参数还要加一个点号数量，递归返回条件为如果点号数量已经为3了，就判断最后一个数字是否为有效IP地址。

并且如果判断当前字符串不是有效IP地址，遇到不符合的直接break，退出本次循环。而分割回文串本次不符合，可能再加一个字符就符合了，因此使用continue。

</aside>

```java
package BackTrack;

import java.util.ArrayList;
import java.util.List;

public class RestoreIPAddress {
    List<String> res=new ArrayList<>();
    public List<String> restoreIpAddresses(String s) {
        backTrack(s,0,0);
        return res;
    }

    private void backTrack(String s, int partitionIndex,int pointCount) {
        if (pointCount==3){	//递归返回条件：逗号数量为3且最后一个数字符合标准
            if (isValid(s,partitionIndex,s.length()-1)){
                res.add(s);
            }
            return;
        }
        for (int i = partitionIndex; i < s.length(); i++) {
            if (isValid(s,partitionIndex,i)){
                s=s.substring(0,i+1)+'.'+s.substring(i+1);
                pointCount++;
                backTrack(s,i+2,pointCount);
                pointCount--;
                s=s.substring(0,i+1)+s.substring(i+2);
            }else {
                break;
            }
        }
    }

    private boolean isValid(String s, int start, int end) {	//判断是否有效
        if (start>end) return false;	//1、start>end 
        if (s.charAt(start)=='0' && start!=end) return false;		//2、开头为0，且不是一个字符0
        int num=0;	//3、数字是否超过255
        for (int i = start; i <= end; i++) {
            if (s.charAt(i)>'9' || s.charAt(i)<'0') return false;
            num = num * 10 + (s.charAt(i) - '0');
            if (num>255) return false;
        }
        return true;
    }
}
```

> 优化：使用StringBuilder修改字符串
> 

## 子集【LC 78题】

给你一个整数数组 `nums` ，数组中的元素 **互不相同** 。返回该数组所有可能的子集

解集 **不能** 包含重复的子集。你可以按 **任意顺序** 返回解集。

<aside>
💡

这道题和之前题目的区别：

之前的题目都是在终止条件中判断是否满足条件，加入结果集。

而本题需要将每一次递归【树的每一个节点】，都加入结果集，因此每一次递归最开始都需要进行收集结果操作。

</aside>

```java
package BackTrack;

import java.util.ArrayList;
import java.util.List;

public class Subsets {
    List<List<Integer>> res=new ArrayList<>();
    List<Integer> list=new ArrayList<>();
    public List<List<Integer>> subsets(int[] nums) {
        backTrack(nums,0);
        return res;
    }

    private void backTrack(int[] nums, int startIndex) {
        res.add(new ArrayList<>(list));
        //if (startIndex>=nums.length) return; 终止条件可以不写 因为满足终止条件之后 就不会走for循环了 直接结束方法 自然而然return了
        for (int i = startIndex; i < nums.length; i++) {
            list.add(nums[i]);
            backTrack(nums,i+1);
            list.remove(list.size()-1);
        }
    }
}
```

## 子集||【LC 90题】

给你一个整数数组 `nums` ，其中**可能包含重复元素**，请你返回该数组所有可能的子集

解集 **不能** 包含重复的子集。返回的解集中，子集可以按 **任意顺序** 排列。

<aside>
💡 与上题的区别在于，上一题是不存在重复元素的，只用考虑startIndex一个去重操作就可以了，而本题的数组可能包含重复元素。

这道题相当于 子集1+组合总和||，按照组合总和||的方式来去除重复元素的影响就行。

</aside>

```java
package BackTrack;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class SubsetWithDup {
    List<List<Integer>> res = new ArrayList<>();
    List<Integer> list=new ArrayList<>();
    boolean []used;
    public List<List<Integer>> subsetsWithDup(int[] nums) {
        Arrays.sort(nums);
        used=new boolean[nums.length];
        backTrack(nums,0);
        return res;
    }

    private void backTrack(int[] nums, int startIndex) {
        res.add(new ArrayList<>(list));
        for (int i = startIndex; i < nums.length; i++) {
            if (i>0 && nums[i]==nums[i-1] && !used[i-1]) continue;	// 如果是同层的重复元素，跳过本次
            list.add(nums[i]);
            used[i]=true;
            backTrack(nums,i+1);
            used[i]=false;
            list.remove(list.size()-1);
        }
    }
}
```

## 递增子序列【LC 491题】

给你一个整数数组 `nums` ，找出并返回所有该数组中**不同**的递增子序列，递增子序列中 **至少有两个元素** 。你可以按 **任意顺序** 返回答案。

数组中可能含有重复元素，如出现两个整数相等，也可以视作递增序列的一种特殊情况。

<aside>
💡 这一题和组合总和||、子集||也类似，涉及树层的去重，但是这一题不需要排序，因为排序后递增子序列就会发生改变了。所以我们用集合/数组来记录这一层数字有没有出现，集合因为是hashset，占用空间比较大，又因为本题中数的范围确定所以可以使用数组来代替哈希表。

</aside>

```java
package BackTrack;

import java.util.ArrayList;
import java.util.List;

public class FindSubsequences {
    List<List<Integer>> res=new ArrayList<>();
    List<Integer> list=new ArrayList<>();
    public List<List<Integer>> findSubsequences(int[] nums) {
        backTrack(nums,0);
        return res;
    }

    private void backTrack(int[] nums, int startIndex) {
        if (list.size()>=2) res.add(new ArrayList<>(list));
        int[] used=new int[201];
        for (int i = startIndex; i < nums.length; i++) {
            // 如果这个数不满足递增 或者 这个数在这一层已经出现过 就跳过这个数 找到这一层的下一个数
            if (!list.isEmpty()&&nums[i]<list.get(list.size()-1) || used[nums[i]+100]==1) continue;
            used[nums[i]+100]=1;
            list.add(nums[i]);
            backTrack(nums,i+1);
            list.remove(list.size()-1);
        }
    }
}
```

## 全排列【LC 46题】

给定一个不含重复数字的数组 `nums` ，返回其 *所有可能的全排列* 。你可以 **按任意顺序** 返回答案。

<aside>
💡 这道题和之前不同点在于：之前求的都是组合，这道题求的是排列。

之前的组合问题我们使用startIndex来避免出现同样的组合，不同的排列；而排列问题就不需要了。我们使用used数组来标记树枝中我们使用过的元素，【因为这个数组不含有重复元素，所以可以直接判断list中含不含有当前元素】除了使用过的元素不能取，其他都可以。

在叶子节点收集结果【list中元素个数等于nums的元素个数】

</aside>

```java
package BackTrack;

import java.util.ArrayList;
import java.util.List;

public class Permute {
    List<List<Integer>> res=new ArrayList<>();
    List<Integer> list=new ArrayList<>();
    public List<List<Integer>> permute(int[] nums) {
        backTrack(nums);
        return res;
    }

    private void backTrack(int[] nums) {
        if (list.size()==nums.length){
            res.add(new ArrayList<>(list));
            return;
        }
        for (int i = 0; i < nums.length; i++) {
            if (list.contains(nums[i])) continue;		//如果树枝上这个元素已经用过了
            list.add(nums[i]);
            backTrack(nums);
            list.remove(list.size()-1);
        }
    }
}
```

## 全排列||【LC 47题】

给定一个可包含重复数字的序列 `nums` ，***按任意顺序*** 返回所有不重复的全排列。

<aside>
💡 上一题和这一题的区别在于，这一道题是可能包含重复元素的。

所以除了树枝上要做 不包含当前元素的去重；树层上也要做相同元素的去重【排列 判断当前元素和前一个是否相等 并且 used[i-1]=false表示是同一层的】

</aside>

```java
package BackTrack;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class PermuteUnique {
    List<List<Integer>> res=new ArrayList<>();
    List<Integer> list=new ArrayList<>();
    boolean[] used;
    public List<List<Integer>> permuteUnique(int[] nums) {
        used=new boolean[nums.length];
        Arrays.sort(nums);
        backTrack(nums);
        return res;
    }

    private void backTrack(int[] nums) {
        if (list.size()==nums.length){
            res.add(new ArrayList<>(list));
            return;
        }
        for (int i = 0; i < nums.length; i++) {
            if (i>0 && nums[i]==nums[i-1] && !used[i-1] || used[i]) continue;	//树层去重 和 树枝上使用过的数不能再使用
            list.add(nums[i]);
            used[i]=true;
            backTrack(nums);
            list.remove(list.size()-1);
            used[i]=false;
        }
    }
}
```

## N皇后【LC 51题】

按照国际象棋的规则，皇后可以攻击与之处在同一行或同一列或同一斜线上的棋子。

**n 皇后问题** 研究的是如何将 `n` 个皇后放置在 `n×n` 的棋盘上，并且使皇后彼此之间不能相互攻击。

给你一个整数 `n` ，返回所有不同的 **n 皇后问题** 的解决方案。

每一种解法包含一个不同的 **n 皇后问题** 的棋子放置方案，该方案中 `'Q'` 和 `'.'` 分别代表了皇后和空位。

<aside>
💡 递归参数：chessborad，当前递归到哪一行row，一共有多少行

递归返回条件：row==n；当递归到叶子节点，就可以收集结果并返回了

初始化所有位置都是`'.'`当前位置符合规则就可以放皇后`'Q'`，然后递归遍历下一行。

</aside>

```java
package BackTrack;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class SolveNQueens {
    List<List<String>> res=new ArrayList<>();
    public List<List<String>> solveNQueens(int n) {
        char[][] chessboard=new char[n][n];
        for (char[] chars : chessboard) {
            Arrays.fill(chars,'.');
        }
        backTrack(chessboard,0,n);
        return res;
    }

    private void backTrack(char[][] chessboard, int row, int n) {
        if (row==n){
            // 一次chessboard 转换成 List<String> 是一次结果
            res.add(Array2List(chessboard));
            return;
        }
        for (int col = 0; col < n; col++) {
            // 如果满足条件 就放置皇后 进行下一行的递归；如果不满足条件，就放在另一列
            if (isValid(row,col,n,chessboard)){
                chessboard[row][col]='Q';
                backTrack(chessboard,row+1,n);
                chessboard[row][col]='.';
            }
        }
    }

    //判断 chessboard[row][col]这个位置能不能放皇后
    private boolean isValid(int row, int col, int n, char[][] chessboard) {
        // 检查列
        for (int i = 0; i < row; i++) {
            if (chessboard[i][col]=='Q') return false;
        }
        // 检查45度对角线
        for (int i = row-1,j=col-1; i>=0 &&  j>=0; i--,j--) {
            if (chessboard[i][j]=='Q') return false;
        }
        // 检查135度对角线
        for (int i=row-1,j=col+1 ; i>=0&&j<n ;i--,j++){
            if (chessboard[i][j]=='Q') return false;
        }
        return true;
    }

    private List<String> Array2List(char[][] chessboard) {
        List<String> list=new ArrayList<>();
        for (char[] chs : chessboard) {
            list.add(String.copyValueOf(chs));
        }
        return list;
    }
}
```

## 解数独【LC 37题】

编写一个程序，通过填充空格来解决数独问题。

数独的解法需 **遵循如下规则**：

1. 数字 `1-9` 在每一行只能出现一次。
2. 数字 `1-9` 在每一列只能出现一次。
3. 数字 `1-9` 在每一个以粗实线分隔的 `3x3` 宫内只能出现一次。（请参考示例图）

数独部分空格内已填入了数字，空白格用 `'.'` 表示。

<aside>
💡 这道题和N皇后类似，都要找出合适的位置放置合适的数字。但是这道题每一个格子都需要放数字，因此采用二维递归。

</aside>

```java
package BackTrack;

public class SolveShuDu {
    public void solveSudoku(char[][] board) {
        backTrack(board);
    }

    private boolean backTrack(char[][] board) {
        for (int i = 0; i < board.length; i++) {
            for (int j = 0; j < board[0].length; j++) {
                if (board[i][j]!='.') continue;     //已经有数字了
                for (char ch='1';ch<='9';ch++){    //每一个位置 9个字符都试一试
                    if (isValid(i,j,ch,board)){ //如果这个位置可行
                        board[i][j]=ch;
                        if (backTrack(board)) return true;  //如果这个位置可行，返回true
                        board[i][j]='.';
                    }
                }
                return false;   //九个数都试完了还不行，说明这种方式不行，递归返回前面，回溯重试
            }
        }
        return true;
    }

    // 判断board[row][col]能不能放ch字符
    private boolean isValid(int row, int col, char ch, char[][] board) {
        //判断行上有没有重复的
        for (int i = 0; i < col; i++) {
            if (board[row][i]==ch) return false;
        }
        //判断列上有没有重复的
        for (int i = 0; i < row; i++) {
            if (board[i][col]==ch) return false;
        }
        //判断九宫格上有没有重复的
        int startRow=(row/3)*3;
        int startCol=(col/3)*3;
        for (int i = startRow; i < startRow+3; i++) {
            for (int j=startCol;j<startCol+3;j++){
                if (board[i][j]==ch) return false;
            }
        }
        return true;
    }
}
```

## 括号生成【LC 22题】

数字 `n` 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 **有效的** 括号组合。

<aside>
💡

</aside>

```java
class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> res=new ArrayList<>();
        dfs(res,new StringBuilder(),0,0,n);
        return res;
    }

    public void dfs(List<String> res,StringBuilder cur,int open,int end,int max){
        if(cur.length()==max*2){
            res.add(cur.toString());
            return;
        }
        if(open<max){
            cur.append('(');
            dfs(res,cur,open+1,end,max);
            cur.deleteCharAt(cur.length()-1);
        }
        if(end<open){
            cur.append(')');
            dfs(res,cur,open,end+1,max);
            cur.deleteCharAt(cur.length()-1);
        }
    }
}
```