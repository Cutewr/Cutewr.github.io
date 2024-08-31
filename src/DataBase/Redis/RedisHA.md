---
date: 2024-08-30
category:
  - 数据库
tag:
  - Redis
  - 高可用
---

# Redis高可用

高可用HA（High Availability）是分布式系统架构设计中必须考虑的因素之一，它通常是指，通过设计减少系统不能提供服务的时间。

假设系统一直能够提供服务，我们说系统的可用性是100%。如果系统每运行100个时间单位，会有1个时间单位无法提供服务，我们说系统的可用性是99%。很多公司的高可用目标是4个9，也就是99.99%，这就意味着，系统的年停机时间为8.76个小时。

那么如何保证系统的高可用呢？

在整个架构的每个节点中，不允许存在『单点问题』，因为单点一定是高可用最大的风险点，我们应该在系统设计过程中去避免单点问题。

在实现方法上，一般采用的就是集群部署、或者冗余部署来实现。这样的设计使得如果某个节点出现故障，其他的节点还可以继续使用。

## Redis中高可用设计的必要性

Redis作为一个高性能Nosql中间件，会有很多热点数据存放在Redis中，一旦Redis-server出现故障，会导致所有相关业务访问都出现问题。另外，即便是设计了数据库兜底的方案，大量请求对数据库的访问也很容易导致数据库出现瓶颈，造成更大的灾难。

除此之外，Redis的集群部署还可以带来额外的收益：

- 负载（性能），Redis本身的QPS已经很高了，但是如果在一些并发量非常高的情况下，性能还是会受到影响。这个时候我们希望有更多的Redis服务来完成工作。
- 扩容（水平扩展），第二个是出于存储的考虑。因为Redis所有的数据都放在内存中，如果数据量大，很容易受到硬件的限制。升级硬件收效和成本比太低，所以我们需要有一种横向扩展的方法。

在Redis中，提供了高可用方案包含以下几种：

- 主从复制（用来实现读写分离）
- 哨兵机制（实现master选举）
- 集群机制（实现数据的分片）

## Redis的Master-Slave方法

主从复制模式，简单来说就是把一台Redis服务器的数据，复制到其他Redis服务器中。其中负责复制数据的来源称为master，被动接收数据并同步的节点称为slave，数据的复制是单向的，如图5-1所示，对于主从模式，其实有很多的变体。

在很多组件中都有使用这种思想，比如mysql的主从复制、Redis的主从复制、activemq的主从复制、kafka里面的数据副本机制等等，所以大家需要举一反三，融会贯通。

![](https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/image-20240830145144025.png)



### 主从复制的好处

1. 数据冗余，主从复制实现了数据的热备，是除了持久化机制之外的另外一种数据保存方式。
2. 读写分离，在主从复制的基础上，配合读写分离机制，可以由主节点提供写服务，从节点提供读服务。在读多写少的场景中，可以增加从节点来分担主节点的读取能力，从而提高Redis-server的并发量
4. 保证高可用，作为后备数据库，如果主节点出现故障后，可以切换到从节点继续工作，保证Redis-server的高可用。

### Redis如何配置主从复制

**需要注意，Redis的主从复制，是直接在从节点发起就行，主节点不需要做任何事情**

在Redis中有三种方式来开启主从复制。

- 在从服务器的Redis.conf配置文件中加入下面这个配置

  ```shell
  replicaof master_ip master_port
  ```

- 通过启动命令来配置，也就是启动slave节点时执行如下命令

  ```shell
  ./Redis-server ../Redis.conf --replicaof <masterip> <masterport>
  ```

- 启动Redis-server之后，直接在客户端窗口执行下面命令

  ```shell
  Redis>replicaof master_ip master_port
  ```

#### 准备三台虚拟机

准备好三台虚拟机，并且这三台虚拟机需要能相互ping通，以及相互能够访问6379这个端口，如果访问不了，需要关闭防火墙。

> firewall-cmd --zone=public --add-port=6379/tcp --permanent

- 192.168.221.128（master）
- 192.168.221.129（slave）
- 192.168.221.130（slave）

这三台机器上都需要安装Redis-server，安装步骤如下。

> 注意事项，Redis6安装需要gcc版本大于5.3以上，否则安装会报错。

```shell
# 升级到gcc 9.3：
yum -y install centos-release-scl
yum -y install devtoolset-9-gcc devtoolset-9-gcc-c++ devtoolset-9-binutils
scl enable devtoolset-9 bash
# 需要注意的是scl命令启用只是临时的，退出shell或重启就会恢复原系统gcc版本。
# 如果要长期使用gcc 9.3的话：
echo -e "\nsource /opt/rh/devtoolset-9/enable" >>/etc/profile
```

> **开始安装**

```shell
cd /usr/local/
wget http://download.Redis.io/releases/Redis-6.0.9.tar.gz
tar -zxvf Redis-6.0.9.tar.gz
cd Redis-6.0.9
make
make test
make install PREFIX=/data/program/Redis 
cp Redis.conf /data/program/Redis/Redis.conf
```

#### 演示配置过程

在192.168.221.129和192.168.221.130这两台机器上分别按照下面的操作增加配置。

- 编辑Redis.conf文件，通过shift+g跳转到最后一行，增加如下配置

  ```shell
  replicaof 192.168.221.128 6379
  ```

- 分别启动这两台机器，启动成功后，使用如下命令查看集群状态

  ```shell
  Redis> info replication
  ```

- 启动日志中可以看到，在启动过程中已经从master节点复制了信息。

