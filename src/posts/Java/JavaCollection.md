---
date: 2024-08-28
category:
  - Java集合
tag:
  - Java基础
  - 
---

# Java集合

# Java集合概览

## 介绍一下Java中的集合框架

Java 集合，主要是由两大接口派生而来：一个是 Collection接口；另一个是 Map 接口。Collection 接口，下面又有三个子接口：List、Set 、 Queue。

List中常见的实现类有：ArrayList和LinkedList两个；Set接口实现常见类有HashSet、LinkedHashSet、TreeSet；Queue接口的实现类有PriorityQueue优先级队列。

Map接口常见的实现类有HashMap、LinkedHashMap、TreeMap、Hashtable、ConcurrentHashMap。

## 数组和链表的区别

1. 存储结构：数组基于连续的内存块，大小是固定的，内存使用紧凑但容易浪费空间。链表是基于节点的结构，在内存中不需要连续存储，可以动态扩展。
2. 访问速度：数组支持O(1)时间的随机访问，可以通过索引计算出元素的访问地址，直接访问元素。而链表访问特定元素需要O(n）时间复杂度，因为节点在内存中不一定连续，需要从链表头开始遍历。
3. 插入和删除操作: 数组插入和删除都有可能影响整个数组，时间复杂度为O(n)。而链表则很灵活，可在O（1）时间插入和修改指定位骯素。

因此数组适合需要快速随机访问并且修改操作较少的场景。链表适合需要频繁插入和删除操作的场景。

Java中最常见的数组和链表是ArrayList和LinkedList。

## 说说 List, Set, Queue, Map 四者的区别？

- List: 存储的元素是有序的、可重复的。
- Set: 存储的元素不可重复的。
- Queue: 按特定的排队规则来确定先后顺序，存储的元素是有序的、可重复的。
- Map: 使用键值对（key-value）存储，key 是无序的、不可重复的，value 是无序的、可重复的，每个键最多映射到一个值。

## 如何选用合适的集合

如果要存储键值对，就选用map接口下的实现类，如果要实现排序就用treemap，不需要就使用hashmap，需要线程安全就使用concurrenthashmap【不要使用hashtable，因为hashtable的线程安全实现是在方法前面加上synchronized关键字，无论什么请求会锁住整个哈希表，其他想操作hashtable的线程都会阻塞。而councurrentHashmap在jdk1.7和1.8之间有不同的实现，他们的锁的粒度都比hashtable小】。

不存储键值对，就用Collection接口下的集合。需要存储唯一的数据就用set接口下的实现类，比如hashset和treeset；不需要就可以使用list接口下的集合，比如arraylist和linkedlist；如果要实现特定的元素出入顺序，或者实现取出最大/最小元素这样的请求，可以使用queue接口下的实现类。

# 集合框架底层数据结构

### 1、List

- ArrayList：Object[] 数组。
- Vector：Object[] 数组。
- LinkedList：双向链表(JDK1.6 之前为循环链表，JDK1.7 取消了循环)。

### 2、Set

- HashSet(无序，唯一): 基于 HashMap 实现的，将set中的元素添加到hashmap的key中，HashMap中的value都是存储的一样的,都是同一个Object对象(底层源码中:PRESENT)，private static final Object PRESENT = new Object()；【为了防止出现空指针异常】
- LinkedHashSet: LinkedHashSet 是 HashSet 的子类，并且其内部是通过 LinkedHashMap 来实现的。【保证元素添加的顺序】
- TreeSet(有序，唯一): 红黑树(自平衡的排序二叉树)。【保证元素的自然顺序和实现自定义排序】

### 3、Queue

- PriorityQueue: Object[] 数组来实现小顶堆。
- DelayQueue:PriorityQueue。
- ArrayDeque: 可扩容动态双向数组。

### 4、Map

- HashMap：JDK1.8 之前 HashMap 由数组+链表组成的，数组是 HashMap 的主体，链表则是主要为了解决哈希冲突而存在的（“拉链法”解决冲突）。JDK1.8 以后在解决哈希冲突时有了较大的变化，当链表长度大于阈值（默认为 8）（将链表转换成红黑树前会判断，如果当前数组的长度小于 64，那么会选择先进行数组扩容，而不是转换为红黑树）时，将链表转化为红黑树，以减少搜索时间。
- LinkedHashMap：LinkedHashMap 继承自 HashMap，所以它的底层仍然是基于拉链式散列结构即由数组和链表或红黑树组成。另外，LinkedHashMap 在上面结构的基础上，增加了一条**双向链表**，使得上面的结构可以保持键值对的插入顺序。同时通过对链表进行相应的操作，实现了访问顺序相关逻辑。
- Hashtable：数组+链表组成的，数组是 Hashtable 的主体，链表则是主要为了解决哈希冲突而存在的。
- TreeMap：红黑树（自平衡的排序二叉树）。

# List

## ArrayList和LinkedList的区别

List接口实现类中最常见的就是ArrayList和LinkedList，首先它们都不是线程安全的。

1. ArrayList底层是Object[]数组，所以特性和数组一直，随机访问快，时间复杂度O(1)；插入和删除操作比较慢，时间复杂度O(n)
2. LinkedList底层是双向链表。两端插入和删除快，时间复杂度为O(1)；随机访问需要遍历链表，时间复杂度为O(n)
3. 内存空间占用不同：ArrayList对空间的占用主要体现在列表的结尾会预留一定的空间。LinkedList对空间的占用主要体现在存放直接前驱和直接后继。

## ArrayList和Vector的区别

List接口还有一个实现是Vector，Vector也是基于动态数组实现的，但是方法前面加了synchronized关键字，是线程安全的。也因为同步开销比较大，因此性能相对较低。

但是这种给方法加synchronized的方式保证的线程安全不是绝对的，这种锁是方法级的。如果出现多个线程使用不同的方法，比如使用get和remove方法，就有可能造成访问数据的时候，数据已经被删除了，造成数组越界异常。因此使用vector做复杂操作时，还需要自己在程序中额外加锁。这时候应该使用arrayList，避免vector重复加锁影响性能。

## CopyOnWriteArrayList

List的另一个实现是CopyOnWriteArrayList，基于动态数组实现，但所有可变操作(如add()、set() 等)都会创建一个新的数组，运用了copyOnWrite技术，在写的时候，拷贝一个新数组。它是线程安全的，适合在多线程环境中读多写少的场景。

## 什么是Java中的Copy On Write

我们都知道操作系统有父子进程的概念，当父进程创建子进程之后，父子进程的内存空间是共享的，只有当子进程(或父进程)尝试写入或修改数据的时候，才需要复制一个新的内存页面写入。

因为一开始共享内存，所以在没有发生修改的时候，内存不需要新复制一份，当写入的时候才发生复制，这就不仅节省内存，也避免了内存频繁复制的开销。

copy-on-write 对读比较友好，多个并发读可以共享，互相不会阻塞；当有线程写在修改数据的时候，也不会阻塞读，因为可以读老的数据。

不过 copy-0n-write 也有缺点，写操作会延迟，因为写的时候需要拷贝数据。

如果写操作非常频繁就会一直拷贝数据，开销比较大，所以它适合读多写少的场景。

在 Java 中主要有 copyonwriteArrayList 这个实现类，底层基于数组存储，写的时候会拷贝一个新数组。

它是线程安全的，读不会被写阻塞。

## AbstractList

是一个抽象类,实现了List 接口的大部分方法，提供了基本的List功能。

如果我们想要扩展实现自己的列表，那么可以用它作为自定义列表实现的基础类，减少我们的自定义成本。

## ArrayList和Array(静态数组)的区别

1. ArrayList中能添加null值
2. Array初始化的时候必须指定大小，ArrayList不需要。
3. ArrayList可以根据实际需求，调用API()，增加/删除元素；而array只是一个固定长度的数组，只能按照下标获取元素，不具备动态增加、删除元素的能力。
4. ArrayList会根据实际存储的元素数量进行自动扩容，而Array创建后就不能改变长度了
5. ArrayList允许使用泛型来保证类型安全，Array不行
6. ArrayList只允许存放对象，对于基本数据类型，需要使用它们对应的包装类；而Array支持存储基本数据类型，也可以存储对象

## ArrayList的扩容机制

ArrayList默认初始长度是10，当然我们也可以在创建ArrayList时，指定初始长度。随着程序不断往ArrayList添加数据，当添加到第十一个数据时，ArrayList就会触发自动扩容机制。首先会计算出原来容量的1.5倍作为新容量，如果新容量还是小于最小需要容量，就把最小需要容量当做新容量。如果新容量超过了数组最大容量(Integer.MAX_VALUE-8),就把容量设置为Integer.Max_VALUE。然后利用Arrays.copyOf()这个方法创建新容量对应的数组，并把原数组中的元素复制到新数组中，原来数组的引用指向新数组。

## LinkedList的应用场景

1. 适用于更多的插入和删除元素，更少的读取数据。因为插入和删除元素不涉及重排数据，所以它要比ArrayList要快。
2. 可以用LinkedList实现的栈、队列、双端队列

## 有哪些线程安全的list接口实现类

1. 使用Vector容器
2. 使用Collections的静态方法synchronizedList(List< T> list)
3. 采用CopyOnWriteArrayList容器【写操作时，会复制原来的数组并且在新数组上修改，最后再将原数组覆盖】

# Set

## Comparable 和 Comparator 的区别

Comparable 接口和 Comparator 接口都是 Java 中用于排序的接口，它们在实现类对象之间比较大小、排序等方面发挥了重要作用：

- Comparable 接口实际上是出自java.lang包 它有一个 compareTo(Object obj)方法用来排序
- Comparator接口实际上是出自 java.util 包它有一个compare(Object obj1, Object obj2)方法用来排序

一般我们需要对一个集合使用自定义排序时，我们就要重写compareTo()方法或compare()方法。

【例子放在下面的treeset自定义排序】

## 比较 HashSet、LinkedHashSet 和 TreeSet 三者的异同

1. HashSet、LinkedHashSet 和 TreeSet 都是 Set 接口的实现类，都能保证元素唯一，并且都不是线程安全的。
2. HashSet、LinkedHashSet 和 TreeSet 的主要区别在于底层数据结构不同。HashSet 的底层数据结构是哈希表（基于 HashMap 实现）。LinkedHashSet 的底层数据结构是链表和哈希表，元素的插入和取出顺序满足 FIFO。TreeSet 底层数据结构是红黑树，元素是有序的，排序的方式有自然排序和定制排序。
3. 底层数据结构不同又导致这三者的应用场景不同。HashSet 用于不需要保证元素插入和取出顺序的场景，LinkedHashSet 用于保证元素的插入和取出顺序满足 FIFO 的场景，TreeSet 用于支持对元素自定义排序规则的场景。

## TreeSet实现自定义排序

1. 使用java.util包下的comparator，自定义compare方法

```java
public class comparator{
    public static void main(String[] args) {
        Person p=new Person(11);
        Person p1=new Person(8);
        Person p2=new Person(17);
        Person p3=new Person(12);
        TreeSet<Person> s=new TreeSet<>(new Comparator<Person>() {
            @Override
            public int compare(Person o1, Person o2) {
                return o1.age-o2.age;
            }
        });
        s.add(p);
        s.add(p1);
        s.add(p2);
        s.add(p3);
        for(Person pe:s) {
            System.out.println(pe);
        }
    }
}
```

1. 在定义变量的时候，实现java.lang包下的Compare接口，再实现compareTo方法

```java
public class Person implements Comparable<Person>{
    public int age;
    Person(int age){
        this.age=age;
    }
    public String toString(){
        return "年龄"+age;
    }

    @Override
    public int compareTo(Person o) {
        return this.age-o.age;
    }
}
```

# Map

## HashSet和HashMap的区别

HashSet是Set接口的一种实现方式，它的内部实现还是HashMap，元素作为HashMap的键存储，所有的值都指向同一个特殊值，通常为null。HashSet 底层封装了 HashMap 的方法，体现了装饰器模式的思想。

## HashMap的扩容机制

因为会出现hash冲突，如果数据太多，冲突会越来越严重，此时就需要扩容了。

在 HashMap 中有阈值的概念，阈值等于capacity*loadfactor，超过这个阈值就会触发扩容。

扩容的时候，默认会新建一个数组，新数组的大小是老数组的两倍。然后将 map 内的元素重新 hash 映射搬运到新的数组中。

在JDK 1.8后，数组的长度是2的次方，目扩容新数组的大小是老数组的两倍。因此只用看原来hash值最高位是否为是，如果是1说明需要移到新位置，且新位置的下标就是原下标+原数组大小，如果是0就还是在原位置。

## 为什么 HashMap 的容量是 2 的幂呢？

1. **提高计算索引效率**：当容量为2的幂时，可以通过 (n - 1) & hash 来代替取模操作，位运算的效率比取模运算高得多当容量是 2 的幂时，快速计算索引位置
2. **减少哈希冲突**：如果容量不是 2 的幂，进行与操作，某些低位的哈希值可能会被忽略，导致哈希冲突增加。
3. **简化扩容和再哈希**：当 HashMap 扩容时，新容量也是 2 的幂，这使得旧容量到新容量的映射关系非常简单，只需要判断原哈希值的最高有效位是 0 还是 1 就可以确定新索引位置，这简化了再哈希的过程。

## 什么是哈希冲突，怎么解决哈希冲突？

哈希冲突是不同的值经过哈希函数得到相同的hash值，因为哈希值相同，所以这些键会被映射到同一个槽中，也就是发生了哈希碰撞。

解决方法

1. 链地址法。将哈希表每个槽的位置变成一个链表，当多个键的哈希值相同时，将它们存储在同一个链表中
2. 开放寻址法。如果出现碰撞，寻找哈希表中的下一个可用位置。比如有线性探测法、平方探测法
3. 再哈希法。在出现碰撞时，使用第二个哈希函数计算新的索引位置

## Hashmap的底层数据结构

HashMap底层数据结构是数组+链表，JDK 8之后引入了红黑树。

数组内的元素包含了key和value，当put一个键值对时，会根据一个hash算法得出key的hash值，然后通过数组长度(n-1)&hash得到数组下标，然后根据数组下标，插入键值对。

可能会发生哈希冲突。HashMap通过链表法来解决的，JDK1.8之前采用的是头插法，JDK1.8之后采用尾插法。

不过，链表过长时，查询效率会比较低，于是当链表的长度超过 8 时，且数组的长度大于 64，链表就会转换为红黑树。当红黑树节点小于6时，又会退化成链表。

## 为什么链表转成红黑树，直接用红黑树不就得了？

因为红黑树的节点大小是普通链表节点大小的两倍，为了节省内存空间不会直接用红黑树。

## 为什么节点少于6要从红黑树变回链表

为了平衡时间和空间，节点数量少链表遍历也很快，变回链表节约内存。

为什么少于6再变？

是为了留一个缓冲余地。假如发生碰撞，节点增减刚好在8附近，会发生链表和红黑树的不断转换，导致资源浪费。

# JDK1.8对HashMap有什么改动？

1. 添加了红黑树机制
2. hash函数的优化，jdk1.8之后，将key的哈希码高16位和低16位进行异或，得到的 hash 值同时拥有高位和低位的特性，使得哈希码的分布更均匀，不容易冲突。
3. 扩容和rehash的优化，1.8之后数组长度为2的次方，扩容倍数为2倍，这样在rehash的时候只用判断原来hash值最高位是否为1，不为1就不用移动位置，为1就移动到新数组的对应位置，原来的位置+原来数组长度
4. 将头插法改成了尾插法，因为在扩容的时候容易逆序，逆序在多线程操作下可能会出现环，导致死循环。

# 你对红黑树了解多少？为什么不用二叉树/平衡树呢？

红黑树本质上是一种二叉查找树，为了保持平衡，它又在二叉查找树的基础上增加了一些规则：

1. 每个节点要么是红色，要么是黑色；
2. 根节点永远是黑色的；
3. 所有的叶子节点都是是黑色的（注意这里说叶子节点其实是图中的 NULL 节点）；
4. 每个红色节点的两个子节点一定都是黑色；
5. 从任一节点到其子树中每个叶子节点的路径都包含相同数量的黑色节点；

红黑树是一种相对平衡的二叉树，插入、删除、查找的最坏时间复杂度都为 O(logn)，避免了二叉树最坏情况下的O(n)时间复杂度。**所以不用二叉搜索树。**

平衡二叉树是比红黑树更严格的平衡树，为了保持平衡，需要修改的次数更多，保持平衡的效率比较低。所以采用红黑树。

# HashMap和HashTable的区别

1. HashMap是非线程安全的，Hashtable的方法加了同步锁，是线程安全的
2. HashMap没有同步开销，所以性能会高一些
3. Hashmap允许一个null健和多个null值；HashTable都不允许
4. HashMap默认容量为16，使用Iterator遍历，支持fail-fast机制；HashTable默认容量为11.【fail-fast 机制当多个线程对同一个集合的内容进行操作时，就可能会产生fai-fast事件。例如:当某一个线程A通过iterator去遍历某集合的过程中，若该集合的内容被其他线程所改变了;那么线程A访问集合时，就会批出ConcurentModificationException异常，产生fail-fast事件。】

# HashMap 是线程安全的吗？多线程下会有什么问题？

HashMap不是线程安全的，可能会发生这些问题：

1. 如果线程A和B同时插入HashMap，线程A判断没有发生哈希冲突，切换B线程，判断没有发生哈希冲突；切换A线程，赋值成功，切换B线程赋值成功，B线程的值覆盖了A线程的值，发生了数据覆盖，用户感受到是数据丢失。

```java
if ((p = tab[i = (n - 1) & hash]) == null)
        tab[i] = newNode(hash, key, value, null)
```

1. 插入元素的时候需要将hashMap的size++，但size变量没有保证原子性，因此多线程下size自增是存在原子性问题。即添加了两个元素，但是size只增加了1。

```java
if (++size > threshold)
        resize();
```

- 多线程下扩容死循环。JDK1.7 中的 HashMap 使用头插法插入元素，在多线程的环境下，扩容的时候有可能导致环形链表的出现，形成死循环。因此，JDK1.8 使用尾插法插入元素，在扩容时会保持链表元素原本的顺序，不会出现环形链表的问题。
- put 和 get 并发时，可能导致 get 为 null。线程 1 执行 put 时，因为元素个数超出 threshold 而导致 rehash，线程 2 此时执行 get，有可能导致这个问题。这个问题在 JDK 1.7 和 JDK 1.8 中都存在。

# 有什么办法能解决HashMap线程不安全的问题呢？

Java 中有 HashTable、Collections.synchronizedMap、以及 ConcurrentHashMap 可以实现线程安全的 Map。

1. HashTable 是直接在操作方法上加 synchronized 关键字，锁住整个table数组，粒度比较大；
2. Collections.synchronizedMap 是使用 Collections 集合工具的内部类，通过传入 Map 封装出一个 SynchronizedMap 对象，内部定义了一个对象锁，方法内通过对象锁实现；
3. ConcurrentHashMap 在jdk1.7中使用分段锁，在jdk1.8中使用CAS+synchronized。

# 说一下ConcurrentHashmap的实现

ConcurrentHashmap在jdk1.7版本是基于分段锁实现，在jdk1.8是基于CAS+synchronized实现。

### jdk1.7版本 分段锁

1.7版本的ConcurrentHashMap，引入了一个Segment数组，Segment继承了ReentrantLock，Segment则包含HashEntry的数组，实现线程安全原理就是先通过 key的 hash 判断得到 Segment数组的下标，将这个 Segment 上锁，然后再次通过 key的 hash 得到 Segment 里 HashEnty数组的下标，就和HashMap一致了。

![https://cdn.nlark.com/yuque/0/2024/png/39067949/1719322039413-937c26d4-36e2-4404-8e4b-ae8b0ca38947.png](https://cdn.nlark.com/yuque/0/2024/png/39067949/1719322039413-937c26d4-36e2-4404-8e4b-ae8b0ca38947.png)

实际上就是相当于每个Segment都是一个HashMap，默认的Segment数组长度是16，也就是支持16个线程的并发写，Segment之间相互不会受到影响。

jdk1.7的分段锁已经有了细化锁粒度的概念，但是它的缺陷是 Segment 数组一旦初始化了之后不会扩容，只有 HashEntny数组会扩容，这就导致并发度过于死板，不能随着数据的增加而提高并发度。

**put流程**

整个流程和HashMap非常类似，只不过是先定位到具体的Segment，然后通过ReentrantLock去操作而已。

1. 计算hash，定位到segment，segment如果是空就先初始化
2. 使用ReentrantLock加锁，如果获取锁失败则尝试自旋，自旋超过次数就阻塞获取，保证一定获取锁成功
3. 遍历HashEntry，就是和HashMap一样，数组中key和hash一样就直接替换，不存在就再插入链表，链表同样操作

### jdk1.8版本 CAS+synchronized

jdk1.8主要利用CAS机制和synchronized关键字。

实现思路也简单：当put一个值的时候

**put流程**

1. 首先计算hash，遍历node数组，如果node是空的话，就通过CAS+自旋的方式初始化
2. 如果发现hash==MOVED，说明需要扩容，执行扩容【支持协程扩容，多线程扩容】
3. 如果都不满足，就使用synchronized 将这个 node 上锁，写入数据，写入数据同样判断链表、红黑树，链表写入和HashMap的方式一样，key hash一样就覆盖，反之就尾插法，链表长度超过8就转换成红黑树

![https://cdn.nlark.com/yuque/0/2024/png/39067949/1719145462721-61e7012e-463b-4773-bcca-9bd61734f6a2.png](https://cdn.nlark.com/yuque/0/2024/png/39067949/1719145462721-61e7012e-463b-4773-bcca-9bd61734f6a2.png)

### get方法需要加锁吗

不需要加锁。保证 put 的时候线程安全之后，get 的时候只需要保证可见性，通过用 volatile 来修饰节点的 value 和 next 指针来实现的。

# ConcurrentHashMap为什么不支持key或value为null

1. 简化代码实现，在并发环境下，可以避免对null的特殊处理，提高代码的可维护性。
2. value不为null，避免二义性。多线程环境下，get方法返回null时，无法区分map到底是不存在这个key，还是被put(key,null)了。因为调用get(key)返回null后，再调用containsKey()，两个方法之间可能有别的线程put了这个key。

# HashMap 内部节点是有序的吗？

HashMap是无序的，根据 hash 值随机插入。

如果想使用有序的Map，可以使用LinkedHashMap 或者 TreeMap。

# 讲讲 LinkedHashMap

LinkedHashMap的父类是HashMap，所以HashMap有的它都有，然后基于HashMap做了一些拓展。 LinkedHashMap的 Entry增加before和after两个指针用于标识前置节点和后置节点。从而实现节点的有序。

# 讲讲 TreeMap

TreeMap内部通过红黑树来实现。可以让 key所属的类实现 Comparable 接口，或者自定义实现一个Comparator，传给 TreeMap 用于 key 的比较。默认是按照自然顺序(键的Comporable实现)排序。

TreeMap不允许键为null，允许值为null。

# HashMap的put流程

1. 首先通过hashcode()方法获得哈希值，再进行哈希值的扰动【用高16位和低16位进行异或操作，尽量哈希值的每一位都进行运算，减少哈希冲突】，获取一个新的哈希值。(key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
2. 根据哈希值计算下标，如果下表正好没有存放数据，直接插入即可；如果下标处有值且key相等则直接覆盖。tab[i = (n - 1) & hash])
3. key不相等就是发生了哈希冲突，判断table[i]是否为树节点，是则向树中插入节点。不是向链表中插入数据，
4. 如果链表中插入节点的时候，链表长度大于等于8，则需要把链表转换为红黑树。treeifyBin(tab, hash);
5. 最后所有元素处理完成后，判断是否超过阈值；threshold【maxLength*0.75】，超过则扩容。

# HashMap是怎么查找元素的？

1. 使用hashcode()获得哈希值，再使用扰动函数，获取新的哈希值
2. 通过哈希函数计算数组下标，获取节点
3. 当前节点和key匹配，直接返回
4. 否则，当前节点是否为树节点，查找红黑树
5. 否则，遍历链表查找

# 怎么遍历HashMap

1. 遍历entry
2. 分别遍历key和value
3. 通过iterator迭代器进行遍历
4. 通过lambda表达式进行遍历

```java
public class TraverseHashMap {
    public static void main(String[] args) {
        HashMap<Integer,Integer> map=new HashMap<>();
        map.put(1,1);
        map.put(2,1);
        map.put(3,1);

        //方式一：通过遍历entrySet
        for (Map.Entry<Integer,Integer> entry :map.entrySet()){
            System.out.println(entry.getKey()+entry.getValue());
        }

        //方式二：分别遍历keySet和values
        for (Integer key:map.keySet()){
            System.out.println(key);
        }
        for (Integer value: map.values()){
            System.out.println(value);
        }
        //方式三：使用迭代器进行迭代
        Iterator<Map.Entry<Integer,Integer>> entries=map.entrySet().iterator();
        while (entries.hasNext()){
            Map.Entry<Integer, Integer> next = entries.next();
            System.out.println(next.getKey()+next.getValue());
        }
        //方式四：通过lambda表达式进行遍历
        map.forEach((k,v)-> System.out.println("key:"+k+",value:"+v));
    }
}
```

# ConcurrentHashMap 能保证复合操作的原子性吗？

`ConcurrentHashMap` 是线程安全的，意味着它可以保证多个线程同时对它进行读写操作时，不会出现数据不一致的情况，也不会导致 JDK1.7 及之前版本的 `HashMap` 多线程操作导致死循环问题。但是，这并不意味着它可以保证所有的复合操作都是原子性的，一定不要搞混了！

复合操作是指由多个基本操作(如`put`、`get`、`remove`、`containsKey`等)组成的操作，例如先判断某个键是否存在`containsKey(key)`，然后根据结果进行插入或更新`put(key, value)`。这种操作在执行过程中可能会被其他线程打断，导致结果不符合预期。

例如，有两个线程 A 和 B 同时对 `ConcurrentHashMap` 进行复合操作，如下：

```java
// 线程 A
if (!map.containsKey(key)) {
map.put(key, value);
}
// 线程 B
if (!map.containsKey(key)) {
map.put(key, anotherValue);
}
```

如果线程 A 和 B 的执行顺序是这样：

1. 线程 A 判断 map 中不存在 key
2. 线程 B 判断 map 中不存在 key
3. 线程 B 将 (key, anotherValue) 插入 map
4. 线程 A 将 (key, value) 插入 map

那么最终的结果是 (key, value)，而不是预期的 (key, anotherValue)。这就是复合操作的非原子性导致的问题。

**那如何保证** `ConcurrentHashMap` **复合操作的原子性呢？**

`ConcurrentHashMap` 提供了一些**原子性的复合操作**，如 `putIfAbsent`、`compute`、`computeIfAbsent` 、`computeIfPresent`、`merge`等。这些方法都可以接受一个函数作为参数，根据给定的 key 和 value 来计算一个新的 value，并且将其更新到 map 中。

上面的代码可以改写为：

```java
// 线程 A
map.putIfAbsent(key, value);
// 线程 B
map.putIfAbsent(key, anotherValue);
```

或者：

```java
// 线程 A
map.computeIfAbsent(key, k -> value);
// 线程 B
map.computeIfAbsent(key, k -> anotherValue);
```

很多同学可能会说了，这种情况也能加锁同步呀！确实可以，但不建议使用加锁的同步机制，违背了使用 `ConcurrentHashMap` 的初衷。在使用 `ConcurrentHashMap` 的时候，尽量使用这些原子性的复合操作方法来保证原子性。

# 阻塞队列

BlockingQueue——Queue下的子接口

## 阻塞队列的特点

阻塞队列是一种特殊的队列，它具有以下几个特点：

1. 阻塞特性：当队列为空时，从队列中获取元素的操作将会被阻塞，直到队列中有新的元素被添加；当队列已满时，向队列中添加元素的操作将会被阻塞，直到队列中有空的位置，这就是等待唤醒机制。
2. 线程安全：阻塞队列内部通过同步机制来保证多线程环境下的数据一致性。
3. 有界性：阻塞队列可以设置容量上限，当队列满时，后续的元素将无法添加。
4. 公平性：阻塞队列可以选择公平或非公平的策略来决定线程的获取顺序。公平队列会按照线程的请求顺序进行处理（线程按先来后到顺序排队获取元素），而非公平队列则允许新的线程插队执行（线程竞争）。比如：SynchronousQueue。

阻塞队列常用于解决生产者-消费者问题，它能够有效地衔接生产者和消费者之间的速度差异，提供一种协调和安全的数据交互方式。

## 阻塞队列的核心方法

- 添加元素

| 方法      | 描述                                                    | 是否阻塞 |
| --------- | ------------------------------------------------------- | -------- |
| add方法   | 往队列尾部添加元素，内部调用offer方法                   | 否       |
| put方法   | 往队列尾部添加元素，如果队列已满，则阻塞等待            | 是       |
| offer方法 | 往队列尾部添加元素，如果队列已满，则返回false，不会阻塞 | 否       |

- 获取元素

| 方法     | 描述                                                         | 是否阻塞 |
| -------- | ------------------------------------------------------------ | -------- |
| take方法 | take方法：移除并返回队列头部的元素，如果队列为空，则阻塞等待 | 是       |
| poll方法 | 移除并返回队列头部的元素，如果队列为空，则返回null，不会阻塞 | 否       |
| peek方法 | 返回队列头部的元素（不移除），如果队列为空，则返回null，不会阻塞 | 否       |

## 常见的阻塞队列

1. ArrayBlockingQueue：基于数组实现的有界阻塞队列，它的容量在创建时指定，并且不能动态扩展。
2. LinkedBlockingQueue：基于链表实现的有界阻塞队列，链表的长度可以通过构造函数显式指定，如果使用默认的构造函数，则默认大小是Integer.MAX_VALUE。
3. PriorityBlockingQueue：基于优先级堆排序实现的阻塞队列（可扩容），元素按照优先级顺序进行排序。
4. SynchronousQueue：不存储元素的阻塞队列，每个插入操作都必须等待一个相应的删除操作，反之亦然。

## 阻塞队列的原理

常用的阻塞队列，比如：ArrayBlockingQueue、LinkedBlockingQueue、PriorityBlockingQueue底层都是采用ReentrantLock锁来实现线程的互斥，而ReentrantLock底层采用了AQS框架实现线程队列的同步，线程的阻塞是调用LockSupport.park实现，唤醒是调用LockSupport.unpark实现，具体可以看我之前的文章，SynchronousQueue底层虽然没有用AQS框架，但也用的是LockSupport实现线程的阻塞与唤醒。

阻塞队列的原理可以通过两个关键组件来解释：锁和条件变量。

- 锁

阻塞队列使用锁来保护共享资源，控制线程的互斥访问。在队列为空或已满时，线程需要等待相应的条件满足才能继续执行。

- 条件变量Condition

条件变量是锁的一个补充，在某些特定的条件下，线程会进入等待状态。当条件满足时，其他线程会通过调用条件变量的唤醒方法（比如signal()或signalAll()）来通知等待的线程进行下一步操作。

当一个线程从队列中获取元素时，它会使用lockInterruptibly()获取队列的锁，这个方法优先考虑中断。然后检查队列是否为空。如果不为空，就取出元素并返回；如果为空，这个线程将notEmpty.await()进入等待状态，直到其他线程向队列中插入元素并通过条件变量NotEmpty唤醒它。当一个线程试图向已满的阻塞队列插入元素时，它会获取队列的锁，并检查队列是否已满。如果已满，这个线程将进入等待状态，直到其他线程从队列中获取元素并通过条件变量NotFull唤醒它。

## 同步队列的使用场景

1. 生产者-消费者模型：阻塞队列能够很好地平衡生产者和消费者之间的速度差异，既能保护消费者不会消费到空数据，也能保护生产者不会造成队列溢出，能够有效地解耦生产者和消费者，提高系统的稳定性和吞吐量。
2. 线程池：在线程池中，阻塞队列可以作为任务缓冲区，将待执行的任务放入队列中，由线程池中的工作线程按照一定的策略进行执行。
3. 同步工具：阻塞队列还可以作为一种同步工具，在多线程环境下实现线程之间的协作。
4. 数据缓冲：阻塞队列可以用作数据缓冲区，当生产者的速度大于消费者的速度时，数据可以先存储在队列中，等待消费者处理
5. 事件驱动编程：阻塞队列可以用于事件驱动的编程模型，当事件发生时，将事件对象放入队列中，由消费者进行处理
