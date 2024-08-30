---
date: 2024-08-28
category:
  - 刷题笔记
tag:
  - 数组
---

# 数组

## 二分查找【LC 704题】

> 我们一般定义查找区间的时候，要么是左闭右开[left,right)，要么是左闭右闭[left,right]。
> 
> 
> 在修改区间范围的时候，一定要坚持这个区间的开闭准则
> 
1. 左闭右闭[left,right]的写法

```java
package Array;

public class Search {
    //左闭右闭写法
    public int search(int[] nums, int target) {
        int left=0,right=nums.length-1;
        while (left<=right){    //注意点一：由于是左闭右闭区间，所以当left=right时，区间内还有元素
            int mid=(left+right)/2;
            if (nums[mid]==target) return mid;  
            // 注意点二 如果mid不符合条件，从区间内剔除
            else if (nums[mid]>target) right=mid-1; 
            else left=mid+1;
        }
        return -1;
    }
}
```

1. 左闭右开[left,right)的写法

```java
package Array;

public class Search {
    //左闭右开写法
    public int search2(int []nums,int target){
        int left=0,right=nums.length;
        while (left<right){     //注意点一：因为是左闭右开区间，所以只有当left小于right的时候，区间内才有元素
            int mid=(left+right)/2;
            if (nums[mid]==target) return mid;
            //注意点二：由于右边是开，不包含right这个元素，所以这里的更新right=mid
            else if (nums[mid]>target) right=mid;
            else left=mid+1;
        }
        return -1;
    }
}
```

## 合并两个有序数组【LC 88题】

🏷  双指针

给你两个按 **非递减顺序** 排列的整数数组 `nums1` **和 `nums2`，另有两个整数 `m` 和 `n` ，分别表示 `nums1` 和 `nums2` 中的元素数目。

请你 **合并** `nums2` **到 `nums1` 中，使合并后的数组同样按 **非递减顺序** 排列。

**注意：**最终，合并后数组不应由函数返回，而是存储在数组 `nums1` 中。为了应对这种情况，`nums1` 的初始长度为 `m + n`，其中前 `m` 个元素表示应合并的元素，后 `n` 个元素为 `0` ，应忽略。`nums2` 的长度为 `n` 。

<aside>
💡 用双指针遍历两个数组没啥好说的，关键可以从后往前遍历来不使用额外空间

</aside>

```java
class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        int i=m-1,j=n-1;
        int index=m+n-1;
        while(i>=0 && j>=0){
            if(nums1[i]>=nums2[j]){
                nums1[index--]=nums1[i--];
            }else{
                nums1[index--]=nums2[j--];
            }
        }
        while(i>=0) nums1[index--]=nums1[i--];
        while(j>=0) nums1[index--]=nums2[j--];
    }
}
```

## 移除元素【LC 27题】

🏷 双指针