```txt
  66267:S 12 Jul 2021 22:21:46.013 * Loading RDB produced by version 6.0.9
  66267:S 12 Jul 2021 22:21:46.013 * RDB age 50 seconds
  66267:S 12 Jul 2021 22:21:46.013 * RDB memory usage when created 0.77 Mb
  66267:S 12 Jul 2021 22:21:46.013 * DB loaded from disk: 0.000 seconds
  66267:S 12 Jul 2021 22:21:46.013 * Ready to accept connections
  66267:S 12 Jul 2021 22:21:46.013 * Connecting to MASTER 192.168.221.128:6379
  66267:S 12 Jul 2021 22:21:46.014 * MASTER <-> REPLICA sync started
  66267:S 12 Jul 2021 22:21:46.015 * Non blocking connect for SYNC fired the event.
  66267:S 12 Jul 2021 22:21:46.016 * Master replied to PING, replication can continue...
  66267:S 12 Jul 2021 22:21:46.017 * Partial resynchronization not possible (no cached master)
  66267:S 12 Jul 2021 22:21:46.039 * Full resync from master: acb74093b4c9d6fb527d3c713a44820ff0564508:0
  66267:S 12 Jul 2021 22:21:46.058 * MASTER <-> REPLICA sync: receiving 188 bytes from master to disk
  66267:S 12 Jul 2021 22:21:46.058 * MASTER <-> REPLICA sync: Flushing old data
  66267:S 12 Jul 2021 22:21:46.058 * MASTER <-> REPLICA sync: Loading DB in memory
  66267:S 12 Jul 2021 22:21:46.060 * Loading RDB produced by version 6.2.4
  66267:S 12 Jul 2021 22:21:46.060 * RDB age 0 seconds
  66267:S 12 Jul 2021 22:21:46.060 * RDB memory usage when created 1.83 Mb
  66267:S 12 Jul 2021 22:21:46.060 * MASTER <-> REPLICA sync: Finished with success
```

**如果没有开启日志，可以通过下面的方法进行开启**

> - 找到Redis的配置文件 Redis.conf
> - 打开该配置文件， vi Redis.conf;
> - 通过linux的查询命令找到 (loglevel下面)logfile " " ;
> - 在冒号里面输入日志的路径，比如logfile “/usr/local/Redis/log/Redis.log”， 需要提前创建好目录和文件，Redis默认不会创建该文件。

接着，我们在master节点上通过设置一些key，会发现数据立刻就同步到了两个slave节点上，从而完成了主从同步功能。不过在默认情况下，slave服务器是只读的，如果直接在slave服务器上做修改，会报错. 不过可以在slave服务器的Redis.conf中找到一个属性，允许slave服务器可以写，但是不建议这么做。因为slave服务器上的更改不能往master上同步，会造成数据不同步的问题

```shell
slave-read-only no 
```

### Redis主从复制的原理分析

Redis的主从复制分两种，一种是全量复制，另一种是增量复制。

#### 全量复制

下图为Redis主从全量复制的整体时序图，全量复制一般发生在Slave节点初始化阶段，这个时候需要把master上所有数据都复制一份，具体步骤是：

- 从服务器连接主服务器，发送SYNC命令；
- 主服务器接收到SYNC命名后，开始执行BGSAVE命令生成一份RDB文件，并使用缓冲区记录此后执行的所有写命令；
- 主服务器BGSAVE执行完后，向所有从服务器发送快照文件，并在发送期间继续记录被执行的写命令（**表示RDB异步生成快照期间的数据变更**）；
- 从服务器收到快照文件后丢弃所有旧数据，载入收到的快照；
- 主服务器快照发送完毕后开始向从服务器发送缓冲区中的写命令；
- 从服务器完成对快照的载入，开始接收命令请求，并执行来自主服务器缓冲区的写命令；

![](https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/1666682-20211023095418809-367724219-20240830145346039.png)

**问题：生成RDB期间，master接收到的命令怎么处理？**

开始生成RDB文件时，主节点会把所有新的写命令缓存在内存中。在 从节点保存了RDB之后，再将缓冲区中新的写命令复制给从节点。（跟AOF重写期间的思路是一样的）

> 完成上面几个步骤后就完成了slave服务器数据初始化的所有操作，slave服务器此时可以接收来自用户的读请求，同时，主从节点进入到命令传播阶段，在这个阶段主节点将自己执行的写命令发送给从节点，从节点接收命令并执行，从而保证主从节点数据的一致性。

在命令传播阶段，除了发送写命令，主从节点还维持着心跳机制：PING和REPLCONF ACK。

下面演示一下主从复制具体的实现。

1. 在slave服务器Redis cli上执行 **REPLCONF listening-port 6379** (向主数据库发送replconf命令说明自己的端口号)
2. 开始同步，向master服务器发送sync命令开始同步，此时master会发送快照文件和缓存的命令。

```shell
  127.0.0.1:6379> sync
  Entering replica output mode...  (press Ctrl-C to quit)
  SYNC with master, discarding 202 bytes of bulk transfer...
  SYNC done. Logging commands from master.
  "ping"
  "ping"
```

3. slave会将收到的内容写入到硬盘上的临时文件，当写入完成后会用该临时文件替换原有的RDB快照文件。需要注意的是，在同步的过程中slave并不会阻塞，仍然可以处理客户端的命令。默认情况下slave会用同步前的数据对命令进行响应，如果我们希望读取的数据不能出现脏数据，那么可以在Redis.conf文件中配置下面的参数，来使得slave在同步完成对所有命令之前，都回复错误:**SYNC with master in progress**

```shell
slave-serve-stale-data no
```

4. 复制阶段结束后，master执行的任何非查询语句都会异步发送给slave。 可以在master节点执行set命令，可以在slave节点看到如下同步的指令。

```shell
Redis > sync
"set","11","11"
"ping"
```

另外需要注意的是：

master/slave 复制策略是采用乐观复制，也就是说可以容忍在一定时间内master/slave数据的内容是不同的，但是两者的数据会最终同步成功。

具体来说，Redis的主从同步过程本身是异步的，意味着master执行完客户端请求的命令后会立即返回结果给客户端，然后异步的方式把命令同步给slave。这一特征保证启用主从复制后 master的性能不会受到影响。

但是另一方面，如果在这个数据不一致的窗口期间，master/slave因为网络问题断开连接，而这个时候，master是无法得知某个命令最终同步给了多少个slave数据库。不过Redis提供了一个配置项来限制只有数据至少同步给多少个slave的时候，master才是可写的：

```shell
min-replicas-to-write 3     表示只有当3个或以上的slave连接到master，master才是可写的
min-replicas-max-lag 10     表示允许slave最长失去连接的时间，如果10秒还没收到slave的响应，则master认为该slave以断开
```

修改master Redis服务的Redis.conf， 打开这两个配置，重启即可看到效果

#### 增量复制

从Redis2.8开始，主从节点支持增量复制，并且是支持断点续传的增量复制，也就是说如果出现复制异常或者网络连接断开导致复制中断的情况，在系统恢复之后仍然可以按照上次复制的地方继续同步，而不是全量复制。

