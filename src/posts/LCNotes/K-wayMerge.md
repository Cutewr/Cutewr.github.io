---
date: 2024-08-30
category:
  - 刷题笔记
tag:
  - 归并算法
  - 堆
---

# 多路归并

## 合并两个有序链表【LC 21题】

将两个升序链表合并为一个新的 **升序** 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。

> 多路归并的开胃菜：2路归并，找到两个链表中较小的那一个，加入新链表中。

```java
class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy=new ListNode(0);
        ListNode cur=dummy;
        ListNode node1=list1,node2=list2;
        while(node1!=null && node2!=null){
            if(node1.val<node2.val){
                cur.next=node1;
                node1=node1.next;
            }else{
                cur.next=node2;
                node2=node2.next;
            }
            cur=cur.next;
        }
        cur.next= node1==null ? node2 : node1;
        return dummy.next;
    }
}
```

## 合并K个升序链表【LC 23题】

给你一个链表数组，每个链表都已经按升序排列。

请你将所有链表合并到一个升序链表中，返回合并后的链表。

> 完全是多路归并形式，已经给出k个有序链表了。

> 多路归并套路：得出多个有序队列，先把多个有序队列中的第一个值放入小根堆中，不断弹出堆顶，如果堆顶元素在队列中存在后续元素，再把后续元素放入堆中。直到堆为空

```java
class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        ListNode dummy=new ListNode(0);
        ListNode cur=dummy;
        PriorityQueue<ListNode> pq=new PriorityQueue<>((a,b)->a.val-b.val);
        for(ListNode head:lists){
            if(head!=null) pq.offer(head);
        }
        while(!pq.isEmpty()){
            ListNode temp=pq.poll();
            cur.next=temp;
            if(temp.next!=null) pq.offer(temp.next);
            cur=cur.next;
        }
        return dummy.next;
    }
}
```

## 第K个数【LC 面试题 17.09】

有些数的素因子只有 3，5，7，请设计一个算法找出第 k 个数。注意，不是必须有这些素因子，而是必须不包含其他的素因子。例如，前几个数按顺序应该是 1，3，5，7，9，15，21。

> 和下面的「丑数||」完全一致，同样是给定数量的素因子，我们用Math.min记录就好。

```java
class Solution {
    public int getKthMagicNumber(int k) {
        int []res=new int[k];
        res[0]=1;
        for(int i3=0,i5=0,i7=0,idx=1;idx<k;idx++){
            int a=res[i3]*3;
            int b=res[i5]*5;
            int c=res[i7]*7;

            int min=Math.min(a,Math.min(b,c));
            if(min==a) i3++;
            if(min==b) i5++;
            if(min==c) i7++;
            res[idx]=min;
        }
        return res[k-1];
    }
}
```

## 丑数|| 【LC 264题】

给你一个整数 `n` ，请你找出并返回第 `n` 个 **丑数** 。

**丑数** 就是质因子只包含 `2`、`3` 和 `5` 的正整数。

> 我们「往后产生的丑数」都是基于「已有丑数」而来（使用「已有丑数」乘上「质因数」2、3、5）。
>
> 因此，如果我们所有丑数的有序序列为 a1,a2,a3,…,an 的话，序列中的每一个数都必然能够被以下三个序列（中的至少一个）覆盖：![丑数序列](https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/QQ_1724983036162.png)因此我们可以使用三个指针来指向目标序列 arr 的某个下标，使用 下标质因数arr[下标]×质因数 代表当前使用到三个有序序列中的哪一位，同时使用 idx 表示当前生成到 arr 哪一位丑数。

```java
class Solution {
    public int nthUglyNumber(int n) {
        int []res=new int[n];
        res[0]=1;
        for(int i2=0,i3=0,i5=0,idx=1;idx<n;idx++){
            int a=res[i2]*2;
            int b=res[i3]*3;
            int c=res[i5]*5;
            int min=Math.min(a,Math.min(b,c));
            if(min==a) i2++;
            if(min==b) i3++;
            if(min==c) i5++;
            res[idx]=min;
        }
        return res[n-1];
    }
}
```

## 超级丑数【LC 313题】

**超级丑数** 是一个正整数，并满足其所有质因数都出现在质数数组 `primes` 中。

给你一个整数 `n` 和一个整数数组 `primes` ，返回第 `n` 个 **超级丑数** 。

题目数据保证第 `n` 个 **超级丑数** 在 **32-bit** 带符号整数范围内。

> 和上道题类似，原理也是「往后产生的丑数」都是基于「已有丑数」而来（使用「已有丑数」乘上「数组中的质因数」）
>
> 上道题中，因为质因数只有3个，所以我们可以把三个序列通过id显示构造出来，并且通过Math.min就可以取得三个数中的最小数。但是本题质数数组中的元素有m个，我们并不需要构造出这 m 个有序序列。
>
> 可以构造一个存储三元组的小根堆，三元组信息为 (val,i,idx)：
>
> - val ：为当前列表指针指向具体值；
> - i ：代表这是由 primes[i] 构造出来的有序序列；
> - idx：代表当前列表所遍历到的原数组丑数下标
>
> 起始时，我们将所有的 (primes[i],i,0) 加入优先队列（堆）中，每次从堆中取出最小元素，那么下一个该放入的元素为 (ans[idx+1]∗primes[i],i,idx+1)。
>
> 另外，由于我们每个 arr 的指针移动和 ans 的构造，都是单调递增，因此我们可以通过与当前最后一位构造的 ans[x] 进行比较来实现去重，而无须引用常数较大的 `Set` 结构。

