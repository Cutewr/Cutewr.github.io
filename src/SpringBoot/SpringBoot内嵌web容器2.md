---
title: 一文了解SpringBoot内嵌web容器||
order: 2
category:
  - SpringBoot
tag:
  - 原理
  - 源码
---

## 前言

​    最近在学习Spring Boot相关的课程，过程中以笔记的形式记录下来，方便以后回忆，同时也在这里和大家探讨探讨，文章中有漏的或者有补充的、错误的都希望大家能够及时提出来，本人在此先谢谢了！

> 开始之前呢，希望大家带着几个问题去学习：
> 
> 1、Spring Boot 嵌入式Web容器是什么？
> 
> 2、整体流程或结构是怎样的？
> 
> 3、核心部分是什么？
> 
> 4、怎么实现的？
> 
> 这是对自我的提问，我认为带着问题去学习，是一种更好的学习方式，有利于加深理解。好了，接下来进入主题。

## 1、起源

​    在当今的互联网场景中，与终端用户交互的应用大多数是 Web 应用，其中 Java Web 应用尤为突出，其对应的 Java Web 容器发展至今也分为 `Servlet Web` 容器和 `Reactive Web` 容器，前者的使用率大概占比是百分之九十左右，其具体的实现有 `Tomcat`、`Jetty` 和 `Undertow`；而后者出现较晚，且技术栈体系并未完全成熟，还有待时间验证可行性，它的默认实现为 `Netty Web Server`。其中的 `Servlet` 规范与三种 `Servlet` 容器的版本关系如下：

| Servlet 规范 | Tomcat | Jetty | Undertow |
| ------------ | ------ | ----- | -------- |
| 4.0          | 9.X    | 9.X   | 2.X      |
| 3.1          | 8.X    | 8.X   | 1.X      |
| 3.0          | 7.X    | 8.X   | N/A      |
| 2.5          | 6.X    | 8.X   | N/A      |

以上 Web 容器均被 `Spring Boot` 嵌入至其中作为其核心特性，来简化 `Spring Boot`应用启动流程。`Spring Boot` 通过 `Maven` 依赖来切换应用的嵌入式容器类型，其对应的 Maven jar 分别是：

```xml
<!-- Tomcat -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-tomcat</artifactId>
</dependency>

<!-- undertow -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-undertow</artifactId>
</dependency>

<!-- jetty -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jetty</artifactId>
</dependency>

<!-- netty Web Server -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-reactor-netty</artifactId>
</dependency>
```

前三者是 `Servlet Web` 实现，最后则是 `Reactive Web` 的实现。值得注意的是，当我们引用的是 `Servlet Web` 功能模块时，它会自动集成 `Tomcat` ，里面包含了 `Tomcat` 的 `Maven` 依赖包，也就是说 `Tomcat` 是默认的 `Servlet Web` 容器。`Servlet Web` 模块的 `Maven` 依赖如下：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

而如果引用的是 `Reactive Web` 功能模块时，则会默认集成 `netty Web Server` 。`Reactive Web` 模块的依赖如下：

```xml
<dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>
```

不过，上面的三种 `Servlet Web` 容器也能作为 `Reactive Web` 容器 ，并允许替换默认实现 `Netty Web Server`，因为 `Servlet` 3.1+容器同样满足 `Reactive` 异步非阻塞特性。

接下来，我们重点讨论嵌入式 Web 容器的启动流程。

> 注：本篇文章所用到的 `Spring Boot`版本是 `2.1.6.BUILD-SNAPSHOT`

## 2、容器启动流程解析

​    `Spring Boot` 嵌入式容器启动时会先判断当前的应用类型，是 `Servlet Web` 还是 `Reactive Web` ，之后会创建相应类型的 `ApplicationContext` 上下文，在该上下文中先获取容器的工厂类，然后利用该工厂类创建具体的容器。接下来，我们进行详细讨论。

从 `Spring Boot` 启动类开始：

```java
@SpringBootApplication
public class DiveInSpringBootApplication {
	public static void main(String[] args) {
		SpringApplication.run(DiveInSpringBootApplication.class, args);
	}
}
```

