---
date: 2024-08-28
category:
  - Java基础
tag:
  - JVM
---

# JVM
## 基础知识

###  什么是JVM

JVM是一种规范，JVM调优是针对JVM规范参数的调优

JVM，也就是 Java 虚拟机，它是 Java 实现跨平台的基石。

Java 程序运行的时候，编译器会将 Java 源代码（.java）编译成操作系统无关的 Java 字节码文件（.class），接下来对应操作系统的 JVM 会对字节码文件进行解释，翻译成对应平台的机器指令并运行。

### Java是如何实现跨平台的？

跨平台指的是在不同的硬件或操作系统上，Java代码都能运行。Java代码运行需要先编译成.class字节码文件，再通过JVM转换成对应操作系统认识的二进制指令，JVM针对不同硬件和平台做了对应的开发，是的Java语言是跨平台的。

# 编译执行和解释执行的区别是什么，JVM采用那种方式？

编译执行是将整个文件转换成独立的可执行文件，再执行；解释执行是将每行代码执行。正常情况下 JVM 是解释执行，但是如果JVM发现这段逻辑执行特别频繁，是个热点代码，那么就会把它就会通过 JIT即时编译将其直持编译成机器码，这样就是编译执行了。

### JDK，JRE和JVM的区别

**（1）本质和概念区别**

JDK是Java Development Kit的缩写，是Java的开发工具包，它提供了编译、运行Java程序所需的各种工具和资源。

JRE是Java Runtime Environment的缩写，是Java运行环境，包含JVM标准实现及Java核心类库。

JVM是Java Virtual Mechinal的缩写，即Java虚拟机，它是整个java实现跨平台的最核心的部分。JVM是一种用于计算设备的规范，它是一个虚构出来的计算机，是通过在实际的计算机上仿真模拟各种计算机功能来实现的。

**（2）作用和使用上的区别**

JDK用于开发，程序开发者必须安装JDK来编译、调试程序；

JRE用于运行Java程序，它没有包含任何开发工具，如编译器和调试器等，因此普通用户只需要安装JRE来运行Java程序。

JVM负责解释执行字节码文件，是可运行java字节码文件的虚拟计算机。当使用Java编译器编译Java程序时，生成的是与平台无关的字节码，这些字节码只面向JVM。不同平台的JVM都是不同的，但它们都提供了相同的接口。

### JDK，JRE和JVM的联系

简单来讲，JDK包含了JRE，JRE包含了JVM。JDK是整个Java的核心，包括了Java运行环境JRE、Java工具和Java基础类库。JRE是运行JAVA程序所必须的环境的集合，包含JVM标准实现及Java核心类库。JVM是整个java实现跨平台的最核心的部分，能够运行以Java语言写的程序。

### JVM的内存区域如何划分？

主要分为线程共享的和线程私有的。

**线程私有的：**

- 程序计数器【下一条执行的指令行号；代码的流程控制和线程的上下文切换】
- 虚拟机栈【方法执行时在虚拟机栈中会有自己的栈帧，存储局部变量、方法出口、操作数栈等信息，在方法调用栈帧入栈，方法返回，栈帧出栈。】
- 本地方法栈【和虚拟机栈类似，服务native方法】

线程私有的这三个区域，会随着线程消亡而自动回收，所以不需要管理。

**线程共享的：【需要垃圾回收】**

- 堆【存放对象实例和数组；堆可以分为新生代、老年代、永久代；永久代在JDK8以后被元空间取代，不在堆内了】
- 方法区【主要存放类结构、常量、静态变量等等这样的全局的数据信息；JDK8之后存在元空间】

tip：如果方法中定义了静态变量 static int a=2;会放在方法区里。