```java
class Solution {
    public int nthSuperUglyNumber(int n, int[] primes) {
        PriorityQueue<int []>pq=new PriorityQueue<>((a,b)->a[0]-b[0]);
        int len=primes.length;
        for(int i=0;i<len;i++){
            pq.offer(new int[]{primes[i],i,0});
        }
        int []res=new int[n];
        res[0]=1;
        for(int j=1;j<n;){
            int []temp=pq.poll();
            int val=temp[0],i=temp[1],idx=temp[2];
            if(val!=res[j-1]) res[j++]=val;
            pq.offer(new int[]{res[idx+1]*primes[i],i,idx+1});
        }
        return res[n-1];
    }
}
```

## 查找和最小的k对数字【LC 373题】

给定两个以 **非递减顺序排列** 的整数数组 `nums1` 和 `nums2` , 以及一个整数 `k` 。

定义一对值 `(u,v)`，其中第一个元素来自 `nums1`，第二个元素来自 `nums2` 。

请找到和最小的 `k` 个数对 `(u1,v1)`, ` (u2,v2)` ...  `(uk,vk)` 。

> 令 nums1 的长度为 n，nums2 的长度为 m，所有的点对数量为 n∗m。
>
> nums1[0]和nums2[i]组成的点序列总和递增；
>
> nums1[1]和nums2[i]组成的点序列总和递增；
>
> .......
>
> 这引导我们使用「多路归并」来解决问题，还是建立小根堆，先把min(n,k)【小优化】个队列的首元素放进去，再不断从堆中弹出堆顶元素，如果堆顶元素在原队列中还有下一个元素，就把下一个元素放进去。

> 代码实现小优化：我们始终确保 nums1 为两数组中长度较少的那个【小表驱动大表的思想，使用小表中的每个元素和大表中的第一个元素配合放入堆中，这样维护堆的时间复杂度会低】，然后通过标识位来记录是否发生过交换，确保答案的点顺序的正确性。

```java
class Solution {
    boolean flag=true;
    public List<List<Integer>> kSmallestPairs(int[] nums1, int[] nums2, int k) {
        int n=nums1.length,m=nums2.length;
        if(n>m){
            flag=false;
            return kSmallestPairs(nums2,nums1,k);
        }

        List<List<Integer>> res=new ArrayList<>();
      // 注意小根堆的比较条件别写错了！！
        PriorityQueue<int []> pq=new PriorityQueue<>((a,b)->(nums1[a[0]]+nums2[a[1]]-nums1[b[0]]-nums2[b[1]]));
        for(int i=0;i<Math.min(n,k);i++) pq.offer(new int[]{i,0});

        while(res.size()<k && !pq.isEmpty()){
            int []temp=pq.poll();
            int a=temp[0],b=temp[1];
            if(flag) res.add(Arrays.asList(nums1[a],nums2[b]));
          // 还有这里只用交换顺序即可，不用交换下标！！
            else res.add(Arrays.asList(nums2[b],nums1[a]));

            if(b+1<m) pq.add(new int[]{a,b+1});
        }
        return res;
    }
}
```

## 第K个最小的素数分数【LC 786题】

给你一个按递增顺序排序的数组 `arr` 和一个整数 `k` 。数组 `arr` 由 `1` 和若干 **质数** 组成，且其中所有整数互不相同。

对于每对满足 `0 <= i < j < arr.length` 的 `i` 和 `j` ，可以得到分数 `arr[i] / arr[j]` 。

那么第 `k` 个最小的分数是多少呢? 以长度为 `2` 的整数数组返回你的答案, 这里 `answer[0] == arr[i]` 且 `answer[1] == arr[j]` 。

> 由于题目规定所有的点对 (i,j) 必须满足 i<j，即给定 arr[j] 后，其所能构建的分数个数为 j 个，而这 j 个分数值满足严格单调递增：arr[0]arr[j]<arr[1]arr[j]<arr[2]arr[j]<…<arr[j−1]arr[j]。
>
> 问题等价于我们从 n−1 个（下标 0 作为分母的话，不存在任何分数）有序序列中找到第 k 小的数值。这 n−1 个序列分别为：
>
> - [arr[0]/arr[1]]
> - [arr[0]/arr[2],arr[1]/arr[2]]
> - [arr[0]/arr[3],arr[1]/arr[3],arr[2]/arr[3]]
>   …
> - [arr[0]/arr[j],arr[1]/arr[j],arr[2]/arr[j],…,arr[j−1]/arr[j]]
>
> 问题彻底切换为「多路归并」问题，我们使用「优先队列（堆）」来维护多个有序序列的当前头部的最小值即可。

```java
class Solution {
    public int[] kthSmallestPrimeFraction(int[] arr, int k) {
      // 注意这里 浮点数的比较，要用Double的比较器
        PriorityQueue<int []> pq=new PriorityQueue<>((a,b)->Double.compare(1.0*arr[a[0]]/arr[a[1]],1.0*arr[b[0]]/arr[b[1]]));
      // 把每一队队首元素 放入堆中
        for(int i=1;i<arr.length;i++) pq.offer(new int[]{0,i});
        while(k-->1){
            int []temp=pq.poll();
            int i=temp[0],j=temp[1];
            if(i+1<j) pq.offer(new int[]{i+1,j});
        }
        return new int[]{arr[pq.peek()[0]],arr[pq.peek()[1]]};
    }
}
```