### 2.1、获取应用类型

先来看看，获取应用类型的过程，进入 run 的重载方法：

```java
public class SpringApplication {

    // 1、该方法中，先构造 SpringApplication 对象，再调用该对象的 run 方法。我们进入第二步查看构造过程
    public static ConfigurableApplicationContext run(Class<?>[] primarySources,
			String[] args) {
		return new SpringApplication(primarySources).run(args);
	}
	
	// 2、webApplicationType 存储的就是应用的类型，通过 deduceFromClasspath 方法返回。
	// 我们进入第三步查看该方法实现
	public SpringApplication(ResourceLoader resourceLoader, Class<?>... primarySources) {
		...
		this.webApplicationType = WebApplicationType.deduceFromClasspath();
		...
	}
}

public enum WebApplicationType {

    private static final String[] SERVLET_INDICATOR_CLASSES = { "javax.servlet.Servlet",
			"org.springframework.web.context.ConfigurableWebApplicationContext" };

	private static final String WEBMVC_INDICATOR_CLASS = "org.springframework." + "web.servlet.DispatcherServlet";

	private static final String WEBFLUX_INDICATOR_CLASS = "org." + "springframework.web.reactive.DispatcherHandler";

	private static final String JERSEY_INDICATOR_CLASS = "org.glassfish.jersey.servlet.ServletContainer";

    // 3、这里其实是根据引入的 Web 模块 jar 包，来判断是否包含各 Web 模块的类，来返回相应的应用类型
    static WebApplicationType deduceFromClasspath() {
    
        // 当 DispatcherHandler 类存在，DispatcherServlet 和 ServletContainer 不存在时，
        // 返回 Reactive ，表示当前 Spring Boot 应用类型是 Reactive Web 。
        // 前者是 Reactice Web jar 中的类，后两者是 Servlet Web 中的。
		if (ClassUtils.isPresent(WEBFLUX_INDICATOR_CLASS, null) && !ClassUtils.isPresent(WEBMVC_INDICATOR_CLASS, null)
				&& !ClassUtils.isPresent(JERSEY_INDICATOR_CLASS, null)) {
			return WebApplicationType.REACTIVE;
		}
		
		// 这里判断是非 Web 应用类型
		for (String className : SERVLET_INDICATOR_CLASSES) {
			if (!ClassUtils.isPresent(className, null)) {
				return WebApplicationType.NONE;
			}
		}
		
		// 以上都不满足时，最后返回 Servlet 。
		return WebApplicationType.SERVLET;
	}
}
```

以上，在 `SpringApplication` 的构造阶段确定了当前应用的类型，该类型名称存储在 `webApplicationType` 字段中。

### 2.2、容器启动流程

接着进入容器启动流程，进入重载的 run 方法中：

