---
icon: page
title: 神经网络风格迁移(Neuron Style Transfer)
author: Leonhardt
category: Thesis
tag:
  - StyleTransfer
sidebarDepth: 1
sticky: false
star: false
time: 2022-04-22
---

## 开端

> Texture Synthesis Using Convolutional Neural Networks --Leon A. Gatys  

核心思想是在图像经过预训练的VGG网络时的特征表达(feature map)上计算Gram矩阵，得到的Gram矩阵可以很好地表示大多数纹理。  
Gram矩阵的计算方式是先将预训练VGG某一层的特征表达 F(I) 由 $R^{C\ast H\ast W}$ reshape 成 $R^{C\ast HW}$ ，然后用reshape后的特征表达和其转置矩阵相乘 $F(I)\ast F(I)^T$，最后得到的Gram矩阵维度为 $R^C\ast R^C$  

在CNN中，内容(content)和风格(style)的解耦是可能的。VGG是关键。

### 内容
输入一张真实图片，经过VGG网络，到28x28左右停止，得到图片的特征图，并reshape成一个一维向量。  
输入一张高斯噪音图片，同样喂进VGG，到28x28左右停止，得到特征图，并reshape成一个一维向量。  
用简单的MSE计算两个特征向量的loss。用这个loss优化输入图片，随着loss降低，高斯噪音图片内容会逐渐向真实图片靠拢。

### 风格/纹理
输入一张风格图片，经过VGG网络,提取器每个stage的第一个卷积的特征图，分别计算出Gram矩阵。
输入一张高斯噪音图片，经过VGG网络,提取器每个stage的第一个卷积的特征图，分别计算出Gram矩阵。
用简单的MSE计算两个特征向量的loss。用这个loss优化输入图片，随着loss降低，高斯噪音图片内容会逐渐向风格图片靠近。

### 合起来
将两种loss加权合起来优化，即可实现风格迁移

## AdaIN
Conditional IN: 网络可以用同样的卷积参数产生完全不同风格的图像，只要在IN时应用不同的仿射参数(ax+b中的a,b, x是标准化到N(0,1)的内容图像)。

Demystifying Neural Style Transfer --Yanghao Li:最小化重建结果图和风格图的Gram统计量差异其实等价于最小化两个域统计分布之间的基于二阶核函数的MMD。换言之，风格迁移的过程其实可以看做是让目标风格化结果图的特征表达二阶统计分布去尽可能地逼近风格图的特征表达二阶统计分布。由此可以很自然地想到，既然是衡量统计分布差异，除了有二阶核函数的MMD外，其他的MMD核函数例如一阶线性核函数、高阶核函数、高斯核函数，也可能达到和Gram统计量类似的效果。实验证明也确实如此。这些计算风格特征的方式其实都是在特征表达（feature map）的所有channel上进行计算的。  
==>风格迁移实质是一种图像之间的神经网络特征图的分布对齐过程。

Arbitrary Style Transfer in Real-time with Adaptive IN: 只要在IN时应用风格图像的均值和方差作为仿射参数就能实现风格迁移。