它的具体原理是：主节点和从节点分别维护一个复制偏移量（offset），代表的是**主节点向从节点传递的字节数**；主节点每次向从节点传播N个字节数据时，主节点的offset增加N；从节点每次收到主节点传来的N个字节数据时，从节点的offset增加N。主从节点的偏移量可以分别保存在：`master_repl_offset`和`slave_repl_offset`这两个字段中，通过下面的命令可以查看。

```shell
127.0.0.1:6379> info replication
# Replication
role:slave
master_host:192.168.221.128
master_port:6379
master_link_status:up
master_last_io_seconds_ago:1
master_sync_in_progress:0
slave_repl_offset:77864
slave_priority:100
slave_read_only:1
connected_slaves:0
master_replid:acb74093b4c9d6fb527d3c713a44820ff0564508
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:77864
second_repl_offset:-1
repl_backlog_active:1   # 开启复制缓冲区
repl_backlog_size:1048576  # 缓冲区最大长度
repl_backlog_first_byte_offset:771  # 起始偏移量，计算当前缓存区可用范围
repl_backlog_histlen:77094  # 以保存数据的有效长度
```

#### 无磁盘复制

前面我们说过，Redis主从复制是基于RDB方式的持久化实现的，也就是master在后台保存RDB快照，slave接收到RDB文件并载入，但是这种方式会存在一些问题。

1. 当master禁用RDB时，如果执行了复制初始化操作，Redis依然会生成RDB快照，当master下次启动时执行该RDB文件的恢复，但是因为复制发生的时间点不确定，所以恢复的数据可能是任何时间点的。就会造成数据出现问题
2. 当硬盘性能比较慢的情况下（网络硬盘），那初始化复制过程会对性能产生影响

因此2.8.18以后的版本，Redis引入了无硬盘复制选项，可以不需要通过RDB文件去同步，直接发送数据，通过以下配置来开启该功能：

```shell
repl-diskless-sync yes
```

**master在内存中直接创建rdb，然后发送给slave，不会在自己本地落地磁盘了**

#### 主从复制注意事项

主从模式解决了数据备份和性能（通过读写分离）的问题，但是还是存在一些不足：

1、第一次建立复制的时候一定是全量复制，所以如果主节点数据量较大，那么复制延迟就比较长，此时应该尽量避开流量的高峰期，避免造成阻塞；如果有多个从节点需要建立对主节点的复制，可以考虑将几个从节点错开，避免主节点带宽占用过大。此外，如果从节点过多，也可以调整主从复制的拓扑结构，由一主多从结构变为树状结构。

2、在一主一从或者一主多从的情况下，如果主服务器挂了，对外提供的服务就不可用了，单点问题没有得到解决。如果每次都是手动把之前的从服务器切换成主服务器，这个比较费时费力，还会造成一定时间的服务不可用。

## Master自动选举之Sentinel哨兵机制

在前面讲的master/slave模式，在一个典型的一主多从的系统中，slave在整个体系中起到了数据冗余备份和读写分离的作用。当master遇到异常中断后，开发者可以通过手动方式选择一个slave数据库来升级到master，使得系统能够继续提供服务，这个过程需要人工干预，比较麻烦； Redis并没有提供自动master选举功能，而是需要借助一个哨兵来进行监控。

### 什么是哨兵

顾名思义，哨兵的作用就是监控Redis系统的运行状况，它的功能包括两个

1. 监控master和slave是否正常运行
2. master出现故障时自动将slave数据库升级为master

哨兵是一个独立的进程，使用哨兵后的集群架构如下图所示。同时为了保证哨兵的高可用，我们会对Sentinel做集群部署，因此Sentinel不仅仅监控Redis所有的主从节点，Sentinel也会实现相互监控。

![](https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/image-20240830145443588.png)

### 配置哨兵集群

在前面主从复制的基础上，增加三个sentinel节点，来实现对Redis中master选举的功能。

- 192.168.221.128（sentinel）
- 192.168.221.129（sentinel）
- 192.168.221.130（sentinel）

sentinel哨兵的配置方式如下：

- 从Redis-6.0.9源码包中拷贝sentinel.conf文件到Redis/bin安装目录下

```shell
  cp /data/program/Redis-6.0.9/sentinel.conf /data/program/Redis/sentinel.conf
```

- 修改以下配置

```shell
  # 其中name表示要监控的master的名字，这个名字是自己定义，ip和port表示master的ip和端口号,最后一个2表示最低通过票数，也就是说至少需要几个哨兵节点认为master下线才算是真的下线
  sentinel monitor mymaster 192.168.221.128 6379 2 
  sentinel down-after-milliseconds mymaster 5000   # 表示如果5s内mymaster没响应，就认为SDOWN
  sentinel failover-timeout mymaster 15000         # 表示如果15秒后,mysater仍没活过来，则启动failover，从剩下的slave中选一个升级为master
  logfile "/data/program/Redis/logs/sentinels.log"  # 需要提前创建好文件
```

- 通过下面这个命令启动sentinel哨兵

```shell
  ./Redis-sentinel ../sentinel.conf
```

- 启动成功后，得到一下信息，表示哨兵启动成功并且开始监控集群节点

```shell
  103323:X 13 Jul 2021 15:16:28.624 # Sentinel ID is 2e9b0ac7ffbfca08e80debff744a4541a31b3951
  103323:X 13 Jul 2021 15:16:28.624 # +monitor master mymaster 192.168.221.128 6379 quorum 2
  103323:X 13 Jul 2021 15:16:28.627 * +slave slave 192.168.221.129:6379 192.168.221.129 6379 @ mymaster 192.168.221.128 6379
  103323:X 13 Jul 2021 15:16:28.628 * +slave slave 192.168.221.130:6379 192.168.221.130 6379 @ mymaster 192.168.221.128 6379
  103323:X 13 Jul 2021 15:16:48.765 * +fix-slave-config slave 192.168.221.130:6379 192.168.221.130 6379 @ mymaster 192.168.221.128 6379
  103323:X 13 Jul 2021 15:16:48.765 * +fix-slave-config slave 192.168.221.129:6379 192.168.221.129 6379 @ mymaster 192.168.221.128 6379
```

**其他两个节点的配置和上面完全相同，都去监视master节点即可**。

当其他sentinel哨兵节点启动后，第一台启动的sentinel节点还会输出如下日志，表示有其他sentinel节点加入进来。

