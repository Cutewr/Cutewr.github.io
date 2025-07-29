---
date: 2025-07-29
category:
  - JUC
tag:
  - JUC
---

# ThreadLocal

## ThreadLocal是什么

ThreadLocal在很多地方被称作线程本地存储（Thread-Local Storage，TLS），意思就是ThreadLocal能为每一个线程创建一个存储空间，通过ThreadLocal能够让每一个线程存储自己的副本（set方法传需要存储的对象），这样每个线程取数据时拿到的就是自己的数据（直接调用get方法，不用传参数），这样相互之间就能不影响。

- 多线程并发问题的解决
1. 锁机制：访问对象修改对象时用锁将该对象封闭起来不准其他线程修改等
2. 线程局部存储（Thread-Local Storage，TLS）：为每个线程存一份自己的变量副本，所以ThreadLocal并不是解决共享对象的同步问题，只是从根本上避免同步问题的产生。

线程本地存储模式本质上是一种避免共享的方案，由于没有共享，所以自然也就没有并发问题。如果你需要在并发场景中使用一个线程不安全的工具类，最简单的方案就是避免共享。

避免共享有两种方案，一种方案是将这个工具类作为局部变量使用，另外一种方案就是线程本地存储模式。这两种方案，局部变量方案的缺点是在高并发场景下会频繁创建对象，而线程本地存储方案，每个线程只需要创建一个工具类的实例，所以不存在频繁创建对象的问题。

# 2. ThreadLocal发展历程

## 2.1 简单实现ThreadLocal

在解释ThreadLocal的工作原理之前， 你先自己想想：如果让你来实现ThreadLocal的功能，你会怎么设计呢？

ThreadLocal的目标是让不同的线程有不同的变量V，那最直接的方法就是创建一个Map，它的Key是线程，Value是每个线程拥有的变量V，ThreadLocal内部持有这样的一个Map就可以了。你可以参考下面的示意图和示例代码来理解。

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3e894961-3173-4702-91a3-da175d94f68d/860202e1-f783-4851-905c-d75f8decfd48/image.png)

```java
class MyThreadLocal {
  Map locals = 
    new ConcurrentHashMap<>();
  //获取线程变量  
  T get() {
    return locals.get(
      Thread.currentThread());
  }
  //设置线程变量(key(线程),value(共享变量值))
  void set(T t) {
    locals.put(
      Thread.currentThread(), t);
  }
}
```

## 2.2 jdk1.8实现

ThreadLocal中实现了一个内部类，叫ThreadLocalMap，用来作为对象的存储结构，然而这个存储类的实例并不存在ThreadLocal中，而是在Thread线程类中有一个该类的属性叫threadLocals，所以所有的对象存储都是在线程里，然后ThreadLocal通过某些方式（特定的方法）去对应的Thread里去存对象、取对象、去除对象。

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3e894961-3173-4702-91a3-da175d94f68d/5031e79d-5cc6-4f05-9d73-6cfc0652c95a/image.png)

以下是三个类之间的类图：

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3e894961-3173-4702-91a3-da175d94f68d/90b1abfc-33bb-45ff-8a09-8f24ee8927e8/image.png)

这种方式和最初设想的方式对比起来好处在哪？

1. 在JDK的实现方案里面，ThreadLocal仅仅是一个代理工具类，内部并不持有任何与线程相关的数据，所有和线程相关的数据都存储在Thread里面，这样的设计容易理解。而从数据的亲缘性上来讲，ThreadLocalMap属于Thread也更加合理。
2. 当然还有一个更加深层次的原因，那就是不容易产生内存泄露。在我们的设计方案中，ThreadLocal持有的Map会持有Thread对象的引用，这就意味着，只要ThreadLocal对象存在，那么Map中的Thread对象就永远不会被回收。ThreadLocal的生命周期往往都比线程要长，所以这种设计方案很容易导致内存泄露。而JDK的实现中Thread持有ThreadLocalMap，而且ThreadLocalMap里对ThreadLocal的引用还是弱引用（WeakReference），所以只要Thread对象可以被回收，那么ThreadLocalMap就能被回收。JDK的这种实现方案虽然看上去复杂一些，但是更加安全。

# 3.ThreadLocal原理分析

## 3.1ThreadLocal与内存泄露

ThreadLocal中的get()方法，封装了针对currentThread.ThreadLocalMap的get操作：

```java
public T get() {
    Thread t = Thread.currentThread();
    ThreadLocalMap map = getMap(t);
    if (map != null) {
        ThreadLocalMap.Entry e = map.getEntry(this);
        if (e != null) {
            @SuppressWarnings("unchecked")
            T result = (T)e.value;
            return result;
        }
    }
    return setInitialValue();
}
```

ThreadlLocal中的set()方法，封装了针对currentThread.ThreadLocalMap的set操作：

```java
public void set(T value) {
    Thread t = Thread.currentThread();
    ThreadLocalMap map = getMap(t);
    if (map != null)
		    // map.set(当前threadLocal,value)
        map.set(this, value);
    else
        createMap(t, value);
}
```

ThreadlLocal中的remove()方法，封装了针对currentThread.ThreadLocalMap的remove操作：

```java
public void remove() {
     ThreadLocalMap m = getMap(Thread.currentThread());
     if (m != null)
		     // map.remove(当前这个threadLocal为键的key-value对)
         m.remove(this);
 }
```

### 3.1.1ThreadLocalMap的getEntry()实现

ThreadLocalMap的属性比较少，只有4个属性：

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3e894961-3173-4702-91a3-da175d94f68d/71f7204d-9cb1-434a-b1df-f2eee5a11d22/image.png)

Entry

Entry是ThreadLocalMap里实现的一个内部类，用来存放对象，一个Entry存放一个对象。这个类继承了WeakReference<ThreadLocal<?>>，然后有一个属性是Object，用来保存对象【线程本地存储的值】。

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3e894961-3173-4702-91a3-da175d94f68d/0ad10f6b-8a54-42fd-a98e-2800453afdbf/image.png)

然后ThreadLocalMap里有一个Entry的数组，用来存放一系列的数据。从这里可以看出，ThreadLocalMap的key是ThreadLocal，value是对应的对象。

继承的WeakReference<ThreadLocal>是java提供的一个弱引用类，弱引用是指，若是一个对象只有弱引用指向它时，在下次gc时，该对象会被回收掉。

