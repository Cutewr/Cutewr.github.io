---
date: 2024-08-28
category:
  - Java
tag:
  - JUC
  - 
---

# JUC并发编程

# 基本概念

# Java中的线程安全是什么意思？

多线程环境下，不会出现多个线程访问时造成数据的错误、丢失等不一致问题。

# 并行和并发

并行：在多处理器系统中同时执行多个任务。

并发：在单处理器系统中通过任务切换来实现某个时间段内的多个任务的“同时”进行。

# 同步和异步

同步操作需要等待任务完成后才能继续执行。

异步操作则不需要等待任务完成，可以继续执行其他任务，提高系统的效率。

# 线程安全实现方式

1. 原子操作：不可分割的操作，避免了多线程同时修改数据的问题，例如 CAS 就是一个原子操作。
2. 锁机制：如互斥锁、读写锁等，保证同一时刻只有一个线程能够访问共享资源。例如 synchronized 或者 ReentrantLock
3. 并发控制：如信号量、条件变量等，控制线程的执行顺序来保证线程安全。例如 Semaphore、CountDownLatch。

# 什么是协程？

协程(Coroutine)，是一个比线程更加轻量级的执行单位。线程是 CPU 层面的最小执行单元，但是协程是在程序层面的定义。

1. 协程的切换是由程序显式控制的，而不是由操作系统调度。
2. 由于不需要内核的参与，协程切换的开销非常低，可以显著提高程序的性能。
3. 协程之间的切换是非抢占式的，也就是说，协程只有在显式调用挂起操作时才会切换。协程通过协作式调度避免了许多传统多线程编程中的复杂问题，如锁等等。

## as-if-serial规则和happens-before规则的区别？

区别：

- as-if-serial定义：无论编译器和处理器如何进行重排序，单线程程序的执行结果不会改变。
- happens-before定义：一个操作happens-before另一个操作，表示第一个的操作结果对第二个操作可见，并且第一个操作的执行顺序也在第二个操作之前。但这并不意味着Java虚拟机必须按照这个顺序来执行程序。如果重排序的后的执行结果与按happens-before关系执行的结果一致，Java虚拟机也会允许重排序的发生。
- happens-before关系保证了同步的多线程程序的执行结果不被改变，as-if-serial保证了单线程内程序的执行结果不被改变。

相同点：happens-before和as-if-serial的作用都是在不改变程序执行结果的前提下，提高程序执行的并行度。

# 线程的生命周期在Java中是如何定义的？

1. 当我们刚创建一个线程的时候，这个时候就是NEW状态
2. 调用了线程的start方法，线程进入RUNNABLE状态【调用start方法后会处于Ready状态，获得时间片之后处于Running状态。因为时间片很短，这两种状态之间的切换很快，所以JVM没有区分这两种状态】Thread.yield()方法就会把线程从RUNNING状态变到READY状态。
3. 线程试图获得一个对象锁而被阻塞会进入Blocked状态【线程有代码被synchronized关键字修饰，没有获得锁的线程，BLOCKED状态。获得锁之后，进入Runnable状态，等待运行】。
4. 调用wait方法、join、park后，会从runnable变到WAITTING状态，需要被显式唤醒才能返回到运行状态【notify，notifyAll，unpark】
5. TIME-WAITING状态。线程进入等待状态，但指定了等待时间，超时后会被唤醒。【使用带超时时间的方法，比如sleep(xxs)，wait(xxx)超时时间结束后，会回到运行状态】
6. 线程执行完成或因异常退出，进入TERMINATE终止状态。这个时候线程执行完毕。terminate之后是不能再调用start方法的了。

# waitting状态和blocked状态的区别

BLOCKED和WAITING都是属于线程的等待状态。

1. **BLOCKED状态**是指线程在等待Synchronized锁的时候的阻塞状态。

也就是在多个线程去竞争Synchronized同步锁的时候，没有竞争到锁资源的线程，会被阻塞等待，这个时候线程状态就是BLOCKED。

1. **WAITING状态**，表示线程的等待状态。在这种状态下，线程需要等待某个线程的特定操作才会被唤醒。使用Object.wait()、Object.join()这些方法都使得线程进入WAITING状态，在这个状态下，必须要等待特定的方法来唤醒。【比如Object.notify方法可以唤醒Object.wait()方法阻塞的线程；Object.join()方法会使得当前线程等待指定线程的结束，当指定线程结束时，当前线程将被唤醒。】

所以，在我看来，BLOCKED和WAITING两个状态最大的区别有两个：

- BLOCKED是锁竞争失败后被被动触发的状态，WAITING是人为的主动触发的状态
- BLCKED的唤醒时自动触发的，而WAITING状态是必须要通过特定的方法来显式唤醒

## wait方法和sleep方法的区别

1、sleep()方法正在执行的线程主动让出CPU（然后CPU就可以去执行其他任务），在sleep指定时间后CPU再回到该线程继续往下执行(注意：sleep方法只让出了CPU，而并不会释放同步资源锁！！！)；wait()方法则是指当前线程让自己暂时退让出同步资源锁，以便其他正在等待该资源的线程得到该资源进而运行，只有调用了notify()方法，之前调用wait()的线程才会解除wait状态，可以去参与竞争同步资源锁，进而得到执行。（注意：notify的作用相当于叫醒睡着的人，而并不会给他分配任务，就是说notify只是让之前调用wait的线程有权利重新参与线程的调度）；

2、sleep()方法可以在任何地方使用；wait()方法则只能在同步方法或同步块中使用；

3、sleep()是线程线程类（Thread）的方法，调用会暂停此线程指定的时间，但监控依然保持，不会释放对象锁，到时间自动恢复；wait()是Object的方法，调用会放弃对象锁，进入等待队列，待调用notify()/notifyAll()唤醒指定的线程或者所有线程，才会进入锁池，不再次获得对象锁才会进入运行状态；

## 一个线程调用两次start方法，会发生什么

会报错！因为在Java中, 一个线程只能被启动一次! 所以尝试第二次调用start()方法时，会抛出IllegalThreadStateException异常。【非法线程状态异常】

这是因为一旦线程已经开始执行，线程的生命周期不允许它再回到初始状态。

## 用过JUC包下的那些类？

1. 用过Atomic包下的原子类，可以保证变量的原子性，底层是通过unsafe类下的CAS方式形式来对数据进行修改的
2. locks包下的，有ReentrantLock、LockSupport
3. ConcurrentHashMap
4. ThreadPoolExecutor 创建线程池

# 什么是Java中的可见性、原子性和有序性？

1. 可见性

可见性是指当多个线程访问同一个变量时，一个线程修改了这个变量的值，其他线程能够立即看得到修改的值。

```java
public class Test01Visibility {
    public static volatile boolean flag=true;
    public static void main(String[] args) throws InterruptedException {
        Thread t1=new Thread(()->{
            while (flag){

            }
        });
        t1.start();

        Thread.sleep(2000);
        Thread t2=new Thread(()->{
            flag=false;
            System.out.println("t2设置flag为false");
        });
        t2.start();
    }
}
```

加了volatile关键字之后，t2修改flag为false，t1感知道了，就会跳出循环，停下程序。

1. 原子性

指一个操作不会被中断，要么这个操作执行完毕，要么不会执行。

```java
public class Test02Atomicity {
    public static int number=0;
    public static void main(String[] args) throws InterruptedException {
        Runnable increment=()->{
            for (int i=0;i<1000;i++){
                number++;
            }
        };

        ArrayList<Thread> list=new ArrayList<>();
        for (int i=0;i<5;i++){
            Thread t=new Thread(increment);
            t.start();
            list.add(t);
        }
        for (Thread thread : list) {
            thread.join();
        }
        System.out.println(number);
    }
}
```

这样得出的结果并不是5000，因为number++并不是原子操作【分为内存读到寄存器，寄存器自增，写回内存】。当一个线程对共享变量操作到一半时，另外的线程也有可能来操作共享变量，干扰了前一个线程的操作。

1. 有序性

是指程序的执行顺序和代码编写顺序一致。Java在编译时和运行时会对代码进行优化，可能会导致程序最终的执行顺序不一定是代码编写的顺序。

# volatile关键字的作用是什么？

volatile的主要作用是保证变量的可见性和禁止指令重排优化。

可见性：被它修饰的值一旦被修改，立即会被其他线程看到。

指令重排序：在多线程环境中，编译器和处理器可能会对代码进行优化，比如指令重排序。 volatie 关键字可以禁止这种优化，确保变量的读写操作按照代码的顺序执行。

【volatile可以保证变量的可见性，但是不能保证对变量的操作是原子性的】

# volatile的原理

1. volatile变量的可见性主要是通过

JMM规定所有的变量都存储在主内存（Main Memory）中。每个线程还有自己的工作内存（Working Memory）,线程的工作内存中保存了该线程使用到的变量的副本，线程对变量的所有操作（读取、赋值等）都必须在工作内存中进行，而不能直接读写主内存中的变量。不同的线程之间也无法直接访问对方工作内存中的变量，线程之间值的传递都需要通过主内存来完成正因为不同的线程之间也无法直接访问对方工作内存中的变量，所以 volatile 闪亮登场了。

当线程A对被 volatile 修饰的 stop 变量进行赋值时并把值写进主内存，会导致其他线程的工作内存中变量副本 stop 的缓存行无效（反映到硬件层的话，就是 CPU 的 L1 或者L2 缓存中对应的缓存行无效），所以其他线程再次读取变量 stop 的值时，发现自己的缓存行无效，它会等待缓存行对应的主存地址被更新之后，然后去对应的主存读取最新的值，那么线程1读取到的就是最新的正确的值。

缓存行（cache line）：CPU高速缓存中可以分配的最小存储单位。处理器填写缓存行时会加载整个缓存行。

加入volatile关键字时所生成的汇编代码时，会多出一个lock前缀指令，实现了缓存一致性。

一个处理器将自己缓存行的数据写回到系统内存后，其他的每个处理器就会通过嗅探在总线上传播的数据来检查自己缓存的数据是否已过期，当处理器发现自己缓存行对应的内存地址的数据被修改后，就会将自己缓存行缓存的数据设置为无效，当处理器要对这个数据进行修改操作的时候，会重新从系统内存中把数据读取到自己的缓存行，重新缓存。

1. 实现有序性：编译器在生成字节码时会通过插入内存屏障来禁止指令重排序。

# Java中线程之间如何进行通信？

**共享变量**

多个线程可以访问同一个共享的变量来进行通信。但需要注意线程同步，以避免出现数据不一致的问题。通常使用 synchronized 关键字或者 Lock 锁来保证线程安全。

**同步机制**

1. 等待/通知机制

在 synchronized代码块或方法中，通过wait()方法使当前线程等待，释放锁；其他线程可以通过notify()或 notifyAll()方法来唤醒等待的线程。

ReentrantLock配合Condition也提供了类似的方法，await() 负责等待、signal() 和 signalAll() 负责通知。为线程提供了一种等待某个条件的机制，更灵活。

1. volatile关键字：保证变脸那个的可见性，防止指令重排
2. 信号量机制：控制对特定资源的访问线程数
3. 线程阻塞队列：实现生产者-消费者模型

**管道流**

管道输入/输出流主要包括了如下 4 种具体实现：PipedOutputStream、PipedInputStream、 PipedReader 和 PipedWriter，前两种面向字节，而后两种面向字符。

