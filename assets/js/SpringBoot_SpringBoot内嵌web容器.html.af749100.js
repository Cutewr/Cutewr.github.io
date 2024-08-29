"use strict";(self.webpackChunkvuepress_theme_hope_template=self.webpackChunkvuepress_theme_hope_template||[]).push([[5881],{6262:(e,i)=>{i.A=(e,i)=>{const t=e.__vccOpts||e;for(const[e,a]of i)t[e]=a;return t}},3011:(e,i,t)=>{t.r(i),t.d(i,{comp:()=>r,data:()=>g});var a=t(641);const n=[(0,a.Fv)('<h1 id="一文了解springboot内嵌web容器" tabindex="-1"><a class="header-anchor" href="#一文了解springboot内嵌web容器"><span>一文了解SpringBoot内嵌web容器</span></a></h1><h2 id="前言" tabindex="-1"><a class="header-anchor" href="#前言"><span>前言</span></a></h2><p>今天分享一个SpringBoot的内嵌Web容器，在SpringBoot还没有出现时，我们使用Java开发了Web项目，需要将其部署到Tomcat下面，需要配置很多xml文件，SpringBoot出现后，就从繁琐的xml文件中解脱出来了，SpringBoot将Web容器进行了内嵌，我们只需要将项目打成一个jar包，就可以运行了，大大省略了开发成本，那么SpringBoot是怎么实现的呢，我们今天就来详细介绍。</p><h2 id="springboot提供的内嵌容器" tabindex="-1"><a class="header-anchor" href="#springboot提供的内嵌容器"><span>SpringBoot提供的内嵌容器</span></a></h2><p>SpringBoot提供了四种Web容器，分别为Tomcat，Jetty，Undertow，Netty。</p><h3 id="tomcat" tabindex="-1"><a class="header-anchor" href="#tomcat"><span>Tomcat</span></a></h3><p>Spring Boot 默认使用 Tomcat 作为嵌入式 Web 容器。Tomcat 作为一个流行的 Web 容器，容易能够理解、配置和管理。可以通过使用spring-boot-starter-web来启用 Tomcat 容器。</p><h3 id="jetty" tabindex="-1"><a class="header-anchor" href="#jetty"><span>Jetty</span></a></h3><p>Jetty 同样是一个流行的嵌入式 Web 容器，它的缺省配置相对精简，从而有利快速启动。可以通过使用spring-boot-starter-jetty来启用 Jetty 容器。</p><h3 id="undertow" tabindex="-1"><a class="header-anchor" href="#undertow"><span>Undertow</span></a></h3><p>Undertow 是一个由 JBoss 开发的轻量级的嵌入式 Web 服务器。它具有出色的性能和低资源占用率，是一个适合微服务实现的 Web 服务器。可以使用spring-boot-starter-undertow来启用 Undertow 容器。</p><h3 id="netty" tabindex="-1"><a class="header-anchor" href="#netty"><span>Netty</span></a></h3><p>Netty是一个高性能的网络框架，需要引入spring-boot-starter-webflux和spring-boot-starter-reactor-netty来开启Netty作为Web容器。</p><h2 id="使用" tabindex="-1"><a class="header-anchor" href="#使用"><span>使用</span></a></h2><p>因为SpringBoot默认的是Tomcat作为Web容器，如果我们需要使用使用其他Web容器，那么需要排除Tomcat容器，再引入其他容器，Tomcat容器位于spring-boot-starter-web模块下，所以我们需要在maven的pom.xml中移除Tomcat，如下。</p><div class="language-xml line-numbers-mode" data-highlighter="shiki" data-ext="xml" data-title="xml" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">dependency</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">      &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">groupId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;org.springframework.boot&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">groupId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">      &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">artifactId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;spring-boot-starter-web&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">artifactId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">      &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">version</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;3.0.2&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">version</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">      &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">exclusions</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">          &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">exclusion</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">              &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">groupId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;org.springframework.boot&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">groupId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">              &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">artifactId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;spring-boot-starter-tomcat&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">artifactId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">          &lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">exclusion</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">      &lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">exclusions</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">dependency</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后引入对应的Web容器，比如引入Undertow</p><div class="language-xml line-numbers-mode" data-highlighter="shiki" data-ext="xml" data-title="xml" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">dependency</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">      &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">groupId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;org.springframework.boot&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">groupId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">      &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">artifactId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;spring-boot-starter-undertow&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">artifactId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">dependency</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后可以在yml文件中配置相应容器的参数，如下配置undertow.</p><div class="language-yml line-numbers-mode" data-highlighter="shiki" data-ext="yml" data-title="yml" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">server</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">:</span></span>\n<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">  port</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">8080</span></span>\n<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">  undertow</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">:</span></span>\n<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">    threads</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">:</span></span>\n<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">      worker</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">10</span></span>\n<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">      io</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">10</span></span>\n<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">    direct-buffers</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">true</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其他web容器可以根据实际情况配置，从ServerProperties配置文件中可以查看对应的Web容器的相关配置。</p><figure><img src="https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/4574f51b-2b08-4ca4-bb64-7016532ee9af.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="源码解析" tabindex="-1"><a class="header-anchor" href="#源码解析"><span>源码解析</span></a></h2><p>下面从源码进行分析，我们先使用SpringBoot的默认Web容器Tomcat进行分析。</p><p>那么源码应该从哪里看起呢，对于SpringBoot这么庞大复杂的项目，首先，我们在使用SpringBoot的时候，需要在application.yml文件中配置相关信息，比如端口，如果不配置端口，默认是8080，那么这个端口肯定是web容器的端口，如果是Tomcat，那么Tomcat就设置为这个端口，Undertow也是，依此类推。</p><p>那么这里就是一个入口，在SpringBoot中，我们要获取yml文件中的配置信息，一般是通过<code>@ConfigurationProperties</code>注解，我们可以按住ctrl，然后鼠标点击这个port，就能跳到对应的属性类里面。</p><figure><img src="https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/867ff8b4-ca6f-46e3-a375-a48474cbd4f1-20240829141746703.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>属性类ServerProperties就是专门获取yml文件中的配置，然后以供使用。</p><figure><img src="https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/c2f7a63f-c5d8-47d0-b227-ec6dfaa51fee.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>到了属性类里面后，我们继续ctrl，然后会弹出很多类，如下所示。</p><p><img src="https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/ae404d6b-e8b0-4ec5-9251-023656603eb1-20240829141514990.png" alt="" loading="lazy">因为我们使用的是Tomcat，那么就选择一个Tomcat相关的类，我们选择<code>TomcatWebServerFactoryCustomizer</code>，这个类实现了接口<code>WebServerFactoryCustomizer</code>，并实现了方法customize。</p><figure><img src="https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/999b10db-dd13-4178-a3cf-a1c45afd72c1-20240829141527356.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>customize的参数是<code>ConfigurableTomcatWebServerFactory</code>，它是一个接口，它还继承了接口<code>ConfigurableWebServerFactory</code>，我们从<code>ConfigurableWebServerFactory</code>中看出里面有设置端口，地址等方法。</p><figure><img src="https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/b8416349-c141-484b-aab0-354a0ff6dff8.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>我们再回头看<code>ConfigurableTomcatWebServerFactory</code>，可以看出里面是一些Tomcat相关的方法。</p><figure><img src="https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/595f2d35-5c60-4f1f-b5ed-8b44ea37a09f.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>然后继续看<code>ConfigurableUndertowWebServerFactory</code>,可以看出里面是对Undertow的一些属性设置的方法。</p><figure><img src="https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/29c43100-21d6-4166-888e-75f3ffcb9443.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>回到<code>TomcatWebServerFactoryCustomizer</code>类中，SpringBoot使用了它的<code>PropertyMapper</code>类对属性进行设置，我们可以看出它使用propertyMapper.from().to()语法，其实就是将ServerProperties中的属性设置到ConfigurableTomcatWebServerFactory中，这个属性设置是在Spring对Bean进行初始化时候设置的，使用的是Spring的后置处理器来实现的，后面我们继续说。</p><figure><img src="https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/6100f518-506f-4e29-9f6f-74232b207c83.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>然后我们继续看一下<code>TomcatWebServerFactoryCustomizer</code>，他有一个构造函数，参数是Environment和ServerProperties，那么就证明其他地方对其进行了new操作。</p><figure><img src="https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/36df1016-832d-4d65-b02c-2fccef86609f-20240829141600521.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>我们也是用ctrl套路，点击构造函数后跳到了<code>EmbeddedWebServerFactoryCustomizerAutoConfiguration</code>自动装配类中，这个类中有四个静态类，我们可以看出，他们的作用都是创建对应的定制器Bean，其实就是将yml文件中的Web容器配置进行装配，以供后面使用。</p><figure><img src="https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/c63c5b1f-adbd-4d7e-90d3-80f7568f1c62-20240829141610287.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>上面说的这一堆其实就是SpringBoot的自动装配，其目的就是创建对应的Customizer，因为每个Web容器的配置项不一样，所以就需要不同的Customizer和Factory。</p><blockquote><p>上面说了这么多，怎么感觉和源码没关系呢，没错，其实上面说的并不是核心源码，那么怎么找到核心源码呢？我们思考一下，既然上面是部分源码，那么源码肯定会执行到这里。</p></blockquote><h3 id="查看调用链" tabindex="-1"><a class="header-anchor" href="#查看调用链"><span>查看调用链</span></a></h3><p>我们在上面的<code>TomcatWebServerFactoryCustomizer</code>类中的<code>customize</code>方法中打一个断点，然后debug，于是得到调用链如下。</p><figure><img src="https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/b86715b2-048f-4947-bcf7-abd7d4070a5a.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>我们可以看出会调用<code>onRefresh()</code>方法，因为<code>AbstractApplicationContext</code>使用的是<strong>模板方法</strong>模式，具体的实现交给子类实现，因为使用的是Tomcat，所以交给了<code>ServletWebServerApplicationContext</code>类来实现，具体的子类里面有一个<code>createWebServer()</code>方法，它就是创建Web容器。</p><figure><img src="https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/3e1bb4f0-5790-4a1a-ac55-a4a2d63aedf9.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>具体实现如下，如下是Tomcat的实现，里面会涉及到两个重要的接口<code>WebServer</code>和<code>WebServerFactory</code>。</p><figure><img src="https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/701284e0-8a8a-4953-a5e6-e8e995580d33.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="webserver" tabindex="-1"><a class="header-anchor" href="#webserver"><span>WebServer</span></a></h3><p>WebServer是容器的顶层接口，具体实现交给具体的容器实现类，如Tomcat则使用<code>TomcatWebServer</code>，Undertow则使用<code>UndertowWebServer</code>,Jetty，Netty也是如此。</p><p>此接口提供了一些方法，start()启动Web服务器，stop()停止Web服务器，getPort()获取服务器端口。</p><figure><img src="https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/image-20240829142157826.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>不过对于start()和stop()，它们只是接口抽象的规范，在具体的实现中，也并不是全部都按照这个标准，start()方法上有备注<code>Starts the web server. Calling this method on an already started server has no effect.</code>，翻译为:<code>启动web服务器。在已启动的服务器上调用此方法无效。</code>，比如Tomcat的就没有在start()方法中启动服务器，具体我们等会会看。</p><h3 id="webserverfactory" tabindex="-1"><a class="header-anchor" href="#webserverfactory"><span>WebServerFactory</span></a></h3><p>WebServerFactory是一个接口，没有定义任何方法，它就创建Web服务器的工厂的标记接口，Spring中很多地方也是这样的风格。</p><figure><img src="https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/image-20240829142206545.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>这个接口重要的两个子接口，也是我们需要关注的两个子接口分别是<code>ServletWebServerFactory</code>和<code>ReactiveWebServerFactory</code>，它们两个都定义了一个方法<code>getWebServer</code>。</p><p><code>Jetty</code>，<code>Undertow</code>，<code>Tomcat</code>三个都属于Servlet容器，所以使用的是<code>ServletWebServerFactory</code>来创建Web容器。</p><p><img src="https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/51d6e4c5-0d4a-41ed-9ee3-e3e10000f7cc-20240829141642852.png" alt="" loading="lazy"><code>Netty</code>不是Servlet容器，所以使用的是<code>ReactiveWebServerFactory</code>来创建Web容器。</p><figure><img src="https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/image-20240829142217367.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><blockquote><p>上面对这两个接口进行了介绍，基本上整个Web容器都是围绕这两个接口来，我们下面继续分析。</p></blockquote><h3 id="获取webserverfactory" tabindex="-1"><a class="header-anchor" href="#获取webserverfactory"><span>获取WebServerFactory</span></a></h3><p>首先我们要先获取web服务的工厂类的Bean，才能创建Web容器，因为我们使用的是Tomcat，所以获取到的工厂类是<code>TomcatServletWebServerFactory</code>，具体的获取Bean的过程我们就没有必要去一一说明，只要对Spring IOC稍微熟悉一点就能理解，我们主要说一下在后置处理器。</p><p>上面我们介绍了Tomcat容器的定制器Customizer，里面对Web容器的配置属性进行组装，它就是发生在Bean的初始化前，用到的Bean后置处理器是<code>WebServerFactoryCustomizerBeanPostProcessor</code>。</p><figure><img src="https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/1a38d1a5-ec3a-45e7-b353-8ce46393a75e.png" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>Bean的后置处理器中，会调用对应的定制器，Tomcat调用的就是<code>TomcatWebServerFactoryCustomizer</code>，其他的也一样，其目的都是定制WebServerFactory。</p><p>经过一系列处理后，就从IOC容器中获取到了<code>WebServerFactory</code>Bean，然后再使用这个工厂去创建Web服务。</p><h3 id="创建web服务" tabindex="-1"><a class="header-anchor" href="#创建web服务"><span>创建Web服务</span></a></h3><p>获取到WebServerFactory后，就可以创建Web容器，因为使用的是Tomcat，所以使用的是<code>TomcatServletWebServerFactory</code>，如下，我们就看到了Tomcat的身影。</p><figure><img src="https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/image-20240829142019324.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>最后启动Tomcat容器是在TomcatWebServer中，在TomcatWebServer的构造函数中调用initialize()，在initialize()中我们看是this.tomcat.start()，Tomcat被启动了。</p><figure><img src="https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/image-20240829142030007.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>上面我们在说<code>WebServer</code>接口的时候，说了启动<code>start()</code>方法，在Tomcat的实现中就没有使用<code>start()</code>来启动容器，但是在Undertow中，就使用了<code>start()</code>方法来启动容器。</p><h3 id="undertow容器启动" tabindex="-1"><a class="header-anchor" href="#undertow容器启动"><span>Undertow容器启动</span></a></h3><p>上面我们介绍了Tomcat容器的创建，Undertow的流程和Tomcat基本上是一样的，但是在启动的时候，Undertow是在start()方法中启动，而start()方法需要在 finishRefresh()这一步中执行。</p><figure><img src="https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/f3977d33-cfb6-4b05-99f8-88c29b752217.png" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>在finishRefresh()中，会调用生命周期处理器</p><figure><img src="https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/image-20240829142059238.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>最终会走到WebServerStartStopLifecycle这个生命周期，这里就会调用WebServer中的start()方法。</p><figure><img src="https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/image-20240829142108040.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>最终在UndertowWebServer中启动Undertow容器</p><figure><img src="https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/bb0bae5c-1532-49d5-987d-ae3d5a1a4f0a.png" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>具体执行顺序如下。</p><p>finishRefresh() -&gt; getLifecycleProcessor().onRefresh() -&gt; startBeans(true) -&gt; start() -&gt; doStart(this.lifecycleBeans, member.name, this.autoStartupOnly) -&gt; bean.start() -&gt; this.webServer.start()</p><blockquote><p>上面我们分析了Tomcat和Undertow的创建流程，Jetty和Netty也是大同小异，因为Spring使用了模板方法模式，具体的实现交给具体的Web容器，所以在整体结构上是差不多的，只是实现方式不同。</p></blockquote><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2><p>关于SpringBoot的内嵌Web容器，就说得差不多了，我们从各种Web容器进行介绍，包括他们的有点，怎么在SpringBoot中使用，并对源码进行解析，在源码解析这里，我们并没有进行芝麻细节式解析，而是从大体上进行解析，只有对大致结构了解，才能更好地进行深度学习。</p><p>SpringBoot内嵌容器涉及的知识点还是比较多，需要对Spring和SpringBoot有一定的了解才能更好地学习它，本文基于SpringBoot3.0进行解析， SpringBoot3.0中，Servlet也是遵循Jakata EE规范。</p>',93)],s={},r=(0,t(6262).A)(s,[["render",function(e,i){return(0,a.uX)(),(0,a.CE)("div",null,n)}]]),g=JSON.parse('{"path":"/SpringBoot/SpringBoot%E5%86%85%E5%B5%8Cweb%E5%AE%B9%E5%99%A8.html","title":"一文了解SpringBoot内嵌web容器","lang":"zh-CN","frontmatter":{"title":"一文了解SpringBoot内嵌web容器","order":1,"category":["SpringBoot"],"tag":["原理","源码"],"description":"一文了解SpringBoot内嵌web容器 前言 今天分享一个SpringBoot的内嵌Web容器，在SpringBoot还没有出现时，我们使用Java开发了Web项目，需要将其部署到Tomcat下面，需要配置很多xml文件，SpringBoot出现后，就从繁琐的xml文件中解脱出来了，SpringBoot将Web容器进行了内嵌，我们只需要将项目打成一...","head":[["meta",{"property":"og:url","content":"https://cutewr.github.io/SpringBoot/SpringBoot%E5%86%85%E5%B5%8Cweb%E5%AE%B9%E5%99%A8.html"}],["meta",{"property":"og:site_name","content":"首页"}],["meta",{"property":"og:title","content":"一文了解SpringBoot内嵌web容器"}],["meta",{"property":"og:description","content":"一文了解SpringBoot内嵌web容器 前言 今天分享一个SpringBoot的内嵌Web容器，在SpringBoot还没有出现时，我们使用Java开发了Web项目，需要将其部署到Tomcat下面，需要配置很多xml文件，SpringBoot出现后，就从繁琐的xml文件中解脱出来了，SpringBoot将Web容器进行了内嵌，我们只需要将项目打成一..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/4574f51b-2b08-4ca4-bb64-7016532ee9af.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-08-29T08:01:08.000Z"}],["meta",{"property":"article:author","content":"Cutewr"}],["meta",{"property":"article:tag","content":"原理"}],["meta",{"property":"article:tag","content":"源码"}],["meta",{"property":"article:modified_time","content":"2024-08-29T08:01:08.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"一文了解SpringBoot内嵌web容器\\",\\"image\\":[\\"https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/4574f51b-2b08-4ca4-bb64-7016532ee9af.png\\",\\"https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/867ff8b4-ca6f-46e3-a375-a48474cbd4f1-20240829141746703.png\\",\\"https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/c2f7a63f-c5d8-47d0-b227-ec6dfaa51fee.png\\",\\"https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/ae404d6b-e8b0-4ec5-9251-023656603eb1-20240829141514990.png\\",\\"https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/999b10db-dd13-4178-a3cf-a1c45afd72c1-20240829141527356.png\\",\\"https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/b8416349-c141-484b-aab0-354a0ff6dff8.png\\",\\"https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/595f2d35-5c60-4f1f-b5ed-8b44ea37a09f.png\\",\\"https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/29c43100-21d6-4166-888e-75f3ffcb9443.png\\",\\"https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/6100f518-506f-4e29-9f6f-74232b207c83.png\\",\\"https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/36df1016-832d-4d65-b02c-2fccef86609f-20240829141600521.png\\",\\"https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/c63c5b1f-adbd-4d7e-90d3-80f7568f1c62-20240829141610287.png\\",\\"https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/b86715b2-048f-4947-bcf7-abd7d4070a5a.png\\",\\"https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/3e1bb4f0-5790-4a1a-ac55-a4a2d63aedf9.png\\",\\"https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/701284e0-8a8a-4953-a5e6-e8e995580d33.png\\",\\"https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/image-20240829142157826.png\\",\\"https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/image-20240829142206545.png\\",\\"https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/51d6e4c5-0d4a-41ed-9ee3-e3e10000f7cc-20240829141642852.png\\",\\"https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/image-20240829142217367.png\\",\\"https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/1a38d1a5-ec3a-45e7-b353-8ce46393a75e.png\\",\\"https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/image-20240829142019324.png\\",\\"https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/image-20240829142030007.png\\",\\"https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/f3977d33-cfb6-4b05-99f8-88c29b752217.png\\",\\"https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/image-20240829142059238.png\\",\\"https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/image-20240829142108040.png\\",\\"https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/bb0bae5c-1532-49d5-987d-ae3d5a1a4f0a.png\\"],\\"dateModified\\":\\"2024-08-29T08:01:08.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Cutewr\\",\\"url\\":\\"https://cutewr.github.io\\"}]}"]]},"headers":[{"level":2,"title":"前言","slug":"前言","link":"#前言","children":[]},{"level":2,"title":"SpringBoot提供的内嵌容器","slug":"springboot提供的内嵌容器","link":"#springboot提供的内嵌容器","children":[{"level":3,"title":"Tomcat","slug":"tomcat","link":"#tomcat","children":[]},{"level":3,"title":"Jetty","slug":"jetty","link":"#jetty","children":[]},{"level":3,"title":"Undertow","slug":"undertow","link":"#undertow","children":[]},{"level":3,"title":"Netty","slug":"netty","link":"#netty","children":[]}]},{"level":2,"title":"使用","slug":"使用","link":"#使用","children":[]},{"level":2,"title":"源码解析","slug":"源码解析","link":"#源码解析","children":[{"level":3,"title":"查看调用链","slug":"查看调用链","link":"#查看调用链","children":[]},{"level":3,"title":"WebServer","slug":"webserver","link":"#webserver","children":[]},{"level":3,"title":"WebServerFactory","slug":"webserverfactory","link":"#webserverfactory","children":[]},{"level":3,"title":"获取WebServerFactory","slug":"获取webserverfactory","link":"#获取webserverfactory","children":[]},{"level":3,"title":"创建Web服务","slug":"创建web服务","link":"#创建web服务","children":[]},{"level":3,"title":"Undertow容器启动","slug":"undertow容器启动","link":"#undertow容器启动","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]}],"git":{"createdTime":1724918468000,"updatedTime":1724918468000,"contributors":[{"name":"Cutewr","email":"2574303446@qq.com","commits":1}]},"readingTime":{"minutes":8.8,"words":2641},"filePathRelative":"SpringBoot/SpringBoot内嵌web容器.md","localizedDate":"2024年8月29日","excerpt":"\\n<h2>前言</h2>\\n<p>今天分享一个SpringBoot的内嵌Web容器，在SpringBoot还没有出现时，我们使用Java开发了Web项目，需要将其部署到Tomcat下面，需要配置很多xml文件，SpringBoot出现后，就从繁琐的xml文件中解脱出来了，SpringBoot将Web容器进行了内嵌，我们只需要将项目打成一个jar包，就可以运行了，大大省略了开发成本，那么SpringBoot是怎么实现的呢，我们今天就来详细介绍。</p>\\n<h2>SpringBoot提供的内嵌容器</h2>\\n<p>SpringBoot提供了四种Web容器，分别为Tomcat，Jetty，Undertow，Netty。</p>","autoDesc":true}')}}]);