给你一个数组 `nums` 和一个值 `val`，你需要 [**原地**](https://baike.baidu.com/item/%E5%8E%9F%E5%9C%B0%E7%AE%97%E6%B3%95) 移除所有数值等于 `val` 的元素。元素的顺序可能发生改变。然后返回 `nums` 中与 `val` 不同的元素的数量。

假设 `nums` 中不等于 `val` 的元素数量为 `k`，要通过此题，您需要执行以下操作：

- 更改 `nums` 数组，使 `nums` 的前 `k` 个元素包含不等于 `val` 的元素。`nums` 的其余元素和 `nums` 的大小并不重要。
- 返回 `k`。

<aside>
💡 什么时候用库函数，什么时候不用？

如果这道题使用库函数一行代码就解决了，那肯定不是考察我们使用库函数的技巧aaa

如果使用库函数只是我们解题步骤中的一步，使用库函数。

解决方法：双指针【用一个指针一直往前走，判断当前元素是否需要保存下来；另一个指针维护当前保存的位置】

</aside>

```java
package Array;

public class RemoveElement {
    public int removeElement(int[] nums, int val) {
        int slow=0;
        for (int i = 0; i < nums.length; i++) {
            if (nums[i]!=val){
                nums[slow++]=nums[i];
            }
        }
        return slow;
    }
}
```

## 有序数组的平方【LC 977题】

🏷 双指针

给你一个按 **非递减顺序** 排序的整数数组 `nums`，返回 **每个数字的平方** 组成的新数组，要求也按 **非递减顺序**排序。

<aside>
💡 用On时间复杂度解决问题。

【平方数大的值在数组的两侧，用双指针分别从左右两侧往中间靠拢】

代码细节点：因为得出来的是较大的值，所以result数组要从大到小(从右往左)遍历

</aside>

```java
package Array;

public class sortedArray {
    public int[] sortedSquares(int[] nums) {
        int []result=new int[nums.length];
        int left=0,right=nums.length-1;
        int i=nums.length-1;
        while (left<=right){
            if (nums[left]*nums[left]>nums[right]*nums[right]){result[i--]=nums[left]*nums[left]; left++;}
            else {result[i--]=nums[right]*nums[right]; right--;}
        }
        return result;
    }
}
```

## 长度最小的子数组【LC 209题】

🏷 滑动窗口、双指针

给定一个含有 `n` 个正整数的数组和一个正整数 `target` **。**

找出该数组中满足其总和大于等于 `target` 的长度最小的 **子数组**

`[numsl, numsl+1, ..., numsr-1, numsr]` ，并返回其长度**。**如果不存在符合条件的子数组，返回 `0`

<aside>
💡 暴力解法：两个for循环，外层遍历开始位置，里层遍历结束位置。时间复杂度On^2

滑动窗口解法：遍历结束位置。如果[初始位置，结束位置]子数组之和大于等于target，则收缩起始位置。

关键点：

1. 结束位置往后移的时候，初始位置不需要[回头]，因为靠右的结束位置所匹配的初始位置，不会比靠左的结束位置所匹配的初始位置，更靠右。
2. 当满足sum>=target的时候，就把left++就好，因为下一个结束位置匹配的初始位置一定在这个初始位置后面。
</aside>

```java
package Array;

public class MinSubArrayLen {
    public int minSubArrayLen(int target, int[] nums) {
        int left=0;
        int minLen=Integer.MAX_VALUE;
        int sum=0;
        for (int right = 0; right < nums.length; right++) {
            sum+=nums[right];
            while (sum>=target){
                minLen=Math.min(minLen,right-left+1);
                sum-=nums[left++];
            }
        }
        return minLen==Integer.MAX_VALUE ? 0 : minLen;
    }
}
```

## 和为k的子数组【LC 560题】

🏷 前缀和

给你一个整数数组 `nums` 和一个整数 `k` ，请你统计并返回 *该数组中和为 `k` 的子数组的个数* 。

子数组是数组中元素的连续非空序列。

<aside>
💡 使用前缀和来解决问题

这道题相对于 路径总和|||简单之处在于，那道题是树形前缀和，需要使用回溯来去除当前节点的影响，回到上一层。这道题只用线性遍历完就可以了。哈希表来记录前缀和出现的次数。

> 问：为什么代码中要先更新 res，再更新 map？这两行代码能否交换一下？
> 
> 
> 答：不行，这会在 k=0 的时候算错。例如 nums=[2], k=0，正确答案应该是 0，但如果先把 map[2] 加一，再把 map[2] 加到 ans 中，最后返回的 ans 就不是 0 了。
> 
</aside>

```java
package Array;

import java.util.HashMap;

public class SubarraySum {
    public int subarraySum(int[] nums, int k) {
        int res=0;
        int preSum=0;
        HashMap<Integer,Integer> map=new HashMap<>();
        map.put(0,1);
        for (int num : nums) {
            // 当前节点的前缀和
            preSum+=num;
            // 找当前节点和之前节点形成的路径
            res=res+map.getOrDefault(preSum-k,0);
            map.put(preSum,map.getOrDefault(preSum,0)+1);
        }
        return res;
    }
}
```

## 最大子数组和【LC 53题】

🏷 动态规划

给你一个整数数组 `nums` ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

**子数组**是数组中的一个连续部分。

<aside>
💡 用全局变量res来记录最终结果。dp[i]表示以nums[i]结尾的最大和的连续子数组。【看要不要加上前一个最大连续子数组】

</aside>

```java
class Solution {
    public int maxSubArray(int[] nums) {
        int res=nums[0];
        int dp=nums[0];
        for(int i=1;i<nums.length;i++){
            dp=Math.max(dp+nums[i],nums[i]);
            res=Math.max(res,dp);
        }
        return res;
    }
}
```

## 合并区间【LC 56题】

以数组 `intervals` 表示若干个区间的集合，其中单个区间为 `intervals[i] = [starti, endi]` 。请你合并所有重叠的区间，并返回 *一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间* 。

<aside>
💡 把所有区间按照start从小到大排序。先用list记录结果，如果下一个的开始小于等于这一个结尾，则更新end为这一个区间和下一个区间end的较大值；如果下一个的开始大于这一个的结尾，这把上一个区间加入结果数组。注意最后遍历完成后，将最后一个结果加入list。然后创建一个二维数组，把list的结果放入二维数组中。

</aside>

```java
class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals,(v1,v2)->v1[0]-v2[0]);
        ArrayList<int []> list=new ArrayList<>();
        int begin=intervals[0][0];
        int end=intervals[0][1];
        for(int i=1;i<intervals.length;i++){
            if(intervals[i][0]<=end){
                end=Math.max(end,intervals[i][1]);
            }else{
                list.add(new int[]{begin,end});
                begin=intervals[i][0];
                end=intervals[i][1];
            }
        }
        list.add(new int[]{begin,end});
        int [][]res=new int[list.size()][2];
        for(int i=0;i<list.size();i++){
            res[i][0]=list.get(i)[0];
            res[i][1]=list.get(i)[1];
        }
        return res;
    }
}
```

## 轮转数组【LC 189题】

给定一个整数数组 `nums`，将数组中的元素向右轮转 `k` **个位置，其中 `k` **是非负数。

<aside>
💡 先反转前nums.length-k个数，再反转后k个数，然后再把整个数组反转

</aside>

<aside>
💡 最要注意的点！题目只是说了k是非负数，所以我们需要把k对nums.length取余！！！

</aside>

```java
class Solution {
    public void rotate(int[] nums, int k) {
        k=k%nums.length;   //非常重要！！ 不要忘了这里
        reverse(nums,0,nums.length-k-1);
        reverse(nums,nums.length-k,nums.length-1);
        reverse(nums,0,nums.length-1);
        return;
    }

    public void reverse(int []nums,int left,int right){ //左闭右闭
        while(left<right){
            int temp=nums[left];
            nums[left++]=nums[right];
            nums[right--]=temp;
        }
    }
}
```

## 除自身以外数的乘积【LC 238题】

给你一个整数数组 `nums`，返回 数组 `answer` ，其中 `answer[i]` 等于 `nums` 中除 `nums[i]` 之外其余各元素的乘积 。

题目数据 **保证** 数组 `nums`之中任意元素的全部前缀元素和后缀的乘积都在  **32 位** 整数范围内。

请 **不要使用除法，**且在 `O(n)` 时间复杂度内完成此题。

<aside>
💡 先从左往右遍历，记录数字左边的乘积。再从右往左遍历，乘上数字右边的乘积。返回最终结果

</aside>

```java
class Solution {
    public int[] productExceptSelf(int[] nums) {
        int []res=new int[nums.length];
        // 该数左边数的乘积
        int left=1;
        for(int i=0;i<nums.length;i++){
            res[i]=left;
            left=left*nums[i];
        }
        int right=1;
        for(int i=nums.length-1;i>=0;i--){
            res[i]*=right;
            right=right*nums[i];
        }
        return res;
    }
}
```

## 缺失的第一个正数【LC 41题】

给你一个未排序的整数数组 `nums` ，请你找出其中没有出现的**最小的正整数**。

请你实现时间复杂度为O(n)，并且只使用常数级别额外空间的解决方案。

<aside>
💡 数组的长度n确定了没有出现的最小正整数范围为 [1,n]

因此我们先遍历数组，如果数组在[1,n]这个范围内，就把这个数放到正确位置上。然后再次遍历数组，找到第一个不等于i+1的位置。

</aside>

<aside>
💡 📢注意！：只有只有这个位置的数 在它该在的地方 才让i++。说明不需要判断这个位置了。不然交换过来的数还需要判断，因此不能让i++

</aside>

```java
class Solution {
    public int firstMissingPositive(int[] nums) {
        int len=nums.length;
        int i=0;
        while(i<nums.length){
            int val=nums[i];
            // 确定val在1~len这个范围内
            // 确定两个位置放的都不对 当前位置放的不对 即将交换的位置放的也不对
            if(val>0 && val<=len && nums[val-1]!=val && nums[i]!=i+1){
                swap(nums,i,val-1);
            }else{  // 只有这个位置的数 在它该在的地方 才让i++。说明不需要判断这个位置了
                i++;
            }
        }
        for(i=0;i<nums.length;i++){
            if(nums[i]!=i+1) return i+1;
        }
        return len+1;
    }

    public void swap(int []nums,int left,int right){
        int temp=nums[left];
        nums[left]=nums[right];
        nums[right]=temp;
    }
}
```

## H指数【LC 274题】

给你一个整数数组 `citations` ，其中 `citations[i]` 表示研究者的第 `i` 篇论文被引用的次数。计算并返回该研究者的 **`h` **指数**。

根据维基百科上 [h 指数的定义](https://baike.baidu.com/item/h-index/3991452?fr=aladdin)：`h` 代表“高引用次数” ，一名科研人员的 `h` **指数** 是指他（她）至少发表了 `h` 篇论文，并且 **至少** 有 `h` 篇论文被引用次数大于等于 `h` 。如果 `h` **有多种可能的值，**`h` 指数** 是其中最大的那个。

<aside>
💡 即找到一个数h：数组中至少有h个数大于等于h。

</aside>

<aside>
💡 解法：用一个count数组记录：count数组中的下标记录i当前元素超过i的元素个数。设citations数组长度为n，count数组下标为n+1，即可0~n，引用次数超过n的论文将count[n]++即可。再从右往左遍历，直到前面的count数组元素之和大于count下标，返回count下标。

</aside>

```java
class Solution {
    public int hIndex(int[] citations) {
        int len=citations.length;
        int []count=new int[len+1];
        for(int num:citations){
            int index=Math.min(len,num);
            count[index]++;
        }
        int sum=0;
        for(int i=len;i>=0;i--){
            sum+=count[i];
            if(sum>=i)  return i;
        }
        return 0;
    }
}
```

## H指数||【LC 275题】

给你一个整数数组 `citations` ，其中 `citations[i]` 表示研究者的第 `i` 篇论文被引用的次数，`citations` 已经按照 **升序排列** 。计算并返回该研究者的 h ******指数。

[h 指数的定义](https://baike.baidu.com/item/h-index/3991452?fr=aladdin)：h 代表“高引用次数”（high citations），一名科研人员的 `h` 指数是指他（她）的 （`n` 篇论文中）**至少** 有 `h` 篇论文分别被引用了**至少** `h` 次。

请你设计并实现对数时间复杂度的算法解决此问题。

<aside>
💡 和上题一样，找到数组中至少有h个数大于等于h。只不过这道题的citations数组为升序的。由于H指数是有单调性质的

【如果至少有2篇论文的引用次数≥2，那么也必然有至少 1篇论文的引用次数≥1。
如果没有4篇论文的引用次数≥4，那么也必然没有5篇论文的引用次数≥5。】所以可以考虑用二分法来优化时间复杂度。

二分查找的关键点：循环不变量。我们使用左闭右闭区间，【1，n】，每次循环结束，left-1是「确定」的最大符合条件的数，因此最后返回right(left-1)

</aside>

```java
class Solution {
    public int hIndex(int[] citations) {
        int len=citations.length;
        int left=1,right=len;
        while(left<=right){
            int mid=(left+right)>>>1;
            if(citations[len-mid]>=mid){    //mid满足，尝试扩大
                left=mid+1;  // left-1 是这次循环结束后确定满足条件的最大值
            }else{  //mid 不满足，往左做小待选值
                right=mid-1;    // left-1=0 是这次循环结束后确定满足条件的最大值
            }
        }
        return right;
    }
}
```

## 加油站【LC 134题】

在一条环路上有 `n` 个加油站，其中第 `i` 个加油站有汽油 `gas[i]` **升。

你有一辆油箱容量无限的的汽车，从第 **`i` **个加油站开往第 **`i+1` **个加油站需要消耗汽油 `cost[i]` **升。你从其中的一个加油站出发，开始时油箱为空。

给定两个整数数组 `gas` 和 `cost` ，如果你可以按顺序绕环路行驶一周，则返回出发时加油站的编号，否则返回 `-1` 。如果存在解，则 **保证** 它是 **唯一** 的。

**示例 1:**

```
输入: gas = [1,2,3,4,5], cost = [3,4,5,1,2]
输出: 3
解释:
从 3 号加油站(索引为 3 处)出发，可获得 4 升汽油。此时油箱有 = 0 + 4 = 4 升汽油
开往 4 号加油站，此时油箱有 4 - 1 + 5 = 8 升汽油
开往 0 号加油站，此时油箱有 8 - 2 + 1 = 7 升汽油
开往 1 号加油站，此时油箱有 7 - 3 + 2 = 6 升汽油
开往 2 号加油站，此时油箱有 6 - 4 + 3 = 5 升汽油
开往 3 号加油站，你需要消耗 5 升汽油，正好足够你返回到 3 号加油站。
因此，3 可为起始索引。
```

<aside>
💡 题目的场景相当于 假设油箱中的油为一个环形数组，环形数组的值为gas-cost，我们尝试遍历所有地点，看能不能有一种遍历方式，使得环形数组的每一个值都大于等于0。【start=环形数组的最低点+1】从这里开始。遍历结束后，如果sum<0，就直接返回-1，如果消耗总和大于加油总和，是不可能有解的。其他情况：如果start==n,说明从第0个加油站出发。

</aside>

```java
class Solution {
    public int canCompleteCircuit(int[] gas, int[] cost) {
        int len=gas.length;
        int sum=0,minSum=0; //记录最低点
        int start=0;
        for(int i=0;i<len;i++){
            sum+=gas[i];
            sum-=cost[i];
            if(sum<minSum){
                minSum=sum;
                start=i+1;
            }
        }
        if(sum<0)   return -1;
        return start==len ? 0 : start;
    }
}
```