```java
public class SpringApplication {

    public static final String DEFAULT_CONTEXT_CLASS = "org.springframework.context."
			+ "annotation.AnnotationConfigApplicationContext";

    public static final String DEFAULT_WEB_CONTEXT_CLASS = "org.springframework.boot."
			+ "web.servlet.context.AnnotationConfigServletWebServerApplicationContext";
			
    public static final String DEFAULT_REACTIVE_WEB_CONTEXT_CLASS = "org.springframework."
			+ "boot.web.reactive.context.AnnotationConfigReactiveWebServerApplicationContext";
			
    ...
    
    private WebApplicationType webApplicationType;
    
    ...
    
    public ConfigurableApplicationContext run(String... args) {
		...
		
		ConfigurableApplicationContext context = null;
		
		try {
			...
			// 1、通过 createApplicationContext 方法创建对应的 ApplicationContext 应用上下文，进入 1.1 查看具体实现
			context = createApplicationContext();
			
			...
			
			// 2、该方法实质是启动 Spring 应用上下文的，但 Spring Boot 嵌入式容器也在该过程中被启动，入参是上下文对象，我们进入 2.1 进行跟踪
			refreshContext(context);
			
			...
		}
		...
	}
	
	// 1.1、
	protected ConfigurableApplicationContext createApplicationContext() {
		Class<?> contextClass = this.applicationContextClass;
		if (contextClass == null) {
			try {
			
			    // 这里就是通过 webApplicationType 属性，判断应用类型，来创建不同的 ApplicationContext 应用上下文
				switch (this.webApplicationType) {
				case SERVLET:
					
					// 返回的是 Servlet Web ，具体对象为 AnnotationConfigServletWebServerApplicationContext，
					// 该类有一个关键父类 ServletWebServerApplicationContext
					contextClass = Class.forName(DEFAULT_WEB_CONTEXT_CLASS);
					break;
				case REACTIVE:
				
				    // 返回的是 Reactive Web，具体对象为 AnnotationConfigReactiveWebServerApplicationContext
					contextClass = Class.forName(DEFAULT_REACTIVE_WEB_CONTEXT_CLASS);
					break;
				default:
				
				    // 应用类型是非 Web 时，返回 AnnotationConfigApplicationContext
					contextClass = Class.forName(DEFAULT_CONTEXT_CLASS);
				}
			}
			...
		}
		return (ConfigurableApplicationContext) BeanUtils.instantiateClass(contextClass);
	}
	
	// 2.1
	private void refreshContext(ConfigurableApplicationContext context) {
		
		// 里面调用的是 refresh 方法，进入 2.2 继续跟踪
		refresh(context);
		
		...
	}
	
	// 2.2
	protected void refresh(ApplicationContext applicationContext) {
		Assert.isInstanceOf(AbstractApplicationContext.class, applicationContext);
		
		// 最终调用了 所有应用上下文的统一抽象类 AbstractApplicationContext 中的 refresh 方法，进入 3 查看实现
		((AbstractApplicationContext) applicationContext).refresh();
	}
	
	...
}
```

`AbstractApplicationContext` 是 `Spring` 应用上下文的核心启动类，`Spring` 的 ioc 从这里就开始进入创建流程。在后续在 `Spring` 系列的文章中会进行详细讨论，我们这里只关注容器创建的部分。

```java
public abstract class AbstractApplicationContext extends DefaultResourceLoader
		implements ConfigurableApplicationContext {
    
    ...
    
    // 3
    @Override
	public void refresh() throws BeansException, IllegalStateException {
		synchronized (this.startupShutdownMonitor) {
			
			try {
				...
                
                // Web 容器在这个方法中启动，但在当前抽象类中这个方法是个空实现，具体由 ApplicationContext 上下文的子类对象进行重写，
                // 我们进入 4 查看其中一个子类的实现
				onRefresh();

				...
			}
		}
		...
	}
	...
}
```

这里以 `Servlet web` 为例，具体上下文对象是 `AnnotationConfigServletWebServerApplicationContext`，该类实现了 `ServletWebServerApplicationContext` 类，onRefresh 方法由该类进行重写。

```java
public class ServletWebServerApplicationContext extends GenericWebApplicationContext
		implements ConfigurableWebServerApplicationContext {
    ...
    
    // 4
    @Override
	protected void onRefresh() {
		
		...
		
		try {
		
		    // 里面调用了 createWebServer 方法，进入 5 查看实现
			createWebServer();
		}
		catch (Throwable ex) {
			throw new ApplicationContextException("Unable to start web server", ex);
		}
	}
	
	...
	
	// 5
	private void createWebServer() {
	    
	    // WebServer 就是容器对象，是一个接口，其对应的实现类分别是：
	    // JettyWebServer、TomcatWebServer、UndertowWebServer、NettyWebServer。这些容器对象由对应的容器工厂类进行创建
		WebServer webServer = this.webServer;
		ServletContext servletContext = getServletContext();
		
		// 当 webServer 等于 null ，也就是容器还没创建时，进入该 if 中
		if (webServer == null && servletContext == null) {
		    
		    // 这里是获取 创建 Servlet Web 容器的工厂类，也是一个接口，有三个实现，分别是：
		    // JettyServletWebServerFactory、TomcatServletWebServerFactory、UndertowServletWebServerFactory
			ServletWebServerFactory factory = getWebServerFactory();
			
			// 通过容器工厂类的 getWebServer 方法，创建容器对象。这里以创建 Tomcat 为例，来继续跟踪容器的创建流程，
			// 跳到 6 查看 TomcatServletWebServerFactory 的 getWebServer 方法
			this.webServer = factory.getWebServer(getSelfInitializer());
		}
		
		...
	}
}
```

