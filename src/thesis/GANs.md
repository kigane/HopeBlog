---
icon: page
title: GANs
author: Leonhardt
category: Thesis
tag:
  - thesis note
  - GAN
sidebarDepth: 1
sticky: false
star: false
time: 2022-02-22
---

## DCGAN

### Approach
- all convolution net: 不使用常用的确定性池化，改用步长为2的卷积让模型学到适合自己的下采样。
- 去掉了全连接层
- BN: 在所有层后加BN，会使模型不稳定。去掉G的输出层，和D的输入层后的BN后可以避免该问题。
- ReLU in Generator except for the output layer which use Tanh
- LeakyReLU in Discriminator