这里继承弱引用类的作用是，若是ThreadLocal对象本身不被程序用到了（即没有强引用指向它了），那就算该ThreadLocal还作为某些线程里ThreadLocalMap的key，也会被回收掉，之后就能通过一系列依据于此的操作来防止内存泄漏。

ThreadLocalMap的存储策略

ThreadLocalMap的存储由一个Entry数组搞定。因为ThreadLocalMap没有设置一个loadfactor变量，所以在设置阈值的时候是写死的等于长度的2/3。

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3e894961-3173-4702-91a3-da175d94f68d/36177a57-5779-4e18-ac86-64a882d1bf50/image.png)

ThreadLocalMap的构造函数是default的，所以并不允许开发人员自己来实例化一个ThreadLocalMap，这是专门的用途的。构造函数有两个参数，初始想存放的key和value。构造函数中主要是做了：

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3e894961-3173-4702-91a3-da175d94f68d/9c5ccf10-0a5b-44e2-a029-bcad5d25b8c0/image.png)

1.以默认容量大小初始化一个table这个Entry数组；

2.获取firstkey的hashcode与初始容量大小-1的与运算来计算firstValue的存放位置；

3.将firstValue放到table对应的位置上；

4.设置好size、阈值；

ThreadLocalMap中的getEntry

通过key去获取ThreadLocalMap里的对象的方法是getEntry，大致流程为：

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3e894961-3173-4702-91a3-da175d94f68d/a23774ed-006a-47ea-a41a-10b09330328c/image.png)

1. 通过key获取对象存储的数组下标；
2. 获取到该位置对应的对象，如果不为null且该对象的key等于参数的key，则直接返回该对象
3. 如果为null或者key不相等，则调用getEntryAfterMiss(ThreadLocal<?> key, int i, Entry e)方法来获取对应的Entry

getEntryAfterMiss方法干了以下事情：

传入getEntryAfterMiss的参数：作为key的ThreadLocal，通过key的hashCode计算出的数组下标i，通过下标i获得的<ThreadLocal,value>entry对 e

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3e894961-3173-4702-91a3-da175d94f68d/585f7c84-bdca-4a3b-8da1-0946a4dd676d/image.png)

1. 如果e不为空，则看e的key是不是与查询的key相同，若是相同则直接返回e；
2. 如果e不为空但是e的key为空，这个entry的key被释放了【作为key的threadLocal是弱引用，如果没有其他的强引用指向它，那么遇到垃圾回收就会将key回收】，调用expungeStaleEntry方法
3. 如果都不是，说明没有命中，则查看下一个entry，重新来匹配；（其实从这里可以看出ThreadLocalMap的解决冲突的策略是，发生冲突时，往下找空余的位置放置。开放地址法）

这边提出一个疑问？按照getEntryAfterMiss的逻辑，如果一个ThreadLocalMap容量为16，然后现在满了装了16个kv对，现在想get一个map里不存在的key，是不是会进入无限死循环？

expungeStaleEntry方法干了以下事情：

传入的参数是 根据threadLocal的hashcode计算出的数组下标

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3e894961-3173-4702-91a3-da175d94f68d/587f0fbf-a669-4b1b-8242-3b0ac426f5eb/image.png)

1. 将当前位置进行释放：先将参数位置entry的value置为null，再将该位置的entry引用置为null。并且size--。
2. rehash操作：从该位置开始，一直往后遍历，经过的entry等于null的话退出遍历，不等于null的话进行操作：
    - 如果entry的key为null，则采取1的操作；【将该位置释放】
    - 如果key不为null，则看该key的hashcode值是否与当前位置是否一致，如果不一致【说明这个在放这个entry的时候发生了哈希冲突，进行了线性探测】【那我们尝试把这个entry放回它本来该放的位置】则把该entry移到对应的hashcode处，要是hashcode处已经有entry，则往后找空余的地方，然后放下。

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3e894961-3173-4702-91a3-da175d94f68d/790f470c-5e0c-4b2d-9920-a397606e6e0d/image.png)

为什么要有这个方法？

expungeStaleEntry方法就是为了解决内存泄漏存在的。从map中删掉那些已经被释放的threadLocal key。

ThreadLocalMap中的entry其实是继承的弱引用，如果该弱引用指向的ThreadLocal没有在外部被强引用指向的话，在下次gc的时候就会被回收，那这样的话就会出现ThreadLocalMap中存在key为null的情况，这样的数据对于map来讲是脏数据，这样的脏数据没有用，却一直占用着map的存储空间，这其实就是一种内存泄漏，所以需要来释放掉这些空间。

### 3.1.2ThreadLocalMap中的set()实现

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3e894961-3173-4702-91a3-da175d94f68d/c691a956-058f-4940-8c69-f2522c16377b/image.png)

1. 根据ThreadLocal的hashcode找到对应需要放置的位置。
2. 从该位置开始一直往后找合适的位置放下：
    - 如果找到有key和参数key相同的entry，则直接把value替换成需要插入的对象
    - 如果找到有key为null的entry，则调用replaceStaleEntry方法【原来这个位置的key被释放了，对map来说是脏数据，直接把这个位置替换成新增的entry】
    - 如果遇到的entry为空，则直接放下
3. size++，然后运行cleanSomeSlots方法专门清除一些key为null的脏数据，（下面详细讲cleanSomeSlots方法）。
4. 如果没有清除一个脏数据并且size已经超过阈值threshold，则调用rehash()方法重新调整大小

### 3.1.3ThreadLocalMap中的remove()实现

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3e894961-3173-4702-91a3-da175d94f68d/925a6b55-d976-4b5d-aa42-155f82c9382b/image.png)

通过hashcode找到要删除的key对应位置，判断key是不是要删除的key【因为有可能使用开放地址法解决哈希冲突】，如果是则调用Entry的clear方法（实际上就是继承的Reference的clear方法，将key变为null），

如果不是则往后找key相同的然后调用clear方法，然后再调用expungeStaleEntry方法来清空脏数据（包括clear完的entry）

### 3.1.4 ThreadLocal中的key是强弱引用与内存泄露

问题一：假设ThreadLocalMap中的key使用了强引用, 那么会出现内存泄漏吗?

1. 假设在业务代码中使用完ThreadLocal, ThreadLocal ref被回收了
2. 但是因为threadLocalMap的Entry强引用了threadLocal, 造成ThreadLocal无法被回收
3. 在没有手动删除Entry以及CurrentThread依然运行的前提下, 始终有强引用链threadRef → currentThread → entry, Entry就不会被回收( Entry中包括了ThreadLocal实例和value), 导致Entry内存泄漏