![https://cdn.nlark.com/yuque/0/2024/png/39067949/1718334175153-c0e9a728-3c82-4925-ae9e-7c4948e4f8a4.png](https://cdn.nlark.com/yuque/0/2024/png/39067949/1718334175153-c0e9a728-3c82-4925-ae9e-7c4948e4f8a4.png)

# Java中堆和栈的区别

栈（Stack）：主要用于存储局部变量和方法的调用信息。在方法执行期间，局部变量（包括引用变量，但不包括它们引用的对象）被创建在栈上，并在方法结束时被销毁。

堆（Heap）：用于存储对象实例和数组。每当使用 new 关键字创建对象时，JVM 都会在堆上为该对象分配内存空间。

从其他方面进一步区分：

- 生命周期：栈空间的生命周期比较短，比如一次方法的调用，调用的时候存入，执行完成就被弹出释放。堆空间的数据生命周期会相对较长，堆空间是需要进行垃圾回收。
- 空间大小：栈的空间大小都是固定的，根据操作系统决定，如果是64位的则大小为8个字节。但是堆的空间大小并不确定，根据对象的大小进行一个划分。

# 什么是Java中的常量池？

常量池其实就是方法区的一部分，主要用于存储字面量和一些常量数据。

常量池的好处是减少内存的消耗，比如同样的字符串，常量池仅需存储一份。

且常理池在类加载后就已经准备好了，这样程序运行时可以快速的访问这些数据，提升运行时的效率。

不过在 Java 1.7 的时候，HotSpot 将字符串从方法区中的运行时常量池中剥离出来，把字符串常量池存储在堆内，因为字符串对象也经常需要被回收，因此放置到堆中好管理回收。

# Java的类加载机制

类加载是把字节码文件加载到内存中，将其转换为.class对象主要分为：加载、链接、初始化。

加载阶段，将 class 文件里面的内容加载到 JVM 中生成类对象。

JDK8 的时候一共有三种类加载器：

1）启动类加载器（Bootstrap ClassLoader），它是属于虚拟机自身的一部分，用C++实现的（JDK9后用 java 实现），主要负责加载<JAVA_HOME>lib 目录中或被-Xbootclasspath 指定的路径中的并且文件名是被虚拟机识别的文件，它是所有类加载器的父亲。

2） 扩展类加载器（Extension ClassLoader），它是 Java 实现的，独立于虚拟机，主要负责加载<JAVA_HOME>liblext目录中或被 java.ext.dirs 系统变量所指定的路径的类库。

3） 应用程序类加载器（Application ClassLoader），它是Java 实现的，独立于虚拟机。主要负责加载用户类路径（classPath）上的类库。

# 什么是Java中的逃逸分析？

逃逸分析是JIT中的一种优化，它用于确定对象是否可以被限定在某个方法或线程中，而不会被其它部分的代码引用。因此它的作用是：

1. 将内部对象分配在栈上

正常情况下我们分配对象都是在堆上，需要垃圾回收。但如果这个对象不可能会被外部访问，只会在当前的线程内被访问，就可以分配在栈上，变量会上随着方法的结束而自动销毁，这样就可以减少 GC工作。

1. 同步消除

消除该对象的同步锁，减少锁带来的性能开销。

1. 标量替换

将对象拆解为基本类型，直接在局部变量中维护。

# 垃圾回收

## 什么是垃圾回收机制

Java中垃圾回收指的是回收释放不再引用的实例对象，目的是为了减少[内存泄漏](https://so.csdn.net/so/search?q=%E5%86%85%E5%AD%98%E6%B3%84%E6%BC%8F&spm=1001.2101.3001.7020)和内存溢出现象的发生。

## 对象什么时候可以被回收

第一个是**引用计数法，第二个是可达性分析**算法

1. 引用计数法
2. 可达性算法

判断某对象是否与根对象【GC Roots】有直接或间接的引用，如果没有被引用，则可以当做垃圾回收

## 哪些对象可以做GC ROOTS

虚拟机栈和本地方法栈中直接引用的对象，方法区中的静态变量、常量引用的对象、被同步锁持有的对象

## 对象可以回收，就一定会被回收吗？

节点是可回收的，但是并不会马上的被回收！ 对象中存在一个【finalize】方法。当对象被标记为可回收后，当发生GC时，首先会判断这个对象是否执行了finalize方法，如果这个方法还没有被执行的话，那么就会先来执行这个方法，接着在这个方法执行中，可以设置当前这个对象与GC ROOTS产生关联，那么这个方法执行完成之后，GC会再次判断对象是否可达，如果仍然不可达，则会进行回收，如果可达了，则不会进行回收。但是影响安全和性能，JDK9 版本及后续版本中各个类中的 finalize 方法会被逐渐弃用移除。

## 垃圾回收算法

1. 标记-清理法【标记需要回收的对象。问题：产生很多的内存碎片】
2. 复制算法一般用于新生代【将内存分为相同的两块，每次使用其中的一块，当一块内存使用完后，将还存活的对象放到另一块内存中，再把使用的空间一次性清理掉。问题：使用内存变小；不适合老年代：存活数量比较多，复制性能会变得很差】
3. 标记-整理法，适合老年代【标记需要清楚的对象，但后续是让所有存活的对象向一端移动，然后直接清理掉端边界以外的内存】
4. 分代收集算法

只是根据对象存活周期的不同将内存分为几块。一般将 Java 堆分为新生代和老年代，这样我们就可以根据各个年代的特点选择合适的垃圾收集算法。

比如在新生代中，每次收集都会有大量对象死去，所以可以选择”复制“算法，只需要付出少量对象的复制成本就可以完成每次垃圾收集。而老年代的对象存活几率是比较高的，而且没有额外的空间对它进行分配担保，所以我们必须选择“标记-清除”或“标记-整理”算法进行垃圾收集。

## HotSpot 为什么要分为新生代和老年代？

1. 因为不同对象的生命周期不一样，所以可以采用不同的清除算法来优化处理，像新生代的对象“死亡率" 较高，因此复制算法比较合适（大部分对象都消失了，把存活的复制到一边，死亡的全部清理即可）而老年代的对象存活时间比较长，因此标记清除即可（存活对象比较多，整理或复制耗时比较长）
2. 分区后可以減少 GC暂停的时间，可以将堆分区回收。
   总而言之，分区是为了更高效地管理不同生命周期的对象。

## 为什么Java新生代被分为S0、S1、Eden区？

因为新生代对象存活时间较短的特性，适合复制算法。按正常思路将新生代一分为二，划两块区域，每次只使用其中一个，GC 后将存活的复制到另一个区域，然后清理老区域非存活对象，这样替换使用两块区域可以避免内存碎片的存在。但如果一分为二的话，内存空间利用率只有一半，不太划算。

所以，定义了三个区域，Eden 区和两个 Survivor 区，Eden 区+1个 Survivor 区可以比二分之一大，提升利用率，默认占比Eden 占80%，两个Survivor各占10%。然后利用两个 Survivor 来交替接收 gc 后存活的对象，比如当前用 Eden +s0 两块区域，gc 的时候将存活的对象拷贝至S1，然后清理 Eden和 s0，接着使用 Eden +S1 作为新的对象分配区域。

## 如果单个survivor存放不下还存活的对象怎么办？

超出的对象直接晋升到老年代。
如果老年代剩余的空间也放不下这些存活的对象怎么办？
如果是CMS 垃圾回收器，则会触发CMS 回收。如果CMS 回收不足以回收足够的空间，会触发 Full GC （Serial Old 回收器）。
如果是 G1 垃圾回收器则会触发 Mixed GC。

## 有哪些垃圾回收方式？

GC分为两大类，分别是 Partial GC 和 Full GC。
Partial GC 即部分收集，分为 youngGC、oldGC、mixedGC。
• younggc：指的是单单收集年轻代的 GC。
• old gc：指的是单单收集老年代的GC。
• mixed gc：这个是 G1 收集器特有的，指的是收集整个年轻代和部分老年代的 GC。
Full GC即整堆回收，指的是收取整个堆，包括年轻代、老年代，如果有永久代的话还包括永久代。

## 什么情况下会触发YoungGC?

1. 基本上是在年轻代的 eden 区快要被占满的时候会触发 young gC。eden 快满的触发因素有两个，一个是为对象分配内存不够，一个是为 TLAB 分配内存不够。
2. 有一些收集器的回收实现是在 full gc前会让先执行以下 young gc。比如 Parallel Scavenge，不过有参数可以调整让其不进行young gc。

## 什么情况下会触发FullGC？

- 老年代空间不足，大对象直接在老年代申请分配，如果此时老年代空间不足则会触发 full gc。
- 在要进行 younggc的时候，根据之前统计数据发现年轻代平均晋升大小比现在老年代剩余空间要大，那就会触发 full gc。
- 担保失败即 promotion failure，新生代的to 区放不下从 eden 和 from 拷贝过来的对象，或者新生代对象 gc年龄到达阈值需要晋升这两种情况，老年代如果放不下的话都会触发 full gc。
- 执行 System.gc()、jmap -dump 等命令会触发 full gc。
- 元空间或者永久代的话如果永久代满了也会触发full gc。

## 垃圾收集器

1. Serial收集器 【单线程的垃圾收集器，垃圾回收时会暂停所有工作线程】
2. Serial Old收集器【Serial收集器的老年代版本 单线程】
3. ParNew收集器【在Serial 收集器的基础上，使用多线程进行垃圾收集】
4. Parallel Scavenge 收集器【像CMS等收集器注重的是响应时间、而Parrallel收集器注重的是吞吐量(高效率的使用cpu)，JVM自适应策略，JDK8使用的垃圾收集器】也是STW
5. Parallel Old【Parallel Scavenge 收集器的老年代版本 标记-整理法 多线程】
6. CMS垃圾收集器【注重响应时间、第一次实现了gc线程和用户线程并发执行】
   1. 初始标记【标记那些与GCRoots直接相连的对象，STW】
   2. 并发标记【GC线程和用户线程并发运行，但是用户线程运行过程中会不断更新它的引用，无法保证GC线程可达性分析的有效性】
   3. 重新标记【STW，只有GC线程修改并发标记】
   4. 并发清除【用户线程和GC线程并发执行，GC线程会使用**标记-清除法**进行垃圾回收】

缺点：对CPU资源消耗较大【并发垃圾回收，会占用用户线程的资源，使用户程序性能下降】；产生内存碎片【标记-清理法】；无法处理浮动垃圾【最后一步，并发清除，还可能会产生垃圾】

## 介绍一下CMS垃圾收集器中为什么GC线程可以和用户线程一起工作？

主要是通过三色标记法，CMS将对象标记为三种颜色。白色，表示没有被GC扫描，扫描结束后白色的可以被回收。灰色，对象本身被扫描，还存在至少一个引用没有被扫描。黑色，对象本身及其所有的引用都被扫描过，黑色不能直接指向白色，不能被回收。
标记的过程大致如下：

1. 刚开始，所有的对象都是白色，没有被访问。
2. 将GC Roots直接关联的对象置为灰色。
3. 遍历灰色对象的所有引用，灰色对象本身置为黑色，引用置为灰色。
4. 重复步骤3，直到没有灰色对象为止。
5. 结束时，黑色对象存活，白色对象回收。

这个过程正确执行的前提是没有其他线程改变对象间的引用关系，然而，并发标记的过程中，用户线程仍在运行，因此就会产生漏标和错标的情况。

### **漏标**

假设GC已经在遍历对象B了，而此时用户线程执行了`A.B=null`的操作，切断了A到B的引用。B已经变为灰色，它仍会被当做存活对象，留到下次GC时回收，也算是浮动垃圾的一部分。这个问题可以通过「写屏障」来解决，只要在A写B的时候加入写屏障，记录下B被切断的记录，重新标记时可以再把B标为白色即可。

### 错标

A到B对象的间接引用被切断，但是重新建立了到B的直接引用。因为A已经标记为黑色，GC不会再遍历A了，所以B会被标记为白色，最后被当做垃圾回收。错标的结果比漏标严重的多，浮动垃圾可以下次GC清理，而把不该回收的对象回收掉，将会造成程序运行错误。

CMS是通过写屏障+增量更新来解决这个问题的，当直接引用被建立后，插入写屏障，记录这个新的引用关系，等扫描结束后，再以这些记录中的黑色对象为根，重新扫描一次。如果黑色对象建立了指向白色对象的引用，白色对象就会变为灰色对象，不会被回收。

## 介绍一下G1垃圾收集器

G1(Gabage First)收集器是一种面向服务器的垃圾收集器，主要用于多核CPU和大内存的服务器环境中。

G1 不再以固定大小和固定数量来划分分代区域，而是把连续的Java 堆划分为多个大小相等的独立区域（Region）。每一个 Region都可以根据不同的需求来扮演新生代的 Eden 空间、Survivor 空间或者老年代空间，收集器会根据其扮演角色的不同而采用不同的回收策略。

还有一些 Region 使用 H进行标注，它代表 Humongous，表示这些 Region 用于存储大对象，即大小大于等于 region一半的象。
G1 收集器的运行大致可以分为以下四个步骤：
1）初始标记 （Inital Marking）：标记 GC Roots能直接关联到的对象，修改TAMS（Top at Mark Start） 指针的值，让下一阶段用户线程并发运行时，能够正确的在 Reigion 中分配新对象。G1为每一个 Reigion 都设计了两个名为 TAMS 的指针，新分配的对象必须位于这两个指针位置以上，位于这两个指针位置以上的对象默认被隐式标记为存活的，不会纳入回收范围；
2）并发标记（Concurrent Marking）：从GC Roots能直接关联到的对象开始遍历整个对象图。遍历完成后，还需要处理 SATB 记录中变动的对象。SATB（snapshot-at-the-beginning，开始阶段快照）能够有效的解决并发标记阶段因为用户线程运行而导致的对象变动，其效率比CMS 重新标记阶段所使用的增量更新算法效率更高；
3）最终标记（Final Marking）：对用户线程做一个短暂的暂停，处理并发标记阶段结束后留下来的少量的 SATB 记录。虽然并发标记阶段会处理 SATB 记录，但由于处理时用户线程依然是运行中的，因此依然会有少量的变动，所以需要最终标记来处理；
4）筛选回收（Live Data Counting and Evacuation）：负责更新 Region 统计数据，按照各个 Region 的回收价值和成本进行排序，在根据用户期望的停顿时间进行来指定回收计划，可以选择任意多个Region 构成回收集。然后将回收集中 Region 的存活对象复制到空的 Region 中，再清理掉所有旧的Region。此时因为涉及到存活对象的移动，所以需要暂停用户线程，并由多个收集线程并行执行。

## G1垃圾收集器比CMS垃圾收集器的优点

1. 更精细的控制【G1垃圾收集器可以对指定的region区域进行回收】
2. 可以设置每次GC的停顿时间
3. 可以减少内存碎片【CMS采用的是标记-清理法，而G1的每个region都是通过指针碰撞来分配空间，回收的时候采用标记-整理法，会对region的内存进行规整，减少内存碎片的产生】
4. 为GC设置了优先级，根据允许的收集时间，优先回收价值最大的region

## 了解ZGC垃圾回收器吗?

ZGC的目标就是低延迟，几乎所有暂停都只依赖于GC Roots集合大小，不会随着堆的大小或者活跃对象的大小而增加。与ZGC对比，G1的转移阶段完全STW的，且停顿时间随存活对象的大小增加而增加。

CMS的YoungGC、G1、ZGC基于复制算法，复制算法大致可以分为三个阶段：

标记阶段：从GCRoots开始标记活跃对象

转移阶段：把活跃对象转移新的内存地址上

重定向阶段：所有指向对象旧地址的指针转移到对象的新地址上。

这三个阶段中，转移阶段需要分配新内存和复制对象，对象的复制耗时可能比较长，G1未能解决转移过程中准确定位对象地址的问题，所以这个阶段需要暂停用户线程，这也就是G1停顿时间的瓶颈。而ZGC只有初始标记、再标记、初始转移是STW的，并且停顿时间只和GCRoots大小有关。转移过程中准确访问对象的问题【GC在转移对象的时候，要保证并发运行的用户线程准确访问到新的对象】

ZGC通过着色指针和读屏障技术解决了这个问题，实现了并发转移。而在ZGC中，应用线程访问对象将触发读屏障，如果发现对象被移动了，那么“读屏障”会把读出来的指针更新到对象的新地址上，这样应用线程始终访问的都是对象的新地址。

JVM利用对象引用的地址，即染色指针来判断对象被移动过呢。

## 染色指针的运行过程？

染色指针就是从64位的指针中，拿出几位来标记对象此时的情况。

首先，在垃圾回收之前，指针的标记位是Remapped。

进入标记阶段，如果对象被GC标记线程或者用户线程访问过，那么就将对象的地址视图从Remapped调整为M0。所以，在标记阶段结束之后，ZGC会用一个对象活跃表来存储活跃对象，它们的地址标记是M0；如果对象的地址标记是Remapped，说明对象不活跃。

标记结束之后进入转移阶段：转移阶段中，GC线程访问对象，此时对象地址视图是 M0，并且存在或活跃表中，则将其转移，并将地址视图置为 Remapped。如果在活跃表中，但是地址视图已经是 Remapped 说明已经被转移了，不做处理。

应用线程此时访问对象，分为几种情况，如果对象在活跃表中，且地址视图为 Remapped 说明转移过了，不做处理。如果对象在活跃表中地址视图为 M0，则说明还未转移，则需要转移，并将其地址视图置为 Remapped。如果访问到的对象不在活跃表中，则不做处理。

## 指针标记位M1什么用？

M1 是在下一次GC 时候用的，下一次的GC就用M1来标记，不用M0。再下一次再换过来。
简单的说就是 M1标识本次垃圾回收中活跃的对象，而M0是上一次回收被标记的对象，但是没有被转移，在本次标记中也没有被标记为活跃的对象。
下一次 GC 如果还是用 M0来标识，就混淆了这两种对象。所以搞了个 M1。

## 总结一下ZGC

总而言之，ZGC 就是通过多阶段的并发和几个短暂的 STW 阶段来达到低延迟的特性。利用指针染色技术和读屏障实现并发转移对象。 ZGC不分代，就是没分新生代和老年代。ZGC的不分代其实是它的缺点，因为分代比较难实现，不过以后应该会加上吧（JDK 21 实现分代了）。

## JVM垃圾回收调优的主要目标是什么？

分别是最短暂停时间和吞吐量。

最短暂停时间：因为 GC会STW 暂停所有应用线程，这时候对于用户而言就等于卡顿了，因此对于时延敏感的应用来说减少STW的时间是关键。

吞吐量：对于一些对时延不敏感的应用比如一些后台计算应用来说，更关注总的停顿时间少，吞吐量高。

# 编译过程【混合模式】

- 解释器 Bytecode Intepreter
- JIT Just In Time Complier
- 混合模式
- 初始阶段采用解释器执行
- 热点代码检测
- 多次被调用的方法(方法计数器：监测方法执行频率)
- 多次被调用的循环(循环计数器：监测循环执行频率)
- 进行编译

为什么不直接使用编译？

1. 因为目前java的解释速度，在一些简单代码不输于编译速度
2. 如果有一个文件，执行内容非常多，先编译，这个启动速度会非常慢。

# 为什么编译模式启动慢，执行块；解释模式相反

在 JIT 编译模式下，**启动慢**的原因是：

- 当程序启动时，JVM 需要将字节码编译成本地机器码，这个编译过程需要一定的时间，尤其是对于大型程序或需要编译大量代码时。

**执行快**

编译后的机器码直接在硬件上运行，执行速度非常快，因为：

- 机器码是针对特定硬件优化的，消除了字节码解释的开销。
- 编译器可以进行各种优化，使得代码执行效率更高。

解释模式下，启动快的原因是：

- 不需要预先编译成机器码，解释器可以立即开始执行源代码。
- 程序启动时，不存在编译的开销，直接解释执行代码。

执行慢

执行慢的原因是：

- 每行代码都需要在运行时解释成机器码，这增加了额外的开销。
- 解释器在运行时不断进行翻译工作，导致执行效率低于直接运行编译后的机器码。

# 类加载过程

# 类加载过程是什么样的

类加载指的把字节码文件加载到虚拟机内存中，生成可以被JVM执行的Class对象

系统加载 Class 类型的文件主要三步：**加载->连接->初始化**。连接过程又可分为三步：**验证->准备->解析**。

1. 加载

- 读取.class文件的二进制字节流【没有规定二进制流的来源，可以从zip包、网络、其他文件、数据库等获取...】
- 将类信息、常量这些静态存储结构放入方法区中
- 在java堆中生成一个java.lang.Class对象，作为方法区的各种数据的访问入口

加载完成后，我们的内存中【运行时数据的方法区和堆中已经存在数据了】

方法区：类信息、静态变量、常量【方法区中还会装及时编译过后的热点代码，但不是这个时候装入方法区的】

堆：代表被加载类的java.lang.Class对象

1. 链接【验证、准备、解析】

- 验证 【验证.class文件的字节流是否符合标准，比如前四个字节是不是class文件标识符CAFEBABE等等】【验证和加载过程是交叉运行的】
- 准备【为类的静态变量分配内存并设置为当前类型的默认初始值【零值】，这里的类变量指的是没有被final修饰的static变量】
- 解析【将常量池中的符号引用替换为直接引用的过程】
  - 符号引用【**以一组符号来描述**，符号可以是任何形式的字面量，只要可以准确定位目标。】
  - 直接引用【可以是直接指向目标的指针、相对偏移量或是一个能间接定位到目标的句柄。如果有了直接引用，那引用的目标就肯定在内存中了】

1. 初始化【执行静态语句块，静态变量赋为初始值。执行类的构造器方法 clinic方法 是编译器自动生成的】

【假设这个类没有被加载和连接，则程序先加载并连接该类；假设该类的直接父类还没有被初始化，则先初始化其直接父类。】

# 3.2 有几种类加载器

当任何一个class文件，load到内存之后，会生成两块内容，第一块就是二进制文件，第二个生成了一个class对象。其他对象通过这个class对象去访问二进制文件。

class对象在metaspace中。常量是放在方法区中的，jdk1.8之前是放在永久代的，jdk1.8之后放在元空间

JVM中的所有class文件，都是被类加载器加载到内存的。

```sql
System.out.println(String.class.getClassLoader());
```

输出为null，说明String类是被启动类加载器加载的。【核心类都是被启动类加载器加载的】

![https://cdn.nlark.com/yuque/0/2024/png/39067949/1719834333367-41a5d535-27a8-4926-8d76-aa2b31d98f4d.png](https://cdn.nlark.com/yuque/0/2024/png/39067949/1719834333367-41a5d535-27a8-4926-8d76-aa2b31d98f4d.png)

- 父加载器不是类加载器的加载器，也不是类加载器的父类。【类加载器中有一个parent对象，为它的父加载器】。
- 类加载器的类加载器是启动类加载器。
- 类加载是反射的基石。

什么时候需要自己loadClass【自己加载一个类】？

1. Spring的动态代理技术，需要把新的类load到内存。
2. 热部署。

JVM 中内置了三个重要的 ClassLoader：

1. **BootstrapClassLoader(启动类加载器)**：最顶层的加载类，由 C++实现，通常表示为 null，并且没有父级，主要用来加载 JDK 内部的核心类库
2. **ExtensionClassLoader(扩展类加载器)**：主要负责加载 %JRE_HOME%/lib/ext 目录下的 jar 包和类以及被 java.ext.dirs 系统变量所指定的路径下的所有类。
3. **AppClassLoader(应用程序类加载器)**：面向我们用户的加载器，负责加载当前应用 classpath 下的所有 jar 包和类。
4. 自定义类加载器 通过继承 ClassLoader类实现

### 3.3 类加载过程代码

```java
protected Class<?> loadClass(String name, boolean resolve)
        throws ClassNotFoundException
    {
        synchronized (getClassLoadingLock(name)) {
            // First, check if the class has already been loaded
            //查看类有没有被加载过 是一个 native方法
            Class<?> c = findLoadedClass(name);
            //父类都没找着
            if (c == null) {
                long t0 = System.nanoTime();
                try {
                    if (parent != null) {
                        //让父加载器去加载
                        c = parent.loadClass(name, false);
                    } else {
                        c = findBootstrapClassOrNull(name);
                    }
                } catch (ClassNotFoundException e) {
                    // ClassNotFoundException thrown if class not found
                    // from the non-null parent class loader
                }
            //父类没有加载到，自己加载
                if (c == null) {
                    // If still not found, then invoke findClass in order
                    // to find the class.
                    long t1 = System.nanoTime();
                    //其他的地方都给实现好了
                    //只剩findClass需要自己定义，钩子函数 模版方法
                    c = findClass(name);

                    // this is the defining class loader; record the stats
                    sun.misc.PerfCounter.getParentDelegationTime().addTime(t1 - t0);
                    sun.misc.PerfCounter.getFindClassTime().addElapsedTimeFrom(t1);
                    sun.misc.PerfCounter.getFindClasses().increment();
                }
            }
            if (resolve) {
                resolveClass(c);
            }
            return c;
        }
    }
```

自定义ClassLoader只需要重写findClass代码

```java
protected Class<?> findClass(String name) throws ClassNotFoundException {
    throw new ClassNotFoundException(name);
}
```

### 3.2.2 自定义ClassLoader

1. 继承ClassLoader类，重写findClass对象
2. 读取class文件，转换为二进制文件
3. 在内存中通过defineClass方法，将二进制文件转换为class对象

### 3.2.3 lazyloading

- JVM并没有规定什么时候加载
- 但是严格规定了什么时候必须初始化

# 双亲委派机制

“向上委托，向下加载”

当类加载器进行加载时，会递归地询问它的父类有没有加载过，如果没有被加载过，会优先从顶级开始往下加载。如果AppClassLoader也加载失败，则会抛出异常**ClassNotFoundException**。

1.当AppClassLoader去加载一个class时，它首先不会自己去尝试加载这个类，而是把类加载请求委托给父加载器ExtClassLoader去完成。

2.当ExtClassLoader去加载一个class时，它首先也不会去尝试加载这个类，而是把类加载请求委托给父加载器BootstrapClassLoader去完成。

3.如果BootstrapClass加载失败（例如在JAVA_HOME/jre/lib里未找到该class），就会使用ExtClassLoader来尝试加载。

4.如果使用ExtClassLoader加载失败（例如在JAVA_HOME/jre/lib/ext里未找到该class）,就会使用AppClassLoader来尝试加载。如果AppClassLoader也加载失败，则会抛出异常ClassNotFoundException。

## 为什么要双亲委派机制

1. 使类有了层次的划分，比如java. Lang.Object 来说，经过一层层委托最终是由 Bootstrap ClassLoader 来加载的，这样如果有人自己造了个 java.lang.Object，如果我们是按照双亲委派模型来实现的话，最终加载到 JVM 中的只会是lib目录下rt.jar包里的内容，使得这些基础类代码得到了保护。
2. 防止内存中出现多份相同的字节码

## 怎样打破双亲委派机制？

1. 自定义类加载器：通过自定义ClassLoader的子类，重写**findClass()方法**，实现自定义的类加载逻辑。在**自定义类加载器**中，可以选择**不委派给父类加载器**，而是**自己去加载类**。
2. 线程上下文类加载器：通过Thread类的setContextClassLoader()方法，可以设置线程的上下文类加载器。在某些框架或库中，会使用线程上下文类加载器来加载特定的类，从而打破双亲委派机制。

## 为什么JDBC需要打破双亲委派机制？

因为类加载器受到加载范围的限制，在某些情況下父类加载器无法加载到需要的文件，这时候就需要委托子类加载器去加载class文件。
JDBC的Driver接口定义在JDK中，其实现由各个数据库的服务商来提供，比如MySQL驱动包。DriverManager 类中要加载各个实现了Driver接口的类，然后进行管理，但是DriverManager位于 $JAVA_HOME中jre/lib/rt.jar 包，由BootStrap类加载器加载，而
其Driver接口的实现类是位于服务商提供的Jar 包，所以需要由子类加载器去加载Driver实现，这就破坏了双亲委派模型。

## 类卸载需要满足什么条件？

类卸载：该类的class对象被垃圾回收。

满足条件：

1. 该类的所有的实例对象都已被 GC，也就是说堆不存在该类的实例对象。
2. 该类没有在其他任何地方被引用
3. 该类的类加载器的实例已被 GC

# class文件组成

1. 前四个字节【Magic Number魔数】 文件标识：表示是class文件，不是java文件

【CAFE BABE！！】

1. 5~6字节【Minor Version java小版本号】 7~8字节【Major Version java大版本号】

jdk8编译出来就是52

1. 9~10字节【constant_pool_count 常量个数】
2. 常量个数为constant_pool_count-1的常量值表。【常量值表是从1开始的】0号做了一个预留，代表没有任何常量

![https://cdn.nlark.com/yuque/0/2024/png/39067949/1719830205415-2b53f04c-1da4-4d0e-91dd-773912dfef12.png](https://cdn.nlark.com/yuque/0/2024/png/39067949/1719830205415-2b53f04c-1da4-4d0e-91dd-773912dfef12.png)

![https://cdn.nlark.com/yuque/0/2024/png/39067949/1719831163572-f47528db-226a-4ed7-9f74-6643fee2014c.png](https://cdn.nlark.com/yuque/0/2024/png/39067949/1719831163572-f47528db-226a-4ed7-9f74-6643fee2014c.png)

# JVM调优

windwos系统下没必要调优，因为没有服务器是windwos的。

- 为什么 -Xms和-Xmx大小设置相同？

减少内存弹性自适应，减少JVM额外负担。一般需要性能比较稳定的情况，都将最小堆内存和最大堆内存设置成一致。