```shell
+sentinel sentinel d760d62e190354654490e75e0b427d8ae095ac5a 192.168.221.129 26379 @ mymaster 192.168.221.128 6379
103323:X 13 Jul 2021 15:24:31.421 
+sentinel sentinel dc6d874fe71e4f8f25e15946940f2b8eb087b2e8 192.168.221.130 26379 @ mymaster 192.168.221.128 6379
```

### 模拟master节点故障

我们直接把Redis主从复制集群的master节点，通过`./Redis-cli shutdown`命令停止，于是我们观察三个sentinel哨兵的日志，先来看第一台启动的sentinel日志，得到如下内容。

```shell
103625:X 13 Jul 2021 15:35:01.241 # +new-epoch 9
103625:X 13 Jul 2021 15:35:01.244 # +vote-for-leader d760d62e190354654490e75e0b427d8ae095ac5a 9
103625:X 13 Jul 2021 15:35:01.267 # +odown master mymaster 192.168.221.128 6379 #quorum 2/2
103625:X 13 Jul 2021 15:35:01.267 # Next failover delay: I will not start a failover before Tue Jul 13 15:35:31 2021
103625:X 13 Jul 2021 15:35:02.113 # +config-update-from sentinel d760d62e190354654490e75e0b427d8ae095ac5a 192.168.221.129 26379 @ mymaster 192.168.221.128 6379
103625:X 13 Jul 2021 15:35:02.113 # +switch-master mymaster 192.168.221.128 6379 192.168.221.130 6379
103625:X 13 Jul 2021 15:35:02.113 * +slave slave 192.168.221.129:6379 192.168.221.129 6379 @ mymaster 192.168.221.130 6379
103625:X 13 Jul 2021 15:35:02.113 * +slave slave 192.168.221.128:6379 192.168.221.128 6379 @ mymaster 192.168.221.130 6379
103625:X 13 Jul 2021 15:35:07.153 # +sdown slave 192.168.221.128:6379 192.168.221.128 6379 @ mymaster 192.168.221.130 6379
```

+sdown表示哨兵主观认为master已经停止服务了。

+odown表示哨兵客观认为master停止服务了（关于主观和客观，后面会给大家讲解）。

接着哨兵开始进行故障恢复，挑选一个slave升级为master，其他哨兵节点的日志。

```shell
76274:X 13 Jul 2021 15:35:01.240 # +try-failover master mymaster 192.168.221.128 6379
76274:X 13 Jul 2021 15:35:01.242 # +vote-for-leader d760d62e190354654490e75e0b427d8ae095ac5a 9
76274:X 13 Jul 2021 15:35:01.242 # d760d62e190354654490e75e0b427d8ae095ac5a voted for d760d62e190354654490e75e0b427d8ae095ac5a 9
76274:X 13 Jul 2021 15:35:01.247 # dc6d874fe71e4f8f25e15946940f2b8eb087b2e8 voted for d760d62e190354654490e75e0b427d8ae095ac5a 9
76274:X 13 Jul 2021 15:35:01.247 # 2e9b0ac7ffbfca08e80debff744a4541a31b3951 voted for d760d62e190354654490e75e0b427d8ae095ac5a 9
76274:X 13 Jul 2021 15:35:01.309 # +elected-leader master mymaster 192.168.221.128 6379
76274:X 13 Jul 2021 15:35:01.309 # +failover-state-select-slave master mymaster 192.168.221.128 6379
76274:X 13 Jul 2021 15:35:01.400 # +selected-slave slave 192.168.221.130:6379 192.168.221.130 6379 @ mymaster 192.168.221.128 6379
76274:X 13 Jul 2021 15:35:01.400 * +failover-state-send-slaveof-noone slave 192.168.221.130:6379 192.168.221.130 6379 @ mymaster 192.168.221.128 6379
76274:X 13 Jul 2021 15:35:01.477 * +failover-state-wait-promotion slave 192.168.221.130:6379 192.168.221.130 6379 @ mymaster 192.168.221.128 6379
76274:X 13 Jul 2021 15:35:02.045 # +promoted-slave slave 192.168.221.130:6379 192.168.221.130 6379 @ mymaster 192.168.221.128 6379
76274:X 13 Jul 2021 15:35:02.045 # +failover-state-reconf-slaves master mymaster 192.168.221.128 6379
76274:X 13 Jul 2021 15:35:02.115 * +slave-reconf-sent slave 192.168.221.129:6379 192.168.221.129 6379 @ mymaster 192.168.221.128 6379
76274:X 13 Jul 2021 15:35:03.070 * +slave-reconf-inprog slave 192.168.221.129:6379 192.168.221.129 6379 @ mymaster 192.168.221.128 6379
76274:X 13 Jul 2021 15:35:03.070 * +slave-reconf-done slave 192.168.221.129:6379 192.168.221.129 6379 @ mymaster 192.168.221.128 6379
76274:X 13 Jul 2021 15:35:03.133 # +failover-end master mymaster 192.168.221.128 6379
76274:X 13 Jul 2021 15:35:03.133 # +switch-master mymaster 192.168.221.128 6379 192.168.221.130 6379
76274:X 13 Jul 2021 15:35:03.133 * +slave slave 192.168.221.129:6379 192.168.221.129 6379 @ mymaster 192.168.221.130 6379
76274:X 13 Jul 2021 15:35:03.133 * +slave slave 192.168.221.128:6379 192.168.221.128 6379 @ mymaster 192.168.221.130 6379
76274:X 13 Jul 2021 15:35:08.165 # +sdown slave 192.168.221.128:6379 192.168.221.128 6379 @ mymaster 192.168.221.130 6379
```

**+try-failover**表示哨兵开始进行故障恢复

**+failover-end** 表示哨兵完成故障恢复

**+slave**表示列出新的master和slave服务器，我们仍然可以看到已经停掉的master，哨兵并没有清除已停止的服务的实例，这是因为已经停止的服务器有可能会在某个时间进行恢复，恢复以后会以slave角色加入到整个集群中。

### 实现原理

