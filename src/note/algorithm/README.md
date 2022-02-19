---
title: UML类图简介
author: Leonhardt
category: SoftwareEngineering
tag:
  - design pattern
sidebarDepth: 1
sticky: false
star: false
time: 2022-02-06
---

## 类的表示
- 类名
    - `<<Interface>>`
    - `<<abstract>>`
    - `<<Service>>`
    - `<<enumeration>>`
- 数据: 保护级别+类型+变量名
    - 保护级别：public +, protected #, private -, package/internal ~
- 方法: 保护级别+方法名(参数)+返回值

```class
Duck

class Duck {
    <<Interface>>
    - int weight
    + Quark() void
}
```

## 关系
### 泛化关系(generalization)
- 类的继承结构表现在UML中为：泛化(generalize)与实现(realize)
- 继承关系为 is-a 的关系，两个对象之间如果可以用 is-a 来表示，就是继承关系
- 最终代码中，泛化关系表现为继承非抽象类
- 用实线+三角箭头表示，mermaid.js中用`<|--`表示

### 实现关系(realize)
- 最终代码中，实现关系表现为继承抽象类
- 用虚线+三角箭头表示，mermaid.js中用`..|>`表示

### 聚合关系(aggregation)
- 用于表示实体对象之间的关系，表示整体由部分构成的语义
- 与组合关系不同的是，整体和部分不是强依赖的，即使整体不存在了，部分仍然存在。如打工人和公司
- 用实线+空心菱形箭头表示，mermaid.js中用`o--`表示

### 组合关系(composition)
- 用于表示实体对象之间的关系，表示整体由部分构成的语义
- 整体和部分是强依赖的，整体不存在了，部分也就不存在了。如公司和部门
- 用实线+实心菱形箭头表示，mermaid.js中用`*--`表示

### 关联关系(association)
- 它一般用来定义对象之间静态的、天然的结构
- 关联关系默认不强调方向，表示对象间相互知道
- 用一条直线表示，mermaid.js中用`--`表示，强调方向用`-->`表示
- 在最终代码中，关联对象通常是以成员变量的形式实现的

### 依赖关系(dependency)
- 描述一个对象在运行期间会用到另一个对象的关系
- 与关联关系不同的是，它是一种临时性的关系，通常在运行期间产生，并且随着运行时的变化； 依赖关系也可能发生变化
- 双向依赖是一种非常糟糕的结构，我们总是应该保持单向依赖，杜绝双向依赖的产生
- 用虚线+箭头表示，mermaid.js中用`..>`表示
- 在最终代码中，依赖关系体现为类构造方法及类方法的传入参数，箭头的指向为调用关系