# 阻塞队列

## 常见的阻塞队列

1. ArrayBlockingQueue：基于数组实现的有界阻塞队列，容量在创建时指定，并且不能动态扩展。
2. LinkedBlockingQueue：基于链表实现的有界阻塞队列，链表的长度可以通过构造函数显式指定，如果使用默认的构造函数，则默认大小是Integer.MAX_VALUE。
3. PriorityBlockingQueue：基于优先级堆排序实现的阻塞队列（可扩容），元素按照优先级顺序进行排序。
4. SynchronousQueue：不存储元素的阻塞队列，每个插入操作都必须等待一个相应的删除操作，反之亦然。

## 阻塞队列的原理

常用的阻塞队列，比如：ArrayBlockingQueue、LinkedBlockingQueue、PriorityBlockingQueue底层都是采用ReentrantLock锁来实现线程的互斥，而ReentrantLock底层采用了AQS框架实现线程队列的同步，线程的阻塞是调用LockSupport.park实现，唤醒是调用LockSupport.unpark实现，具体可以看我之前的文章，SynchronousQueue底层虽然没有用AQS框架，但也用的是LockSupport实现线程的阻塞与唤醒。

[一文读懂LockSupport](https://www.cnblogs.com/star95/p/17640946.html)

[AQS源码分析](https://www.cnblogs.com/star95/p/17656890.html)

阻塞队列的原理可以通过两个关键组件来解释：锁和条件变量。

- 锁

阻塞队列使用锁来保护共享资源，控制线程的互斥访问。在队列为空或已满时，线程需要等待相应的条件满足才能继续执行。

- 条件变量

条件变量是锁的一个补充，在某些特定的条件下，线程会进入等待状态。当条件满足时，其他线程会通过调用条件变量的唤醒方法（比如signal()或signalAll()）来通知等待的线程进行下一步操作。

当一个线程试图从空的阻塞队列中获取元素时，它会获取队列的锁，并检查队列是否为空。如果为空，这个线程将进入等待状态，直到其他线程向队列中插入元素并通过条件变量唤醒它。当一个线程试图向已满的阻塞队列插入元素时，它会获取队列的锁，并检查队列是否已满。如果已满，这个线程将进入等待状态，直到其他线程从队列中获取元素并通过条件变量唤醒它。

接下来我们看下阻塞队列的获取元素和插入元素的核心代码：

ArrayBlockingQueue、LinkedBlockingQueue、PriorityBlockingQueue的带阻塞的插入和获取方法都是基于ReentrantLock锁+条件变量的等待和通知来实现的。

主要看看ArrayBlockingQueue带阻塞的插入和获取元素的主要方法吧。

# 线程池

## 为什么要有线程池？

线程池是一种池化技术，用于预先创建并管理一组线程，通过线程复用来减少创建和销毁线程的开销，提高系统性能和响应速度，提高线程的可管理性。

## 创建线程池的几种方式

主要有两种方式

1. 通过ThreadPoolExecutor构造函数，自定义参数创建
2. 通过Executor提供的方法，这种方法的构造函数还是调用了ThreadPoolExecutor，只不过已经指定好了参数。

- `FixedThreadPool`：固定线程数量的线程池。该线程池中的线程数量始终不变。当有一个新的任务提交时，线程池中若有空闲线程，则立即执行。若没有，则新的任务会被暂存在一个任务队列中，待有线程空闲时，便处理在任务队列中的任务。
- `SingleThreadExecutor`： 只有一个线程的线程池。若多余一个任务被提交到该线程池，任务会被保存在一个任务队列中，待线程空闲，按先入先出的顺序执行队列中的任务。

前两种线程池使用的任务队列是无界的LinkedBlockingQueue，可能导致堆积大量的请求，导致OOM

- `CachedThreadPool`： 可根据实际情况调整线程数量的线程池。线程池的线程数量不确定，但若有空闲线程可以复用，则会优先使用可复用的线程。若所有线程均在工作，又有新的任务提交，则会创建新的线程处理任务。所有线程在当前任务执行完毕后，将返回线程池进行复用。

使用的是同步队列 `SynchronousQueue`, 允许创建的线程数量为 `Integer.MAX_VALUE` ，如果任务数量过多且执行速度较慢，可能会创建大量的线程，从而导致 OOM

- `ScheduledThreadPool`：支持定时及周期性执行任务。使用的无界的延迟阻塞队列`DelayedWorkQueue`，任务队列最大长度为 `Integer.MAX_VALUE`,可能堆积大量的请求，从而导致 OOM。

## 线程池常用的阻塞队列总结

新任务来的时候会先判断当前运行的线程数量是否达到核心线程数，如果达到的话，新任务就会被存放在队列中。
不同的线程池会选用不同的阻塞队列，我们可以结合内置线程池来分析。

- 容量为 Integer.MAX_VALUE 的 LinkedBlockingQueue（无界队列）：FixedThreadPool 和SingleThreadExector 。 FixedThreadPool 最多只能创建核心线程数的线程（核心线程数和最大线程数相等），SingleThreadExector 只能创建一个线程（核心线程数和最大线程数都是1），二者的任务队列永远不会被放满
- SynchronousQueue（同步队列）：CachedThreadPool。 SynchronousQueue 没有容量，不存储元素，目的是保证对于提交的任务，如果有空闲线程，则使用空闲线程来处理；否则新建一个线程来处理任务。也就是说， CachedThreadPool 的最大线程数是 Integer.MAX_VALUE，可以理解为线程数是可以无限扩展的，可能会创建大量线程，从而导致OOM。
- DelayedWorkQueue（延迟阻塞队列）：ScheduledThreadPool 和 SingleThreadScheduledExecuton。DelayedWorkQueue 的内部元素并不是按照放入的时间排序，而是会按照延迟的时间长短对任务进行排序，内部采用的是“堆”的数据结构，可以保证每次出队的任务都是当前队列中执行时间最靠前的。DelayedWorkQueue 添加元素满了之后会自动扩容原来容量的1/2，即永远不会阻塞，最大扩容可达Integer.MAX_VALUE。

## `execute()` [vs](https://www.notion.so/JUC-11613b45ed5d48bbb3e4fd1ea8bccdf1?pvs=21) `submit()`

`execute()` 和 `submit()`是两种提交任务到线程池的方法，有一些区别：

- **返回值**：`execute()` 方法用于提交不需要返回值的任务。通常用于执行 `Runnable` 任务，无法判断任务是否被线程池成功执行。`submit()` 方法用于提交需要返回值的任务。可以提交 `Runnable` 或 `Callable` 任务。`submit()` 方法返回一个 `Future` 对象，通过这个 `Future` 对象可以判断任务是否执行成功，并获取任务的返回值（`get()`方法会阻塞当前线程直到任务完成， `get（long timeout，TimeUnit unit）`多了一个超时时间，如果在 `timeout` 时间内任务还没有执行完，就会抛出 `java.util.concurrent.TimeoutException`）。
- **异常处理**：在使用 `submit()` 方法时，可以通过 `Future` 对象处理任务执行过程中抛出的异常；而在使用 `execute()` 方法时，异常处理需要通过自定义的 `ThreadFactory` （在线程工厂创建线程的时候设置`UncaughtExceptionHandler`对象来 处理异常）或 `ThreadPoolExecutor` 的 `afterExecute()` 方法来处理

## `shutdown()`[VS](https://www.notion.so/JUC-11613b45ed5d48bbb3e4fd1ea8bccdf1?pvs=21)`shutdownNow()`

- **`shutdown（）`** :关闭线程池，线程池的状态变为 `SHUTDOWN`。线程池不再接受新任务了，但是队列里的任务得执行完毕。
- **`shutdownNow（）`** :关闭线程池，线程池的状态变为 `STOP`。线程池会终止当前正在运行的任务，并停止处理排队的任务并返回正在等待执行的 List。

## `isTerminated()` [VS](https://www.notion.so/JUC-11613b45ed5d48bbb3e4fd1ea8bccdf1?pvs=21) `isShutdown()`

- **`isShutDown`** 当调用 `shutdown()` 方法后返回为 true。
- **`isTerminated`** 当调用 `shutdown()` 方法后，并且所有提交的任务完成后返回为 true

## 线程池的核心参数

1. corePoolSize：核心线程数，即线程池中始终保持的线程数量。
2. maximumPoolSize：最大线程数，即线程池中允许的最大线程数量。
3. keepAliveTime：线程空闲时间，超过这个时间的非核心线程会被销毁。
4. unit：空闲时间的单位
5. workQueue：任务队列，存放待执行的任务。
6. threadFactory：线程工厂，用于创建新线程
7. rejectedExecutionHandler：任务拒绝处理器，当任务无法执行时的处理策略

线程池提供的有参构造里的7个参数。

```java
public ThreadPoolExecutor(int corePoolSize,
                          int maximumPoolSize,
                          long keepAliveTime,
                          TimeUnit unit,
                          BlockingQueue<Runnable> workQueue,
                          ThreadFactory threadFactory,
                          RejectedExecutionHandler handler) {
    /*
    corePoolSize：核心线程数。
    maximumPoolSize：工作线程总数 = 核心线程数 + 非核心线程数。
    keepAliveTime：默认情况下，针对非核心线程的最大空闲时间
    unit：空闲时间的单位
    workQueue：任务排队的地方，可以指定长度。
    threadFactory：创建工作线程的线程工厂。
    handler：拒绝策略。在核心线程满了，非核心线程满了，工作队列满了，才走拒绝策略。
    */
}
```

## 线程池的工作原理

1. 默认情况下线程不会预创建，任务提交之后才会创建线程(不过设置 prestartAllCoreThreads 可以预创建核心线程)。
2. 当核心线程满了之后不会新建线程，而是把任务堆积到工作队列中。
3. 如果工作队列放不下了，然后才会新增线程，直至达到最大线程数。
4. 如果工作队列满了，然后也已经达到最大线程数了，这时候来任务会执行拒绝策略。
5. 如果线程空闲时间超过空闲存活时间，并且线程数是大于核心线程数的则会销毁线程，直到线程数等于核心线程数(设置allowCoreThreadTimeOut 为 true 可以回收核心线程，默认为 false)。

## 如何设置Java线程池的线程数？

线程池的线程数设置是需要看你执行的任务是什么类型的。

任务类型可以分：CPU 密集型任务和IO 密集型任务。

CPU密集型任务，也就是它可以充分利用 CPU 资源，很少因为IO操作被阻塞。因此不需要很多线程，线程多了上下文开销反而会变多。那么核心线程数就需要设计为CPU内核数左右。

IO密集型任务，有很多IO操作，例如文件的读取、数据库的读取等等，任务在读取这些数据的时候，是无法利用 CPU 的，这种情况下，核心线程数要应该远大于CPU内核数。

然而，实际的最佳线程数还是需要通过压测分析。Hippo4j

## Java线程池有哪些拒绝策略

线程池默认提供了四种拒绝策略

1. AbortPolicy：，直接抛出RejectedExecutionException错误，这也是默认的拒绝策略。适用于必须通知调用者任务未能被执行的场景。
2. CallerRunsPolicy，当任务队列满且没有线程空闲，此时添加任务由即调用者线程执行。适用于希望通过减缓任务提交速度来稳定系统的场景
3. DiscardOldestPolicy，当任务队列满且没有线程空闲，会删除最早的任务，然后重新提交当前任务。
4. DiscardPolicy，直接丢弃当前提交的任务，不会执行任何操作，也不会抛出异常。

另外，可以实现ReiectedExecutionHandler接口来定义自定义的拒绝策略。

```java
public class CustomRejectedExecutionHandler implements RejectedExecutionHandler {
    @Override
    public void rejectedExecution(Runnable r, ThreadPoolExecutor executor) {
        System.out.println("mianshiya.com Task " + r.toString() + " rejected");
        // 可以在这里实现日志记录或其他逻辑
    }
}

```

# 可重入锁的应用场景

可重入锁在实际应用中非常广泛，特别是在处理递归函数或方法时。例如，在[数据库](https://cloud.baidu.com/solution/database.html)连接池、线程池等场景中，我们经常需要用到可重入锁来确保线程[安全](https://cloud.baidu.com/solution/security/soc.html)。

# 常用方法总结

### yield()方法

Thread.yield()方法就会把线程从RUNNING状态变到READY状态。【暂时让出CPU资源】。和Thread.sleep(0)等价

### 3、sleep()方法

方法结束，会回到就绪状态

### 3、join()方法

保证线程按序执行

操作系统的线程一般大于Java程序的线程，因为java程序的线程和os的线程是一一对应的，但是JVM本身存在一些线程【垃圾回收线程....】

# 什么是Java中的Semaphore？

Semaphore是信号量，相比于lock和synchronized这种只允许一个线程访问临界区，信号量机制允许多线程同时访问临界区。具体是通过acquire方法来请求资源，如果-1后资源小于0，说明没有资源分配了，就阻塞当前线程，加入到阻塞队列中。当一个线程执行完毕后，调用release方法，可以唤醒阻塞队列中的一个等待线程。

内部实现是内部有一个类继承自 AQS的 Sync类，通过依托 AQS 的封装来实现功能。主要用于流量的控制，比如停车场只允许停一定数量的车位。

# 你了解Java中的读写锁吗？

读写锁在 Java 中一般默认指的是 ReentrantReadWriteLock。

读写锁是有两把锁，分别是读锁和写锁。

除了读读操作不互斥之外，其他都互斥。

所以读很多写比较少的情况，用读写锁比较合适。

还有一点要注意，如果不是这种情况不要用读写锁，因为读写锁需要额外维护读锁的状态，所以如果读读操作不多还不如一般的锁。

读写锁也是基于 AQS实现的，再具体点的实现就是将 state分为了两部分，高16bit用于标识读状态、低16bit标识写状态。就这样通过一个 state 实现了两把锁。

# 什么是Java中的CountDownLatch？

CountDownLatch是一个线程阻塞着等待其他线程到达一个节点才能继续执行。使用：因为内部有一个继承自AQS的Sync类，核心就是AQS类的state值，初始化state的值，调用一次countDown会把state值减一，当state值减为0时就会唤醒之前调用await等待的线程。

# 如何在Java中控制多个线程/任务的执行顺序

1. CompletableFuture，它内部有 thenRun 的方法，假设我们现在有三个任务T1、T2、T3 需要按序执行，那么仅需使用以下伪代码即可：

```java
CompletableFuture. runAsync(( → {do t1 sth})
    thenRun ((→> {do t2 sth})
    thenRun (()-> {do t3 sth}) ;
```

1. synchronized + wait（）/notify（），通过对象锁和线程间通信机制来控制线程的执行顺序。
2. ReentrantLock + condition.
3. Thread类的 join()，通过调用这个方法，可以使一个线程等待另一个线程执行完毕后再继续执行。
4. CountDownLatch，使一个或多个线程等待其他线程完成各自工作后再继续执行。
5. CyclicBarrier，使多个线程互相等待，直到所有线程都到达某个共同点后再继续执行。
6. Semaphore，控制线程的执行顺序，适用于需要限制同时访问资源的线程数量的场景。
7. 线程池，内部仅设置一个线程来执行任务，按序的将任务提交到线程池中就可以了。

# join()方法的底层原理

实际上join方法底层用的就是synchronized + wait机制，调用join就是加锁然后 wait 等待，源码：

![https://cdn.nlark.com/yuque/0/2024/png/39067949/1723295323247-acbc26e0-b1b2-4c26-a2c8-85e7311bfb33.png](https://cdn.nlark.com/yuque/0/2024/png/39067949/1723295323247-acbc26e0-b1b2-4c26-a2c8-85e7311bfb33.png)

假如一个线程调用了join方法，等线程执行完毕后，JVM底层会调用lock.notify_all（thread），唤醒持有这个线程对象锁的其他线程。

# Synchronized和ReentrantLock有什么区别？

Synchronized 是 Java 内置的关键字，实现基本的同步机制，不支持超时时间、非公平，不可中断，不支持多条件。

ReentrantLock 是JUC 类库提供的，由 JDK 1.5引入，支持设置超时时间，可以避免死锁，比较灵活，并且支持公平锁，可中断，支持多条件判断。

ReentrantLock 需要手动解锁，而 Synchronized 不需要，它们都是可重入锁。

一般情况下用 Synchronized 足矣，比较简单，而ReentrantLock 比较灵活，支持的功能比较多，所以复杂的情况用 ReentrantLocK。

性能问题：比较早的时候，Synchronized 性能不如ReentrantLock，现在基本上性能是一致的。

# 什么是Java中的CAS操作

CAS 就是 compare and swap，即比较并交换，是一个原子操作，用于实现无锁并发编程。CAS 需要三个操作数，分别是旧的预期值，变量内存地址，新值。指令是根据变量地址拿到值，比较是否和预期值相等，如果是的话则替换成新值，如果不是则不替换。硬件层面就给予支持，将这个比较和交换的动作封装成一个指令，这样就保证了原子性。

# CAS的优缺点

优点：

1. 无锁并发：CAS 操作不使用锁，因此不会导致线程阻塞，提高了系统的并发性和性能。
2. 原子性：CAS 操作是原子的，保证了线程安全。

缺点：

1. ABA 问题：CAS 操作中，如果一个变量值从A变成B，又变回 A，CAS无法检测到这种变化，可能导致错误。（可以通过版本号机制来解决，使用volatile修饰版本号，保证可见性）
2. 自旋开销：CAS操作通常通过自旋实现，可能导致CPU 资源浪费，尤其在高并发情况下。
3. 单变量限制：CAS操作仅适用于单个变量的更新，不适用于涉及多个变量的复杂操作。

# 什么是Java内存模型(JMM)

JMM定义了一套规范，我们只需要使用Java提供的并发类、知道happens-before原则，就可以写出并发安全的代码。

它的基本目标是：

1. 确保原子性：多个线程对一个变量的读写操作是不可分割的
2. 确保可见性：一个线程对共享变量的修改，能够被其他线程看到。
3. 确保有序性：使得代码的执行顺序符合开发者的预期。

JMM是抽象出来的一套内存规范，会把内存分为本地内存和主存，每个线程都有自己的私有化的本地内存，然后还有存储共享数据的主存。本地内存只存储该线程对共享变量的副本。线程对变量的所有的操作都在本地内存中完成，不同线程之间也不能直接访问对方工作内存中的变量。

JMM定义这两个内存的交互规则，我们只要遵守定义的规则，就不会出现并发问题。

# 什么是Java中的Happens-Before原则

Happens-Before 关系定义了某个操作的结果对另一个操作可见，即如果操作 A Happens-Before 操作 B，则操作 A的结果对操作B可见。

Happens-Before 规则包括以下几个重要的顺序：

1. 程序顺序规则：在一个线程内，按照代码顺序，前面的操作 Happens-Before 后面的操作。
2. 监视器锁规则：对一个锁的解锁操作 Happens-Before 后续对这个锁的加锁操作。
3. volatile 变量规则：对一个 volatile 变量的写操作 Happens-Before 后续对这个 volatile 变量的读操作。
4. 线程启动规则：对线程的 Thread.start（）调用 Happens-Before 该线程中的每一个动作。
5. 线程终止规则：线程中的所有操作 Happens-Before 其他线程检测到该线程已经终止
6. 线程中断规则：对线程的 interrupt（）调用 Happens-Before 检测到中断事件的代码
7. 对象终结规则：一个对象的初始化完成 Happens-Before 它的 finalize（）方法的开始。
8. 传递性：如果操作 A Happens-Before 操作B，操作B Happens-Before 操作C，则操作AHappens-Before 操作C。

# 什么是Java中的指令重排

为了提高程序执行的效率。因为内存访问的速度比CPU运行速度慢很多，因此需要编排一下执行的顺序，防止因为访问内存的比较慢的指令而使得CPU闲置着。

为了提高效率就会有指令重排的情况，导致指令乱序执行的情况发生，不过会保证结果肯定是与单线程执行结果一致的。不过多线程就无法保证了。

# synchronized关键字

### 1、计算机内存模型

冯诺依曼提出，计算机由五大部分组成：输入设备，存储器，输出设备，CPU【控制器、运算器】

![https://cdn.nlark.com/yuque/0/2024/png/39067949/1719203709900-4b638db2-c971-45a6-ae47-a073da548ea1.png](https://cdn.nlark.com/yuque/0/2024/png/39067949/1719203709900-4b638db2-c971-45a6-ae47-a073da548ea1.png)

1. CPU

中央控制器，是计算机控制和运算的核心，我们的程序最终都会变成指令让CPU执行，处理CPU中的数据。

1. 内存

程序都是在内存中运行的，内存会保存程序运行时的数据，供CPU处理。

1. 缓存

CPU的运算速度和内存的访问速度相差比较大，这就导致CPU每次操作内存都需要等待时间。内存的读写速度成了计算机运行的瓶颈。于是就在CPU中设计了缓存结构，依次是L1、L2、L3

### 2、Java内存模型

### 2.1 Java内存模型的概念

Java内存模型是一套规范，描述了Java中线程共享变量的访问规则，以及在JVM中将变量存储到内存和从内存中读取变量这样的细节。

- 主内存

主内存是所有线程都共享的，都能访问的。所有的共享变量都存储于主内存。

- 工作内存

每一个线程有自己的工作内存，

![https://cdn.nlark.com/yuque/0/2024/png/39067949/1719205650325-056026cc-28cb-44dc-baa9-f082614569ce.png](https://cdn.nlark.com/yuque/0/2024/png/39067949/1719205650325-056026cc-28cb-44dc-baa9-f082614569ce.png)

### 3、总结

Java内存模型和硬件内存架构并不完全一致。对于硬件内存来说只有寄存器、缓存内存、主内存的概念，并没有工作内存和主内存之分，也就是说Java内存模型对内存的划分对硬件内存并没有任何影响。

因为JMM只是一种抽象的概念，是一组规则，不管是工作内存的数据还是主内存的数据，对于计算机硬件来说都会存储在计算机主内存中、CPU缓存或者寄存器中，因此总体上来说， Java内存模型和计算机硬件内存架构是一个相互交叉的关系，是一种抽象概念划分与真实物理硬件的交叉。

**JMM内存模型与CPU硬件内存架构的关系：**

![https://cdn.nlark.com/yuque/0/2024/png/39067949/1719205810461-adef84ae-8762-44bb-baf3-e72541587cd3.png](https://cdn.nlark.com/yuque/0/2024/png/39067949/1719205810461-adef84ae-8762-44bb-baf3-e72541587cd3.png)

# 1.3 synchronized保证三大特性

1. 锁定的并不是代码，而是我们可以自定义任何锁。Hotspot虚拟机是在对象头上面的markword记录，对象的锁状态，是什么锁。

锁定的是object对象，获得这个锁之后，才能执行内部的代码

tip:synchronized(object) 不能用String、Integer、Long

```java
public class sync {
    private int count=10;
    public Object object=new Object();
    public void m(){
        synchronized (object){
            count--;
            System.out.println("get count:"+count);
        }
    }
}
```

1. 如果不想新建对象使用锁，可以直接synchronized(this)

在方法中synchronized(this)等价于在方法前面加synchronized关键字。

1. 同步方法和非同步方法可以同时调用。

引出面试题：写方法加synchronized，读方法不加synchronized可以吗。

可以，但是会导致脏读问题。

1. 程序运行时，抛出异常，默认情况下会释放锁

### 1、使用synchronized保证互斥性

对number++加锁后，保证同一时间只有一个线程拿到锁，操作number++，就能保证互斥性。

### 2、使用synchronized保证性可见

执行synchronized时，会对Java内存模型中，主内存中的共享变量进行lock原子操作，从而会刷新工作内存中共享变量的值。保证共享变量的可见性。

### 3、使用synchronized保证有序性

### 前置知识

1. **为什么要重排序？**

为了提高程序的执行效率，编译器和CPU会对程序中代码进行重排序。

1. as-if-serial原则

不管编译器和CPU如何重排序，必须保证在单线程情况下程序的结果是正确

的。有下列依赖关系，不能重排序。

```java
int a=1;
int b=a;
```

```java
int a=1;
int a=2;
```

```java
int a=1;
int b=a;
int a=2;
```

### 原理

synchronized后，虽然还会进行指令重排序，保证只有一个线程会进入同步代码块，也能保证有序性。

# 1.4 synchronized的特性

### 1、可重入特性

可重入锁，就是一个线程如果抢占到了互斥锁的资源，在锁释放之前，再去竞争同一把锁的时候，不需要等待，只需要记录重入次数。比如synchronized和reetranlock；但是也有一些不支持重入的锁，比如jdk8中提供的读写锁stampedlock。

可重入锁主要解决的是死锁问题。因为一个已经获得互斥锁x的线程，再释放x之前再去竞争锁x的时候，【递归】相当于会出现一个自己等待自己锁释放的过程，这样的话就会导致死锁。以上就是我对这个问题的一个理解

### 2、不可中断特性

# 1.4 synchronized原理

### 1、javap反汇编

synchronized编译成字节码。

![https://cdn.nlark.com/yuque/0/2024/png/39067949/1719208287790-9262ad56-9c34-444f-8aab-b38d91a2cbdc.png](https://cdn.nlark.com/yuque/0/2024/png/39067949/1719208287790-9262ad56-9c34-444f-8aab-b38d91a2cbdc.png)

### monitorenter

synchronized的锁对象会关联一个监视器monitor，监视器被占用时会被锁住，其他线程无法来获取该monitor。 当JVM执行某个线程的某个方法内部的monitorenter时，它会尝试去获取当前对象对应的monitor的所有权。其过程如下：

1. 若monior的进入数为0，线程可以进入monitor，并将monitor的进入数置为1。当前线程成为monitor的owner（所有者）
2. 若线程已拥有monitor的所有权，允许它重入monitor，则进入monitor的进入数加1
3. 若其他线程已经占有monitor的所有权，那么当前尝试获取monitor的所有权的线程会被阻塞，直到monitor的进入数变为0，才能重新尝试获取monitor的所有权

monitorenter小结:synchronized的锁对象会关联一个monitor,这个monitor不是我们主动创建的,是JVM的线程执行到这个同步代码块，发现锁对象没有monitor就会创建monitor，monitor内部有两个重要的成员变量【owner:拥有这把锁的程，recursions会记录线程拥有锁的次数】当一个线程拥有monitor后其他线程只能等待。

**synchronized出现异常会释放锁吗？**

**从字节码文件中可以看出，出现异常的话，会直接跳到释放锁步骤。**

### monitorexit

### 小结

通过javap反汇编我们看到synchronized使用编程了monitorentor和monitorexit两个指令.每个锁对象 都会关联一个monitor(监视器,它才是真正的锁对象),它内部有两个重要的成员变量owner会保存获得锁的线程,recursions会保存线程获得锁的次数,当执行到monitorexit时,recursions会-1,当计数器减到0时这个线程就会释放锁。

### synchronized与Lock的区别

1. synchronized会自动释放锁，而Lock必须手动释放锁。【lock.unlock()】
2. synchronized是不可中断的，Lock可以中断【lock.trylock()】也可以不中断。
3. 通过Lock可以知道线程有没有拿到锁，而synchronized不能。
4. synchronized能锁住方法和代码块，而Lock只能锁住代码块。
5. Lock可以使用读锁提高多线程读效率。
6. synchronized是非公平锁【随机唤醒线程】，ReentrantLock可以控制是否是公平锁。

# synchronized

## synchronzied的原理

synchronized的锁升级过程是由java对象头中的标记字段实现的，标记字段中存储了对象自身的运行时的一些数据，如哈希码（HashCode）、GC分代年龄、锁状态标志、线程持有的锁、偏向线程 ID、偏向时间戳等等,它是实现轻量级锁和偏向锁的关键.

当升级为重量锁后，被synchronized修饰的代码块在编译成字节码后，会在开始和结尾分别加上MonitorEnter和MonotorExit指令，Monitor是对象监视器，每次只允许一个线程进入代码块。

**synchronized出现异常会释放锁吗？**

从字节码文件中可以看出，出现异常的话，会直接跳到释放锁步骤。

## synchronized的锁升级

无锁->偏向锁->轻量级锁->重量级锁

1. 无锁

最初多个线程可能不需要同步访问共享资源，所有的线程都能访问并修改同一个资源，但只有一个线程能修改成功。

1. 偏向锁

一段同步代码一直被一个线程所访问，那么该线程会自动获取锁。会在被锁定的对象对象头Mark Word里存储锁偏向的线程ID。在线程进入和退出同步块时，检测Mark Word里的线程ID是否等于向当前线程ID。

只有遇到其他线程尝试竞争偏向锁时，持有偏向锁的线程才会释放锁，升级到轻量级锁（标志位为“00”）的状态。

1. 轻量级锁

此时，JVM会通过CAS的形式尝试获取锁，如果CAS成功，那么获得锁；如果CAS失败，就会进入重量级锁。不会阻塞，从而提高性能。

虚拟机首先将在当前线程的栈帧中建立一个名为锁记录（Lock Record）的空间，虚拟机将使用CAS操作尝试将对象的Mark Word更新为指向Lock Record的指针。如果这个更新动作成功了，那么这个线程就拥有了该对象的锁，并且对象Mark Word的锁标志位设置为“00”，表示此对象处于轻量级锁定状态。

1. 重量级锁

升级为重量级锁时，锁标志的状态值变为“10”，此时Mark Word中存储的是指向重量级锁的指针，此时等待锁的线程首先会自旋等待一下，自旋获得锁失败就会进入阻塞状态。

综上，偏向锁通过对比Mark Word解决加锁问题，避免执行CAS操作。而轻量级锁是通过用CAS操作和自旋来解决加锁问题，避免线程阻塞和唤醒而影响性能。重量级锁是将除了拥有锁的线程以外的线程都阻塞。

# 进程和线程

# 如何创建线程

可以通过继承thread类，实现runnable接口、实现callable接口。

callable 接口的区别：实现Callable接口的任务线程能返回执行结果；Callable接口的call()方法允许抛出异常；而Runnable接口的run()方法的异常只能在内部消化，不能继续上抛；

这些方法都依赖与new Thread().start()

# ThreadLocal

## ThreadLocal的作用

ThreadLocal可以为每一个线程提供自己专属的本地变量。通过本地化资源来避免共享，避免了多线程竞争造成的资源消耗。

不是任何场景都能通过避免共享来解决，有些时候就必须共享。

## ThreadLocal是如何实现线程隔离的？

线程内部有一个ThreadLocalMap对象，Threadlocal对象作为key，值作为value，这样每一个线程就可以使用同一个对象作为key，

## Java中的引用类型

### 强引用

Normal Reference【正常的引用】

当内存中没有东西指向它，就会被回收。

- 重写T中的finalize()方法【对象实例被回收时会调用finalize()方法，为了能显式看到gc】

```java
public class T {
    @Override
    protected void finalize() throws Throwable {
        System.out.println("finalize");
    }
}
```

- 强引用对象，当没有引用指向它时，才会被回收

```java
//强引用
public class NormalReference {
    public static void main(String[] args) throws IOException {
        T t=new T();    //建立一个强引用
        t=null;     //去除强引用
        System.gc();    //显式调用垃圾回收

        System.in.read();
    }
}
```

![https://cdn.nlark.com/yuque/0/2024/png/39067949/1719387875195-88757499-4cfc-4440-85bf-5b2b44f65bed.png](https://cdn.nlark.com/yuque/0/2024/png/39067949/1719387875195-88757499-4cfc-4440-85bf-5b2b44f65bed.png)

为什么最后要写System.in.read()呢？

因为如果不写这句代码的话，main方法退出了，垃圾回收是在单独的垃圾回收线程中，而不是在main线程中。有可能垃圾回收线程还没有进行垃圾回收，main线程结束，那就不能显式的看到垃圾回收的输出结果了。

### 软引用

Soft Reference【软引用本身首先是一个对象，再指向它所引用的对象。软引用对象实例本身都存放在堆内存中，它所引用的目标对象也是存放在堆内存中。】

内存示意图大致如下

```java
SoftReference<byte []> m=new SoftReference<>(new byte[1024*1024*10]);
```

![https://cdn.nlark.com/yuque/0/2024/jpeg/39067949/1719387883706-036e2914-0490-46e5-8a34-34b14af66442.jpeg](https://cdn.nlark.com/yuque/0/2024/jpeg/39067949/1719387883706-036e2914-0490-46e5-8a34-34b14af66442.jpeg)

当堆内存空间不足时，先会进行一次垃圾回收，**堆内存还不够**，就会**回收被软引用指向对象**。

- 举例子

1. 先通过-Xmx设置JVM运行时可申请的最大堆内存为20MB

![https://cdn.nlark.com/yuque/0/2024/png/39067949/1719387890662-497dec37-56e3-4c6b-8f7f-fb10abb8bd26.png](https://cdn.nlark.com/yuque/0/2024/png/39067949/1719387890662-497dec37-56e3-4c6b-8f7f-fb10abb8bd26.png)

1. 先建立软引用指向10MB的字节数组，再建立强引用指向10MB的字节数组。JVM会先垃圾回收一次，堆内存还是不够，就会回收软引用对象。因此第三次软引用m.get()输出为null

```java
//软引用
public class T02_SoftReference {
    //设置 jvm堆内存参数为20MB
    public static void main(String[] args) throws InterruptedException {
        //虚引用指向对象 占10MB
        SoftReference<byte []> m=new SoftReference<>(new byte[1024*1024*10]);
        System.out.println(m.get());
        //堆内存存在空间不会被回收
        System.gc();
        Thread.sleep(500);
        //堆内存存在空间不会被回收，此时软引用仍存在
        System.out.println(m.get());

        //再在堆中分配一个数组，堆中装不下，先发生一次垃圾回收
        // 堆内存还不够，就会回收软引用对象
        byte[] b=new byte[1024*1024*10];
        System.out.println(m.get());
    }
}
```

![https://cdn.nlark.com/yuque/0/2024/png/39067949/1719387912947-9c9a02e1-c6c5-476b-a0b2-2d6778a6d6e9.png](https://cdn.nlark.com/yuque/0/2024/png/39067949/1719387912947-9c9a02e1-c6c5-476b-a0b2-2d6778a6d6e9.png)

### 弱引用

WeakReference【弱引用和软引用类似，本身都是一个对象，并且指向它们所引用的对象】

```java
WeakReference<byte []> m=new WeakReference<>(new byte[1024*1024*10]);
```

内存示意图大致如下

![https://cdn.nlark.com/yuque/0/2024/png/39067949/1719387920442-eb225ab8-c4ed-400c-a522-62dd244ed02f.png](https://cdn.nlark.com/yuque/0/2024/png/39067949/1719387920442-eb225ab8-c4ed-400c-a522-62dd244ed02f.png)

**只要发生垃圾回收**，就会**回收被弱引用指向的对象**。

使用场景：解决在Map的Entry内存管理中，可能会出现的内存泄漏问题。

- 举例子

```java
//弱引用
public class T03_WeakReference {
    public static void main(String[] args) {
        WeakReference<T> wr=new WeakReference<>(new T());
        System.out.println(wr.get());
        System.gc();
        System.out.println(wr.get());
    }
}
```

![https://cdn.nlark.com/yuque/0/2024/png/39067949/1719387938080-ff900962-b5ad-4717-aa1c-9c62faae94d1.png](https://cdn.nlark.com/yuque/0/2024/png/39067949/1719387938080-ff900962-b5ad-4717-aa1c-9c62faae94d1.png)

### 虚引用

虚引用指向对象被回收的时候，会把信息填到Queue中去。【当某个对象被回收时，我能知道它被回收了。】我们使用get()方法是获取不到的。

- 举例子

```java
package Reference;

import java.lang.ref.PhantomReference;
import java.lang.ref.Reference;
import java.lang.ref.ReferenceQueue;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;

public class T04_PhantomReference {
    private static final List<Object> list=new LinkedList<>();
    private static final ReferenceQueue<T> QUEUE=new ReferenceQueue<>();
    public static void main(String[] args) {
        PhantomReference<T> phantomReference=new PhantomReference<>(new T(),QUEUE);
        new Thread(()->{
           while (true){
               list.add(new byte[1024][1024]);
               try {
                   Thread.sleep(1000);
               } catch (InterruptedException e) {
                   e.printStackTrace();
                   Thread.currentThread().interrupt();
               }
               System.out.println(phantomReference.get());	//一直是null
           }
        }).start();
        new Thread(()->{
            while (true){
                Reference<? extends T> poll = QUEUE.poll();
                if (poll!=null){
                    System.out.println("--虚引用对象被JVM回收了--");
                }
            }
        }).start();
    }
}

```

- 回收的消息被填充到QUEUE中

![https://cdn.nlark.com/yuque/0/2024/png/39067949/1719387946149-8cf07cc0-ddfc-41e8-ba6b-224ac300421f.png](https://cdn.nlark.com/yuque/0/2024/png/39067949/1719387946149-8cf07cc0-ddfc-41e8-ba6b-224ac300421f.png)

- 使用场景：(使用get都get不到，用它干嘛？)**管理堆外内存**

![https://cdn.nlark.com/yuque/0/2024/png/39067949/1719387953289-6a1894db-3e56-4f00-ac70-71ce1cc24e3e.png](https://cdn.nlark.com/yuque/0/2024/png/39067949/1719387953289-6a1894db-3e56-4f00-ac70-71ce1cc24e3e.png)

JVM只占了操作系统中的一部分内存，当我们从网络中读数据时，操作系统首先读到操作系统内存中，然后再拷贝到JVM内存中，这样效率特别低，因此JVM提供了一种直接内存的方法，直接去访问操作系统的内存，但是不是JVM自己管理的内存，JVM是不知道也没有办法进行垃圾回收的。

因此，我们建立一个DirectByteBuffer虚引用，指向堆外内存。当这个虚引用对象被回收之后，可以通过QUEUE检测到，然后JVM清理堆外内存。

## ThreadLocal详解

### 2.3 用法

1. 创建ThreadLocal对象，并绑定需要提供的本地变量

```java
static ThreadLocal<Person> tl=new ThreadLocal<Person>();
```

1. 各个变量通过ThreadLocal的set、get方法来设置和获取本地变量

### 2.3 内存泄漏相关概念

- 内存溢出: Memory overflow 没有足够的内存提供申请者使用。
- 内存泄漏: Memory Leak 程序中已经动态分配的堆内存由于某种原因,**程序未释放或者无法释放**, 造成系统内部的**浪费**, 导致程序运行速度减缓甚至系统崩溃等严重结果. 内存泄漏的堆积终将导致内存溢出。

### 2.4 原理【源码解读】

- Thread类Thread类中有一个ThreadLocalMap对象 threadLocals

![https://cdn.nlark.com/yuque/0/2024/png/39067949/1719387974358-cb895d7f-65d6-4d09-961e-2318bef8e17c.png](https://cdn.nlark.com/yuque/0/2024/png/39067949/1719387974358-cb895d7f-65d6-4d09-961e-2318bef8e17c.png)

- ThreadLocal类ThreadLocal类中有一个静态类ThreadLocalMap，ThreadLocalMap中的Entry继承了弱引用，Entry中的key为虚引用指向当前ThreadLocal变量，value为我们set的值。

  ![https://cdn.nlark.com/yuque/0/2024/png/39067949/1719387983889-1caf1308-b75a-4eb3-8f53-ef737191e285.png](https://cdn.nlark.com/yuque/0/2024/png/39067949/1719387983889-1caf1308-b75a-4eb3-8f53-ef737191e285.png)

- 举例子

```java
public class T05_ThreadLocal {
    static ThreadLocal<Person> tl=new ThreadLocal<Person>();
    public static void main(String[] args) {
        //Thread1
        new Thread(()->{
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            System.out.println(tl.get());
        }).start();
        //Thread2
        new Thread(()->{
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            tl.set(new Person(12));
        });
    }
}
```

- Thread2会设置自己的ThreadLocalMap，因此Thread1调用get()方法为空

![https://cdn.nlark.com/yuque/0/2024/png/39067949/1719387994236-59e38114-bf67-4ef0-bb88-6025c911121b.png](https://cdn.nlark.com/yuque/0/2024/png/39067949/1719387994236-59e38114-bf67-4ef0-bb88-6025c911121b.png)

注意事项：当tl=null后，意为解除了ThreadLocal的强引用，若key指向当前ThreadLocal为强引用，这个ThreadLocal就不会被回收，会发生**内存泄漏**。如果这里是弱引用，只要遇到垃圾回收，key所指向的ThreadLocal就会被回收。

注意事项2：key被回收后，此时entry变为(null,value)，因此还要使用tl.remove()方法，回收ThreadLocalMap中的Entry。

- 反正都要使用remove()回收entry，强引用和弱引用不是一样的吗？

ThreadLocalMap使用ThreadLocal的弱引用作为key，如果一个ThreadLocal不存在外部**强引用**时，Key(ThreadLocal)势必会被GC回收，这样就会导致ThreadLocalMap中key为null， 而value还存在着强引用，只有thead线程退出以后,value的强引用链条才会断掉。

但如果当前线程再迟迟不结束的话，这些key为null的Entry的value就会一直存在一条强引用链：

Thread Ref -> Thread -> ThreaLocalMap -> Entry -> value

永远无法回收，造成内存泄漏。

### key 使用强引用

当 ThreadLocalMap的key为强引用回收ThreadLocal时，因为ThreadLocalMap还持有ThreadLocal的强引用，如果没有手动删除，ThreadLocal不会被回收，导致Entry内存泄漏。

### key 使用弱引用

当ThreadLocalMap的key为弱引用回收ThreadLocal时，由于ThreadLocalMap持有ThreadLocal的弱引用，即使没有手动删除，ThreadLocal也会被回收。当key为null，在下一次ThreadLocalMap调用set(),get()，remove()方法的时候会被清除value值。

弱引用多一层保护机制，当这个线程执行完后忘记remove，entry有的是会被回收掉的。比如ThreadLocalMap在调用set，get，remove方法时都会清理 key 为 null 的entry。强引用忘记remove，entry永远都不会回收掉。

## **ThreadLocal父子线程数据传递**

前情提要 ThreadLocal原理：

# 4.2 线程池的核心属性？

首先线程池有一下核心的属性，ctl

![https://cdn.nlark.com/yuque/0/2024/png/39067949/1719391444741-c440c8a7-9555-4f87-a0c4-b5c914deadbe.png](https://cdn.nlark.com/yuque/0/2024/png/39067949/1719391444741-c440c8a7-9555-4f87-a0c4-b5c914deadbe.png)

先简单的解释一个AtomicInteger是个什么鬼。

1、可以简单的看成，AtomicInteger就是一个int数值。

2、因为线程池中存在并发修改ctl的情况。AtomicInteger内部是基于CAS的方式，对ctl属性做修改。

Ps：CAS其实就是比较和交换，Compare And Swap。基于CPU支持的原语，来保证的原子性。保证修改某一个属性的时候，是原子性的。

ctl在线程池中，维护这两个信息：

- 工作线程的个数。
- 线程池的状态。

前3个bit位，维护线程池的状态。

低29个bit位，维护工作线程的个数。

**维护工作线程：** 计算工作线程最大个数的操作

维护线程池状态：

![https://cdn.nlark.com/yuque/0/2024/png/39067949/1719391444744-af3f863b-3d5b-4ec5-9457-295463ee7f86.png](https://cdn.nlark.com/yuque/0/2024/png/39067949/1719391444744-af3f863b-3d5b-4ec5-9457-295463ee7f86.png)

```java
// 线程池状态RUNNING是最小的，依次递增到SHUTDOWN，RUNNING，TIDYING，TERMINATED…………
private static final int RUNNING    = -1 << COUNT_BITS;
private static final int SHUTDOWN   =  0 << COUNT_BITS;
private static final int STOP       =  1 << COUNT_BITS;
private static final int TIDYING    =  2 << COUNT_BITS;
private static final int TERMINATED =  3 << COUNT_BITS;
```

# 线程池提交任务的完整流程？

1. 线程池是通过execute方法来处理提交的任务的
2. 首先，会从ctl中获取当前工作线程数，如果当前工作线程数小于核心线程数，就会尝试创建核心线程，创建成功，任务就交给核心线程，execute方法结束。创建失败【可能有多个任务交给线程池处理，有些任务提交线程池成功，获得核心线程处理；另外的任务再获取核心线程时，可能当前工作线程数已经超过核心线程数了，因此创建失败。】
3. 判断一下，如果线程池状态仍为running且当前工作线程数大于核心线程数时，把任务放到工作队列中。这个时候会再判断一下线程池状态是否为running，如果不是running了，就把任务移除掉，并且执行拒绝策略。如果是running状态，查看当前的工作线程数是否为0，如果为0，说明当前线程池的核心线程数设置为0，就创建一个空任务的非核心线程。
4. 如果放到任务队列失败，就会创建非核心线程，创建成功，execute方法结束。创建失败，就会执行拒绝策略。

![https://cdn.nlark.com/yuque/0/2024/png/39067949/1719391445471-0a96e716-6aab-41f2-8307-20ab55600c3b.png?x-oss-process=image%2Fformat%2Cwebp%2Fresize%2Cw_1125%2Climit_0](https://cdn.nlark.com/yuque/0/2024/png/39067949/1719391445471-0a96e716-6aab-41f2-8307-20ab55600c3b.png?x-oss-process=image%2Fformat%2Cwebp%2Fresize%2Cw_1125%2Climit_0)

```java
// 任务投递给线程池之后的处理
// command：投递过来的任务
public void execute(Runnable command) {
    // 如果投递的任务为null，直接甩异常。
    if (command == null)
        throw new NullPointerException();
    // 拿到核心属性ctl。
    int c = ctl.get();
    // workerCountOf：在获取工作线程个数
    // 现在的工作线程数 小于 核心线程数
    if (workerCountOf(c) < corePoolSize) {
        // 基于addWorker方法，创建工作线程处理任务command，传递的true，代表构建核心线程
        // addWorker，返回true，创建工作线程成功，反之失败。
        if (addWorker(command, true))
            // 代表创建线程成功，任务已经交给线程池了。return结束了。
            return;
        // 代表创建线程失败了，有情况，重新获取ctl。做后续判断
        c = ctl.get();
    }
    // 任务交给核心线程处理失败了，代码走到这。
    // 线程池状态是RUNNING么？如果是，就尝试将任务扔到工作队列
    // 如果任务成功的投递到了工作队列排队，返回true，反之返回false
    // 返回true，进到if，execute方法结束
    if (isRunning(c) && workQueue.offer(command)) {
        // 代码到这，说明任务已经添加到工作队列
        // 再次获取ctl
        int recheck = ctl.get();
        // 再次判断，线程池状态是不是RUNNING
        // 如果状态不是RUNNING，走remove方法，将任务从工作队列中移除。
        // 移除任务操作，成功返回true，反之false
        if (! isRunning(recheck) && remove(command))
            // 说明任务移除成功，给任务甩一波拒绝策略。
            reject(command);
        // 状态是RUNNING，或者，没拒绝
        // 查看工作线程个数是不是0个。
        else if (workerCountOf(recheck) == 0)
            // 创建一个非核心线程，处理这个任务，毕竟任务饥饿。
            addWorker(null, false);
    }
    // 到这，说明任务没扔到工作队列。
    // 创建非核心线程，处理任务。
    else if (!addWorker(command, false))
        // 如果创建非核心线程失败了，执行拒绝策略
        reject(command);
}
```

![https://cdn.nlark.com/yuque/0/2024/png/39067949/1719391445471-0a96e716-6aab-41f2-8307-20ab55600c3b.png](https://cdn.nlark.com/yuque/0/2024/png/39067949/1719391445471-0a96e716-6aab-41f2-8307-20ab55600c3b.png)

### 1、线程池如何添加工作线程？

addWorker()源码中有两个嵌套的for循环。

1. 外层for循环，首先会进行线程池状态的判断

两种情况下会创建工作线程：线程池状态是RUNNING 或者 线程池为 SHUTDOWN状态，工作队列不为空、工作线程为0状态下，如果不是这两种状态，线程池就不会创建工作线程。

1. 内层for循环，会进行线程个数的判断

如果当前工作线程数超过最大值【CAPACITY 2^29-1】或者 如果目前创建的是核心线程，但是当前线程数已经超过核心线程数 或者 当前创建的是非核心线程，当前线程数已经超过最大线程数，就return false结束。

1. 状态没问题、线程个数没问题。

会基于CAS给当前线程数加1，跳出外层循环；如果失败，重新获取ctl，拿到线程池状态；如果线程池状态没变化，重新走内层循环，比对线程个数；有变化，就重新走外层循环。

1. 创建工作线程

new Worker()，会根据程序员传递的线程工厂，创建一个Thread对象。会再判断一下线程池状态以及，新建的这个线程状态【是否已经start了】，如果没问题，就把这个新建的工作线程放到hashset中，并且更新一下线程池中工作线程最大值这个变量。创建工作线程操作是要加lock锁的，因为hashset和给变量赋值都是线程不安全的。

1. 启动工作线程

就是调用刚刚创建的工作线程的start()方法。

```java
// 添加工作线程。
// firstTask，是任务
// core，true=核心，false=非核心
private boolean addWorker(Runnable firstTask, boolean core) {
    // =======================做校验，线程池状态，工作线程个数====================================
    retry:
    for (;;) {
        // 线程池状态
        // 获取ctl。
        int c = ctl.get();
        // 基于ctl获取线程池状态
        int rs = runStateOf(c);

        // rs >= SHUTDOWN，如果满足，代表状态不是RUNNING。不是RUNNING不能接收新任务
        if (rs >= SHUTDOWN &&
            // 线程池状态是SHUTDOWN，没有传递任务，并且工作队列不为空
            // 满足上述要求，代表当前要构建的工作线程，是要处理工作队列中的任务的。
            // 如果工作队列有任务，但是没有工作线程在处理。任务饥饿。就会做addWorker(null,false)
            !(rs == SHUTDOWN && firstTask == null && ! workQueue.isEmpty()))
            // 到这，代表当前状态不对劲，不能构建工作线程
            return false;

        for (;;) {
            // 工作线程个数
            // 到这说明状态ok。
            // 拿到工作线程个数。
            int wc = workerCountOf(c);
            // CAPACITY：占用了29个bit位的数值，代表线程池能支撑的最大工作线程个数
            // wc >= CAPACITY：如果满足，代表不能再创建工作线程了，超过最大值了。
            if (wc >= CAPACITY ||
                // 根据core判断，是否超过了核心线程数，或者最大线程数。
                wc >= (core ? corePoolSize : maximumPoolSize))
                // 工作线程数，达到阈值了，进到if，直接结束。
                return false;
            // 状态没问题，个数没问题。
            // 对ctl + 1，如果成功，返回true，如果失败，返回false
            if (compareAndIncrementWorkerCount(c))
                // ctl + 1成功，跳出外层循环，准备走添加工作线程，并启动工作线程
                break retry;
            // 到这，CAS失败了，其他线程把ctl + 1了，ctl肯定改变了。
            // 重新获取ctl
            c = ctl.get();
            // 线程池状态改变了么？
            if (runStateOf(c) != rs)
                // 跳出一次外层for循环
                continue retry;
            // 到这，说明状态没变，走内层for循环，判断工作线程个数就可以了。
        }
    }

    // =======================添加工作线程，并启动工作线程====================================
    // 两个标识，默认都是false
    boolean workerStarted = false;
    boolean workerAdded = false;
    // Worker就是工作线程，先声明出来。
    Worker w = null;
    try {
        // new 一个工作线程。会基于咱们自己提供的线程工厂，构建出Thread
        w = new Worker(firstTask);
        // 拿到线程工作构建的thread
        final Thread t = w.thread;
        // thread对象不是null，继续往下走。
        if (t != null) {
            // 拿线程池里的lock锁，加锁。 目的是为了确保HashSet操作的线程安全。
            final ReentrantLock mainLock = this.mainLock;
            mainLock.lock();
            try {
                // 获取线程池的状态
                int rs = runStateOf(ctl.get());
                // 如果是RUNNING，一切正常，接着往下走
                if (rs == RUNNING ||
                    // 解决任务饥饿的情况，代表正常，接着往下走
                    (rs == SHUTDOWN && firstTask == null)) {
                    // 一个Thread对象，连续两次执行start方法，会发生什么？
                    // 如果你的线程工厂，构建的Thread已经start了，直接扔你异常。
                    if (t.isAlive())
                        throw new IllegalThreadStateException();
                    // Worker对象扔到HashSet集合里。
                    workers.add(w);
                    // 获取工作线程个数
                    int s = workers.size();
                    // largestPoolSize记录当前线程池中工作线程个数的最大值记录
                    if (s > largestPoolSize)
                        // 如果现在的工作线程数，大于之前的记录，覆盖一下。
                        largestPoolSize = s;
                    // 代表工作线程添加成功。
                    workerAdded = true;
                }
            } finally {
                mainLock.unlock();
            }
            // 添加成功了咩？
            if (workerAdded) {
                // 成功就，启动线程
                t.start();
                // 代表工作线程启动成功。
                workerStarted = true;
            }
        }
    } finally {
        // 如果到这 workerStarted是false，代表工作线程启动失败。
        if (! workerStarted)
            // ctl + 1，   workers.add(w)
            // 从workers里移除worker，然后ctl - 1
            addWorkerFailed(w);
    }
    // 返回结果。
    return workerStarted;
}

```

### 2、工作线程到底是什么？

- 工作线程实际上就是Worker中启动的thread。
- 当new Worker时，会将传递过来的任务，赋值给firstTask，并且基于线程工厂创建thread对象。
- thread.start()方法调用后，实际上调用的是worker的run方法
- Worker的run方法中，执行了runWorker方法，传递Worker进去，相当于传递了firstTask

```java
// 省略了部分代码
// Worker实现的Runnable，Worker重新了run方法，run方法就是任务
private final class Worker implements Runnable{
    // thread对象
    final Thread thread;
    // 传递过来的第一个任务
    Runnable firstTask;
    // 当前工作线程，每完成一个任务，就+1
    volatile long completedTasks;

    // new Worker用的有参构造
    Worker(Runnable firstTask) {
        this.firstTask = firstTask;
        this.thread = getThreadFactory().newThread(this);
    }

    // Worker任务。thread对象执行了start方法走，走的是这个run方法。
    public void run() {
        // 工作线程执行任务，走的就是这个方法、
        runWorker(this);
    }
}

```

### 3、工作线程如何执行任务？

工作线程执行了runWorker()方法，在runWorker()方法中，获取firstTask，如果firstTask为空，就调用getTask方法获取任务。

- 就是拿到任务，直接task.run即可
- 前后有钩子函数beforeExecute(wt, task)和afterExecute(task, ex)，可以做拓展
- 当firstTask执行完毕后，会通过getTask()继续从工作队列中拿任务
- 当前线程完成的任务数加1

**面试题：线程池里的线程在执行任务时，发生了异常会发生什么？**

runWorker()方法中没有捕获异常，抛给线程的run方法，run方法没有进行处理，因此run方法异常结束，线程结束了。【还要聊FutureTask】

一个线程结束了，指的是线程的run方法结束了。手段：中断....

### 4、工作线程如何获取新任务？

如果线程完成了firstTask，通过getTask()继续从工作队列中拿任务。

1. 如果当前状态是STOP或当前状态是SHUTDOWN且工作队列中没任务；不拿任务，直接返回NULL，等着当前工作线程结束【把worker从hashset中移除】。
2. 判断是否有非核心线程，如果有，执行poll方法，等待keepAliveTime【非核心线程的最大空闲时间】，没任务就返回null。如果都是核心线程，就执行take，没任务就一直阻塞等待。如果拿到任务了，就直接返回任务。
3. 如果刚刚存在非核心线程，且等待最大空闲时间后，没拿到任务。判断当前工作线程数是否大于1或者工作队列中没任务，就会退出runWorker方法中的拿任务while循环，执行ProcessWorkerExit方法，将Worker从HashSet中移除。

```java
// getTask方法获取新任务执行。
private Runnable getTask() {
    // timeOut，刚开始肯定是false。
    boolean timedOut = false;

    // 死循环。
    for (;;) {
        // 这两行看不懂面壁。。
        int c = ctl.get();
        int rs = runStateOf(c);

        // 判断线程池状态
        // 状态是SHUTDOWN，并且队列没任务。
        if (rs == SHUTDOWN && workQueue.isEmpty())
        // 状态是STOP，啥也不管，直接破产。
        if (rs >= STOP)
        if (rs >= SHUTDOWN && (rs >= STOP || workQueue.isEmpty())) {
            // ctl - 1，工作线程准备凉凉……
            decrementWorkerCount();
            // 返回null，代表没任务了。
            return null;
        }

        // 判断工作线程个数问题
        // 拿到工作线程个数
        int wc = workerCountOf(c);
        // allowCoreThreadTimeOut：核心线程是否允许超时，默认是false，如果为true，
                                                                    基于最大空闲时间走
        // wc > corePoolSize：如果满足，代表现在有非核心线程在。
        boolean timed = allowCoreThreadTimeOut || wc > corePoolSize;

        // wc > maximumPoolSize：不会满足，理解就是一个健壮性判断，妹啥用。。。
        // timed可以在第一次循环时为true，但是timeOut必然是false。第一次循环进不来，先不看！
        // 第二次循环，timeOut可能为true了，第一个判断为null
        if ((wc > maximumPoolSize || (timed && timedOut))
            // wc > 1，至少是两个，即便工作有任务，也不会出现任务饥饿问题。
            // workQueue.isEmpty()，工作队列为空，肯定没有任务饥饿问题。
            && (wc > 1 || workQueue.isEmpty())) {
            // CAS的方式，将ctl - 1，只要-1成功，直接返回null
            if (compareAndDecrementWorkerCount(c))
                return null;
            // 如果CAS失败，说明有并发，重新走for循环。
            continue;
        }

        try {
            // timed为true，走工作队列的poll方法，拿任务，等keepAliveTime时间，超过了，返回null
            // timed为false，都是核心线程，执行take方法，死等，没任务就在这死等。等到有任务
            Runnable r = timed ?
                workQueue.poll(keepAliveTime, TimeUnit.NANOSECONDS) :
                workQueue.take();
            // 如果r不为null，拿到任务了，回到runWorker继续执行任务
            if (r != null)
                return r;
            // 到这，说明等了一会，没拿到任务，先把timedOut设置为true
            timedOut = true;
        } catch (InterruptedException retry) {
            timedOut = false;
        }
    }
}

```

### 5、线程池的参数如何设置？

线程池有2个核心线程和1个非核心线程，此时一个核心线程发生异常结束了，那么还需要再创建一个核心线程来补全嘛？

答：不需要！线程池内部不区分线程是核心还是非核心，只在创建时区分一小下。内部执行时，只看工作线程的数量。

最需要关注的是核心线程数。然后需要看的是任务是IO密集还是CPU密集。

# 5、AQS

# 5.1 怎么理解AQS是什么

AQS本身是JUC下的一个抽象类

```java
public abstract class AbstractQueuedSynchronizer{}
```

AQS本身并没有实现什么锁或者其他概念，他就是一个向上抽取出来的基础类。

JUC包下的一些工具，比如ReentrantLock，ThreadPoolExecutor，Semaphore，读写锁，都是基于AQS实现的。

# 5.2 AQS核心底层和Lock是什么关系

1. ReentrantLock内部有一个抽象的内部类Sync，Sync继承了AQS
2. Sync是一个抽象的静态类，具体有两个实现，FairSync和NoFairSync
3. 那么公平锁和非公平锁在执行lock方法时，有什么区别？

**1）lock方法的实现不同**

1. 非公平锁的lock方法

基于CAS的方式，尝试将state从0改到1。如果修改成功，代表拿到了锁资源，将持有锁资源线程的标记，修改为当前线程。如果没有修改成功，执行acquire()方法。

```java
final void lock() {
	// 通过CAS的方式尝试将state从0修改为1，如果返回true，代表修改成功，如果修改失败，返回false
    if (compareAndSetState(0, 1)){
		// 将一个属性设置为当前线程，这个属性是AQS的父类提供的
        setExclusiveOwnerThread(Thread.currentThread());
    }
     else {
        acquire(1);
	}
}
```

1. 公平锁的lock方法

```java
final void lock() {
    acquire(1);
}

```

直接走acquire方法。

**2）acquire方法是啥？**无论公平锁还是非公平锁，都要走这个方法【AQS类提供的】

1. tryAcquire：再次基于acquire方法拿锁。拿到了返回true，方法结束，没拿到返回false，继续往后走。
2. addWaiter()：如果没有拿到锁，会执行这个方法，把当前线程封装成node加入同步队列(双向链表)中排队
3. acquireQueued()：如果当前排队的线程没机会尝试拿锁【排在后面】，挂起线程。如果有机会拿锁了，会在acquireQueued()中执行tryAcquire()方法尝试拿锁。

```java
public final void acquire(int arg) {
    if (!tryAcquire(arg) &&
        acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
        selfInterrupt();
}
```

**3）tryAcquire方法的实现也不同**

# 5.3 AQS如何尝试获取锁资源【tryAcquire()】

AQS内部尝试获取锁资源的方法是tryAcquire()方法。

在ReentrantLock中，tryAcquire()有两种实现，公平锁和非公平锁

### 5.3.1 非公平锁的tryAcquire()方法

1. 获取当前想拿锁的线程
2. 获取state值，如果state为0，说明当前没有线程持有锁资源，直接基于CAS修改state，如果修改成功了，当前线程就拿到锁资源了，返回true。
3. 如果state大于0，说明有线程在持有锁资源。如果持有锁资源的线程就是当前线程，说明为锁重入，直接对state+1。lock锁最多允许重入Integer.MAX_VALUE次，如果state+1小于0了，说明发生int类型溢出了，抛出ERROR。如果没有超过最大重入次数，就返回true，锁重入成功。
4. 如果state大于0，且持有锁资源的线程不是当前线程，就获取锁失败，返回false。

```java
final boolean nonfairTryAcquire(int acquires) {
	// 获取当前线程
    final Thread current = Thread.currentThread();
	// 获取AQS的state的值
    int c = getState();
	// 如果state为0，代表，尝试再次获取锁资源
    if (c == 0) {
		// CAS尝试修改state，从0-1，如果成功，设置ExclusiveOwnerThread属性为当前线程
        if (compareAndSetState(0, acquires)) {
            setExclusiveOwnerThread(current);
            return true;
        }
    }
	// 当前占有锁资源的线程是否是当前线程
    else if (current == getExclusiveOwnerThread()) {
		// 将state + 1
        int nextc = c + acquires;
		// 如果加1后，小于0，超所锁可重入的最大值，抛出Error
        if (nextc < 0) // overflow
            throw new Error("Maximum lock count exceeded");
		// 没问题，就重新对state进行复制
        setState(nextc);
		// 锁重入成功
        return true;
    }
    return false;
}

```

### 5.3.2 公平锁的tryAcquire()方法

公平锁和非公平锁的唯一区别在于：

当state=0，当前线程获取锁时：非公平锁直接获取；公平锁需要查看一下排队的情况。

使用hasQueuedPredecessors()方法判断

1、没有排队的线程，返回false；

2、有排队的线程，但是当前线程排在第一名，返回false；

3、有排队的线程，当前线程排不在第一名，返回true【公平！】

```java
protected final boolean tryAcquire(int acquires) {
    final Thread current = Thread.currentThread();
    int c = getState();
    if (c == 0) {
        //公平锁只有这里的实现逻辑和非公平锁不一样
        //代码到这，说明没有线程持有锁资源
        //公平锁需要执行hasQueuedPredecessors()查看是否有排队的线程
        //1、没有排队的线程，返回false
        //2、有排队的线程，但是当前线程排在第一名，返回false
        //3、有排队的线程，当前线程排不在第一名，返回true
        if (!hasQueuedPredecessors() &&
            compareAndSetState(0, acquires)) {
            setExclusiveOwnerThread(current);
            return true;
        }
    }
    else if (current == getExclusiveOwnerThread()) {
        int nextc = c + acquires;
        if (nextc < 0)
            throw new Error("Maximum lock count exceeded");
        setState(nextc);
        return true;
    }
    return false;
}
}
```

非公平锁只能在最开始的lock方法中抢一次【没有线程持有锁的情况】，和tryAcquire方法中抢一次【没有线程持有锁，不关注排队情况，直接抢锁】。

如果没有抢到，就去双向链表队列中排队，排队的逻辑，公平锁和非公平锁是一致的。

# 5.4 AQS获取资源失败怎么排队

在Acquire方法中，tryAcquire()方法获取锁资源失败，于是调用addWaiter()方法把当前线程放到同步队列中等待。

1. 首先将当前线程封装成Node节点，Node pred指向尾部节点，如果pred不为null，说明当前队列已经初始化了，队列中有其他线程排队，node.pre=pred，基于CAS，把当前节点设置为tail节点，pred.next=node。返回当前节点。
2. 如果pred为null，说明同步队列没有初始化，或者前面基于CAS设置当前节点为tail节点失败。拿到tail节点，如果tail节点为null，先初始化一个空节点。后将当前线程节点设置为tail节点。返回当前节点。

```java
// 说明前面获取锁资源失败，放到队列中等待。。。
private Node addWaiter(Node mode) {
	// 创建Node类，并且设置thread为当前线程，设置为排它锁
    Node node = new Node(Thread.currentThread(), mode);
  	// 获取AQS中队列的尾部节点
    Node pred = tail;
	// 如果tail != null，现在队列有人排队
    if (pred != null) {
		// 将当前节点的prev，设置为刚才的尾部节点
        node.prev = pred;
		// 基于CAS的方式，将tail节点设置为当前节点
        if (compareAndSetTail(pred, node)) {
			// 将之前的为节点的next，设置为当前节点
            pred.next = node;
            return node;
        }
    }
	// 查看下面~
    enq(node);
    return node;
}

//-------------------------------
// 现在没人排队，我是第一个~~，  如果前面CAS失败，也会进到这个位置重新往队列尾巴塞。
private Node enq(final Node node) {
	// 死循环往队列里扔
    for (;;) {
		// 重新获取当前的tail节点为t
        Node t = tail;
        if (t == null) {
			// 现在没人排队, 我是第一个，没头没尾，都是空
            if (compareAndSetHead(new Node()))	// 初始化一个Node作为head，而这个head没有意义。
				// 将头尾都指向了这个初始化的Node
                tail = head;
        } else {
			// 有人排队，往队列尾巴塞
			// 当前节点的上一个指向tail。
            node.prev = t;
			// 基于CAS的方式，将tail节点设置为当前节点
            if (compareAndSetTail(t, node)) {
				// 将之前的为节点的next，设置为当前节点
                t.next = node;
                return t;
            }
        }
    }
}

```

![https://cdn.nlark.com/yuque/0/2024/png/39067949/1719575638340-9808fa80-f8e7-4bee-aa61-11949d5a2b09.png](https://cdn.nlark.com/yuque/0/2024/png/39067949/1719575638340-9808fa80-f8e7-4bee-aa61-11949d5a2b09.png)

# 5.5 AQS排队后如何重新尝试获取资源

没有拿到锁资源，进入同步队列等待之后，执行方法进行下面的操作。【删除了一些线程中断的属性】

1. failed属性代表拿锁失败了，如果后续没拿到锁，节点跑路了，需要**在队列中取消这个节点**。【将该节点的属性设置为CANCELLED，准备跑路】。
2. 拿到当前node节点的上一个节点，如果**上一个节点是head**，说明**当前线程排在第一名**，于是可以通过tryAcquie()尝试获取锁资源。
3. 如果当前线程拿到锁资源了，会通过setHead(node)方法将当前node设置为头节点【保安节点】完成三件事：head指针指向当前node，将node节点的线程属性设置为null，node.prev=null。那原来的保安节点，不可达，就可以被GC线程回收了。
4. 将failed属性设置为false，拿锁成功
5. 如果当**前node不是排在第一名**或者tryAcquire()拿锁失败了，就会**判断当前线程能否挂起**。

需要知道同步队列中Node的三种状态

1. static final int CANCELLED=1；//代表当前Node不排队了，准备跑路
2. static final int DEFAULT=0；//默认状态，啥事没有
3. static final int SIGNAL=-1；//代表当前节点后面的节点准备挂起线程【因为后面的线程如果挂起，需要前面的线程唤醒它】

拿到上一个节点的状态，如果

**上一个节点的状态是-1**

，则当前线程可以挂起【一会儿前面的线程会把我唤醒的】。如果

**上一节点状态为1**

【准备跑路，当前线程准备挂起的信息不能和这个节点说】，do-while循环直到找到一个有效节点。

**如果上一个节点状态为0**

，就使用CAS的方式，将上一个节点的状态设置为-1。

![https://cdn.nlark.com/yuque/0/2024/png/39067949/1719578355201-fa38af03-44a4-4d71-b7a9-d240fba455a9.png](https://cdn.nlark.com/yuque/0/2024/png/39067949/1719578355201-fa38af03-44a4-4d71-b7a9-d240fba455a9.png)

1. 如果当前线程可以挂起，使用parkAndCheckInterrupt()挂起线程。内部走的是LockSupport。park方法，底层最后走的是Unsafe类的park方法【native方法，c++实现的】。

```java
// 已经将node加入到了双向队列中，然后执行当前方法
final boolean acquireQueued(final Node node, int arg) {
	// 标识！！！！
    boolean failed = true;
    try {
		// 标识！！！！
        boolean interrupted = false;
        for (;;) {
			// 获取当前节点的上一个节点p
            final Node p = node.predecessor();
			// 如果p是头，再次尝试获取锁资源（state从0-1，锁重入操作），成功返回true，失败返回false
            if (p == head && tryAcquire(arg)) {
				// 拿到锁资源设置head节点为当前节点，将thread，prev设置为null，因为拿到锁资源了，排队跟我没关系
                setHead(node);
                p.next = null;   // 老保安指向null；帮助GC回收
                failed = false;  // 将标识修改为false
                return interrupted;  // 返回interrupted
            }
			// 保证上一个节点是-1，才会返回true，才会将线程阻塞，等待唤醒获取锁资源
            if (shouldParkAfterFailedAcquire(p, node) &&
				// 基于Unsafe类的park方法，挂起线程~~~
                parkAndCheckInterrupt())    // 针对fail属性，这里是唯一可能出现异常的地方，JVM内部出现问题时，可以这么理解，fianlly代码块中的内容，执行的几率约等于0~
                interrupted = true;
        }
    } finally {
        if (failed)
            //没拿到锁，跑路了，需要在队列中取消这个节点
            cancelAcquire(node);
    }
}

// -------------------------------------
// node是当前节点，pred是上一个节点
private static boolean shouldParkAfterFailedAcquire(Node pred, Node node) {
	// 获取上一个节点的状态
    int ws = pred.waitStatus;
	// 如果上一个节点状态为SIGNAL，一切正常！
    if (ws == Node.SIGNAL)
        return true;
	// 如果上一个节点已经失效了
    if (ws > 0) {
        do {
			// 将当前节点的prev指针指向了上一个的上一个！
            node.prev = pred = pred.prev;
        } while (pred.waitStatus > 0);  // 一致找到小于等于0的
		// 将重新标识好的最近的有效节点的next
        pred.next = node;
    } else {
		// 小于等于0，不等于-1，将上一个有效节点状态修改为-1
        compareAndSetWaitStatus(pred, ws, Node.SIGNAL);
    }
    return false;
}

// ----------------------------
// cancelAcquire方法
private void cancelAcquire(Node node) {
	// 如果当前节点为null，结束，健壮性判断
    if (node == null)
        return;
	// node不为null的前提下执行

	// 将当前node的线程置位null  ， 竞争锁资源跟我没有关系了，
    node.thread = null;

	// 获取当前节点的前驱节点
    Node pred = node.prev;
	// 前驱节点的状态 > 0
    while (pred.waitStatus > 0)
		// 找到前驱中最近的非失效节点
        node.prev = pred = pred.prev;

	// 将第一个不是失效节点的后继节点声明出来
    Node predNext = pred.next;

	// 将当前节点置位失效节点。给别的Node看的。
    node.waitStatus = Node.CANCELLED;

	// 如果当前节点是尾节点，将尾节点设置为最近的有效节点（如果当前节点为尾节点的操作）
    if (node == tail && compareAndSetTail(node, pred)) {
		// 用CAS方式将尾节点的next设置null
        compareAndSetNext(pred, predNext, null);
    } else {
        int ws;
		// 中间节点操作
		// 如果上一个节点不是头节点
        if (pred != head &&
			获取上一届点状态，是不是有效
            ((ws = pred.waitStatus) == Node.SIGNAL ||  // pred需要唤醒后继节点的
             (ws <= 0 && compareAndSetWaitStatus(pred, ws, Node.SIGNAL))) &&
            pred.thread != null) {
            Node next = node.next;
            if (next != null && next.waitStatus <= 0)
                compareAndSetNext(pred, predNext, next);  // 尝试将pred的前驱节点的next指向当前节点的next（必须是有效的next节点）
        } else {
			// 头结点，唤醒后继节点
            unparkSuccessor(node);
        }

        node.next = node; // help GC
    }
}

```

# 5.6 AQS如何释放资源

释放资源，从ReentrantLock来看，就是走unlock方法。释放资源不存在公平和非公平的区别，就一种实现逻辑。

```java
public final boolean release(int arg) {
    //尝试释放资源
    if (tryRelease(arg)) {
        //锁释放干净了，拿到head
        Node h = head;
        //如果head不等于null，且状态为-1【说明后面的线程挂起】
        if (h != null && h.waitStatus != 0)
            // 唤醒后面的线程
            unparkSuccessor(h);
        return true;
    }
    return false;
}
```

```java
protected final boolean tryRelease(int releases) {
    //拿到state,-1
    int c = getState() - releases;
    // 当前线程是否是持有锁的线程
    if (Thread.currentThread() != getExclusiveOwnerThread())
        //如果不是，抛出异常
        throw new IllegalMonitorStateException();
    boolean free = false;
    //free表示当前的锁资源有没有释放干净【可重入情况】
    if (c == 0) {
        //释放干净了
        free = true;
        //现在没有线程持有锁了
        setExclusiveOwnerThread(null);
    }
    //将减一后的state设置给state
    setState(c);
    return free;
}
```

```java
private void unparkSuccessor(Node node) {
    //传进来的参数是head，拿到head的状态
    int ws = node.waitStatus;
    if (ws < 0)
        // 将head状态设置为0，状态归位~
        compareAndSetWaitStatus(node, ws, 0);
    Node s = node.next;
    //如果下一个节点为null或者准备跑路了
    if (s == null || s.waitStatus > 0) {
        s = null;
        //从后往前找到状态正常的节点
        【为什么不从前往后找，因为在取消排队的方法中，节点会进行node.next=node操作
        从前往后找，有可能过不去，但是prev指针不会动】
        for (Node t = tail; t != null && t != node; t = t.prev)
            if (t.waitStatus <= 0)
                s = t;
    }
    if (s != null)
        //如果下一个节点没问题，unpark唤醒对应线程
        LockSupport.unpark(s.thread);
}
```

# ReentrantLock

# 谈谈你对ReentrantLock的理解

1. 首先，ReentrantLock是一个可重入的排它锁，主要用来解决多线程对共享资源访问的问题。核心特性有：第一它支持可重入，就是获得锁的线程，在释放锁之前，再次竞争同一把锁时，不需要再次加锁，就可以直接访问这个代码。第二，它支持公平锁和非公平锁两个特性；第三，它支持中断。
2. ReentrantLock的底层实现，有几个非常关键的技术：
3. 锁的竞争，ReentrantLock是通过互斥变量，使用CAS机制来实现的；
4. 没有竞争到锁的进程，使用AQS的队列同步器来存储，底层是通过双向链表实现的，当获得锁的线程释放锁之后，就会从AQS队列的头部唤醒下一个等待锁的线程。
5. 公平和非公平的特性，主要是体现在竞争锁的时候，是否需要判断AQS队列里面存在等待的线程
6. 锁的可重入特性，AQS里面有一个成员变量，用来保存当前获得锁的线程，当同一个线程下次再来竞争锁时，不会再去走竞争锁的逻辑，而是直接增加重入次数。

# 6、CAS

# 6.1 谈一下你对CAS的理解

CAS是Java的Unsafe类中的一个方法，它的全称是CompareAndSwap，比较并交换。主要功能是能够保证在多线程的环境下，修改共享变量的原子性。有些需要同步的场景我们可以使用synchronized同步锁，但是同步锁会造成性能的很大下降，所以可以使用CAS进行优化。CAS是一个native方法。

可以通过unsafe类中的compareAndSwapxxx(A,B,C,D)方法来保证共享变量的原子性，这四个参数分别是当前对象实例、共享变量在内存地址中的偏移量【通过unsafe类中的objectFieldOffset方法拿到】、预期值和期望更改后的新值。CAS会比较内存地址偏移量对应的值和预期值是否相等，如果相等，就直接修改内存地址对应的值为更改后的新值。这个过程对于JVM是原子操作，不存在线程安全的问题。

compareAndSwapxxx()方法是一个native方法，他最终还会面临同样的问题，就是先从内存地址中读取值，比较再去修改。这三个小步骤在哪个层面都会存在原子性问题，所以在这个方法更底层实现中，如果是多核的CPU环境下，会增加一个lock指令，来对缓存或者总线加锁，从而保证这个操作的原子性。

CAS比较经典的使用场景有两个：一个是JUC包里面Atomic类的原子性实现；第二个是实现多线程对共享资源竞争的互斥特性，比如AQS、ConcurrentHashMap等。

以上就是我对这个问题的理解。
