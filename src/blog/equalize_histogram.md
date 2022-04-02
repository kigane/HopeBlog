---
title: 直方图均衡化
category: CV
tag:
  - DIP
time: 2021-12-05
---

## 总览
- 提高全局对比度，在图像灰度集中于某个小区域时效果尤为明显
- 直方图均衡化将集中在一起的灰度像素值打散到全灰度级上来获得**对比度的增强**
- 适合处理曝光不足的照片和骨骼的x-ray图像，热力图，卫星图
- 是可逆的，需要知道直方图均衡化函数
- 一个缺点是对背景噪音和有用的信号一视同仁
- 会使图像产生不真实感
- 会丢失一些细节，因此不用于分析环节，仅用于显示。
- 对低color depth的图像，会进一步降低其color depth
- 改进，在提高对比度的同时不改变灰度的均值和避免细节上的损失
    - adaptive histogram equalization
    - contrast limiting adaptive histogram equalization (CLAHE)
    - multipeak histogram equalization (MPHE)
    - multipurpose beta optimized bihistogram equalization (MBOBHE)

## 具体算法
- 计算图像的hist直方图，即每个灰度有多少像素
- 计算hist的cumsum()，即cdf
- 用cdf当权值在目标RANGE内进行插值。
  - $h ( v ) = round( \frac { \operatorname { cdf } ( v ) - \operatorname { cdf } _ { min } } { H\times W- \operatorname { cdf } _ {min} } \times ( L - 1 ) )$
  - cdf~min~代表灰度最低像素的个数
  - HxW为图像像素总数
  - L为灰度级，通常为256

## python实现

```python
TODO
```