1. 每个Sentinel以每秒钟一次的频率向它所知的Master/Slave以及其他 Sentinel 实例发送一个 PING 命
2. 如果一个实例（instance）距离最后一次有效回复 PING 命令的时间超过 **down-after-milliseconds** 选项所指定的值， 则这个实例会被 Sentinel 标记为主观下线。
3. 如果一个Master被标记为主观下线，则正在监视这个Master的所有 Sentinel 要以每秒一次的频率确认Master的确进入了主观下线状态。
4. 当有足够数量的 Sentinel（大于等于配置文件指定的值：quorum）在指定的时间范围内确认Master的确进入了主观下线状态， 则Master会被标记为客观下线 。
5. 在一般情况下， 每个 Sentinel 会以每 10 秒一次的频率向它已知的所有Master，Slave发送 INFO 命令。当Master被 Sentinel 标记为客观下线时，Sentinel 向下线的 Master 的所有 Slave 发送 INFO 命令的频率会从 10 秒一次改为每秒一次 ，若没有足够数量的 Sentinel 同意 Master 已经下线， Master 的客观下线状态就会被移除。
6.  若 Master 重新向 Sentinel 的 PING 命令返回有效回复， Master 的主观下线状态就会被移除。

主观下线：Subjectively Down，简称 SDOWN，指的是当前 Sentinel 实例对某个Redis服务器做出的下线判断。

客观下线：Objectively Down， 简称 ODOWN，指的是多个 Sentinel 实例在对Master Server做出 SDOWN 判断，并且通过 SENTINEL之间交流后得出Master下线的判断。然后开启failover

### 谁来完成故障转移？

当Redis中的master节点被判定为客观下线之后，需要重新从slave节点选择一个作为新的master节点，那现在有三个sentinel节点，应该由谁来完成这个故障转移过程呢？所以这三个sentinel节点必须要通过某种机制达成一致，在Redis中采用了Raft算法来实现这个功能。

> 每次master出现故障时，都会触发raft算法来选择一个leader完成Redis主从集群中的master选举功能。

#### 数据一致性问题

了解raft算法之前，我们来了解一个拜占庭将军问题。

拜占庭将军问题（Byzantine failures），是由**莱斯利·兰伯**特提出的点对点通信中的基本问题。具体含义是在『存在消息丢失的不可靠信道』上试图通过『消息传递』的方式达到一致性是不可能的。

拜占庭位于如今的土耳其的伊斯坦布尔，是东罗马帝国的首都。由于当时拜占庭罗马帝国国土辽阔，为了达到防御目的，每个军队都分隔很远，将军与将军之间只能靠信差传消息。在战争的时候，拜占庭军队内所有将军和副官必须达成一致的共识，决定是否有赢的机会才去攻打敌人的阵营。但是，在军队内有可能存有叛徒和敌军的间谍，左右将军们的决定又扰乱整体军队的秩序。在进行共识时，结果并不代表大多数人的意见。这时候，在已知有成员谋反的情况下，其余忠诚的将军在不受叛徒的影响下如何达成一致的协议，这就是是著名的拜占庭问题。

拜占庭将军问题本质上所描述的是计算机领域中的一个协议问题，拜占庭帝国军队的将军们必须全体一致的决定是否攻击某一支敌军。问题是这些将军在地理上是分隔开来的，并且将军中存在叛徒。叛徒可以任意行动以达到以下目标：

- 欺骗某些将军采取进攻行动；
- 促成一个不是所有将军都同意的决定，如当将军们不希望进攻时促成进攻行动；
- 或者迷惑某些将军，使他们无法做出决定。

如果叛徒达到了这些目的之一，则任何攻击行动的结果都是注定要失败的，只有完全达成一致的努力才能获得胜利 。

拜占庭假设是对现实世界的模型化，由于硬件错误、网络拥塞或断开以及遭到恶意攻击，计算机和网络可能出现不可预料的行为，所以如何在这样的环境下达成一致，这就是所谓的数据一致性问题。

回到Sentinel中，这三个Sentinel节点，需要选择一个节点来负责针对Redis集群进行故障恢复，那这三个节点中谁能做这个事情？因此同样需要基于某个机制来达成共识。

在很多中间件中都需要用到数据一致性算法，最直观的是像zookeeper这样一个组件，他的高可用设计是由leader和follow组成，当leader节点因为异常宕机了， 需要从生下的follow节点选举出一个新的leader节点，那么这个选举过程需要集群中所有节点达成一致，也就是只有所有节点都赞同某个follow节点成为leader，它才能成为leader节点。而这个共识达成的前提是所有节点需要对某个投票结果达成一致，否则就无法选举出新的leader，因此这里必然需要用到共识算法。

#### 常见的数据一致性算法

- paxos，paxos应该是最早也是最正统的数据一致性算法，也是最复杂难懂的算法。
- raft，raft算法应该是最通俗易懂的一致性算法，它在nacos、sentinel、consul等组件中都有使用。
- zab协议，是zookeeper中基于paxos算法上演变过来的一种一致性算法
- distro，Distro协议。Distro是阿里巴巴的私有协议，目前流行的Nacos服务管理框架就采用了Distro协议。Distro 协议被定位为 **临时数据的一致性协议**

#### Raft协议说明

> Raft算法动画演示地址： http://thesecretlivesofdata.com/raft/

Raft算法的核心思想：先到先得，少数服从多数。

#### 故障转移过程

怎么让一个原来的slave节点成为主节点？

- 选出Sentinel Leader之后，由Sentinel Leader向某个节点发送slaveof no one命令，让它成为独立节点。
- 然后向其他节点发送replicaof x.x.x.x xxxx（本机服务），让它们成为这个节点的子节点，故障转移完成。

如何选择合适的slave节点成为master呢？有四个因素影响。

- 断开连接时长，如果与哨兵连接断开的比较久，超过了某个阈值，就直接失去了选举权
- 优先级排序，如果拥有选举权，那就看谁的优先级高，这个在配置文件里可以设置（replica-priority 100），数值越小优先级越高
- 复制数量，如果优先级相同，就看谁从master中复制的数据最多（复制偏移量最大）
- 进程id，如果复制数量也相同，就选择进程id最小的那个

#### Sentinel功能总结

监控：Sentinel会不断检查主服务器和从服务器是否正常运行。

通知：如果某一个被监控的实例出现问题，Sentinel可以通过API发出通知。

自动故障转移（failover）：如果主服务器发生故障，Sentinel可以启动故障转移过程。把某台服务器升级为主服务器，并发出通知。

配置管理：客户端连接到Sentinel，获取当前的Redis主服务器的地址。

## Redis分布式扩展之Redis Cluster方案

主从复制的缺点：

