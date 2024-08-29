---
date: 2024-08-28
category:
  - 刷题笔记
tag:
  - 链表
---

# 链表

## 移除链表元素【LC 203题】

给你一个链表的头节点 `head` 和一个整数 `val` ，请你删除链表中所有满足 `Node.val == val` 的节点，并返回 **新的头节点** 。

<aside>
💡 两种做法：

1、不添加虚拟头结点

2、添加虚拟头结点

</aside>

方法一：注意可能前几个节点的值都是val，因此要用while循环删除头结点

```java
// 不使用虚拟头结点
public ListNode removeElements(ListNode head, int val) {
    while (head!=null && head.val==val) head=head.next;
    ListNode cur=head;
    while (cur!=null){
        // 除了处理头结点要使用while循环，处理后续节点也要使用while循环，来去除连续的val节点
        while (cur.next!=null && cur.next.val==val) cur.next=cur.next.next;
        cur=cur.next;
    }
    return head;
}
```

方法二：使用dummy虚拟头结点

```java
// 使用虚拟头结点
public ListNode removeElements2(ListNode head, int val) {
    ListNode dummy=new ListNode(0);
    dummy.next=head;
    ListNode pre=dummy;
    ListNode cur=head;
    while (cur!=null){
        //如果当前元素的值等于val，说明需要移除，pre节点不用发生变化，还是原来的pre节点
        if (cur.val==val) pre.next=cur.next;
        else pre=cur；
        cur=cur.next;
    }
    return dummy.next;
}
```

## 设计链表【LC 707题】

你可以选择使用单链表或者双链表，设计并实现自己的链表。

单链表中的节点应该具备两个属性：`val` 和 `next` 。`val` 是当前节点的值，`next` 是指向下一个节点的指针/引用。

如果是双向链表，则还需要属性 `prev` 以指示链表中的上一个节点。假设链表中的所有节点下标从 **0** 开始。

实现 `MyLinkedList` 类：

- `MyLinkedList()` 初始化 `MyLinkedList` 对象。
- `int get(int index)` 获取链表中下标为 `index` 的节点的值。如果下标无效，则返回 `1` 。
- `void addAtHead(int val)` 将一个值为 `val` 的节点插入到链表中第一个元素之前。在插入完成后，新节点会成为链表的第一个节点。
- `void addAtTail(int val)` 将一个值为 `val` 的节点追加到链表中作为链表的最后一个元素。
- `void addAtIndex(int index, int val)` 将一个值为 `val` 的节点插入到链表中下标为 `index` 的节点之前。如果 `index` 等于链表的长度，那么该节点会被追加到链表的末尾。如果 `index` 比长度更大，该节点将 **不会插入** 到链表中。
- `void deleteAtIndex(int index)` 如果下标有效，则删除链表中下标为 `index` 的节点。

<aside>
💡 注意增删元素时，对链表长度size的修改

</aside>

```java
package LinkedList;

public class MyLinkedList {
    int size;
    ListNode dummy; //虚拟头结点

    public MyLinkedList() {
        size=0;
        dummy=new ListNode(0);
    }

    public int get(int index) {
        if (index<0 || index>=size) return -1;
        ListNode temp=dummy;
        while(index-->=0){
            temp=temp.next;
        }
        return temp.val;
    }

    public void addAtHead(int val) {
        addAtIndex(0,val);
    }

    public void addAtTail(int val) {
        addAtIndex(size,val);
    }

    public void addAtIndex(int index, int val) {
        if (index<0 || index>size) return;
        ListNode pre=dummy;
        while (index>0){
            pre=pre.next;
            index--;
        }
        ListNode toAdd=new ListNode(val);
        toAdd.next=pre.next;
        pre.next=toAdd;
        size++;
    }

    public void deleteAtIndex(int index) {
        if (index<0 || index>=size) return;
        size--;
        ListNode pre=dummy;
        while(index>0){
            pre=pre.next;
            index--;
        }
        pre.next=pre.next.next;
    }
}
```

