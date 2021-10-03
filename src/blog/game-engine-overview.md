---
title: 游戏引擎总览
lang: zh-CN
sidebarDepth: 2
---

## 典型的游戏团队结构

* engineers
    * runtime programmer: engine&game
    * tools programmer: offline tools for whole team
* artists
    * Concept artists: 概念设计
    * 3D modelers: 建模师
        * foreground modelers: 人物，武器，交通工具等
        * background modelers: 静态背景几何体，如高楼，桥等
    * Texture artists: 纹理艺术家
    * Lighting artists: 光照艺术家，调整光照以最大化艺术和情感上的冲击
    * Animators: 动画师
    * Motion capture actors: 动捕演员，提供粗略的运动数据供动画师整理和调整
    * Sound designers: 将音效和音乐混入游戏
    * Voice actors: 角色声优
    * composers: 作曲家，负责配乐
* game designers: gameplay 设计师，负责用户体验部分
    * 宏观层面： 故事走向，人物和关卡的安排，玩家的宏观的目标和终点
    * 微观层面： 场景设计，关卡设计，谜题设计
    * writers: 编剧
* producers: 在不同工作室中的职能不尽相同
    * 有些负责日程安排和人力资源管理
    * 有些负责游戏设计
    * 也可能会负责团队之间(如开发部门和商业部门)的联系
    * 小工作室可能不需要
* management&support staff
    * 执行管理
    * 市场
    * 行政
    * IT
* Publisher and Studio
    * 发行商：负责游戏的营销，生产和发行，如EA,Nitendo, Sony等
    * 游戏工作室
        * 独立的，不依附于发行商，做好游戏后交给发行商发行，价格详谈。
        * 依附于发行商的
        * 第一方的：为特定平台开发游戏，如Naughty Dog 是 Sony 的第一方工作室。

## 什么是游戏？

Koster断言，游戏“乐趣”的核心在于“学习(learning)”和“掌握(mastering)”,就像笑话只有在你“懂了(get-it)”的时候才有趣。

### soft real-time interactive agent-based computer simulations.
* simulations: 对现实世界(即使是想象中的现实)的近似和简化。
* agent-based: 有大量不同的实体(entity/agent)交互
* interactive -- interactive temporal simulations: 交互式时间模拟。游戏状态随着时间的变化而不断改变，并对无法预测的输入作出响应。
* real-time: 所有实时系统的核心都是"deadline"。例如
    * 大多数游戏渲染的帧率为30/60帧每秒。(NTSC指定的显示器刷新率为29.97帧每秒)
    * 电影的帧率至少为24帧每秒。(使用3:2 pulldown，即让两个电影帧，一帧占3个视频帧，另一帧占2个视频帧)
    * 物理模拟要保持稳定，一秒要计算120次。
    * 角色AI至少一秒运行一次
    * 音频也要每1/60 s调用一次以保持audio buffer充满，防止听觉故障。
* soft: 表示即使错过了deadline也不会带来灾难性的后果。与之相反的是hard real-time system ，如直升机的航空电子系统，核电站的控制杆系统。一旦错过deadline，操作者可能会死。

### 游戏中的数学模型
分析型：有闭式公式。可以求得任意时刻的状态。只能解决一小部分问题。   
数值型：通过不断求导等方法，估计离散点的数值。

通常在一个游戏循环中，每次迭代都有机会进行物理系统，AI，游戏逻辑的计算，最后根据计算结果进行渲染。

## 什么是游戏引擎？

!["game-engine-reusability-gamut"](/assets/img/game-engine-reusability-gamut.png)

游戏引擎与游戏的区别在于数据驱动的架构。固定的部分越多，就越难修改为其他的游戏。就越接近游戏而非游戏引擎。
另外，一个游戏引擎或中间件越泛用，对于特定的游戏或平台，其最优性就越低。这很容易理解，每个软件在设计的时候都需要权衡(trade-off)，权衡的基准就是软件将会如何被使用或将在哪个平台运行。
即使现在游戏引擎越来越强大，一般性与最优性的权衡仍然存在。所以顶尖的游戏工作室都会使用自研引擎。

## 不同类型游戏的游戏引擎的区别

### FPS

