---
date: 2024-08-28
category:
  - 刷题笔记
tag:
  - 哈希表
---

# 哈希表

## 两数之和【LC 1题】

给定一个整数数组 `nums` 和一个整数目标值 `target`，请你在该数组中找出 **和为目标值** `*target*` 的那 **两个** 整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

你可以按任意顺序返回答案。

<aside>
💡 解题思路：找出nums[i]以及另一个target-nums[i]的数。因为要返回数组下标，所以使用哈希表，key存nums值，value存下标值。

</aside>

```java
package hash;

import java.util.HashMap;

public class TwoSum {
    public int[] twoSum(int[] nums, int target) {
        HashMap<Integer,Integer> map=new HashMap();
        for (int i = 0; i < nums.length; i++) {
            if (map.containsKey(target-nums[i])){
                return new int[]{i,map.get(target-nums[i])};
            }
            map.put(nums[i],i);
        }
        return null;	//不要忘记写最后的return
    }
}
```

## 三数之和【LC 15题】

给你一个整数数组 `nums` ，判断是否存在三元组 `[nums[i], nums[j], nums[k]]` 满足 `i != j`、`i != k` 且 `j != k` ，同时还满足 `nums[i] + nums[j] + nums[k] == 0` 。请你返回所有和为 `0` 且不重复的三元组。

**注意：**答案中不可以包含重复的三元组。

> 使用双指针，先排序，确认第一个元素，剩下两个使用双指针，一个从前往后，一个从后往前。
> 
> 
> 注意剪枝的条件：
> 
> 1. 当第一个元素大于0时，剩下肯定不符合条件了，直接返回
> 2. 剩下就要考虑去除重复的三元祖。
>     1. 条件一：遍历到下一个 第一个元素，和上次遍历的第一个元素一致【为什么不是这次遍历的第一个元素下一次遍历的第一个元素相同：因为下一次遍历的第一个元素可能在结果数组中】
>     2. 后面两个指针指向元素的去重方式也一致

<aside>
💡 解题步骤：

第一个元素下标从0开始到nums.length-3

每次遍历一次i，如果当前nums[i]==nums[i-1]，跳过本次循环。否则重新确定left和right的初始值，当left<right时，确认是否有满足条件的三元组。

只有sum==0的时候需要强制剪枝，其他情况进入下次循环就行。

</aside>

<aside>
💡 api记录：新建含有几个数的list：Arrays.asList(int ,int ,int )

</aside>

```java
package hash;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ThreeSum {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        for (int i = 0; i < nums.length - 2; i++) {
            if (nums[i] > 0) return res;
            if (i > 0 && nums[i] == nums[i - 1]) continue; //跳过这次循环
            int left = i + 1, right = nums.length - 1;
            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];
                // 这里注意：只有sum==0符合条件的时候，才需要强制剪枝，其他的再走一次循环就可以
                if (sum > 0) right--;
                else if (sum < 0) left++;
                else {
                    res.add(Arrays.asList(nums[i], nums[left++], nums[right--]));
                    while (left < right && nums[left] == nums[left - 1]) left++;
                    while (left < right && nums[right] == nums[right + 1]) right--;
                }
            }
        }
        return res;
    }
}
```

## 字母异位词分组【LC 49题】

给你一个字符串数组，请你将 **字母异位词** 组合在一起。可以按任意顺序返回结果列表。

**字母异位词** 是由重新排列源单词的所有字母得到的一个新单词

<aside>
💡 这里我们使用hashmap，用key记录所有字符串按照字符升序排列的样子，value记录对应字符串的集合。
这道题主要是方法api的名称要记住，map用put，list用add，字符串变字符数组用toCharArray，字符数组变字符串用String.valueOf。

</aside>

```java
class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        HashMap<String,List<String>> map=new HashMap<>();
        for(String str:strs){
            char []chs=str.toCharArray();
            Arrays.sort(chs);
            String temp=String.valueOf(chs);
            map.putIfAbsent(temp,new ArrayList<>());
            map.get(temp).add(str);
        }
        return new ArrayList<>(map.values());
    }
}
```

## 最长连续序列【LC 128题】

给定一个未排序的整数数组 nums ，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。

请你设计并实现时间复杂度为 O(n) 的算法解决此问题。

<aside>
💡 先使用一个HashSet遍历数组，记录下所有不重复的元素
然后遍历数组，记录全局变量最长连续序列长度和当前最长序列，如果set中不包含这个数字的前一个，就从这个数字开始记录
注意！只有set不包含这个数字的前一个才开始计数和更新最长连续序列长度！！

</aside>

```java
class Solution {
    public int longestConsecutive(int[] nums) {
        Set<Integer> set = new HashSet<>();
        for (int num : nums){
            set.add(num);
        }
        int max = 0;
        for (int num : set){
            if (!set.contains(num - 1)){
                int curNum = num;  //要用一个暂时变量 记录当时的num
                int curLen = 1;
                while (set.contains(curNum + 1)){
                    curNum++;
                    curLen++;
                }
                max = Math.max(max, curLen);
            }
        }
        return max;
    }
}
```

## 有效的字母异位词【LC 242题】

给定两个字符串 `*s*` 和 `*t*` ，编写一个函数来判断 `*t*` 是否是 `*s*` 的字母异位词。

**注意：**若 `*s*` 和 `*t*` 中每个字符出现的次数都相同，则称 `*s*` 和 `*t*` 互为字母异位词。