## 反转链表【LC 206题】

给你单链表的头节点 `head` ，请你反转链表，并返回反转后的链表。

```
输入：head = [1,2,3,4,5]
输出：[5,4,3,2,1]
```

<aside>
💡 维护当前节点cur，前一个节点pre，下一个节点nextNode。每次执行一步有cur.next=pre，并把cur、pre、next都往后移。

**注意：**

每一次循环最后一步都是更新cur的位置，cur=nextNode，最后cur==null，因此判断返回的时候，需要返回pre，而不是cur。

</aside>

> 双指针写法
> 

```java
public ListNode reverseList(ListNode head) {
    ListNode cur=head,pre=null,nextNode=cur.next;
    while (cur!=null){
        nextNode=cur.next;
        cur.next=pre;
        pre=cur;
        cur=nextNode;
    }
    return pre;
}
```

> 递归写法
> 

```java
//递归写法
public ListNode reverseList2(ListNode head) {
    return reverse(head,null);
}
public ListNode reverse(ListNode cur,ListNode pre){
    if (cur==null) return pre;
    ListNode next=cur.next;
    cur.next=pre;
    return reverse(next,cur);
}
```

## k个一组反转链表【LC 25题】

给你链表的头节点 `head` ，每 `k` 个节点一组进行翻转，请你返回修改后的链表。

`k` 是一个正整数，它的值小于或等于链表的长度。如果节点总数不是 `k` 的整数倍，那么请将最后剩余的节点保持原有顺序。

你不能只是单纯的改变节点内部的值，而是需要实际进行节点交换。

<aside>
💡 先把前k个元素翻转，记录newhead【注意这里如果 链表的元素个数小于k个，也就是tail在初次遍历为null了，就直接返回head】然后head.next=翻转后续元素。

</aside>

```java
package LinkedList;

public class ReverseKGroup {
    public ListNode reverseKGroup(ListNode head, int k) {
        if (head==null || head.next==null) return head;
        ListNode tail=head;
        for (int i = 0; i < k; i++) {
            if (tail==null) return head;
            tail=tail.next;
        }
        ListNode newHead=reverseList(head,tail);
        head.next=reverseKGroup(tail,k);
        return newHead;
    }

    private ListNode reverseList(ListNode head, ListNode tail) {
        ListNode pre=null,next,cur=head;
        while (cur!=tail){
            next=cur.next;
            cur.next=pre;
            pre=cur;
            cur=next;
        }
        return pre;
    }
}
```

## 两数相加【LC 2题】

给你两个 **非空** 的链表，表示两个非负的整数。它们每位数字都是按照 **逆序** 的方式存储的，并且每个节点只能存储 **一位** 数字。

请你将两个数相加，并以相同形式返回一个表示和的链表。

你可以假设除了数字 0 之外，这两个数都不会以 0 开头。

<aside>
💡 从头结点开始，对list1和list2的数相加。只有当list1和list2为null和进位carry为0的时候，才退出循环。返回结果。

注意，在取节点值的时候，需要判断一下节点是否为null，如果为null将节点值设置为0.

</aside>

```java
class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy=new ListNode(0);
        ListNode temp=dummy;
        int carry=0;   //表示进位
        while(l1!=null || l2!=null ||carry!=0){
            int x1=l1==null?0:l1.val;
            int x2=l2==null?0:l2.val;
            int sum=x1+x2+carry;
            int current=sum%10;
            carry=sum/10;
            temp.next=new ListNode(current);
            temp=temp.next;
            // 这里也要注意 要做非空判断 不然直接往后走的话 会出现空指针异常
            if(l1!=null) l1=l1.next;
            if(l2!=null) l2=l2.next;
        }
        return dummy.next;
    }
}
```

## LRU缓存【LC 146题】