通常FPS游戏目标是给玩家沉浸在充满细节，高度写实的世界中的感觉。是所有游戏类型中技术挑战最大的。毫不意外的是，游戏行业的大型技术创新都是出于FPS游戏。

FPS游戏需要的典型技术有
* 高效渲染大型3D虚拟世界
* 响应式的镜头控制和瞄准机制
* 高保真的人物肢体动画和武器动画
* 大量可持有的武器
* 人物移动和碰撞模型(可能会产生漂浮感)
* NPC的AI和动画
* 小规模多人对战，死亡竞技模式

FPS游戏中的渲染技术需要高度优化且根据所处环境仔细调整。例如室内和室外环境，渲染技术大不相同，室外渲染优化通常需要遮挡剔除，离线游戏世界区域化(即手动或自动指定从源区域可以看到哪些目标区域)。

当然，为了沉浸感，需要的远不止高质量的图像优化技术，角色动画，音效，音乐，刚体物理，游戏运镜等等都要使用非常前沿的技术。

### 平台游戏和其他第三人称游戏

与FPS相比，更重视人物整体的动画，而非漂浮的手(洗手液战神Eason:rofl:)。主角也通常是更偏卡通风格，分辨率不用太高类人型角色，有丰富的动作和动画。

需要的典型技术有
* 移动的平台，梯子，绳子，齿轮和其他有趣的移动方式
* 带有谜题性质的环境元素
* 相机跟随玩家，且视角可变
* 复杂的相机碰撞系统，保证视点不会卡进背景几何体或动态前景物体。

### 格斗游戏

技术要点
* 丰富的战斗动画
* 精确的击打检测(hit detection)
* 检测用户输入的复杂按键
* 相对静态的背景人群

可以用到更高技术水平的特色有
* 高清人物
* 真实的皮肤渲染，表面散射和流汗效果
* photo-realistic lighting 和粒子效果
* 高保真角色动画
* 基于物理的衣服效果，头发模拟

### 竞速游戏

典型技术
* 大量用于处理远景的"技巧"，如用远处的山，树用二维卡片代替
* 赛道通常会分解为二维的区域(sector)以帮助决定可见区域和AI的自动寻路
* 相机通常处在载具后或驾驶座
* 当赛道进入非常狭小的空间时，需要作出很大的努力来保证相机不与背景几何体碰撞

### 策略游戏

通常视角固定，对与渲染优化是个好消息。世界通常是基于网格构建的。

典型技术
* 同屏可显示大量单位，从而分辨率会相当低
* 游戏设计和游玩的画布通常是Height-field terrain :confused:
* 玩家通常可以在领土中建造建筑和军队
* 单位的选取方式要多样

### MMOG

服务器。

### VirtualReality,AugumentedR,MixedR

VR的难点
* 立体渲染，同一帧画面要渲染两次(左右眼)
* 需要高帧率，至少90帧，否则会引发人体不适
* 导航问题，在虚拟现实世界中如何移动？原地踏步？WSAD？手柄？

其他略

## 有名的游戏引擎