<aside>
💡 平时用到的哈希结构有三种：数组、set、hashmap。

使用场景总结：

1、哈希的范围可控且比较小的情况下，就用数组

2、数值很大的情况，用set

3、如果是key-value结构，用HashMap

</aside>

<aside>
💡 本道题中，限制了是小写字母，所以可以用数组来代替哈希表，数组下标表示字母，数组值表示字母出现的次数

</aside>

```java
package hash;

public class isAnagram {
    public boolean isAnagram(String s, String t) {
        if (s.length()!=t.length()) return false;
        int []map=new int[26];
        for (char c : s.toCharArray()) {
            map[c-97]++;
        }
        for (char c : t.toCharArray()) {
            map[c-97]--;
        }
        for (int i : map) {
            if (i!=0) return false;
        }
        return true;
    }
}
```

## 两个数组的交集【LC 349题】

给定两个数组 `nums1` 和 `nums2` ，返回 *它们的 交集* 。输出结果中的每个元素一定是 **唯一** 的。我们可以 **不考虑输出结果的顺序** 。

<aside>
💡 我们得出的结果需要去重。

先用一个集合装第一个数组中的元素，然后遍历第二个数组，如果集合中存在第二个数组中的元素，则加入结果列表，之后，为了避免重复，删除集合中的该元素。

</aside>

```java
package hash;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

public class InterSection {
    public int[] intersection(int[] nums1, int[] nums2) {
        Set<Integer> set=new HashSet<>();
        ArrayList<Integer> res=new ArrayList<>();
        for (int i : nums1) {
            set.add(i);
        }
        for (int i : nums2) {
            if (set.contains(i)){
                res.add(i);
                set.remove(i);
            }
        }
        return res.stream().mapToInt(Integer::intValue).toArray();
    }
}
```

## 四数相加||【LC 454题】

给你四个整数数组 `nums1`、`nums2`、`nums3` 和 `nums4` ，数组长度都是 `n` ，请你计算有多少个元组 `(i, j, k, l)` 能满足：

- `0 <= i, j, k, l < n`
- `nums1[i] + nums2[j] + nums3[k] + nums4[l] == 0`

<aside>
💡 这道题是变相的两数之和，这题把前两个和后两个数组放在一起相加，第一步需要把前两个数组之和保存到hashmap中，然后再检查后面两个数组之和有没有满足条件的。这题和四数之和的区别在于，我们不需要考虑去重，是在四个数组中分别找四个数字相加为0就行。使用HashMap的原因：

1. 这一题中出现的数字范围是全体int数，范围大，不适合用数组

2.这一题的解题思路在于统计(a+b)出现的次数，如果(c+d)的结果等于0-(a+b)，则符合要求。两个数组一起计算，这样时间复杂度为On^2

</aside>

```java
package hash;

import java.util.HashMap;

public class FourSumCount {
    public int fourSumCount(int[] nums1, int[] nums2, int[] nums3, int[] nums4) {
        int result=0;
        HashMap<Integer,Integer> map=new HashMap<>();
        // 先存 第一个数组元素和第二个数组元素的和，以及它们出现的次数
        for (int i : nums1) {
            for (int j : nums2) {
                map.put(i+j,map.getOrDefault(i+j,0)+1);
            }
        }
        // 然后判断第二个数组元素和第三个数组元素的和，有没有满足条件的
        for (int i : nums3) {
            for (int j : nums4) {
                if (map.containsKey(-i-j)) result+=map.get(-i-j);
            }
        }
        return result;
    }
}
```

## 四数之和【LC 18题】

给你一个由 `n` 个整数组成的数组 `nums` ，和一个目标值 `target` 。请你找出并返回满足下述全部条件且**不重复**的四元组 `[nums[a], nums[b], nums[c], nums[d]]` （若两个四元组元素一一对应，则认为两个四元组重复）：

- `0 <= a, b, c, d < n`
- `a`、`b`、`c` 和 `d` **互不相同**
- `nums[a] + nums[b] + nums[c] + nums[d] == target`

你可以按 **任意顺序** 返回答案 。

<aside>
💡 这道题和三数之和类似，确定前两个数字，后面两个位置用双指针，一个从前往后遍历，一个从后往前遍历。

剪枝的操作要注意，判断第一个数字大于0才能剪枝。

不要忘记排序！！！！

</aside>

```java
package hash;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class FourSum {
    public List<List<Integer>> fourSum(int[] nums, int target) {
        List<List<Integer>> res=new ArrayList<>();
        Arrays.sort(nums);  //别忘了排序！！！
        for (int i = 0; i < nums.length-3; i++) {
            if (nums[i]>0 && nums[i]>=target) continue; //不可能的剪枝
            if (i>0 && nums[i]==nums[i-1]) continue;    //去重剪枝
            for (int j = i+1; j < nums.length-2; j++) {
                if (j>i+1 && nums[j]==nums[j-1]) continue;    //去重剪枝
                int left=j+1,right=nums.length-1;
                while (left<right){
                    int sum=nums[i]+nums[j]+nums[left]+nums[right];
                    if (sum<target) left++;
                    else if (sum>target) right--;
                    else {
                        res.add(Arrays.asList(nums[i],nums[j],nums[left++],nums[right--]));
                        while (left<right && nums[left]==nums[left-1]) left++;
                        while (left<right && nums[right]==nums[right+1]) right--;
                    }
                }
            }
        }
        return res;
    }
}
```