请你设计并实现一个满足 [LRU (最近最少使用) 缓存](https://baike.baidu.com/item/LRU) 约束的数据结构。

实现 `LRUCache` 类：

- `LRUCache(int capacity)` 以 **正整数** 作为容量 `capacity` 初始化 LRU 缓存
- `int get(int key)` 如果关键字 `key` 存在于缓存中，则返回关键字的值，否则返回 `1` 。
- `void put(int key, int value)` 如果关键字 `key` 已经存在，则变更其数据值 `value` ；如果不存在，则向缓存中插入该组 `key-value` 。如果插入操作导致关键字数量超过 `capacity` ，则应该 **逐出** 最久未使用的关键字。

函数 `get` 和 `put` 必须以 `O(1)` 的平均时间复杂度运行。

<aside>
💡 用map和双向链表来实现。

map存储key-node。

双向链表头结点记录最新被访问过的数据，如果put之后超过总容量了，删除尾节点。

注意在 双向链表头和尾都加上虚拟节点，方便插入删除操作。

</aside>

```java
class LRUCache {
    // 用map和双向链表来实现LRU缓存
    Node head;
    Node tail;
    HashMap<Integer,Node> map=new HashMap<>();
    int capacity;

    public LRUCache(int capacity) {
        this.capacity=capacity;
        head=new Node(-1,-1);
        tail=new Node(-1,-1);
        head.next=tail;
        tail.pre=head;
    }
    
    public int get(int key) {
        // 把访问过的放在链表最开头
        if(map.containsKey(key)){
            Node node=map.get(key);
            cutNode(node);
            insertHead(node);
            return node.val;
        }
        return -1;
    }
    
    public void put(int key, int value) {
        if(map.containsKey(key)){
            Node node=map.get(key);
            node.val=value;
            cutNode(node);
            insertHead(node);
        }else{
            Node node=new Node(key,value);
            map.put(key,node);
            insertHead(node);
            // 插入map和链表后，如果超过capacity
            if(map.size()>capacity){
                // 需要保存一下删除的node
                Node delNode=cutTail();
                // 在map中移除
                map.remove(delNode.key);
            }
        }
    }

    public Node cutTail(){
        Node temp=tail.pre;
        temp.pre.next=tail;
        tail.pre=temp.pre;
        temp.next=null;
        temp.pre=null;
        return temp;
    }

    public void cutNode(Node node){
        node.pre.next=node.next;
        node.next.pre=node.pre;
        node.next=null;
        node.pre=null;
    }

    public void insertHead(Node node){
        Node temp=head.next;  //记录下 头结点的下一个节点
        head.next=node;
        node.next=temp;
        node.pre=head;
        temp.pre=node;
    }

    class Node{
        int key;
        int val;
        Node pre;
        Node next;
        Node(int _key,int _val){
            this.key=_key;
            this.val=_val;
        }
    }
}
```

## 排序链表【LC 148题】

给你链表的头结点 `head` ，请将其按 **升序** 排列并返回 **排序后的链表** 。

<aside>
💡 使用归并排序。

分为几个小问题：找到链表的中点【快慢指针】，排序链表【递归排序，注意要把前后两个链表打断】，合并两个有序链表。

</aside>

```java
class Solution {
    public ListNode sortList(ListNode head) {
      // 递归返回条件：节点为null，或者只有一个节点
        if(head==null||head.next==null) return head;
        ListNode fast=head.next;
        ListNode slow=head;
        while(fast!=null && fast.next!=null){
            fast=fast.next.next;
            slow=slow.next;
        }
        ListNode head2=slow.next;
        slow.next=null; //打断链表
        // 分别对前半段链表 和 后半段链表进行排序
        ListNode left=sortList(head);
        ListNode right=sortList(head2);

        // 合并两个有序链表，因为不知道头结点是哪个，所以我们用一个虚拟头结点
        ListNode dummy=new ListNode(0);
        ListNode temp=dummy;
        while(left!=null && right!=null){
            if(left.val<=right.val){
                temp.next=left;
                left=left.next;
            }else{
                temp.next=right;
                right=right.next;
            }
            temp=temp.next;
        }
        temp.next= left==null?right:left;
        return dummy.next;
    }
}
```

## 反转链表||【LC 92题】

给你单链表的头指针 `head` 和两个整数 `left` 和 `right` ，其中 `left <= right` 。请你反转从位置 `left` 到位置 `right` 的链表节点，返回 **反转后的链表** 。

<aside>
💡 反转中间部分链表

![2.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3e894961-3173-4702-91a3-da175d94f68d/bf0a758d-e3ee-4237-b790-db08f2306c35/2.png)

反转前的一个节点为p0,先把中间left和right之间的节点进行翻转，然后将

p0.next(2).next=cur;

p0.next=pre;

特殊情况：如果left为1是没有前一个节点的，所以我们需要新建一个虚拟头结点。

</aside>

```java
class Solution {
    public ListNode reverseBetween(ListNode head, int left, int right) {
        ListNode dummy=new ListNode(0,head);
        ListNode p0=dummy;
        for(int i=0;i<left-1;i++){
            p0=p0.next;
        }
      // 先把中间部分反转
        ListNode pre=null,cur=p0.next,next;
        for(int i=0;i<right-left+1;i++){
            next=cur.next;
            cur.next=pre;
            pre=cur;
            cur=next;
        }
      // 再把两边接上
        p0.next.next=cur;
        p0.next=pre;
        return dummy.next;
    }
}
```

## 分隔链表【LC 86题】

给你一个链表的头节点 `head` 和一个特定值 `x` ，请你对链表进行分隔，使得所有 **小于** `x` 的节点都出现在 **大于或等于** `x` 的节点之前。

你应当 **保留** 两个分区中每个节点的初始相对位置。

> 不会，保留一下
> 

## 回文链表【LC 234题】

给你一个单链表的头节点 `head` ，请你判断该链表是否为回文链表。如果是，返回 `true` ；否则，返回 `false` 。

> 笔试写法
> 
> 
> 利用**栈**先入后出的特性，遍历链表，push节点。判断：从栈中弹出节点，和原来的链表做比对。
> 
> - 时间复杂度：O(n)
> - 额外空间复杂度：O(n)

```java
public boolean isPalindrome(ListNode head) {
    Stack<ListNode> stack=new Stack<>();
    ListNode cur=head;
    while(cur!=null){
        stack.push(cur);
        cur=cur.next;
    }
    while(!stack.isEmpty()){
        if(stack.pop().val!=head.val) return false;
        head=head.next;
    }
    return true;
}
```

<aside>
💡 面试写法

**快慢指针**，利用慢指针找到后半段的链表头，反转后半段链表，再分别从原链表头和反转链表头遍历比对。

- 时间复杂度：O(n)
- 额外空间复杂度：O(1)
</aside>

```java
public boolean isPalindrome(ListNode head) {
    ListNode fast=head.next,slow=head;
    while (fast!=null&&fast.next!=null){
        fast=fast.next.next;
        slow=slow.next;
    }
    ListNode right=reverse(slow.next);
    ListNode left=head;
    while (right!=null){
        if (right.val!=left.val) return false;
        right=right.next;
        left=left.next;
    }
    return true;
}

public ListNode reverse(ListNode head){
    ListNode cur=head;
    ListNode pre=null,next=null;
    while (cur!=null){
        next=cur.next;
        cur.next=pre;
        pre=cur;
        cur=next;
    }
    return pre;
}
```

## 合并两个有序链表【LC 21题】

将两个升序链表合并为一个新的 **升序** 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。

<aside>
💡 和合并两个有序数组类似，也是从前往后遍历链表。

</aside>

```java
class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy=new ListNode(0,list1);
        ListNode cur=dummy;
        ListNode A=list1,B=list2;
        while(A!=null && B!=null){
            if(A.val<=B.val){
                cur.next=A;
                A=A.next;
            }else{
                cur.next=B;
                B=B.next;
            }
            cur=cur.next;
        }
        cur.next=A==null?B:A;
        return dummy.next;
    }
}
```

## 合并k个升序链表【LC 23题】

🏷 堆

给你一个链表数组，每个链表都已经按**升序**排列。

请你将所有链表合并到一个升序链表中，返回合并后的链表。

<aside>
💡 使用小根堆，每次从堆顶获取最小元素

</aside>

```java
class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        Queue<ListNode> pq=new PriorityQueue<>((v1,v2)->v1.val-v2.val);
        for(ListNode node:lists){
            if(node!=null){
                pq.offer(node);
            }
        }
        ListNode dummy=new ListNode(0);
        ListNode temp=dummy;
        while(!pq.isEmpty()){
            ListNode node=pq.poll();
            temp.next=node;
            if(node.next!=null){
                pq.offer(node.next);
            }
            temp=temp.next;
        }
        return dummy.next;
    }
}
```

## 删除排序链表中的重复元素【LC 83题】

给定一个已排序的链表的头 `head` ， *删除所有重复的元素，使每个元素只出现一次* 。返回 *已排序的链表* 。

<aside>
💡 将元素和后面的相邻元素比较，如果相同就删除该元素【cur的位置不变！是cur.next变了】。如果不相同,cur往后走一个，继续和后面的元素进行比较。

</aside>

```java
class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        if(head==null) return head;
        ListNode cur=head;
        while(cur.next!=null){
            if(cur.val==cur.next.val){
                cur.next=cur.next.next;
            }else{
                cur=cur.next;
            }
        }
        return head;
    }
}
```

## 删除链表的倒数第N个节点【LC 19题】

给你一个链表，删除链表的倒数第 `n` 个结点，并且返回链表的头结点。

<aside>
💡 快慢指针，快指针先走n步，然后快慢指针一起走，当快指针走到结尾，慢指针就走到倒数第n个节点了。

因为有可能把头结点删除了，所以使用dummy就不会出现乱七八糟的问题。

</aside>

```java
class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy=new ListNode(0,head);
        ListNode fast=dummy;
        ListNode slow=dummy;
        while(n>0){
            fast=fast.next;
            n--;
        }
        while(fast.next!=null){
            fast=fast.next;
            slow=slow.next;
        }
        slow.next=slow.next.next;
        return dummy.next;
    }
}
```

## 旋转链表【LC 61题】

给你一个链表的头节点 `head` ，旋转链表，将链表每个节点向右移动 `k` **个位置。

<aside>
💡 这道题和旋转数组那道题有点区别，旋转链表只需要修改指针的位置就可以了，不需要反转链表

</aside>

<aside>
💡 解题步骤：

1. 如果head==null || k==0，直接返回null
2. 计算出链表长度len，计算k%len。📢这里如果k%len==0，也直接返回head
3. 剩下就是「删除链表倒数第N个节点问题」，找到倒数第N+1个节点，再修改一下链表指针指向
</aside>

```java
class Solution {
    public ListNode rotateRight(ListNode head, int k) {
        if(head==null || k==0) return head;
        int len=0;
        ListNode dummy=new ListNode(0,head);
        ListNode fast=head;
        while(fast!=null){
            fast=fast.next;
            len++;
        }
        k=k%len;
        if(k==0) return head;
        ListNode slow=dummy;
        fast=dummy;
        while(k>0){
            fast=fast.next;
            k--;
        }
        while(fast.next!=null){
            fast=fast.next;
            slow=slow.next;
        }
        ListNode newHead=slow.next;
        slow.next=null;
        fast.next=head;
        return newHead;
    }
}
```

## 前置问题 荷兰国旗问题【LC 75题】

给定一个包含红色、白色和蓝色、共 `n` 个元素的数组 `nums` ，[**原地**](https://baike.baidu.com/item/%E5%8E%9F%E5%9C%B0%E7%AE%97%E6%B3%95)对它们进行排序，使得相同颜色的元素相邻，并按照红色、白色、蓝色顺序排列。我们使用整数 `0`、 `1` 和 `2` 分别表示红色、白色和蓝色。

> 用三个变量来维护：下一个0应该在的位置left,下一个2应该在的位置right，当前遍历位置idx。也就是[0,left-1]为0；[left,right-1]为1，[right,len-1]为2。【idx，r】为待处理区间。
> 
> - 当nums[idx]==1，表明它已经在正确的位置，因此我们只需要将 `idx` 向右移动。
> - 当nums[idx]==0，说明它应该放在数组的左边，因此我们将其与 `l` 位置的元素交换，并将 `l` 和 `idx` 都向右移动。
> - 当nums[idx]==2，说明它应该放在数组的右边，因此我们将其与 `r` 位置的元素交换，并将 `r` 向左移动。由于交换后 `idx` 位置的新元素还未检查，所以 `idx` 暂时不动。

注意：

> 退出循环条件为idx>right。【idx，r】为待处理区间。退出循环时表明没有待处理的元素。
> 

```java
public class SortColors_75 {
    public void sortColors(int[] nums) {
        int left=0,idx=0,right=nums.length-1; // 左闭右闭
        while(idx<=right){	//退出循环条件为idx>right
            if(nums[idx]==0) {
                swap(nums,idx++,left++);
            }
            else if (nums[idx]==1) idx++;
            else swap(nums,idx,right--);
        }
    }

    public void swap(int []nums,int left,int right){
        int temp=nums[left];
        nums[left]=nums[right];
        nums[right]=temp;
    }
}
```

## 单链表荷兰国旗问题

将单向链表按某`partition`值划分成左边小、中间相等、右边大的形式，并保证节点相对位置不变。

- 需要6个变量构成3个单链表
    - 小于partition链表的头指针
    - 小于partition链表的尾指针
    - 等于partition链表的头指针
    - 等于partition链表的尾指针
    - 大于partition链表的头指针
    - 大于partition链表的尾指针
- 遍历链表，判断当前节点应当插入哪个链表
- 遍历结束，将三个链表依次首尾相接

**注意：**

> 需要考虑三个链表中为空的情况，不然可能会出现空指针异常
> 

```java
public static ListNode listPartition(ListNode head,int partition){
        ListNode SH=null;
        ListNode ST=null;
        ListNode EH=null;
        ListNode ET=null;
        ListNode BH=null;
        ListNode BT=null;
        ListNode cur;
    	//遍历链表
        while (head!=null){
            //下面这两部操作，是为了三个链表的结尾都为null
            cur=head.next;
            head.next=null;
            if (cur.val<partition){
                if (SH==null){
                    SH=cur;
                    ST=cur;
                }else {
                    ST.next=cur;
                    ST=cur;
                }
            } else if (cur.val == partition) {
                if (EH==null){
                    EH=cur;
                    ET=cur;
                }else {
                    ET.next=cur;
                    ET=cur;
                }
            }else {
                if (BH==null){
                    BH=cur;
                    BT=cur;
                }else {
                    BT.next=cur;
                    BT=cur;
                }
            }
            head=cur;
        }
        //连接 三个链表 考虑链表为空的情况
        if (ST!=null){
            //如果小于partition链表不为空，就先直接赋值
            ST.next=EH;
            //再考虑等于partition链表是否为空的情况
            ET=ET==null? BH :ST;
        }
    	//先连接再说，后面再判断返回什么
        if (ET!=null){
            ET.next=BH;
        }
        return SH!=null ? SH : (EH!=null ? EH :BH);
    }
```

## 随机链表的复制【LC 138题】

给你一个长度为 `n` 的链表，每个节点包含一个额外增加的随机指针 `random` ，该指针可以指向链表中的任何节点或空节点。构造这个链表的 [**深拷贝**](https://baike.baidu.com/item/%E6%B7%B1%E6%8B%B7%E8%B4%9D/22785317?fr=aladdin)。 深拷贝应该正好由 `n` 个 **全新** 节点组成，其中每个新节点的值都设为其对应的原节点的值。新节点的 `next` 指针和 `random` 指针也都应指向复制链表中的新节点，并使原链表和复制链表中的这些指针能够表示相同的链表状态。**复制链表中的指针都不应指向原链表中的节点** 。

例如，如果原链表中有 `X` 和 `Y` 两个节点，其中 `X.random --> Y` 。那么在复制链表中对应的两个节点 `x` 和 `y` ，同样有 `x.random --> y` 。接收原链表的头节点，返回复制链表的头节点。

<aside>
💡 笔试解法

利用HashMap，key放原来的节点，value放新建的节点。再次遍历hashmap，建立next和random指针联系。

- 时间复杂度：O(n)
- 额外空间复杂度：O(n)
</aside>

```java
public Node copyRandomList(Node head) {
    HashMap<Node,Node> map=new HashMap<>();
    Node cur=head;
    // 构建 原节点-新节点的map
    while (cur!=null){
        map.put(cur,new Node(cur.val));
        cur=cur.next;
    }
    cur=head;
    //建立 next和random关系
    while (cur!=null){
        map.get(cur).next=map.get(cur.next);
        map.get(cur).random=map.get(cur.random);
        cur=cur.next;
    }
    return map.get(head);
}
```

<aside>
💡 面试解法

- 时间复杂度：O(n)
- 额外空间复杂度：O(1)

主要分为三步

1. 先复制节点 A->B->C 变成 A->A’->B->B’->C->C’
2. 建立 random 关系
3. split：将A->A’->B->B’->C->C’重新拆分成A->B->C和A’->B’->C’
</aside>

```java
public Node copyRandomList(Node head) {
    if(head==null) return head;
    Node cur=head;
    //先复制节点 A->B->C 变成 A->A'->B->B'->C->C'
    while (cur!=null){
        Node next=cur.next;
        cur.next=new Node(cur.val);
        cur.next.next=next;
        cur=next;
    }
    //建立 random 关系
    cur=head;
    while (cur!=null){
        cur.next.random=cur.random==null? null : cur.random.next;
        cur=cur.next.next;
    }
    //split
    cur=head;
    Node headNew=cur.next;
    Node curNew=cur.next;
    while (cur!=null){
        cur.next=cur.next.next;
        cur=cur.next;
        curNew.next= cur==null? null :cur.next;
        curNew=curNew.next;
    }
    return headNew;
}
```

## 两两交换链表中的节点【LC 24题】

给你一个链表，两两交换其中相邻的节点，并返回交换后链表的头节点。你必须在不修改节点内部的值的情况下完成本题（即，只能进行节点交换）。

<aside>
💡 利用「递归」来解决问题，递归返回交换后的前一个节点。

每次递归的时候，记录head.next.next反转后的头结点temp

head.next=temp;

再反转当前的两个节点

next.next=head;

</aside>

```java
class Solution {
    public ListNode swapPairs(ListNode head) {
        if(head==null || head.next==null) return head;
        ListNode second=head.next;
        ListNode temp=swapPairs(second.next);
        head.next=temp;
        second.next=head;
        return second;
    }
}
```

## 环形链表【LC 141题】

给你一个链表的头节点 `head` ，判断链表中是否有环。

<aside>
💡 使用快慢指针，如果快慢指针相遇了说明链表有环，快指针遇到null说明链表无环

</aside>

```java
public boolean hasCycle(ListNode head) {
    if(head==null) return false;
    ListNode fast=head.next;
    ListNode slow=head;
    while(fast!=slow){
        if(fast==null||fast.next==null)
            return false;
        fast=fast.next.next;
        slow=slow.next;
    }
    return true;
}
```

## 环形链表||【LC142题】

给定一个链表的头节点 `head` ，返回链表开始入环的第一个节点。 *如果链表无环，则返回 `null`。*

- 和上题类似，使用快慢指针
- 找环的入口时，固定方法：

<aside>
💡 slow=slow.next，fast=head，然后两者一起往后走，每次走一步，相遇点即为环的入口

</aside>

```java
public ListNode detectCycle(ListNode head) {
    if(head==null) return null;
    ListNode fast=head.next;
    ListNode slow=head;
    while(fast!=slow){
        if(fast==null || fast.next==null) return null;
        fast=fast.next.next;
        slow=slow.next;
    }
    slow=slow.next;
    fast=head;
    while(fast!=slow){
        fast=fast.next;
        slow=slow.next;
    }
    return slow;
}
```

以上是一些铺垫，考虑 相交链表 这个大问题。

<aside>
💡 相交链表：两个链表有交点返回交点，无交点返回null。

根据有环、无环分为以下几种情况：

1. 两个链表都无环【第七题】
2. 一个链表有环，一个链表无环【这样的情况，两个链表不会有交点(如果有交点，就会存在一个节点有两个next指针的情况)】
3. 两个链表都有环【第八题】
</aside>

## 相交链表【LC 160题】

给你两个单链表的头节点 `headA` 和 `headB` ，请你找出并返回两个单链表相交的起始节点。如果两个链表不存在相交节点，返回 `null` 。

解题思想：

> 求出两个链表的长度差n让长的链表先走n步两个链表一起往后走，如果两链表相交，两者会同时走到交点；如果不相交，两者会同时走到null
> 

```java
//两个链表都无环
public ListNode getIntersectionNode1(ListNode headA, ListNode headB) {
    int n=0;
    ListNode curA=headA;
    ListNode curB=headB;
    //求出链表A和链表B的长度差
    while (curA!=null){
        curA=curA.next;
        n++;
    }
    while (curB!=null){
        curB=curB.next;
        n--;
    }
    curA=n>0?headA:headB;   //curA保存长的链表
    curB=curA==headA?headB:headA;
    n=Math.abs(n);
    // 长链表先往前走n步
    while (n>0){
        curA=curA.next;
    }
    // 如果两链表相交，两者会同时走到交点；如果不相交，两者会同时走到null
    while (curA!=curB){
        curA=curA.next;
        curB=curB.next;
    }
    return curA;
}
```

## 相交链表【两个链表都有环】

分为三种情况：

1. 两个有环链表不相交
2. 两个链表共用一个入环节点
3. 两个链表共用一个环，但是入环节点不一致

解决方案：

<aside>
💡 传入第一个链表头head1，第一个链表入环节点loop1；第二个链表头head2，第二个链表入环节点loop2；

1. 如果loop1==loop2，说明为同一个环，解法和第七题类似，做题时以loop1结尾而不是null结尾
2. 如果loop1!=loop2，是1或3情况，这时将loop1再转一圈，如果转的过程碰到loop2了，说明为第三种情况；如果转了一圈没有碰到，说明这两个链表不相交。
</aside>

```java
//两个链表都有环
public ListNode getIntersectionNode2(ListNode headA, ListNode headB) {
    ListNode curA=headA;
    ListNode loop1=detectCycle(headA);	//链表A的环入口
    ListNode curB=headB;
    ListNode loop2=detectCycle(headB);	//链表B的环入口
    if (loop1==loop2){
        int n=0;
        while(curA!=loop1) n++;
        while (curB!=loop2) n--;
        curA = n>0 ? headA : headB;
        curB = curA==headA ? headB : headA;
        n=Math.abs(n);
        while (n>0){
            curA=curA.next;
            n--;
        }
        while (curA!=curB){
            curA=curA.next;
            curB=curB.next;
        }
        return curA;
    }else {
        curA=loop1.next;
        while (curA!=loop1){
            if (curA==loop2) return loop2;
            curA=curA.next;
        }
    }
    return null;
}
```
