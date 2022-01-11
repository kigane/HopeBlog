---
icon: page
title: DenseNet
author: Leonhardt
category: Thesis
tag:
  - thesis note
sidebarDepth: 1
sticky: false
star: false
time: 2022-01-07
---

## 要点
- 在每一个block内，每一层特征图的输入都包含前面所有层的特征图，其输出也会传递到后续所有层的输入中。
- 不像ResNet一样，特征图是通过逐元素相加合并的。DenseNet的处理方式是将所有输入拼接起来。
- DenseNet的参数更少，计算效率更高。原因是其架构允许其输出较窄的特征图(每一层的输出通道数k可以很小，如k=12)。
- 为什么有效
    - CNN的特征图可能包含两部分，一部分用于保存来自前面层的关键特征，一部分用于产生新的特征。ResNet等CNN架构的特征传递是逐层传递的，保存的特征逐层增加且都要复制到下一层，效率较低。DenseNet直接将每一层的特征都传入后续所有层，因此，每一层只需要计算新的特征即可，需要保存的特征可以重用之前的计算结果，因此DenseNet的特征图可以很窄，且计算效率更高。
    - DenseNet每一层都连接到最后的输出，即和loss函数直接相连，相当于一个隐式的Deep Supervision?

## 架构