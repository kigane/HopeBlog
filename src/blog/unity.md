---
title: 黑魂复刻
author: Leonhardt
category: GameEngine
tag:
  - unity
sidebarDepth: 1
sticky: false
star: false
time: 2022-01-24
---

## 玩家输入

### 统一输入
为了统一键盘和手柄等输入，抽象出一个信号概念。
- Dup 上下信号
- Dright 左右信号

### 衰减
Mathf.SmoothDamp(float current, float target, ref float currentVelocity, float smoothTime, float maxSpeed = Mathf.Infinity, float deltaTime = Time.deltaTime)
- current: 平滑的当前值
- target： 目标值
- smoothTime: 经过多长时间达到目标值
- currentVelocity：变化的速度，一阶导数

### 使能标志
控制模块的激活与禁用。在脚本内用一个bool变量控制。

### 1D Blend Tree
- 在Animator中右键create->from blend tree，创建一个blend tree，双击进入。  
- 默认有一个参数，控制在两个动画之间的平滑变化。  
- 在Motion List中加入要混合的两个动画
- threshold表示变化的起止位置
- threshold旁边的参数为每个动画的播放速度

### 连接玩家输入和动画控制器
anim.SetFloat("Forward", pi.Dup);

### 移动
- 使用Dup和Dright的和组成移动的方向movingVec，并用此值修改模型的朝向。
- 使用Dup和Dright的和模控制移动速度。一个问题：斜向速度更快
- 用rigid.velocity控制移动时，要注意movingVec没有y轴分量，需要使用原来的值。
- rigidbody要在FixedUpdate中更新

### 解决trigger累积的问题
在Animator中使用trigger会有一个问题，如果触发两次以上的SetTrigger，会消耗一个并累积一个，结果造成第二次过渡。  

解决方法是在状态上添加一个脚本，在OnStateEnter和OnStateExit上清除累积的trigger。

为了尽量将功能放在顶级游戏对象的组件中，使用SendMessage将具体的处理逻辑延迟到接受Message的方法中。

::: tip 提示
SendMessage():只发送到所在的GameObject
SendMessageUpwards():发送到所在的GameObject和其所有的父对象。
:::

## 动画
- make transition到子状态机，进入子状态机后，会转到子状态机的Entry。
- make transition到子状态机内的某个状态，则会从子状态机的(Up)XXLayer状态转过去。
- make transition到子状态机内的exit，意味着退出子状态机，转到上一层状态机的Entry。(可以减少一条线哦)

## 模型出现章鱼一样的情况
- avatar不对
- unity没有识别出模型中的一些额外的骨骼。解决方法是，将额外的骨骼塞到同级的骨骼下。