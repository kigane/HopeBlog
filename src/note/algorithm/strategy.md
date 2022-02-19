---
title: 策略模式--Strategy
author: Leonhardt
category: SoftwareEngineering
tag:
  - design pattern
sidebarDepth: 1
sticky: false
star: false
time: 2022-02-06
---

## 定义
定义一系列算法，将每一个算法封装起来，并让它们可以相互替换。

## 理解
继承是个强大的技巧，但很多情况下并不需要使用继承，或者继承不够好。   
**继承只能在不同类层级之间共享**，子类在父类的基础上修改。而没有办法在相同层级进行共享。  
例如，同意父类的6个子类，都有一个方法各不相同。但又有一个方法是3个子类一组，组间不同，组内相同的。继承方法无法共享，只能将相同的代码重复3遍。

策略模式通过多态机制，可以很好的实现这种**同级共享**。具体来说，**将方法抽象为接口，不同的实现封装为不同的实体类**。原来拥有方法的类，现在持有抽象的接口，通过构造函数或Setter方法传入不同的实体类就可以让该类表现出不同的行为。

## 类图
```class
Client --> IStrategy
IStrategy <|.. CommonStrategy
IStrategy <|.. AmazingStrategy

class Client{
    - IStrategy strategy
    + Strategy() void
    + SetStrategy(IStrategy s) void
}

class IStrategy{
    <<Interface>>
    + Strategy() void
}

class CommonStrategy{
    + Strategy() void
}

class AmazingStrategy{
    + Strategy() void
}
```