也就是说: ThreadLocalMap中的key使用了强引用, 是无法完全避免内存泄漏的

问题二：假设ThreadLocalMap中的key使用了弱引用, 那么会出现内存泄漏吗?

1. 假设在业务代码中使用完ThreadLocal, ThreadLocal ref被回收了
2. 由于threadLocalMap只持有ThreadLocal的弱引用, 没有任何强引用指向threadlocal实例, 所以threadlocal就可以顺利被gc回收, 此时Entry中的key = null
3. 在没有手动删除Entry以及CurrentThread依然运行的前提下, 也存在有强引用链threadRef → currentThread → value, value就不会被回收, 而这块value永远不会被访问到了, 导致value内存泄漏

也就是说: ThreadLocalMap中的key使用了弱引用, 也有可能内存泄漏。

重点：内存泄漏的真实原因

比较以上两种情况,我们就会发现:

内存泄漏的发生跟 ThreadLocalIMap 中的 key 是否使用弱引用是没有关系的。那么内存泄漏的的真正原因是什么呢？在以上两种内存泄漏的情况中．都有两个前提：

1. 没有手动侧除这个 Entry
2. CurrentThread 依然运行

第一点很好理解，只要在使用完 ThreadLocal 后，调用其 remove 方法翻除对应的 Entry ，就能避免内存泄漏。

第二点稍微复杂一点，由于ThreodLocalMap 是 Thread 的一个属性，被当前线程所引用，所以它的生命周期跟 Thread 一样长。那么在使用完 ThreadLocal 的使用，如果当前Thread 也随之执行结束， ThreadLocalMap 自然也会被 gc 回收，从根源上避免了内存泄漏。

综上， ThreadLocal 内存泄漏的根源是：

由于ThreadLocalMap 的生命周期跟 Thread 一样长，如果没有手动删除对应 key 就会导致内存泄漏。

问题：既然ThreadLocalMap中对ThreadLocal使用哪种引用都无法避免内存泄漏，那为什么还要使用弱引用呢?

要避免内存泄漏有两种方式：

1. 使用完 ThreadLocal ，调用其 remove 方法删除对应的 Entry
2. 使用完 ThreadLocal ，当前 Thread 也随之运行结束

相对第一种方式，第二种方式显然更不好控制，特别是使用线程池的时候，线程结束是不会销毁的。

也就是说，只要记得在使用完ThreadLocal 及时的调用 remove ，无论 key 是强引用还是弱引用都不会有问题.

事实上，在 ThreadLocalMap 中的set/getEntry 方法中，会对 key 为 null （也即是 ThreadLocal 为 null ）进行判断，如果为 null 的话，那么是会将 value 置为 null 的．

这就意味着使用完 ThreadLocal , CurrentThread 依然运行的前提下，就算忘记调用 remove 方法，弱引用比强引用可以多一层保障：弱引用的 ThreadLocal 会被回收．对应value在下一次 ThreadLocaIMap 调用 set/get/remove 中的任一方法的时候会被清除，从而避免内存泄漏。

## 3.2 ThreadLocal与数据污染

由于ThreadLocal的特性是对象与线程挂钩的，那如果在请求中有多线程任务时，在新起的线程中就访问不到对象了。

主要介绍开发中常接触到的四种ThreadLocal，包括ThreadLocal、InheritableThreadLocal、TransmittableThreadLocal和TransmissibleThreadLocal。会先结合具体的案例来介绍这四种ThreadLocal应该如何使用，以及在使用过程中遇到的数据污染和内存泄露问题。

### 3.2.1 案例1-父子线程变量传递不规范导致的数据污染

本文的第一个案例与存储登录信息有关，在日常开发中需要使用到当前登录用户的信息，最常用的方法是将用户信息当做参数进行层层传递，但这种方法会提升代码复杂度且在调用链过长时容易出错。

因此笔者团队选择将用户信息存储在ThreadLocal里进行上下文信息的传递，当需要使用时可以直接从ThreadLocal中获取，具体逻辑可见代码片段1中的SubjectUtils类。

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3e894961-3173-4702-91a3-da175d94f68d/a055c32f-5b58-4245-9d6d-87be05b58a8f/image.png)

```java
// ThreadLocal工具类
// 通过Filter过滤器，往ThreadLocal中写入用户信息
public class SubjectUtils {
    public static final String IN_MEMORY_SSO_USER_KEY = "_sso_user_";
    //声明static的ThreadLocal变量，用户存储登录用户信息
    private static final ThreadLocal<Map<Object, Object>> resources = new InheritableThreadLocal<Map<Object, Object>>();
  	//从ThreadLocal中获取用户信息
    public static UserInfo getUser() {
        return (UserInfo) resources.get().get(IN_MEMORY_SSO_USER_KEY);
    }
  	//往ThreadLocal中写入用户信息
    public static void bind(UserInfo user) {
        if (user != null) {
            resources.get().put(IN_MEMORY_SSO_USER_KEY, user);
        }
    }
  	//清理ThreadLocal中租户信息
    public static void unbindUser() {
        resources.get().remove(IN_MEMORY_SSO_USER_KEY);
    }
}
```

用户的租户信息丢失 

在代码片段2中，笔者使用了ThreadPoolTaskExecutor来创建异步线程（子线程），进行日志的操作。

