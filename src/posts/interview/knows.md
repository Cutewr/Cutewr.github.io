---
date: 2024-08-28
category:
  - 面试复盘
tag:
  - 八股
---

# 八股问答

## MySQL
- 慢sql优化
- mysql相关，有一张千万级数据表并且是线上的，现在需要进行数据迁移，如何平滑迁移，不影响线上，说大致思路(讨论后认为，可以通过日志复制，离线方式，然后再结合线上流量，insert操作直接打到新表)
- Mysql容灾

## redis
- redis高可用
- redis单线程为什么这么快
- redis集群，哨兵机制是什么，原理，容灾。有没有规定redis节点有多少个。盲猜2048。。
- redis锁流程
- 排行榜应该用哪种数据结构？
- redis如何实现高可用的？
- 你了解哨兵模式吗？
- 哨兵模式从client发起请求后的具体过程是什么样的（这里他帮我解答了）
- redis是单线程，你知道它具体是怎么实现并发的效果的吗？客户端的连接是怎样一个过程？
- 你有自己部署过集群吗？

## springboot
- springboot是怎么创建web容器的
- 项目里的分库分表，数据倾斜。
- 设计题：分布式id的唯一性。
- sql：订单表和产品表，查找卖出1千元的以上的产品。写错了，这个得用左链接。
- 自己怎么实现分布式锁
- 了解过哪些分布式项目（说了下etcd）
- 分布式锁的原理（讲了讲Redis的SetNX）
- 你的缓存和数据库怎么保持数据一致性的，有别的做法吗？（吟唱了一下Cache Aside）
- 面向对象三大特性
- static关键字有什么用（答了一下静态变量只初始化一次，单例模式，静态函数直接调用）
- lambda函数用过吗（讲了下变量捕获等等）
- rpc了解吗
- 面试官手写一个CMyString *s = new CMyString（“hello”）；让我分析这个s指针指的内存地址里第一个字节是什么，第二个字节是什么，按顺序这些字节里面装的都是什么？（我结合了java对象结构来分析的因为cpp的我确实不熟）
- 了解 一些 中间件
- 怎么避免死锁？程序方面怎么设计？（说用的很少，只记得有个接口可以）
- TCP怎么保证传输安全性？
- 为什么要有阻塞队列？
- 我要设计一个具有任务优先级性质的线程池怎么设计？（说了下调整成优先阻塞队列参数，或者考虑具体任务的重要程度...有点胡诌但还是尽量说了）
- JVM内存管理了解吗，如果我要保证一个对象不被回收应该怎么设计？
这题，我答的方向是垃圾回收，说设计一个常量对象保持不断对它的引用就不会被回收。面试官说的是ByteBuffer类，直接分配的字节缓冲区，不收JVM控制。感兴趣去搜一下。
- 虚拟内存
- 分页管理（这个真的是忘了，只记得4kb一页）
- hashmap，怎么解决碰撞？追问怎么扩容？扩容难道所有元素都要重新hash吗？有没有办法加速？
- https了解吗？https是怎么防止网络攻击的？（这个也有点忘记了）
- 快排（答出复杂度和基准选取）
- tcp、追问拥塞控制、拥塞避免有阈值吗，无限制增长吗？（忘了，当场分析提出猜想，看他点头）
- concurrenthashmap了解吗？追问红黑树了解吗？（寄，红黑树没仔细研究过）
- 如果我有千万级别的数据，你怎么存储？
- 你项目里面没有用秒杀，秒杀场景你怎么做设计？（高并发all in了）
- 我要设计一个停车场管理系统，你要考虑哪些方面？（这个问题讨论了非常非常久，并且他一直引导我的思路，比如提示门禁功能——我说设计身份验证和拦截功能、提示车辆类型——设计分类或者分区管理，车辆分类字段、提示特权功能——设计会员或者月卡系统）
- 项目有排查过死锁吗？
- 假设没有数据库，没有redis，不考虑锁，并发场景下你会怎么去保证数据安全？
- redis和lua脚本结合，为什么用lua脚本，优势在哪
- mq相关，接触过的mq，优缺点
- 如何保障mq的可靠性，不丢失
- 从消费者考虑，重复消费或者宕机后重启，除了设置手动提交offset，有其他的方式吗，这里答的可以每次拉取消息后对比数据表里，如果重复消费就抛弃消息或者重新加入队列，提示可以借助其他的工具进行呢？答，通过redis保存当前offset，避免查库。
- java相关，java的hashmap结构，流程，扩容机制，什么时候变成红黑树，什么时候回退
- jvm结构，一个实际线上问题，如果看到Java进程，持续占用内存很高，怎么排查？(jvm调优，参数，代码)
- 如果考虑不仅仅是自身问题呢，怎么排查机器问题？(top命令，看使用cpu的进程排行，看程序依赖的其他应用)，追问可以从连接上考虑，比如怎么查询time wait阶段的连接？(通过netstat -nat | grep TIME_WAIT查看)，排查连接后是不是可以进行分析，是否连接数不合理，进而分析一些机器问题。
- 一个文件里一行有一个8位的电话号，很多文件，数据大到内存无法容纳，如何统计不同电话号出现的次数？
先说思路，文件分块读，单纯统计哪些出现→用set，因为电话号范围是00000000-99999999共10^9个数，int型可以容纳，根据os不同int所占大小不同，这里取32位，即4B，一共可能有10^8大小，因此set最大4*10^8B≈400MB。如果考虑统计次数，用map，为了简化我们的统计，key是号码仍然用int，多的就是val的大小，事先如果已知出现次数的范围，用int或者long计数，int则在set基础上多一倍，800MB，lomg这里假设是int两倍，则1.2GB。
面试官提到像一些单片机和一些简单的设备，内存还是太多了，用一些基础的结构？想到了bitmap，号码是多少就把第几位变成1。大小就只需要10^8bit≈12510^5B≈12.5MB。那如果考虑需要统计多少次呢？那就用连续的几位来进行二进制加法计数，比如次数不超过255就连续8位表示次数，空间需要12.58=100MB，以此类推。
那就实现一下最初说的Map方法吧，进行了coding
刚刚的hashmap如果在累加过程中，val的Integer溢出，map会有什么处理吗(我记得没有，会抛出异常，所以我catch了)
- java注解的原理和用途
- 假设我是一个不懂java的人，怎么给我介绍java aop
- 反射了解吗，是java的特性的话，c++有反射吗，反射和黑客所说的hook，钩子有关系吗
- redis为什么快(传统八股)
- redis怎么保证数据安全的，会发生丢失吗
- 如果数据过大，redis性能会不会受限，接近mysql
- 关系型数据库和非关系型数据库的区别联系
- mysql你是怎么学的
- mysql主从复制分类和原理
- mysql除了binlog，还有其他的吗，什么作用
- 执行sql语句过程是什么，binlog，redolog这些什么时候写
- binlog具体作用是什么
- 如果现在有一台主一台备，采用半同步复制，必须要binlog吗，如果没有备呢
- 秒杀系统，redis作用，如果并发几十万，库存10，如何设计，怎么扛得住并发，而且不超卖(这里确实有点问题，回答偏了，答到先放部分库存容错，后续再开一次秒杀了)
- SYN具体是用来干什么的呢？
- 有碰到过网络波动的这种情况吗？怎么去排查？
- 你们现在上下游应该都是通过RPC去调用，如果你调用的接口挂了，和你对接的人死活不配合，你应该怎么去排查呢？（我说看出参和入参的日志，面试官引导我从网络去回答）
这里面试官引导我从IP和TCP的角度去回答，但是我没get到他的意思
- 比如说，你如何去看一个主机，它能否连接到呢？ 答曰ping。ping的具体过程了解吗，或者说，是谁给ping进行了回复？
刚刚其实是从IP层去思考
还有别的方法吗？（我只能摇摇头，面试官又帮我回答了）还要去测试端对端的这种
- 怎么测试端口能否跑通？（摇头xN）利用talent，没有用过吗？那可能java用的比较少
- 我还答了个去抓包，面试官问有抓过包吗？常用的抓包工具了解吗？（不了解，哦wireshark啊，但是没用过打扰了）
- HTTPS怎么保证安全性的知道吗？或者它怎么实现三次握手的？
- 对称加密和非对称加密详细说一下
- CPU飙升的场景怎么排查？用哪些工具？
- 看你写了RPC，RPC概念是什么？和http区别是什么？
## 消息队列
- 应用场景