1. 主从切换的过程中有可能会丢失数据，因为只有一个master，只能单点写，没有解决水平扩容的问题。
2. 每个节点都保存了所有数据，一个是内存的占用率较高，另外就是如果进行数据恢复时非常慢。
3. 数据量过大对数据IO操作的性能也会有影响。

所以我们对Redis有数据分片的需求，所谓分片就是把一份大数据拆分成多份小数据，在3.0之前，我们只能通过构建多个Redis主从节点集群，把不同业务数据拆分到不同的集群中，这种方式在业务层需要有大量的代码来完成数据分片、路由等工作，导致维护成本高、增加、移除节点比较繁琐。

Redis3.0之后引入了Redis Cluster集群方案，它用来解决分布式扩展的需求，同时也实现了高可用机制。

### Redis Cluster架构

一个Redis Cluster由多个Redis节点构成，不同节点组服务的数据没有交集，也就是每个一节点组对应数据sharding的一个分片。

节点组内部分为主备两类节点，对应master和slave节点。两者数据准实时一致，通过异步化的主从复制机制来保证。

一个节点组有且只有一个master节点，同时可以有0到多个slave节点，在这个节点组中只有master节点对用户提供些服务，读服务可以由master或者slave提供。如下图，包含三个master节点以及三个master对应的slave节点，一般一组集群至少要6个节点才能保证完整的高可用。

其中三个master会分配不同的slot（表示数据分片区间），当master出现故障时，slave会自动选举成为master顶替主节点继续提供服务。

![](https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/image-20240830145514391.png)

### 关于gossip协议

再上图描述的架构中，其他的点都好理解，就是关于gossip协议是啥，需要单独说明一下。

在整个Redis cluster架构中，如果出现以下情况

- 新加入节点
- slot迁移
- 节点宕机
- slave选举成为master

我们希望这些变化能够让整个集群中的每个节点都能够尽快发现，传播到整个集群并且集群中所有节点达成一致，那么各个节点之间就需要相互连通并且携带相关状态数据进行传播。

按照正常的逻辑是采用广播的方式想集群中的所有节点发送消息，有点是集群中的数据同步较快，但是每条消息都需要发送给所有节点，对CPU和带宽的消耗过大，所以这里采用了gossip协议。

Gossip protocol 也叫 Epidemic Protocol （流行病协议），别名很多比如：“流言算法”、“疫情传播算法”等。

它的特点是，在节点数量有限的网络中，每个节点都会“随机”（不是真正随机，而是根据规则选择通信节点）与部分节点通信，经过一番杂乱无章的通信后，每个节点的状态在一定时间内会达成一致，如下图所示。

假设我们提前设置如下规则：

1、Gossip 是周期性的散播消息，把周期限定为 1 秒

2、被感染节点随机选择 k 个邻接节点（fan-out）散播消息，这里把 fan-out 设置为 3，每次最多往 3 个节点散播。

3、每次散播消息都选择尚未发送过的节点进行散播

4、收到消息的节点不再往发送节点散播，比如 A -> B，那么 B 进行散播的时候，不再发给 A。

这里一共有 16 个节点，节点 1 为初始被感染节点，通过 Gossip 过程，最终所有节点都被感染：

![image-20240830163046827](https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/image-20240830163046827.png)

### gossip协议消息

gossip协议包含多种消息，包括ping，pong，meet，fail等等。

**ping**：每个节点都会频繁给其他节点发送ping，其中包含自己的状态还有自己维护的集群元数据，互相通过ping交换元数据；

**pong**: 返回ping和meet，包含自己的状态和其他信息，也可以用于信息广播和更新；

**fail**: 某个节点判断另一个节点fail之后，就发送fail给其他节点，通知其他节点，指定的节点宕机了。

**meet**：某个节点发送meet给新加入的节点，让新节点加入集群中，然后新节点就会开始与其他节点进行通信，不需要发送形成网络的所需的所有CLUSTER MEET命令。发送CLUSTER MEET消息以便每个节点能够达到其他每个节点只需通过一条已知的节点链就够了。由于在心跳包中会交换gossip信息，将会创建节点间缺失的链接。

### gossip的优缺点

**优点：** gossip协议的优点在于元数据的更新比较分散，不是集中在一个地方，更新请求会陆陆续续，打到所有节点上去更新有一定的延时，降低了压力； 去中心化、可扩展、容错、一致性收敛、简单。 由于不能保证某个时刻所有节点都收到消息，但是理论上最终所有节点都会收到消息，因此它是一个最终一致性协议。

**缺点：** 元数据更新有延时可能导致集群的一些操作会有一些滞后。 消息的延迟 ， 消息冗余 。

### Redis Cluster集群搭建

集群至少需要6个节点（3主3从模式），每一个节点可以搭建在同一台机器上，也可以搭建在不同的服务器上。

- 192.168.221.128 7000 、 7001
- 192.168.221.129 7002 、 7003
- 192.168.221.130 7004 、 7005

#### 分别启动6个节点

- 在Redis安装目录下，分别创建以下目录，这些目录必须要提前创建好，Redis启动时不会主动创建这些目录。

```shell
  mkdir -p /data/program/Redis/run
  mkdir -p /data/program/Redis/logs
  mkdir -p /data/program/Redis/data/7000、7001
  mkdir -p /data/program/Redis/conf
  mkdir -p /data/program/Redis/Redis-cluster
```

- 拷贝一份Redis.conf到Redis-cluster目录下，由于只有三台机器，所以每个机器上需要运行两个Redis-server，因此需要修改Redis.conf文件的名字来做区分，Redis_7000.conf。并且修改该文件的一下内容。

```shell
  pidfile "/data/program/Redis/run/Redis_7000.pid"   #pid存储目录
  logfile "/data/program/Redis/logs/Redis_7000.log"  #日志存储目录
  dir "/data/program/Redis/data/7000"   #数据存储目录，目录要提前创建好
  cluster-enabled yes                   #开启集群
  cluster-config-file nodes-7000.conf   #集群节点配置文件，这个文件是不能手动编辑的。确保每一个集群节点的配置文件不同
  cluster-node-timeout 15000            #集群节点的超时时间，单位：ms，超时后集群会认为该节点失败
```

- 每个节点需要启动两个Redis-server，所以对配置文件做一份拷贝，然后修改以下配置

