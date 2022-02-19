---
title: 观察者模式--Observer
author: Leonhardt
category: SoftwareEngineering
tag:
  - design pattern
sidebarDepth: 1
sticky: false
star: false
time: 2022-02-07
---

## 定义
定义对象间的一种一对多依赖关系，使得每当一个对象状态发生改变时，其相关依赖对象皆得到通知并被自动更新。观察者模式又叫做发布-订阅（Publish/Subscribe）模式、模型-视图（Model/View）模式、源-监听器（Source/Listener）模式。

## 理解
被观察者实现IObservable接口，包含基本的Add(),Remove(),Notify()方法用于注册观察者，移除观察者，和在状态发生变化时，通知观察者。Notify()实际上是调用了观察者的Update()方法。观察者IObserver接口中只要一个方法Update()，用于响应被观察者发生的变化。

一个比较好的实践为，在IObserver的具体实现类中，保存一个IObservable的引用。

## 类图

```class
direction BT
IObservable --> "many" IObserver
ConcreteObservable ..|> IObservable
ConcreteObserver ..|> IObserver
ConcreteObserver --> ConcreteObservable

class IObservable {
    <<interface>>
    + AddObserver() void
    + RemoveObserver() void
    + Notify() void
}

class IObserver {
    <<interface>>
    + Update() void
}

class ConcreteObservable {
    - Set~T~ observers

    + AddObserver() void
    + RemoveObserver() void
    + Notify() void
}

class ConcreteObserver {
    - IObservable ob

    + Update() void
}

```