```java
// 开异步线程记录日志(从ThreadLocal中获取用户信息)
//authenticateFilter，用于登录信息的绑定和清除，✅做法
public class AuthenticateFilter extends OncePerRequestFilter {
    //Filter拦截器逻辑
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // 清理ThreadLocal中可能存在的旧用户信息
        SubjectUtils.unbindUser();
        // 从cookie中获得token
        String token = CookiesUtils.getCookieValue(request, LOGIN_INFO_COOKIE_NAME);
        // 根据token从redis中获取用户信息
        UserDto userDto = redisCache.getValue(LionKey.WC_OAUTH_USER, new Object[]{token});
        // 如果为null，说明用户未登录
        if (Objects.isNull(userDto)) {
            //重定向到未登录的页面
            noAuthReturn(httpServletResponse);
            return;
        }
        // 如果用户信息存在，则将用户信息绑定到当前线程的ThreadLocal中，以便后续的处理可以方便的获取用户信息
        SubjectUtils.bind(userDto);
      	try {
	      	// 将请求传递给下一个过滤器
        	filterChain.doFilter(request, httpServletResponse);
        } finally {
            //（核心解决问题的代码）用完后需要清理ThreadLocal，否则数据会错乱
            SubjectUtils.unbindUser();
        }
    }
}

public void enterOffer(UserInfo user, Long applyJobUnionId) throws BusinessException {
    doEnterOffer(user, applyJobUnionId);
    ...
    // 通过线程池 异步记录日志
    // 调用这个方法的线程称为父进程
    // 线程池中的线程称为子线程
    taskExecutor.submit(() -> {
        try {
		        // 记录日志
            offerOperateLog(jobName, socialStatusDto, applyJobDto);
        } catch (Exception ex) {
            logger.info("记录操作信息日志异常:{}", ExceptionUtils.getFullStackTrace(ex));
        }
    });
}

private void offerOperateLog(String jobName, SocialStatusDto socialStatusDto, ApplyJobDto applyJobDto) { 
		// 封装日志信息
    ResumeLogRequestDto resumeOpLogDto = new ResumeLogRequestDto();
    resumeOpLogDto.setInfo();
    ....
    调用其他接口，拼装log信息
    ....

    //从ThreadLocal中获取User信息（含租户信息）
    UserInfo user = SubjectUtils.getUser();

    //调用日志记录接口，根据传入的租户信息，写入到对应的租户日志表 
    resumeLogService.addLog(user.getTenantId(), resumeOpLogDto);
}
```

原因分析：

这里会出现偶发性报错：在调用写日志的方法时，提示租户信息无法获取。

这里共有两个问题：

1. 子线程并没有形成独立副本而是与父线程共用同一对象，所以在代码片段2中的unbindUser方法把父线程中的ThreadLocal信息清除掉了，导致子线程获取不到。可是之前不是说ThreadLocal是线程的独立副本吗？这里怎么自相矛盾了。我们分析下线程初始化的源码，可以看到在java.lang.Thread的init方法里有一段代码：当父线程的inheritThreadLocals变量不为空时，程序会把子线程的inheritableThreadLocals变量设置为父线程的inheritableThreadLocals变量（子线程通过引用父线程的inheritableThreadLocals来实现线程间数据的传递）。

```java
//线程初始化的源码，Java8，java.lang.Thread
private void init(ThreadGroup g, Runnable target, String name,long stackSize, AccessControlContext acc,boolean inheritThreadLocals) {
    ......
    if (security == null || isCCLOverridden(parent.getClass()))
        this.contextClassLoader = parent.getContextClassLoader();
    else
        this.contextClassLoader = parent.contextClassLoader;
    this.inheritedAccessControlContext =
        acc != null ? acc : AccessController.getContext();
    this.target = target;
    setPriority(priority);
    // 如果父线程的inheritableThreadLocal不为null
    if (inheritThreadLocals && parent.inheritableThreadLocals != null)
        // 设置子线程中的inheritableThreadLocals为父线程的inheritableThreadLocals
        this.inheritableThreadLocals = ThreadLocal.createInheritedMap(parent.inheritableThreadLocals);

    ......
}

//创建Map的方法
static ThreadLocalMap createInheritedMap(ThreadLocalMap parentMap) {
    return new ThreadLocalMap(parentMap);
}

private ThreadLocalMap(ThreadLocalMap parentMap) {
    Entry[] parentTable = parentMap.table;
    int len = parentTable.length;
    setThreshold(len);
    table = new Entry[len];

    for (int j = 0; j < len; j++) {
        Entry e = parentTable[j];
        if (e != null) {
            @SuppressWarnings("unchecked")
            ThreadLocal<Object> key = (ThreadLocal<Object>) e.get();
            if (key != null) {
                //调用childValue方法
                Object value = key.childValue(e.value);
                Entry c = new Entry(key, value);
                int h = key.threadLocalHashCode & (len - 1);
                while (table[h] != null)
                   h = nextIndex(h, len);
                table[h] = c;
                size++;
        		}
       }
 	 }
}
```

1. 子线程在父线程ThreadLocal清除之前已经开启了，为什么还是没有取到呢？

主要是因为子线程拼装日志信息的耗时较长，长到主线程中ThreadLocal已经被清除掉后才完成拼装，【主线程→清除之前的ThreadLocal信息(旧用户信息)→注册信用户信息→通过子线程记录日志信息(时间较长)，此时又有一个登录请求来，将上个主线程注册的ThreadLocal信息清除掉了，导致上个子线程获取不到用户信息】所以就获取不到租户信息而报错了（如下图2）。

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3e894961-3173-4702-91a3-da175d94f68d/570cdcd0-1559-4743-ae46-da162e4a08f2/image.png)

解决方案：

解决方法的要点就在init源码里第41行key.childValue(e.value)，我们去InheritableThreadLocal的源码中可以看到，childValue方法是可以重写的（如下图3）。

我们可以在这个重写方法里通过克隆主线程的变量来保证父子线程不共用同一对象。

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3e894961-3173-4702-91a3-da175d94f68d/9abb4e5c-f13c-415c-97c9-e1b7706429e5/image.png)

具体的重写代码如下：

```java
private static final ThreadLocal<Map<String, Object>> resources = new InheritableThreadLocal() {
    @Override
    protected Object childValue(Object parentValue) {
        //深拷贝 创建一个完全独立的副本，而不是仅仅复制引用
        return parentValue != null ? (Map) ((HashMap) parentValue).clone() : null;
    }
};
```

需要注意的是：除了使用new Thread和使用Java线程池显式创建父子线程外，还有两种情况大家比较容易忽略的。

1. Jetty容器中的线程池都是由QueuedThreadPool（下文简称qtp）管理的，qtp线程池中的线程会派生子线程。
2. ForkJoinPool线程池中的线程也会存在“父”“子”关系。

### 3.2.2  案例2-线程池内复用线程导致的数据污染

通过上面案例1，大家对父子线程之间的数据污染有了初步了解。我们在实际项目使用中，通过线程池创建多个子线程的情况也很多，池化复用线程还会面临另一类数据污染的问题。

我们来看下面这段代码，实现的功能是给多用户发通知。代码的实现为：通过ExecutorService创建一个核心线程数为5的线程池，然后循环给10个用户发送通知。

