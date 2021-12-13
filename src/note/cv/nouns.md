---
title: 名词解释
category: CV
tag:
  - thesis
time: 2021-12-07
---

## 目标检测
::: tip
Object Localization is finding where and what a single object exists in an image.
Object Detection is finding where and what multiple objects are in an image.
:::

::: tip
Sliding Window: 预定义一个box，在二维的图像上滑动。在每个位置，裁剪图像，缩放为224x224送入CNN。
- 计算量极大(OverFeat方法可以简化一些计算)
    - 滑动步长不能大大
    - 需要不同大小的滑动窗口
- 会产生大量包含物体的bboxes
:::

