---
title: 数字图像处理
time: 2021-10-03
category: CV
tag:
  - DIP
---

## 绪论
### 数字图像
- 一个图像定义了一个2D-函数，f(x, y)，其中x, y是空间坐标，函数值为灰度(grey level或intensity)。
- 图像数字化(digitalization)
    - 必须指定像素大小
    - 必须指定灰度范围，即灰阶。
    - 从连续到离散，一定会丢失部分信息
- 数据特点
    - 维数。通常是2和3，有时会更多，如4D图像增加了时间维度。
    - 大。
    - 每个voxel对应物理空间中的一个点
- 图像描述
    - 2D image: f(i, j)
    - 3D image: f(i, j, k)
    - 4D image: f(i, j, k, t)
    - 注意：f, i, j, k, t都是正整数。
- 数字图像三要素
    - pixel
    - grey level
    - coordinates

### 数字图像处理
- 采样(sampling):测量图像每个像素位置的灰度值
- 量化(quantization):将测量值用整数表示
- 对比度(contrast):图像内灰度变化的幅度
- 解像度(resolution):
- 采样密度(sampling density):像素间距
- 放大率(magnification):图像与真实世界的尺度关系(比例尺)

### 图像分类
- 二值图像(Binary image)
- 灰度图像(Gray level image)
- 彩色图像(Color image)
- 伪彩图像(False color image)

根据传感器分类，有红外，紫外，MRI，超声，微波，X-光片，PET(正电子成像，氧的新陈代谢)，照片...  
其他分类方式略。

### 图像处理流程
- Low level:从图像到图像，也称image filtering
    - Enhancement
        - Sharpen
        - Smooth
        - ...
    - Interpolate
    - Reduce Noise
    - Crop(裁剪)
- Intermediate level:从图像到符号表示，也称image segmentation
    - Region/Contour Extraction(ROI, Region of Interest)
    - Labeling
    - Grouping
- High level:从符号表示(symbolic representation)到功能性描述(functional description)，也称图像理解或模式识别。
    - Recognition
    - Modeling

## 基本图像操作
### 灰度直方图
图像的灰度直方图是基于灰阶的pixel分布函数。其x坐标代表灰阶，y代表对应灰阶的像素数目。主要缺点是丢失了像素的空间信息。
- 图像的灰度直方图通常是双峰(bimodal)的。
- 双峰之间的最小灰阶是最优的二值化threshold选择之一。
- 二值化的threshold可以是固定的(fixed)或适应性的(adaptive)

### 二值化方法
#### Isodata Algorithm
- 选择一个初始threshold值，T~0~(e.g. mean intensity)
- 用T~0~将图像分成两个部分R~1~,R~2~
- 分别计算两个部分的mean intensity u~1~, u~2~
- 选择新的threshold, T~1~=(u~1~+u~2~)/2
- 重复，直到threshold不再改变

#### OTSU Algorithm
- t: total
- $\displaystyle \omega =\sum _{i=0}^{T}P(i), P(i)={n}_{i}/N$
- $\displaystyle \mu =\sum _{i=0}^{T}iP(i)/\omega$
- $\displaystyle {\sigma }_{t}^{2}=\sum _{i=0}^{T}(i-u)^{2}P(i)$
- $\displaystyle {\delta }_{b}^{2}=\omega _0(\mu_0-\mu_t)^2+\omega _1(\mu_1-\mu_t)^2$，其中$\mu_t=
\omega_0\mu_0+\omega_1\mu_1$ 代入可得 ${\delta }_{b}^{2}=\omega_0\omega_1(\mu_1-\mu_0)^2$
- $\displaystyle \eta=\frac {\delta_b^2} {\delta_t^2}$
- 如果有256个灰阶，则计算出256个$\eta$取最大值

#### Entropy Method
- $\displaystyle H_{b}=-\sum_{i=0}^{t}p_{i}\log(p_{i})\quad H_{w}=-\sum_{i=t+1}^{255}p_{i}\log(p_{i})$
- 同样计算256个值，选择合适的灰阶t使得$H=H_b+H_w$ (b:black，通常是背景色， w:white，通常是前景色)最大化

#### Adaptive Threshold/Local Threshold
- 将图像分成一个个小区域，每个区域计算各自的threshold
- 适合背景不均匀的情况