```java
/
 * demo
 * 线程池中,给不同的用户发送大象消息
 */
public class ITLErrorTest {
    private static final ThreadLocal<User> resources = new InheritableThreadLocal<User>() {
        @Override
        protected User childValue(User parentValue) {
            //重写childValue方法, 实现子线程对父线程变量的深拷贝
            return Optional.ofNullable(parentValue).map(u -> (User) u.clone()).orElse(null);
        }
    };

    private static List<User> userList;

    static {
        userList = new ArrayList<>(10);
        //从定时任务中模拟获取到了10个用户数据,id分别是0到9
        IntStream.range(0, 10).forEach(i -> userList.add(new User(i, "zhangsan" + i)));
    }

		// 创建线程池
    private static ExecutorService executorService = new ThreadPoolExecutor(5,5,10,TimeUnit.SECONDS,new LinkedBlockingQueue<>(100));

    public static void main(String[] args) {
        // 定时任务,不同的用户发短信通知
        userList.forEach(user -> {
            // 模拟往ThreadLocal中放入用户信息
            resources.set(user);
            System.out.println("主线程放入用户信息: " + user.toString());

            // (...)中间执行很多业务逻辑

						// 使用线程池 对每一个user发送“简历变更请知晓”【user来源：从threadLocal中获取】
            executorService.submit(() -> {
                //异步发送大象消息,通知用户
                sendXMMessage("简历变更请知晓");
            });
            System.out.println("主线程操作结束");
            resources.remove();
        });
    }

    private static void sendXMMessage(String action) {
        // 从ThreadLocal中获取用户信息
        User user = resources.get();
        if (Objects.nonNull(user)) {
            System.out.println(MessageFormat.format("----子线程发送大象消息currentUser: {0}, action: {1}", user.toString(), action));
        } else {
            System.out.println(MessageFormat.format("----子线程发送大象消息, 用户为空, action: {0}", action));
        }
    }

    @NoArgsConstructor
    @AllArgsConstructor
    static class User implements Cloneable {
        private int id;
        private String name;

        @Override
        public String toString() {
            return "User{id=" + id + ", name='" + name + "'}";
        }

        @Override
        protected Object clone() {
            try {
                return super.clone();
            } catch (CloneNotSupportedException e) {
                System.out.println("clone error" + e.getMessage());
            }
            return null;
        }
    }
}
```

运行结果：

```
主线程放入用户信息: User{id=0, name='zhangsan0'}
主线程操作结束
主线程放入用户信息: User{id=1, name='zhangsan1'}
主线程操作结束
主线程放入用户信息: User{id=2, name='zhangsan2'}
主线程操作结束
主线程放入用户信息: User{id=3, name='zhangsan3'}
主线程操作结束
主线程放入用户信息: User{id=4, name='zhangsan4'}
主线程操作结束
主线程放入用户信息: User{id=5, name='zhangsan5'}
主线程操作结束
主线程放入用户信息: User{id=6, name='zhangsan6'}
主线程操作结束
主线程放入用户信息: User{id=7, name='zhangsan7'}
主线程操作结束
主线程放入用户信息: User{id=8, name='zhangsan8'}
主线程操作结束
主线程放入用户信息: User{id=9, name='zhangsan9'}
主线程操作结束
----子线程发送大象消息currentUser: User{id=1, name='zhangsan1'}, action: 简历变更请知晓
----子线程发送大象消息currentUser: User{id=3, name='zhangsan3'}, action: 简历变更请知晓
----子线程发送大象消息currentUser: User{id=2, name='zhangsan2'}, action: 简历变更请知晓
----子线程发送大象消息currentUser: User{id=1, name='zhangsan1'}, action: 简历变更请知晓
----子线程发送大象消息currentUser: User{id=4, name='zhangsan4'}, action: 简历变更请知晓
----子线程发送大象消息currentUser: User{id=0, name='zhangsan0'}, action: 简历变更请知晓
----子线程发送大象消息currentUser: User{id=4, name='zhangsan4'}, action: 简历变更请知晓
----子线程发送大象消息currentUser: User{id=1, name='zhangsan1'}, action: 简历变更请知晓
----子线程发送大象消息currentUser: User{id=3, name='zhangsan3'}, action: 简历变更请知晓
----子线程发送大象消息currentUser: User{id=2, name='zhangsan2'}, action: 简历变更请知晓
```

问题：用户收到了本不应该发给自己的通知

从运行结果中可以看到，程序只是在循环地给前5名用户发送通知，导致这5名用户收到了本应该发给其他用户的通知，与预期不符。

原因分析：这里的原因其实跟InheritableThreadLocal的初始化逻辑有关系，线程池中的核心线程初始化后，InheritableThreadLocal变量信息就不会发生变化。

在示例代码片段4中，线程池只设置了5个核心线程（5个最大线程），这5个线程初始化时，会把父线程中的inheritThreadLocals变量依次设置到子线程的ThreadLocalMap中，前5名用户的通知会正常发送。

当这5个核心线程初始化完后，第6次提交任务时就会从中随机找一个空闲线程来执行，但此时该线程ThreadLocalMap中的信息没有被更新，所以本应发给第6名用户的通知又发给了前5名用户种的某位。这时父子线程关系的ThreadLocal值传递已经没有意义，因此重写childValue方法也无法解决该问题。

阿里提供了TransmittableThreadLocal【链接 https://github.com/alibaba/transmittable-thread-local】来应对这类会池化复用线程引起的问题，保证线程池中值传递的正确性，共包括三种解决方案：修饰Runnable和Callable、修饰线程池和使用Java Agent来修饰JDK线程池实现类。

