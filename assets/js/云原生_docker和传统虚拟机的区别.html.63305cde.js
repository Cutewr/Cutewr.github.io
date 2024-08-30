"use strict";(self.webpackChunkvuepress_theme_hope_template=self.webpackChunkvuepress_theme_hope_template||[]).push([[4023],{6262:(e,t)=>{t.A=(e,t)=>{const r=e.__vccOpts||e;for(const[e,o]of t)r[e]=o;return r}},9402:(e,t,r)=>{r.r(t),r.d(t,{comp:()=>g,data:()=>p});var o=r(641);const n=[(0,o.Fv)('<h1 id="docker和传统虚拟机的区别" tabindex="-1"><a class="header-anchor" href="#docker和传统虚拟机的区别"><span>docker和传统虚拟机的区别</span></a></h1><p>我有一个程序员朋友，他每年情人节都要送女朋友一台服务器。</p><p>他说：“谁不想在过节当天收到一台 4 核 8g 的服务器呢？”</p><p>“万一对方不要，我还能留着自己用。” 给他一次过节的机会，他能把<strong>浪漫</strong>玩的明明白白。 所以今年情人节，他自己一个人过。 太痛了，是那种<strong>布洛芬都不知道他哪里痛</strong>的痛。</p><p>虽然人跑了，但起码还有服务器陪着他，但屏幕前依然单身的你呢？ <strong>你连服务器都没有</strong>。 那么问题就来了，你买过服务器吗？看着云厂商各种产品是不是有点懵。 你知道 ecs，vps，docker 容器 是什么吗？它们有啥区别呢？</p><figure><img src="https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/1711119186413.jpeg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>我们今天来聊聊这个话题。</p><h2 id="物理服务器是什么" tabindex="-1"><a class="header-anchor" href="#物理服务器是什么"><span>物理服务器是什么？</span></a></h2><p>我的柜子里有一台大学时候用的废弃电脑，自带 cpu、 内存等硬件和操作系统，根据一些教程视频，是可以做成服务器的。 像这样一台看得见摸得着的机器，其实就是云厂商页面里提到的<strong>物理服务器</strong>或<strong>物理机</strong>。不同厂商叫法不同，有的厂商叫它<strong>独立服务器</strong>。 跟家里电脑不一样的是，云厂商的机器性能更好，核数更高，还有专业的机房和空调伺候着。 那既然这样，是不是就不需要买云厂商的服务器呢？ 糊涂啊，一台家用电脑跑起来 50 瓦，一年下来电费都好几百，还得花精力伺候着不让它关机，还真不如买别人家的划算。</p><p>但问题又来了，云厂商的物理服务器一般都是核数较高，很多时候我们根本不需要这么高配的机器。怎么办呢？ 这一点云厂商当然也考虑到了。</p><h2 id="vps-和-ecs-是什么" tabindex="-1"><a class="header-anchor" href="#vps-和-ecs-是什么"><span><a href="https://golangguide.top/%E6%9E%B6%E6%9E%84/%E4%BA%91%E5%8E%9F%E7%94%9F/%E6%A0%B8%E5%BF%83%E7%9F%A5%E8%AF%86%E7%82%B9/docker%E5%92%8C%E4%BC%A0%E7%BB%9F%E8%99%9A%E6%8B%9F%E6%9C%BA%E6%9C%89%E4%BB%80%E4%B9%88%E5%8C%BA%E5%88%AB.html#vps-%E5%92%8C-ecs-%E6%98%AF%E4%BB%80%E4%B9%88" target="_blank" rel="noopener noreferrer">vps 和 ecs 是什么</a></span></a></h2><p>云厂商一般会<strong>将一台物理服务器分割成多个虚拟机</strong>。它跟我们在 windows 用 <code>VMware</code>, <code>VirtualBox</code> 建的虚拟机其实是一回事。 每个虚拟机都拥有独立的操作系统、资源（比如 CPU、内存、存储空间）和公网 IP 地址。然后对外出售，这样的虚拟机就是所谓的 <strong>VPS</strong>（Virtual Private Server，虚拟专用服务器）。</p><p><img src="https://cdn.xiaobaidebug.top/1711119410663.jpeg" alt="VPS" loading="lazy"> 但传统 VPS 有个缺点，不支持用户<strong>自主升降级</strong>，它的资源是预先分配的，不易动态调整。 举个例子，假设你买了 <code>1c1g</code> 的服务器，想在页面上点点两下升级成 <code>2c2g</code>，这在传统 VPS 里是不支持的。 如果给 VPS 加入自主升降级的功能，那它就成了 <strong>ECS</strong>（Elastic Compute Service，弹性计算服务）</p><p><img src="https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/1711119422323.jpeg" alt="ECS支持自主升降级" loading="lazy"> 用户可以根据需要随时调整 CPU、内存、磁盘和带宽，主打一个&quot;<strong>弹性</strong>&quot;。 我们可以利用 ecs 学习 linux 命令，部署个人博客，做私人云盘存储，甚至可以将自己做的游戏部署到 ecs 上邀请朋友来玩。</p><figure><img src="https://cdn.xiaobaidebug.top/1711119454512.jpeg" alt="ecs的用途" tabindex="0" loading="lazy"><figcaption>ecs的用途</figcaption></figure><h2 id="docker-容器-是什么" tabindex="-1"><a class="header-anchor" href="#docker-容器-是什么"><span>docker 容器 是什么</span></a></h2><p>买了 ecs 后，我们一般会开始部署自己的软件应用。机器少的时候手动部署问题不大，机器多了后各种问题就来了，其中最明显的就是，ecs 之间，如果<strong>底层操作系统</strong>不同，比如有些是 <code>ubuntu</code>，有些是 <code>centos</code>，部署应用的时候就会有各种环境问题。如果能让软件带着操作系统环境一起去部署就好了，最简单的方案是将软件和操作系统一起打包成虚拟机部署在 <code>ecs</code> 中。 但这样就成了在 ECS（也就是虚拟机）中再运行一个完整的虚拟机，<strong>太重了</strong>。有解法吗？</p><p><img src="https://cdn.xiaobaidebug.top/1711119500323.jpeg" alt="虚拟机上再运行一个虚拟机" loading="lazy">有。既然多加一个操作系统太重，那我就只打包<strong>软件和系统依赖库加配置</strong>就好了。然后将这部分系统文件挂到 ecs 的操作系统下，利用一个叫 <strong>Namespace</strong> 的能力让它看起来就像是一个独立操作系统一样。再利用一个叫 <strong>Cgroup</strong> 的能力限制它能使用的计算资源。这就省掉了一层笨重的操作系统，同时还让软件轻松跑在各类操作系统上。这就是我们常说的 <strong>Docker 容器技术</strong>。</p><p><img src="https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/1711119525638.jpeg" alt="Docker容器是什么" loading="lazy"> 总的来说就是，<strong>物理服务器上跑 ecs，ecs 跑 Docker 容器。多个 Docker 容器共享一个 ecs 实例 操作系统内核</strong>。</p><figure><img src="https://cdn.xiaobaidebug.top/1711119547688.jpeg" alt="ecs和docker容器的关系" tabindex="0" loading="lazy"><figcaption>ecs和docker容器的关系</figcaption></figure><h2 id="服务器怎么选" tabindex="-1"><a class="header-anchor" href="#服务器怎么选"><span>服务器怎么选</span></a></h2><p>现在我们了解完他们的区别了，但服务器款式那么多，我们怎么选？ 如果你是小公司老板或个体创业者，想要好一点的物理机又不想自建机房，那可以考虑买独立服务器。</p><p>如果你是像我一样的个人开发者，或者是学生，那无脑冲云服务器 ecs。 有了它，我们可以很方便的在上面部署 docker 容器，平时做做实验，部署博客，完全够用了。</p><figure><img src="https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/1711119585064.jpeg" alt="容器里跑应用" tabindex="0" loading="lazy"><figcaption>容器里跑应用</figcaption></figure><p>这时候问题很多的小明就要问了，为什么不选择大厂商的云服务器？是用不起吗？ 喂喂喂，怎么说话呢？ <strong>不是大厂云服务器用不起，而是小厂商的更有性价比</strong>。 就以同样是香港 1 核 1g 的 ecs 为例，比如我用的莱卡云，一个月只要 1 碗红烧牛肉面。大厂商则要 3 碗。</p><p>同样是 24 核物理服务器，小厂商千把块搞定，大厂商就是它的好几倍。</p><p>这省下来的钱，能买多少份 <strong>19 块 9</strong> <code>5条</code>的南极人内裤？</p><p>这时候问题很多的小明就又要问了，为什么要选<strong>香港服务器</strong>？大陆的不是更便宜吗？ 那是因为香港服务器没有备案的烦恼，而且大陆也能轻松访问，有时候一些热点技术一出来，比如时下火热的 ai 技术，网站越快上线就能越早拿到搜索引擎排名，备案得等个把月，这一等就白白错失了很多成为下一个马总的机会。</p><p>转自：<a href="https://golangguide.top/" target="_blank" rel="noopener noreferrer">golang全栈指南</a></p>',29)],a={},g=(0,r(6262).A)(a,[["render",function(e,t){return(0,o.uX)(),(0,o.CE)("div",null,n)}]]),p=JSON.parse('{"path":"/%E4%BA%91%E5%8E%9F%E7%94%9F/docker%E5%92%8C%E4%BC%A0%E7%BB%9F%E8%99%9A%E6%8B%9F%E6%9C%BA%E7%9A%84%E5%8C%BA%E5%88%AB.html","title":"docker和传统虚拟机的区别","lang":"zh-CN","frontmatter":{"date":"2024-08-29T00:00:00.000Z","category":["云原生"],"tag":["docker"],"description":"docker和传统虚拟机的区别 我有一个程序员朋友，他每年情人节都要送女朋友一台服务器。 他说：“谁不想在过节当天收到一台 4 核 8g 的服务器呢？” “万一对方不要，我还能留着自己用。” 给他一次过节的机会，他能把浪漫玩的明明白白。 所以今年情人节，他自己一个人过。 太痛了，是那种布洛芬都不知道他哪里痛的痛。 虽然人跑了，但起码还有服务器陪着他，但...","head":[["meta",{"property":"og:url","content":"https://cutewr.github.io/%E4%BA%91%E5%8E%9F%E7%94%9F/docker%E5%92%8C%E4%BC%A0%E7%BB%9F%E8%99%9A%E6%8B%9F%E6%9C%BA%E7%9A%84%E5%8C%BA%E5%88%AB.html"}],["meta",{"property":"og:site_name","content":"首页"}],["meta",{"property":"og:title","content":"docker和传统虚拟机的区别"}],["meta",{"property":"og:description","content":"docker和传统虚拟机的区别 我有一个程序员朋友，他每年情人节都要送女朋友一台服务器。 他说：“谁不想在过节当天收到一台 4 核 8g 的服务器呢？” “万一对方不要，我还能留着自己用。” 给他一次过节的机会，他能把浪漫玩的明明白白。 所以今年情人节，他自己一个人过。 太痛了，是那种布洛芬都不知道他哪里痛的痛。 虽然人跑了，但起码还有服务器陪着他，但..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/1711119186413.jpeg"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-08-30T05:12:21.000Z"}],["meta",{"property":"article:author","content":"Cutewr"}],["meta",{"property":"article:tag","content":"docker"}],["meta",{"property":"article:published_time","content":"2024-08-29T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-08-30T05:12:21.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"docker和传统虚拟机的区别\\",\\"image\\":[\\"https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/1711119186413.jpeg\\",\\"https://cdn.xiaobaidebug.top/1711119410663.jpeg\\",\\"https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/1711119422323.jpeg\\",\\"https://cdn.xiaobaidebug.top/1711119454512.jpeg\\",\\"https://cdn.xiaobaidebug.top/1711119500323.jpeg\\",\\"https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/1711119525638.jpeg\\",\\"https://cdn.xiaobaidebug.top/1711119547688.jpeg\\",\\"https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/1711119585064.jpeg\\"],\\"datePublished\\":\\"2024-08-29T00:00:00.000Z\\",\\"dateModified\\":\\"2024-08-30T05:12:21.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Cutewr\\",\\"url\\":\\"https://cutewr.github.io\\"}]}"]]},"headers":[{"level":2,"title":"物理服务器是什么？","slug":"物理服务器是什么","link":"#物理服务器是什么","children":[]},{"level":2,"title":"vps 和 ecs 是什么","slug":"vps-和-ecs-是什么","link":"#vps-和-ecs-是什么","children":[]},{"level":2,"title":"docker 容器 是什么","slug":"docker-容器-是什么","link":"#docker-容器-是什么","children":[]},{"level":2,"title":"服务器怎么选","slug":"服务器怎么选","link":"#服务器怎么选","children":[]}],"git":{"createdTime":1724942632000,"updatedTime":1724994741000,"contributors":[{"name":"Cutewr","email":"2574303446@qq.com","commits":3}]},"readingTime":{"minutes":5.57,"words":1671},"filePathRelative":"云原生/docker和传统虚拟机的区别.md","localizedDate":"2024年8月29日","excerpt":"\\n<p>我有一个程序员朋友，他每年情人节都要送女朋友一台服务器。</p>\\n<p>他说：“谁不想在过节当天收到一台 4 核 8g 的服务器呢？”</p>\\n<p>“万一对方不要，我还能留着自己用。”\\n给他一次过节的机会，他能把<strong>浪漫</strong>玩的明明白白。\\n所以今年情人节，他自己一个人过。\\n太痛了，是那种<strong>布洛芬都不知道他哪里痛</strong>的痛。</p>\\n<p>虽然人跑了，但起码还有服务器陪着他，但屏幕前依然单身的你呢？\\n<strong>你连服务器都没有</strong>。\\n那么问题就来了，你买过服务器吗？看着云厂商各种产品是不是有点懵。\\n你知道 ecs，vps，docker 容器 是什么吗？它们有啥区别呢？</p>","autoDesc":true}')}}]);