```shell
  pidfile "/data/program/Redis/run/Redis_7001.pid"   #pid存储目录
  logfile "/data/program/Redis/logs/Redis_7001.log"  #日志存储目录
  dir "/data/program/Redis/data/7001"   #数据存储目录，目录要提前创建好
  cluster-enabled yes                   #开启集群
  cluster-config-file nodes-7001.conf   #集群节点配置文件，这个文件是不能手动编辑的。确保每一个集群节点的配置文件不同
  cluster-node-timeout 15000            #集群节点的超时时间，单位：ms，超时后集群会认为该节点失败
```

- 创建两个脚本用来进行统一的服务运行

  **cluster-start.sh**

```shell
  ./Redis-server ../conf/Redis_7000.conf
  ./Redis-server ../conf/Redis_7001.conf
```

**cluster-shutdown.sh**

```shell
  pgrep Redis-server | xargs -exec kill -9
```

通过下面命令让上述脚本拥有执行权限

```shell
  chmod +x cluster-*.sh
```

- 其他两个节点重复上述的过程，完成6个节点的启动。

#### 配置Redis 集群

启动完这5台服务器后，需要通过下面的操作来配置集群节点。在Redis6.0版本中，创建集群的方式为Redis-cli方式直接创建，以下命令在任意一台服务器上执行即可

用以下命令创建集群，--cluster-replicas 1 参数表示希望每个主服务器都有一个从服务器，这里则代表3主3从，通过该方式创建的带有从节点的机器不能够自己手动指定主节点，Redis集群会尽量把主从服务器分配在不同机器上

```shell
[root@localhost bin]# ./Redis-cli --cluster create 192.168.221.128:7000 192.168.221.128:7001 192.168.221.129 7002 192.168.221.129 7003 192.168.221.130 7004 192.168.221.130 7005 --cluster-replicas 1
```

执行上述命令后，会得到以下执行结果，

```shell
>>> Performing hash slots allocation on 6 nodes...
Master[0] -> Slots 0 - 5460
Master[1] -> Slots 5461 - 10922
Master[2] -> Slots 10923 - 16383
Adding replica 192.168.221.129:7003 to 192.168.221.128:7000
Adding replica 192.168.221.130:7005 to 192.168.221.129:7002
Adding replica 192.168.221.128:7001 to 192.168.221.130:7004
M: 36d34fd3985179786eeab50338e3972608df2f21 192.168.221.128:7000  #master
   slots:[0-5460] (5461 slots) master
S: 202028cfaf69fd5c8fcd5b7b75677d6963184ad9 192.168.221.128:7001
   replicates 124683446267c8910cd080238e72e3b1b589f41f
M: 5927296015093b9474fed5a354c4a04b9345e7a9 192.168.221.129:7002   #master
   slots:[5461-10922] (5462 slots) master
S: 089b77cb753c1ef62bd10f23230c38d4a0a64a09 192.168.221.129:7003
   replicates 36d34fd3985179786eeab50338e3972608df2f21
M: 124683446267c8910cd080238e72e3b1b589f41f 192.168.221.130:7004   #master
   slots:[10923-16383] (5461 slots) master
S: 82a9fe027179f197ff82547863c4252de8ba1354 192.168.221.130:7005
   replicates 5927296015093b9474fed5a354c4a04b9345e7a9
Can I set the above configuration? (type 'yes' to accept): yes
```

从上述结果中看到两个点：

- 预先分配三个节点的slot区间
- 自动选择合适的节点作为master

#### 查看集群状态等信息

- cluster info 查看集群状态信息

```shell
  [root@localhost bin]# ./Redis-cli -p 7000
  127.0.0.1:7000> cluster info
  cluster_state:ok
  cluster_slots_assigned:16384
  cluster_slots_ok:16384
  cluster_slots_pfail:0
  cluster_slots_fail:0
  cluster_known_nodes:6
  cluster_size:3
  cluster_current_epoch:6
  cluster_my_epoch:1
  cluster_stats_messages_ping_sent:276
  cluster_stats_messages_pong_sent:262
  cluster_stats_messages_sent:538
  cluster_stats_messages_ping_received:257
  cluster_stats_messages_pong_received:276
  cluster_stats_messages_meet_received:5
  cluster_stats_messages_received:538
```

- 查看集群节点信息

```shell
  127.0.0.1:7000> cluster nodes
  5927296015093b9474fed5a354c4a04b9345e7a9 192.168.221.129:7002@17002 master - 0 1626247374000 3 connected 5461-10922
  36d34fd3985179786eeab50338e3972608df2f21 192.168.221.128:7000@17000 myself,master - 0 1626247375000 1 connected 0-5460
  82a9fe027179f197ff82547863c4252de8ba1354 192.168.221.130:7005@17005 slave 5927296015093b9474fed5a354c4a04b9345e7a9 0 1626247376000 3 connected
  089b77cb753c1ef62bd10f23230c38d4a0a64a09 192.168.221.129:7003@17003 slave 36d34fd3985179786eeab50338e3972608df2f21 0 1626247375000 1 connected
  124683446267c8910cd080238e72e3b1b589f41f 192.168.221.130:7004@17004 master - 0 1626247376830 5 connected 10923-16383
  202028cfaf69fd5c8fcd5b7b75677d6963184ad9 192.168.221.128:7001@17001 slave 124683446267c8910cd080238e72e3b1b589f41f 0 1626247375000 5 connected
```

### 数据分布

Redis Cluster中，Sharding采用slot(槽)的概念，一共分成16384个槽，这有点儿类似pre sharding思路。对于每个进入Redis的键值对，根据key进行散列，分配到这16384个slot中的某一个中。使用的hash算法也比较简单，就是CRC16后16384取模[crc16(key)%16384]。

Redis集群中的每个node(节点)负责分摊这16384个slot中的一部分，也就是说，每个slot都对应一个node负责处理。

如图5-6所示，*假设现在我们是三个主节点分别是：A, B, C 三个节点，它们可以是一台机器上的三个端口，也可以是三台不同的服务器。那么，采用哈希槽 (hash slot)的方式来分配16384个slot 的话，它们三个节点分别承担的slot 区间是：*

- 节点A覆盖0－5000;
- 节点B覆盖5001－10000;
- 节点C覆盖10001－16383

![](https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/1666682-20211023095421611-1977784721.png)

### 客户端重定向

如图5-6所示，假设k这个key应该存储在node3上，而此时用户在node1或者node2上调用`set k v`指令，这个时候Redis cluster怎么处理呢？