![TransmittableThreadLocal传值解决方案](https://prod-files-secure.s3.us-west-2.amazonaws.com/3e894961-3173-4702-91a3-da175d94f68d/ea47de9c-fbea-411a-97a2-c741db122f0a/image.png)

TransmittableThreadLocal传值解决方案

解决方案：

笔者采用第一种方案-修饰TtlRunnable，改造完成后，程序运行结果符合预期。具体改造代码如下，主要修改逻辑点为：

1.修改代码片段5第8行代码，把InheritableThreadLocal升级为TransmittableThreadLocal ；

2.修改代码片段第35行代码，用TtlRunnable修饰Runnable。

```java
/
 * demo
 * 线程池中,给不同的用户发送大象消息
 * 修复方案,修饰TtlRunnable
 */
public class TTLCorrectTest {
  	//把InheritableThreadLocal升级为TransmittableThreadLocal
    private static final ThreadLocal<User> resources = new TransmittableThreadLocal();

    private static List<User> userList;

    static {
        userList = new ArrayList<>(10);
        //从定时任务中模拟获取到了10个用户数据,id分别是0到9
        IntStream.range(0, 10).forEach(i -> userList.add(new User(i, "zhangsan" + i)));
    }
    
		// 创建线程池
    private static ExecutorService executorService = new ThreadPoolExecutor(5,5,10,TimeUnit.SECONDS,new LinkedBlockingQueue<>(100));

    public static void main(String[] args) {
        //定时任务,不同的用户发短信通知
        userList.forEach(user -> {
            //模拟往ThreadLocal中放入用户信息
            resources.set(user);
            System.out.println("主线程放入用户信息: " + user.toString());

            //(...)中间执行很多业务逻辑

          	//修饰TtlRunnable
            executorService.submit(Objects.requireNonNull(TtlRunnable.get(() -> {
                //异步发送大象消息,通知用户
                sendXMMessage("简历变更请知晓");
            })));
            System.out.println("主线程操作结束");
            resources.remove();
        });
    }

    private static void sendXMMessage(String action) {
        //从ThreadLocal中获取用户信息
        User user = resources.get();
        if (Objects.nonNull(user)) {
            System.out.println(MessageFormat.format("----子线程发送大象消息currentUser: {0}, action: {1}", user.toString(), action));
        } else {
            System.out.println(MessageFormat.format("----子线程发送大象消息, 用户为空, action: {0}", action));
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    static class User {
        private int id;
        private String name;

        @Override
        public String toString() {
            return "User{id=" + id + ", name='" + name + "'}";
        }
    }
}
```

```
主线程放入用户信息: User{id=0, name='zhangsan0'}
主线程操作结束
主线程放入用户信息: User{id=1, name='zhangsan1'}
主线程操作结束
主线程放入用户信息: User{id=2, name='zhangsan2'}
主线程操作结束
主线程放入用户信息: User{id=3, name='zhangsan3'}
主线程操作结束
主线程放入用户信息: User{id=4, name='zhangsan4'}
主线程操作结束
主线程放入用户信息: User{id=5, name='zhangsan5'}
主线程操作结束
主线程放入用户信息: User{id=6, name='zhangsan6'}
主线程操作结束
主线程放入用户信息: User{id=7, name='zhangsan7'}
主线程操作结束
主线程放入用户信息: User{id=8, name='zhangsan8'}
主线程操作结束
主线程放入用户信息: User{id=9, name='zhangsan9'}
主线程操作结束
----子线程发送大象消息currentUser: User{id=2, name='zhangsan2'}, action: 简历变更请知晓
----子线程发送大象消息currentUser: User{id=4, name='zhangsan4'}, action: 简历变更请知晓
----子线程发送大象消息currentUser: User{id=1, name='zhangsan1'}, action: 简历变更请知晓
----子线程发送大象消息currentUser: User{id=3, name='zhangsan3'}, action: 简历变更请知晓
----子线程发送大象消息currentUser: User{id=5, name='zhangsan5'}, action: 简历变更请知晓
----子线程发送大象消息currentUser: User{id=0, name='zhangsan0'}, action: 简历变更请知晓
----子线程发送大象消息currentUser: User{id=8, name='zhangsan8'}, action: 简历变更请知晓
----子线程发送大象消息currentUser: User{id=7, name='zhangsan7'}, action: 简历变更请知晓
----子线程发送大象消息currentUser: User{id=6, name='zhangsan6'}, action: 简历变更请知晓
----子线程发送大象消息currentUser: User{id=9, name='zhangsan9'}, action: 简历变更请知晓
```

### 3.2.3 案例3-线程池内复用线程&父子线程变量传递不规范导致的数据污染

该案例是前两个案例的组合，在该案例背景中，笔者既需要使用到线程池的线程复用，又要用到父子线程的信息传递。

首先描述第一个背景，笔者所负责的项目因为某些历史原因需要做重构，理所当然涉及到大量的接口以及历史数据的迁移。当时数据迁移使用公司提供的数据迁移平台(Unity：[迁移中心-一种基于平滑迁移思路建设的迁移系统](https://km.sankuai.com/page/659708446))，大致的迁移方案如下图，迁移平台会提供一个灰度切面的功能。在灰度期间，主线程执行旧逻辑，并开启异步线程执行新逻辑。

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3e894961-3173-4702-91a3-da175d94f68d/3147bfcc-85c0-4b7f-9c7d-12bda9f8824f/image.png)

再描述第二个背景，很多项目都会需要做租户隔离，而常用租户隔离方式有：字段隔离、表隔离和库隔离。隔离方式的使用场景不是本文重点，就不重点介绍了，笔者当时所负责的系统采用的是第二种表隔离方案。简单来说，就是把不同租户的数据持久化到不同表里去（表结构需一致）。

举例：租户1的表是1_xxtable，租户2的表就是 2_xxtable。在代码层的实现方案则是将租户信息存储在ThreadLocal里，当请求过来后，从ThreadLocal中获取租户信息，再经过 Mybatis 拦截器，给查询/更新语句的表名拼上对应的租户。

鉴于上述两个背景，案例3要实现的一个业务逻辑功能便是写入数据到不同租户的表中去。主要的代码逻辑和案例1很相似，有三部分：

1. 在Filter过滤器里写入租户信息；
2. 通过迁移平台提供的切面能力实现灰度方案；
3. 通过Mybatis拦截器从ThreadLocal中获取租户信息，并拼装对应的sql脚本；

```java
// 在Filter过滤器里写入租户信息；
// ThreadLocal工具类  
public class SubjectUtils {
    public static final String IN_MEMORY_SSO_USER_KEY = "_sso_user_";
    //从InheritableThreadLocal改造为TransmissibleThreadLocal，跟Unity团队共建逻辑
    private static final TransmissibleThreadLocal<Map<Object, Object>> resources = new TransmissibleThreadLocal<Map<Object, Object>>() {
        //由于之前踩坑过,敏感性的重写了childValue方法
        @Override
        protected Map<Object, Object> childValue(Map<Object, Object> parentValue) {
            return parentValue != null ? (Map) ((HashMap) parentValue).clone() : null;
        }
        @Override
        protected Map<Object, Object> initialValue() {
            return new HashMap();
        }
    };
    //获取用户信息
    public static UserInfo getUser() {
        return (UserInfo) ThreadContext.get(Constants.IN_MEMORY_SSO_USER_KEY);
    }
    //绑定当前登录用户信息
    public static void bind(UserInfo user) {
        if (user != null) {
            resources.get().put(IN_MEMORY_SSO_USER_KEY, user);
        }
    }
    //取消绑定当前用户
    public static void unbindUser() {
        resources.get().remove(IN_MEMORY_SSO_USER_KEY);
    }
}
  ....
  //Filter拦截器逻辑
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        //在SSO过滤器后，取到user放到request。
        User user = UserUtils.getUser();
        if(user != null) {
          	try {
                //从SSO中获取验证成功的登录用户
                UserInfo userInfo = cacheUserInfo(response, user);
                //往ThreadLocal中放入当前登录用户信息（用户信息中含租户信息）
                SubjectUtils.bind(userInfo);
                filterChain.doFilter(request, response);
            } finally {
                //用完后需要清理ThreadLocal，否则数据会错乱
                SubjectUtils.unbindUser();
        		}
        } else {
            filterChain.doFilter(request, response);
        }
    }
```

```java
// 灰度代码逻辑
// FlowControl是Unity框架提供的切面
// 根据灰度平台配置的状态进行双写，以旧为主阶段，同步执行老逻辑，异步执行新逻辑
@Override
@FlowControl(migrationCode = "xm_hiring.resume.channel.social_bole",
             moduleName = "insertAttachment",
             newProcessorMethod = "insertAttachment4New",
             oldProcessorMethod = "insertAttachment4Old",
             paramParser = SingleParamUserParser4Bole.class
)
// user用于灰度标识
public int insert(AttachmentPO attachmentPO, UserInfo user) {
    return attachmentPOMapper.insert(attachmentPO);
}
// 新逻辑
public int insertAttachment4New(AttachmentPO attachmentPO, UserInfo user) {
    return resumeRawAdaptor.createAttachment(attachmentPO);
}
// 老逻辑
public int insertAttachment4Old(AttachmentPO attachmentPO, UserInfo user) {
    return this.insert(attachmentPO, user);
```

```java
// Mybatis拦截器从ThreadLocal中获取租户信息
@Intercepts({@Signature(type = StatementHandler.class, method = "prepare", args = {Connection.class, Integer.class})})
public class TenantTableRewriter implements Interceptor {
 	...
   //拦截器逻辑
   public Object intercept(Invocation invocation) throws Throwable {
        //获取SQLStatement
        List<SQLStatement> statements = SQLUtils.parseStatements(boundSql.getSql(), JdbcConstants.MYSQL);

        StringBuilder stringBuilder = ReuseStringBuilderUtils.getStringBuilder();
        // visitor用于遍历和重写SQL中的表名
        MySqlOutputVisitor visitor = new RewriteTableNameVisitor(stringBuilder, tableIsolationNames);
        visitor.setPrettyFormat(false);
        statements.forEach(stmt -> stmt.accept(visitor));
        // 将重写后的sql设置会boundSql的sql属性
        boundSqlMetaObject.setValue("sql", stringBuilder.toString());
        statementMetaObject.setValue("boundSql", boundSql);
        // 继续执行被拦截的方法
        return invocation.proceed();
    }
  ...
}
//mybatis的Visitor，重写SQL
public class RewriteTableName extends MySqlOutputVisitor {
 	 public boolean visit(SQLExprTableSource x) {
        SQLName name = (SQLName) x.getExpr();
        
        //从ThreadLocal中从用户信息中获取租户信息
        String tenant = Optional.ofNullable(SubjectUtils.getUser())
                .map(UserInfo::getTenantId).orElse(null);
        //坑点4：异步线程中获取到的ThreadLocal信息为空，导致报错
        if (StringUtils.isBlank(tenant)) {
            throw new IllegalArgumentException("Can not get tenant info.");
        }
        //租户拼接表名
        print0(tenant + "_" + name.getSimpleName());
				return false;
    } 
}
```

程序报错，获取不到租户信息

由于迁移平台的限制，项目中会存在线程池复用线程的场景，因此选择了使用TransmissibleThreadLocal（是我司MTrace团队在TransmittableThreadLocal上做了一层封装），并且因为有案例1的前车之鉴，就很自觉地去重写了childValue 方法。

但是在执行的时候，发生了与“案例1”类似的情况，偶发性报错提示租户信息取不到，同理也是因为如果子线程的执行时间比父线程长，父线程先一步把ThreadLocal的信息清除掉了，导致子线程取不到Threadlocal里的租户信息。

原因分析：

既然笔者已经重写了childValue，为何还是会出这个问题呢？

经查阅相关资料，笔者了解到TransmissibleThreadLocal的父子线程值传递的时机从“初始化init时”改为“运行时传递”了，因此重写init方法中的childValue也不会生效。

![TransmissibleThreadLocal简介](https://prod-files-secure.s3.us-west-2.amazonaws.com/3e894961-3173-4702-91a3-da175d94f68d/f1e3c3f3-3bb7-4258-a979-ea18e514a0c6/image.png)

TransmissibleThreadLocal简介

解决方案：

根据官方文档提示，阿里的TransmittibleThreadLocal提供了重写copy方法的解决方案。

![TransmissibleThreadLocal的copy方法](https://prod-files-secure.s3.us-west-2.amazonaws.com/3e894961-3173-4702-91a3-da175d94f68d/29301649-6e1f-4cc1-9bb1-178c6017c548/image.png)

TransmissibleThreadLocal的copy方法

重写了copy方法之后，父线程不论如何操作数据，子线程中的数据不会受到影响，实现真正意义上的“线程独立副本”。

```java
// 解决迁移场景租户丢失的代码-重写copy方法
public class SubjectUtils {
    public static final String IN_MEMORY_SSO_USER_KEY = "_sso_user_";
    //从InheritableThreadLocal改造为TransmissibleThreadLocal
    private static final TransmissibleThreadLocal<Map<Object, Object>> resources = new TransmissibleThreadLocal<Map<Object, Object>>() {
        //由于之前踩坑过,敏感性的重写了childValue方法
        @Override
        protected Map<Object, Object> childValue(Map<Object, Object> parentValue) {
            return parentValue != null ? (Map) ((HashMap) parentValue).clone() : null;
        }

        @Override
        protected Map<Object, Object> initialValue() {
            return new HashMap();
        }

        //重写copy方法,解决值（引用类型）传递的问题
        @Override
        protected Map<Object, Object> copy(Map<Object, Object> parentValue) {
		        // 将父线程的数据 深拷贝 给子线程，而不是仅仅只拷贝引用
            return parentValue != null ? (Map) ((HashMap) parentValue).clone() : null;
        }
    };
    //获取用户信息
    public static UserInfo getUser() {
        return (UserInfo) ThreadContext.get(Constants.IN_MEMORY_SSO_USER_KEY);
    }
    //绑定当前登录用户信息
    public static void bind(UserInfo user) {
        if (user != null) {
            resources.get().put(IN_MEMORY_SSO_USER_KEY, user);
        }
    }
    //取消绑定当前用户
    public static void unbindUser() {
        resources.get().remove(IN_MEMORY_SSO_USER_KEY);
    }
}
```

### 3.2.4  案例4-线程池内ThreadLocal未及时清除造成内存泄露

在上述案例中有提到，如果Threadlocal不及时清除会造成数据污染，除此之外需要注意的是内存泄露的问题。

笔者模拟一个核心线程数和最大线程数均为6的线程池，且只往ThreadLocal里写数据而不清除，以此来复现内存泄漏场景。代码片段如下：

```java
/
 * ThreadLocal内存泄漏
 */
public class ThreadLocalMemoryLeakTest {

    static class LocalVar {
        //总共有5M
        private byte[] byteArray5M = new byte[1024 * 1024 * 5];
    }

  	//开启一个线程池，核心线程为6，最大线程为6的线程池
    final static ThreadPoolExecutor executorService = new ThreadPoolExecutor(6, 6, 1, TimeUnit.MINUTES, new LinkedBlockingQueue<>(100));

    static ThreadLocal<LocalVar> resources = new ThreadLocal<LocalVar>();

    public static void main(String[] args) throws InterruptedException {
        for (int i = 0; i < 50; ++i) {
            executorService.execute(() -> {
                LocalVar localVar = new LocalVar();
                resources.set(localVar);
                System.out.println("thread run end：" + Thread.currentThread().getName() + ", value:" + resources.get());
                // resources.remove();
            });
            Thread.sleep(2000);
        }
        resources = null;
        System.out.println("主线程结束");
    }
}
```

内存一直被占用无法回收

通过jconsole命令，图中可以看出一直有30M的内存占用无法被回收，正好对应了线程池中的6个核心线程，每个线程5M。

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3e894961-3173-4702-91a3-da175d94f68d/32fe4960-7d30-4c3d-855c-db11e437ccb2/image.png)

原因分析：

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3e894961-3173-4702-91a3-da175d94f68d/045716df-2f42-470c-995f-edda582b5fa8/image.png)

如上图所示，由于线程池的线程一直存在，并且线程中ThreadLocalMap存储的Entry向量继承自WeakReference<ThreadLocal<?>>，因此在Entry中的ThreadLocal变量是弱引用，一旦发生GC，ThreadLocal便会被GC回收掉，Entry中的key会变为null；但是value是强引用，它不会被回收掉，ThreadLocalMap的内容无法被回收，导致内存泄漏。

解决方案：

```java
/
 * ThreadLocal内存泄漏
 */
public class ThreadLocalMemoryLeakTest {

    static class LocalVar {
        //总共有5M
        private byte[] byteArray5M = new byte[1024 * 1024 * 5];
    }

    final static ThreadPoolExecutor executorService = new ThreadPoolExecutor(6,
            6, 1, TimeUnit.MINUTES,
            new LinkedBlockingQueue<>(100));

    static ThreadLocal<LocalVar> resources = new ThreadLocal<LocalVar>();

    public static void main(String[] args) throws InterruptedException {
        for (int i = 0; i < 50; ++i) {
            executorService.execute(() -> {
                LocalVar localVar = new LocalVar();
                resources.set(localVar);
                System.out.println("thread run end：" + Thread.currentThread().getName() + ", value:" + resources.get());
                //解决方式:使用完ThreadLocal需要进行remove清除
                resources.remove();
            });
            Thread.sleep(2000);
        }
        resources = null;
        System.out.println("主线程结束");
    }
}
```

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3e894961-3173-4702-91a3-da175d94f68d/eafbc310-3a7a-4a72-ae67-f93ba60524ac/image.png)

可以看到，及时清理ThreadLocal后，内存的占用量就变得正常了。

# 4.ThreadLocal使用场景

四种Threadlocal使用注意事项

|  | 存储方式 | 是否支持上下文传递（父子线程场景） | 是否支持多线程使用（线程池场景） | 易用性 | 解决问题/局限性 |
| --- | --- | --- | --- | --- | --- |
| 1 | ThreadLocal | ❌ | ❌ | 使用简单 | 局限性：信息无法进行上下文传递。 |
| 2 | InheritableThreadLocal | ✔️ | ❌ | 使用简单
• 深拷贝需要重写childValue方法。 | 解决问题：ThreadLocal无法跨父子线程，无法支持上下文传递。
局限性：InheritableThreadLocal无法处理线程池这类场景，由于线程的复用以及线程的信息始终保持线程创建时的threadlocal拷贝，因无法修改而造成信息混乱的问题。 |
| 3 | TransmittableThreadLocal
(TransmissibleThreadLocal) | ✔️ | ✔️ | 有一定的学习成本
• 深拷贝需要重写copy方法。 | 解决问题：InheritableThreadLocal在线程池的场景上，会造成信息混乱的问题。 |
- 用到 ThreadLocal 的地方，一定要成对 remove，就像开启流之后必须 close 一样，不及时 remove 会出现内存泄漏或数据污染。
- 严格检查 InheritableThreadLocal 的使用场景，如果确实需要（解决父子线程问题），必须检查重写 childValue 方法。

## 4.1 常用的场景

1. 代替参数的显式传递；
2. 全局存储用户信息；
3. 解决线程安全问题，如SimpleDateFormat；

## 4.2 慎用的场景

1. 线程池中线程调用使用ThreadLocal。
    
    由于线程池中对线程管理都是采用线程复用的方法。在线程池中线程非常难结束甚至于永远不会结束。这将意味着线程持续的时间将不可预测，甚至与JVM的生命周期一致；
    
2. 异步程序。
    
    ThreadLocal的参数传递是不靠谱的， 由于线程将请求发送后，就不再等待远程返回结果继续向下运行了，真正的返回结果得到后，处理的线程可能是其他的线程。Java8中的并发流（parallelStream）也要考虑这种情况；
    
3. 使用完ThreadLocal ，最好手动调用 remove() 方法，防止出现内存溢出。
    
    因为中使用的key为ThreadLocal的弱引用， 如果ThreadLocal 没有被外部强引用的情况下，在垃圾回收的时候会被清理掉的，但是如果value是强引用，不会被清理， 这样一来就会出现 key 为 null 的 value。