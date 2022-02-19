---
title: 卷积网络参数及计算量估计
category: Thesis
tag:
  - thesis note
time: 2021-12-13
---

## 概念
- FLOPS：注意全大写，是floating point operations per second的缩写，意指每秒浮点运算次数，理解为计算速度。是一个衡量硬件性能的指标。
- FLOPs：注意s小写，是floating point operations的缩写（s表复数），意指浮点运算数，理解为计算量。可以用来衡量算法/模型的复杂度。
- MAC：乘法和加法

## 卷积层
- C~i~：输入通道数
- C~o~：输出通道数
- HxW：特征图大小
- KxK：卷积核大小
$$FLOPs = (2 \times C_i \times K^2 -1) \times H \times W \times C_o$$  
2是因为一个MAC算2个operations。不考虑bias时有-1，有bias时没有-1。
$$Parameters = C_i \times K^2 \times C_o$$

## 全连接层
- I：输入神经元数
- O：输出神经元数
$$FLOPs = (2 \times I -1) \times O$$
$$Parameters = O \times I$$

## LSTM
- E：词向量维度
- H：隐藏状态数, 也就是LSTM有多少cell
- 4：四个非线性变换块，3个门+1个tanh
- 2：MAC
$$FLOPs = (E+H) \times H \times 4 \times 2$$