```shell
127.0.0.1:7291> set qs 1
(error) MOVED 13724 127.0.0.1:7293
```

服务端返回MOVED，也就是根据key计算出来的slot不归当前节点管理，服务端返回MOVED告诉客户端去7293端口操作。

这个时候更换端口，用Redis-cli –p 7293操作，才会返回OK。或者用./Redis-cli -c -p port的命令。但是导致的问题是，客户端需要连接两次才能完成操作。所以大部分的Redis客户端都会在本地维护一份slot和node的对应关系，在执行指令之前先计算当前key应该存储的目标节点，然后再连接到目标节点进行数据操作。

在Redis集群中提供了下面的命令来计算当前key应该属于哪个slot

```shell
Redis> cluster keyslot key1
```

### 高可用主从切换原理

**如果主节点没有从节点，那么当它发生故障时，集群就将处于不可用状态。**

一旦某个master节点进入到FAIL状态，那么整个集群都会变成FAIL状态，同时触发failover机制，failover的目的是从slave节点中选举出新的主节点，使得集群可以恢复正常，这个过程实现如下：

当slave发现自己的master变为FAIL状态时，便尝试进行Failover，以期成为新的master。由于挂掉的master可能会有多个slave，从而存在多个slave竞争成为master节点的过程， 其过程如下：

- slave发现自己的master变为FAIL
- 将自己记录的集群currentEpoch加1，并广播FAILOVER_AUTH_REQUEST 信息
- 其他节点收到该信息，只有master响应，判断请求者的合法性，并发送FAILOVER_AUTH_ACK，对每一个epoch只发送一次ack
- 尝试failover的slave收集master返回的FAILOVER_AUTH_ACK
- slave收到超过半数master的ack后变成新Master (这里解释了集群为什么至少需要三个主节点，如果只有两个，当其中一个挂了，只剩一个主节点是不能选举成功的)
- 广播Pong消息通知其他集群节点。

从节点并不是在主节点一进入 FAIL 状态就马上尝试发起选举，而是有一定延迟，一定的延迟确保我们等待FAIL状态在集群中传播，slave如果立即尝试选举，其它masters或许尚未意识到FAIL状态，可能会拒绝投票。

延迟计算公式： DELAY = 500ms + random(0 ~ 500ms) + SLAVE_RANK * 1000ms

SLAVE_RANK表示此slave已经从master复制数据的总量的rank。Rank越小代表已复制的数据越新。这种方式下，持有最新数据的slave将会首先发起选举

### 常见问题分析

**问题：怎么让相关的数据落到同一个节点上？**

比如有些multi key操作是不能跨节点的，例如用户2673的基本信息和金融信息？

在key里面加入{hash tag}即可。Redis在计算槽编号的时候只会获取{}之间的字符串进行槽编号计算，这样由于上面两个不同的键，{}里面的字符串是相同的，因此他们可以被计算出相同的槽

```shell
user{2673}base=…
user{2673}fin=…
```

操作步骤如下，下面这些key都会保存到同一个node中。

```shell
127.0.0.1:7293> set a{qs}a 1
OK
127.0.0.1:7293> set a{qs}b 1
OK
127.0.0.1:7293> set a{qs}c 1
OK
127.0.0.1:7293> set a{qs}d 1
OK
127.0.0.1:7293> set a{qs}e 1
```

### 总结

**优势**

1. 无中心架构。
2. 数据按照slot存储分布在多个节点，节点间数据共享，可动态调整数据分布。
3. 可扩展性，可线性扩展到1000个节点（官方推荐不超过1000个），节点可动态添加或删除。
4. 高可用性，部分节点不可用时，集群仍可用。通过增加Slave做standby数据副本，能够实现故障自动failover，节点之间通过gossip协议交换状态信息，用投票机制完成Slave到Master的角色提升。
5. 降低运维成本，提高系统的扩展性和可用性。

**不足**

1. Client实现复杂，驱动要求实现Smart Client，缓存slots mapping信息并及时更新，提高了开发难度，客户端的不成熟影响业务的稳定性。
2. 节点会因为某些原因发生阻塞（阻塞时间大于clutser-node-timeout），被判断下线，这种failover是没有必要的。
3. 数据通过异步复制，不保证数据的强一致性。
4. 多个业务使用同一套集群时，无法根据统计区分冷热数据，资源隔离性较差，容易出现相互影响的情况。
5. Slave在集群中充当“冷备”，不能缓解读压力，当然可以通过SDK的合理设计来提高Slave资源的利用率。

### Redission连接cluster

修改Redisson.yml文件，参考spring-boot-Redis-client-example这个项目

```properties
clusterServersConfig:
  nodeAddresses:
    - "Redis://192.168.221.129:7003"
    - "Redis://192.168.221.129:7002"
    - "Redis://192.168.221.130:7004"

codec: !<org.Redisson.codec.JsonJacksonCodec> {}
```

注意，nodeAddresses对应的节点都是master。

## Codis

Codis 是一个分布式 Redis 解决方案, 对于上层的应用来说, 连接到 Codis Proxy 和连接原生的 Redis Server 没有明显的区别(不支持的命令列表), 上层应用可以像使用单机的 Redis 一样使用, Codis 底层会处理请求的转发, 不停机的数据迁移等工作,
所有后边的一切事情, 对于前面的客户端来说是透明的, 可以简单的认为后边连接的是一个内存无限大的 Redis 服务。

### codis的架构

如下图所示，表示Codis的整体架构图。

**Codis Proxy**： 客户端连接的 Redis 代理服务, 实现了 Redis 协议。 除部分命令不支持以外(不支持的命令列表)，表现的和原生的 Redis 没有区别（就像 Twemproxy）。对于同一个业务集群而言，可以同时部署多个 codis-proxy 实例；不同 codis-proxy 之间由 codis-dashboard 保证状态同
**codis-Redis-group:** 代表一个Redis服务集群节点，一个RedisGroup里有一个Master，和多个Slave

Zookeeper：Codis 依赖 ZooKeeper 来存放数据路由表和 codis-proxy 节点的元信息, codis-config 发起的命令都会通过 ZooKeeper 同步到各个存活的 codis-proxy.

![](https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/1666682-20211023095421916-317725869.png)

转自：[跟着Mic学架构](https://www.cnblogs.com/mic112/p/15441363.html)