Quake/Quake2
[Quake2 源码](https://github.com/id-Software/Quake-2)  
架构合理且干净，但可能有点过时，且几乎是用纯C语言写的。
如果有Quake2游戏，非常推荐下载源码来跑跑，设置断点来分析引擎如何工作。

Unreal Engine
开放，开源。不多说。

Source Engine
Half-Life系列使用的引擎。

DICE的Frostbite引擎
质量效应，星球大战：前线2，龙腾世纪，极品飞车(Need for Speed)系列

Rockstar Advanced Game Engine(RAGE)
给他爱系列。荒野大镖客系列。

CryEngine
Far Cry等

Sony的PhyreEngine

微软的 XNA Game Studio，2014年没了

Unity
Unity的设计初衷是简化开发和跨平台。
代表作杀出重围，空洞骑士，茶杯头。

## 开源引擎列表
* [Quake2](https://github.com/id-Software/Quake-2)
* [OGRE 一个架构好，易学易用的3D渲染引擎](https://www.ogre3d.org/)
* [Panda3D a script-based engine，设计用于快速方便的制作3D游戏原型和虚拟世界](https://www.panda3d.org/)
*  Crystal Space is a game engine with an extensible modular architecture.

## 运行时引擎架构
游戏引擎是个巨大的软件系统。通常是一层层(layers)构建的，且上层依赖于下层。

![game-engine-archtecture](/assets/img/game-engine-archtecture.png)

### 目标硬件
Windows,Linux,MacOS-PC，移动平台，PSV，PS4，PS5，Switch，Wii，NDS，XBOX等等。

### 设备驱动
管理硬件资源并为操作系统和引擎上层屏蔽无数的硬件设备细节。

### 操作系统
操作系统上通常运行着多个程序(分时抢占式多任务)，这意味着PC游戏永远无法假设它能完全控制硬件，故必须保证它能与系统中的其他程序一起“play nice”。
现在的游戏机上也有操作系统了。开发逐渐趋近于PC。

### 第三方SDK(software development kits)和中间件(Middleware)
大多数引擎都利用了大量第三方SDK和中间件，SDK提供的功能或类接口经常被叫做API。

#### 数据结构和算法
任何软件的开发都离不开容器和算法。常用的第三方库有
* [Boost](https://www.boost.org/)
* Folly:扩展C++标准库和Boost，注重最大化代码性能
* Loki：强大的泛型模板编程库

#### 图形
* OpenGL
* DirectX
* Vulkan
* libgcm
* ...

#### 碰撞和物理
* Havok
* PhysX
* ODE(Open Dynamic Engine)

#### 角色动画
* Granny：作者认为设计最好，API也最符合逻辑的库。处理速度也快。
* Havok Animation
* OrbisAnim
* Endorphin and Euphoria:使用真实的人类移动生物力学模型来模拟人物移动

### 平台无关层

将更底层的API封装一层成为你的游戏引擎更上层使用的API。以屏蔽平台底层的差异。另外，以后要将某个功能的实现库换了，如物理/碰撞检测的库，上层的代码也不用动。

### 核心系统

游戏引擎是一个巨大且复杂的C++应用，需要一系列有用的软件工具，我们将其分类为核心系统(core system)。  

典型的核心系统层见架构图。

核心系统层通常提供的工具，例如
* 断言(Assertion)：用于检查代码的逻辑错误和违反程序员意图的行为。通常不会出现在最终的游戏产品中。
* 内存管理(Memeory management)：几乎每个游戏引擎都会实现自身的内存分配系统以保证高速内存分配和限制内存碎片的副作用。
* 数学库：通常需要提供高效的向量和矩阵运算，四元数旋转，三角学，直线的集合操作，光线，球体等，齿轮操作(spline manipulation)，数值计算，解方程组等等。
* 自定义数据结构和算法：主要是为了最小化或消除动态内存分配并保证在目标平台上的最优运行时性能。


### 资源管理器
为获取所有类型的游戏资源(game assets)和游戏入数据提供统一的接口。有些引擎以高度中心化和一致的方式管理资源，如Unreal的package，OGRE和ResourceManager类。其他一些引擎采取一种临时的方式 ，将资源的处理留给游戏程序员，让程序员可以直接访问硬盘上的原文件或压缩包中的文件，如Quake的PAK文件。典型结构见架构图。

### 渲染引擎

游戏引擎中最大，最复杂的组件。渲染器的架构方法多种多样，且目前没有统一的标准。

#### 底层渲染器(low-level renderer)
包含所有引擎的所有原始渲染能力。在这一层，设计目标主要是尽可能快地渲染一系列几何图元，不考虑其在场景中是否可见。这个组件可以细分为大量子组件，例如
* 图形设备接口(Graphics Device Interface):图形SDK，如DirectX，OpenGL，Vulkan等的使用都需要大量的代码，包括初始化，资源获取和绑定等等。典型的用于处理这些的组件称为GDI(每个引擎的术语可能不同)。
* 其他：光照，纹理，视口，几何图元的提交，材质，相机等等。

#### 剔除优化(Culling Optimization)/场景图(Scene Graph)
用于根据某种可见性判断标准来限制需要渲染的图元数量。对于小型的世界，最简单的frustum cull，即将相机视锥外的图形剔除。对大型的世界，需要更高级的数据结构spatial subdivision来提高渲染效率，通过spatial subdivision可以非常快速的确定潜在可见物体集(the Potentila Visiable Set of Object, PVS)。