`TomcatServletWebServerFactory` 是创建 `Tomcat` 的 Web 容器工厂类，但这个工厂类是如何被创建的呢？这里将会在文章的第三部分进行详细讨论。

```java
public class TomcatServletWebServerFactory extends AbstractServletWebServerFactory
		implements ConfigurableTomcatWebServerFactory, ResourceLoaderAware {
    
    ...
    // 6、
    @Override
	public WebServer getWebServer(ServletContextInitializer... initializers) {
		
		// 方法中先进行创建 Tomcat 的流程，如 Container 、Engine、Host、Servlet 几个容器的组装。
		// 后续有机会再对 Tomcat 进行详细讨论，这里就不深入了
		Tomcat tomcat = new Tomcat();
		File baseDir = (this.baseDirectory != null) ? this.baseDirectory : createTempDir("tomcat");
		tomcat.setBaseDir(baseDir.getAbsolutePath());
		Connector connector = new Connector(this.protocol);
		tomcat.getService().addConnector(connector);
		customizeConnector(connector);
		tomcat.setConnector(connector);
		tomcat.getHost().setAutoDeploy(false);
		configureEngine(tomcat.getEngine());
		for (Connector additionalConnector : this.additionalTomcatConnectors) {
			tomcat.getService().addConnector(additionalConnector);
		}
		prepareContext(tomcat.getHost(), initializers);
		
		// 通过 getTomcatWebServer 方法返回 TomcatWebServer 容器对象。进入 7 查看接下来的流程
		return getTomcatWebServer(tomcat);
	}
	
	...
	
	// 7、这里通过 TomcatWebServer 的构造方法创建该对象。进入 8 继续跟踪
	protected TomcatWebServer getTomcatWebServer(Tomcat tomcat) {
		return new TomcatWebServer(tomcat, getPort() >= 0);
	}
	
	...
}
```

`TomcatWebServer` 是具体的容器对象，在其对应的工厂类中进行创建，其实现了 `WebServer` 接口，并在该对象中进行 `Tomcat` 的启动流程。

```java
public class TomcatWebServer implements WebServer {

    ...

    // 8、
    public TomcatWebServer(Tomcat tomcat, boolean autoStart) {
		Assert.notNull(tomcat, "Tomcat Server must not be null");
		this.tomcat = tomcat;
		this.autoStart = autoStart;
		
		// 进入 initialize 方法中，查看实现
		initialize();
	}

	private void initialize() throws WebServerException {
		logger.info("Tomcat initialized with port(s): " + getPortsDescription(false));
		synchronized (this.monitor) {
			try {
			
				...

				// 调用 Tomcat 的 start 方法，正式启动
				this.tomcat.start();

				...
				
				// 启动守护线程来监听http请求 
				startDaemonAwaitThread();
			}
			...
		}
	}
	
	...
}
```

到这里，Web 容器的启动流程就结束了，以上是以 `Servlet Web` 及其具体的 `Tomcat` 容器为例子进行的讨论，这也是大部分开发者常用的体系。接着来对整个过程做一个总结。

> - 首先通过引入的 Web 模块 Maven 依赖 ，来判断当前应用的类型，如 Servlet Web 或 Reactive Web。并根据应用类型来创建相应的 ApplicationContext 上下文对象。
> - 然后调用了 ApplicationContext 的父抽象类 AbstractApplicationContext 中的 refresh 方法，又在该方法中调用了子类的 onRefresh 方法。
> - 最后是在 onRefresh 中通过容器的工厂类创建具体容器对象，并在该容器对象中进行启动。

## 3、加载 Web 容器工厂

