---
date: 2024-08-29
category:
  - 刷题笔记
tag:
  - 双指针
---

# 双指针

## 移动零【LC 283题】

给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。
请注意 ，必须在不复制数组的情况下原地对数组进行操作。

> 💡 使用一个开始的指针flag来记录下一个非零元素放置的位置。遍历数组，如果数不为0，那么交换它开始元素的位置，并使flag++。


```java
class Solution {
    public void moveZeroes(int[] nums) {
        int flag=0;
        for(int i=0;i<nums.length;i++){
            if(nums[i]!=0){
                int temp=nums[i];
                nums[i]=nums[flag];
                nums[flag]=temp;
                flag++;
            }
        }
    }
}
```

## 盛最多水的容器【LC 11题】

给定一个长度为 `n` 的整数数组 `height` 。有 `n` 条垂线，第 `i` 条线的两个端点是 `(i, 0)` 和 `(i, height[i])` 。

找出其中的两条线，使得它们与 `x` 轴共同构成的容器可以容纳最多的水。

返回容器可以储存的最大水量。

**说明：**你不能倾斜容器。

> 💡 使用两个指针left和right分别记录左边的线和右边的线，while(left<right)就一直遍历，不断更新maxArea，让两个指针中高度较小的那个往里移，来获得更大的盛水面积


```java
class Solution {
    public int maxArea(int[] height) {
        int left=0,right=height.length-1;
        int maxArea=0;
        while(left<right){
            maxArea=Math.max(maxArea,Math.min(height[left],height[right])*(right-left));
            if(height[left]<=height[right]) left++;
            else right--;
        }
        return maxArea;
    }
}
```

## 三数之和【LC 15题】

给你一个整数数组 `nums` ，判断是否存在三元组 `[nums[i], nums[j], nums[k]]` 满足 `i != j`、`i != k` 且 `j != k` ，同时还满足 `nums[i] + nums[j] + nums[k] == 0` 。请你返回所有和为 `0` 且不重复的三元组。

注意：答案中不可以包含重复的三元组。

> 大体思路就是先对数组进行排序，确定第一个元素的位置，如果第一个元素已经大于0了，直接结束。
> 
> 
> 📢注意：如果第一个元素在下一次遍历和上次的第一个元素相同需要跳过。当满足条件时，先加入结果集，然后需要跳过后面两个元素遍历相同的情况
> 
> 还要注意：left必须添加上 left>i+1 这个条件才能跳过，确认left是和上一个left元素相等才跳过，而不是和第一个确定的元素相等。
> 

```java
class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        List<List<Integer>> res=new ArrayList<>();
        Arrays.sort(nums);
        for(int i=0;i<nums.length-2;i++){
            if(nums[i]>0) return res;   //直接返回
            if(i>0 && nums[i]==nums[i-1]) continue;
            int left=i+1,right=nums.length-1;
            while(left<right){
                int sum=nums[i]+nums[left]+nums[right];
                if(sum>0) right--;
                else if(sum<0) left++;
                else {res.add(Arrays.asList(nums[i],nums[left],nums[right])); left++; right--;}
                while(left<right && left>i+1 && nums[left]==nums[left-1]) left++;
                while(left<right && right<nums.length-1 && nums[right]==nums[right+1]) right--;
            }
        }
        return res;
    }
}
```

## 接雨水【LC  42题】

给定 `n` 个非负整数表示每个宽度为 `1` 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。


> 💡 用sum来记录所有柱子存储的雨水。**每个块能接的雨水=1*min(左边的最高值，右边的最高值)-当前高度【重点】**

```java
class Solution {
    public int trap(int[] height) {
        int []maxLeft=new int[height.length];
        int []maxRight=new int[height.length];
        int sum=0;
        for(int i=0;i<height.length;i++){
            if(i>0) maxLeft[i]=Math.max(maxLeft[i-1],height[i]);
            else maxLeft[i]=height[i];
        }
        for(int i=height.length-1;i>=0;i--){
            if(i==height.length-1) maxRight[i]=height[i];
            else maxRight[i]=Math.max(height[i],maxRight[i+1]);
        }
        for(int i=0;i<height.length;i++){
            sum+=Math.min(maxLeft[i],maxRight[i])-height[i];
        }
        return sum;
    }
}
```