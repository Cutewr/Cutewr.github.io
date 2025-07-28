---
date: 2025-07-28
category:
  - MySQL
tag:
  - 日志
---

# MySQL日志

# **日志**

## 介绍一下MySQL的日志

1、errorLog，记录mysql运行时出现的问题

2、generalLog通用日志，记录了执行的所有语句日志，在并发操作非常多的场景下，信息会非常多，那么如果都记录下来会导致IO量非常多，影响 MySQL 性能，因此建议是在调试环境下才开启通用日志功能。

2、slowQueryLog，慢查询日志，记录执行超过 long_query_time 值的所有 SQL 语句。帮助我们识别和优化sql语句。

3、binlog二进制日志，记录了所有修改数据库状态的sql语句和执行时间，比如insert、update、delete。主要用数据库的备份。

还有两个是innodb存储引擎特有的日志文件。

1、redolog重做日志，记录了对于所有对于表数据状态修改的操作，主要用于崩溃恢复。

2、undolog回滚日志：记录数据被事务修改前的值，用于事务回滚。MVCC的实现也需要undolog。

## 插入一行数据，redolog、binlog、undolog的写入时机

事务开始后，undolog会记录数据的原始状态，便于数据恢复。

redolog和binlog按照双阶段提交写，redolog会在

## 逻辑日志和物理日志的区别？

逻辑日志简单来说就是记录了sql语句，比如binlog。属于mysql server层。undolog也是逻辑日志。

物理日志就是真实记录了，在哪个数据页上进行了修改，比如redolog，属于innodb存储引擎。

## 为什么需要主从复制？

1.  数据备份、提高可用性：从服务器可以作为主服务器的备份，提高数据的冗余性和灾难恢复能力。在主服务器出现故障时，可以迅速将从服务器提升为主服务器，减少停机时间。
2. 读写分离、负载均衡：通过将查询操作分发到从服务器上，可以减轻主服务器的压力。

## binlog是怎么进行主从数据库备份的？

1. 主服务器将数据的改变记录到binlog中
2. 从数据库会在一定时间间隔内对binlog进行探测其是否发生改变，如果发生改变，则开始一个I/OThread请求主数据库的binlog
3. 主数据库为每个I/O线程启动一个dump线程，用于向从数据库发送binlog，并保存至从数据库本地的relaylog中，从数据库将启动SQL线程从中继日志中读取信息，在本地重做，使得主从数据库的数据保持一致。

## binlog有几种格式，分别有什么区别？

MySQL的binlog有三种格式：statement、row、mixed。

1、statement格式：记录的是SQL语句原文。在主数据库上执行的SQL语句会被记录到binlog中，并在从数据库上重新SQL语句来实现主从复制。这种格式相对简单，适用于数据量较小、写入操作较为简单的场景。但是比如获取当前系统时间的操作，就会导致主数据库和从数据库数据不一致。
2、row格式：为了解决这个问题，就需要指定为row格式。记录的是行的变化情况，并且经过mysqlbinlog解析出的语句会带有数值的原始值，这样就能保证数据的一致性。但是这种格式需要大容量来记录，比较占用空间。
3、mixed格式：混合了statement和row两种格式。MySQL会判断这条SQL语句是否可能引起数据不一致，如果可能，就用row格式；不可能就用statement格式。

## redolog作用机制

redolog可以用来实现崩溃恢复。

需要崩溃恢复的原因：MySQL中数据以页为单位，查询一条记录，会把硬盘中一页的数据都加载出来，放到bufferpool中。更新表数据的时候，如果buffer pool中存在要更新的数据，就现在bufferpool中更新，然后再统一刷盘。但是一个数据页可能在硬盘文件中的随机位置，是随机读写，所以速度比较慢。而redolog，一行记录比较小，只包含文件初始位置、偏移量、更新值，再加上是顺序写，所以刷盘速度很快，从而使数据库拥有故障恢复能力。

### redolog怎么刷盘的知道吗？

数据修改的流程如下：

1. 把数据页加载到bufferpool中
2. 直接更新bufferpool中的缓存数据
3. 记录更新信息到内存中的redo log buffer中
    
    在以下的一些情况，redologbuffer中的数据
    
4. 刷盘到磁盘中的redo log中，清空redolog buffer

### redolog的刷盘时机

`InnoDB` 存储引擎为 redo log的刷盘提供了一个参数，支持三种策略：

1、参数值为0时，表示每次事务提交都不进行刷盘操作。这种策略性能最高，但是最不安全。如果MySQL宕机了，可能会丢失接近1秒内的事务

2、参数值为1时，表示每次事务提交都进行都刷盘，性能最低但是安全性最高。默认值就是1，保证事务的持久性

3、参数值为2时，这种是介于前两者之间的一种刷盘策略。事务提交后会将redolog写到pagecache中，pagecache是操作系统维护的一块内存区域。如果mysql宕机，但是操作系统仍然运行，那么就能保证数据一致性；如果操作系统宕机那数据就会丢失了，适合需要较好性能，并且能容忍少量数据丢失的场景。

另外，InnoDB 存储引擎有一个**后台线程**，每隔`1` 秒，就会把 `redo log buffer` 中的内容写到（`page cache`），然后调用 `fsync` 刷盘。

(一个没有提交事务的redolog，但是在事务执行过程中，redolog是会写入redologbuffer中的，因此也有可能记录在磁盘上)

### redolog在硬盘上的存储形式

redolog在硬盘上是以日志文件组的形式存储的，每个日志文件的大小一致。采用环形数组的方式保存。主要有两个重要的属性，write-pos和checkpoint，write-pos当前记录的位置，刷盘到日志文件组就会后移；checkpoint是当前要擦除的位置，加载日志文件组恢复数据的时候，会清空加载过的redolog，并把checkpoint往后推移。

writepos和checkpoint之间还空着的地方可以用来写入新的redolog。

### 什么是mysql中的两阶段提交？

主要涉及到redolog和binlog，redolog主要是为了实现故障恢复的物理日志，binlog主要为了实现mysql集群的数据一致性的逻辑日志。如果这两个日志的写入状态不一致，此时系统宕机了，那就可能会导致主从数据库的数据不一致。为了解决这个问题，InnoDB采用两阶段提交。

分为prepare和commit两个阶段。

在prepare阶段，mysql会把事务操作记录到redolog中，并标记为prepare状态；

第二阶段是commit阶段，当事务提交时，mysql会将事务操作记录到binlog中，然后把redolog状态设置为commit；

使用两阶段提交。1、写入 binlog 时发生异常不会有影响，因为 MySQL 根据 redo log 日志恢复数据时，发现 redo log 还处于prepare阶段，并且没有对应 binlog 日志，就会回滚该事务。

2、如果redo log 设置commit阶段发生异常， redo log 是处于prepare阶段，但是能通过事务id找到对应的 binlog 日志，所以 MySQL 认为是完整的，就会提交事务恢复数据

### undolog的作用

1、undo log是innodb存储引擎中用来实现事务回滚操作，保证事务原子性的日志。也是逻辑日志，会记录修改前的数据。比如我们insert一条语句，undolog就会记录对应的delete语句；update一条记录时，它会记录一条对应**相反**的update记录。如果事务需要回滚，则可以利用 undo log 中的信息将数据恢复到修改之前的状态，从而实现事务的原子性。

2、利用undolog实现MVCC