​    上面说过， Web 容器对象是由其对应的工厂类进行创建的，那容器工厂类又是怎么创建呢？我们这里就来看一看。在[《Spring Boot 自动装配（二）》](https://www.cnblogs.com/loongk/p/11973642.html)的 1.2 小节说过， `Spring Boot` 启动时，会读取所有 jar 包中 `META-INF` 文件夹下的 `spring.factories` 文件，并加载文件中定义好的类，如：

```properties
...
## Auto Configure
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
org.springframework.boot.autoconfigure.web.servlet.ServletWebServerFactoryAutoConfiguration,\

...
```

其中有一个 `ServletWebServerFactoryAutoConfiguration` 类：

```java
@Configuration
@AutoConfigureOrder(Ordered.HIGHEST_PRECEDENCE)
@ConditionalOnClass(ServletRequest.class)
@ConditionalOnWebApplication(type = Type.SERVLET)
@EnableConfigurationProperties(ServerProperties.class)
@Import({ ServletWebServerFactoryAutoConfiguration.BeanPostProcessorsRegistrar.class,
		ServletWebServerFactoryConfiguration.EmbeddedTomcat.class,
		ServletWebServerFactoryConfiguration.EmbeddedJetty.class,
		ServletWebServerFactoryConfiguration.EmbeddedUndertow.class })
public class ServletWebServerFactoryAutoConfiguration {
    ...
}
```

该类通过 `@Import` 导入了 `ServletWebServerFactoryConfiguration` 中的三个内部类，这三个内部类就是用来创建容器工厂，我们进入其中查看具体实现：

```java
@Configuration
class ServletWebServerFactoryConfiguration {

    // 通过 @ConditionalOnClass 判断 Servlet 、Tomcat、UpgradeProtocol 这三个 Class 是否存在，
    // 当引用的是 Tomcat Maven 依赖时，则 Class 才存在，并创建 Tomcat 的容器工厂类 TomcatServletWebServerFactory
	@Configuration
	@ConditionalOnClass({ Servlet.class, Tomcat.class, UpgradeProtocol.class })
	@ConditionalOnMissingBean(value = ServletWebServerFactory.class, search = SearchStrategy.CURRENT)
	public static class EmbeddedTomcat {

		@Bean
		public TomcatServletWebServerFactory tomcatServletWebServerFactory() {
			return new TomcatServletWebServerFactory();
		}
	}

    // 当引用的是 Jetty Maven 依赖时，@ConditionalOnClass 条件才满足，
    // 创建的容器工厂类是 JettyServletWebServerFactory 
	@Configuration
	@ConditionalOnClass({ Servlet.class, Server.class, Loader.class, WebAppContext.class })
	@ConditionalOnMissingBean(value = ServletWebServerFactory.class, search = SearchStrategy.CURRENT)
	public static class EmbeddedJetty {

		@Bean
		public JettyServletWebServerFactory JettyServletWebServerFactory() {
			return new JettyServletWebServerFactory();
		}
	}

    // 当引用的是 Undertow Maven 依赖时，@ConditionalOnClass 条件才满足，
    // 创建的容器工厂类是 UndertowServletWebServerFactory 
	@Configuration
	@ConditionalOnClass({ Servlet.class, Undertow.class, SslClientAuthMode.class })
	@ConditionalOnMissingBean(value = ServletWebServerFactory.class, search = SearchStrategy.CURRENT)
	public static class EmbeddedUndertow {

		@Bean
		public UndertowServletWebServerFactory undertowServletWebServerFactory() {
			return new UndertowServletWebServerFactory();
		}
	}
```

可以看到，主要是通过引入相应 Web 容器的 `Maven` 依赖，来判断容器对应的 `Class` 是否存在，存在则创建相应的容器工厂类。

## 4、总结

​    最后，来对 `Spring Boot` 嵌入式 Web 容器做一个整体的总结。`Spring Boot` 支持的两大 Web 容器体系，一个是 `Servlet Web` ，另一个是 `Reactive Web` ，它们都有其具体的容器实现，相信大多数开发者使用的都是前者，且最常用的容器实现也是 `Tomcat`，所以这篇文章主要讨论的也是 `Spring Boot` 启动 `Tomcat` 嵌入式容器的流程。

以上就是本章的内容，如果文章中有错误或者需要补充的请及时提出，本人感激不尽。