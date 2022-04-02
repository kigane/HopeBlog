---
icon: page
title: DL常用操作
author: Leonhardt
category: Python
tag:
  - pytorch
sidebarDepth: 1
sticky: false
star: false
time: 2022-03-28
---

## 范数与标准化

<CodeGroup>
<CodeGroupItem title="pytorch">

```python
# torch.nn.functional.normalize(input, p=2.0, dim=1, eps=1e-12, out=None)
# 用input的dim维的向量的L~p~范数标准化input, v=v/||v||~p~
x = torch.tensor([1.0, 2.0, 2.0], dtype=torch.float)
F.normalize(x, dim=0) # 输出：tensor([0.3333, 0.6667, 0.6667])
# torch.norm(input, p='fro', dim=None, keepdim=False, out=None, dtype=None)`
# p=(int, float, inf, -inf, 'fro', 'nuc'), fro即F范数，相当于L~2~范数
torch.norm(x) # 输出：tensor([0.3333, 0.6667, 0.6667])
```
</CodeGroupItem>

<CodeGroupItem title="numpy">

```python
# np.linalg.norm(x, ord=None, axis=None, keepdims=False)：求L~p~范数。ord指定p
x = np.array([1.0, 2.0, 2.0])
x_norm = np.linalg.norm(x, ord=2)
# 手动标准化
x_normed = x / x_norm
```
</CodeGroupItem>
</CodeGroup>


## 随机变量
scipy的stats模块中整合了大量连续分布和离散分布的随机变量对象(RVs)。连续分布的RV包含以下方法
- rvs: Random Variates
- pdf: Probability Density Function
- cdf: Cumulative Distribution Function
- sf: Survival Function (1-CDF)
- ppf: Percent Point Function (Inverse of CDF)
- isf: Inverse Survival Function (Inverse of SF)
- stats: Return mean, variance, (Fisher’s) skew, or (Fisher’s) kurtosis
- moment: non-central moments of the distribution
- 这些方法都有默认的关键词参数loc=mean, scale=std。norm默认为标准正态分布。

```python
from scipy import stats
# pdf和cdf就是统计中的概率密度函数和累积密度函数
# RV的方法都可以输入一个向量，返回一个每个元素都用相应函数处理过的向量。
# 以正态分布为例
stats.norm.pdf(0) # 0.3989
stats.norm.cdf(0) # 0.5
stats.norm.cdf([-1.0, 0, 1.0]) # array([0.15865525, 0.5, 0.84134475])
stats.norm.mean()
stats.norm.std()
stats.norm.var()
stats.norm.stats(moments="mvsk") # 返回均值，方差，偏度系数，峰度系数
# ppf是cdf的反函数。percent = cdf(x) ==> x = ppf(percent)
stats.norm.ppf(0.5)
norm.rvs(size=3) # 从正态分布中产生3个随机数
# 冻结分布 Freezing Distribution
norm_rv = stats.norm(loc=5, scale=2) # norm_rv和stats.norm用法相同，但默认参数不同
```

## 截断分布-scipy.stats.truncnorm
将标准正态分布截断到`[a, b]`  
移动和缩放分布：truncnorm.pdf(x, a, b, loc, scale) 等价于 truncnorm.pdf(y, a, b) / scale，其中 y = (x - loc) / scale

要想将自定参数的正态分布截断到指定`[ma,mb]`，则需要重新计算形状参数 a, b = (ma - mean)/std, (mb - mean)/std。

```python
mean, std = 2, 4
ma, mb = 0, 4
a, b = (ma - mean)/std, (mb - mean)/std
x = np.linspace(-5, 5, num=1000)
pdf = stats.truncnorm.pdf(x, a, b, mean, std) # 下图一
# pdf = stats.truncnorm.pdf(x, a, b) # 下图二
fig = sns.lineplot(x=x, y=pdf)
```

![调整过](/assets/img/fig_truncnorm_1.png)
![未调整](/assets/img/fig_truncnorm_2.png)

## 谱归一化
[SNGAN](https://arxiv.org/abs/1802.05957): 在GAN的Discriminator中使用，标准化Discriminator的权重参数，使其满足1-Lipschitz约束。

<CodeGroup>
<CodeGroupItem title="python">

```python
import torch
import torch.nn.functional as F

def spectral_norm(W, iteration=1):
    """谱归一化, 用于让 Discriminator 服从 1-Lipschitz 约束。
        对权重矩阵 W,计算出其矩阵二范数 ||W||_2,并将其归一化为 W = W / ||W||_2

    Args:
        W (tensor): weights
        iteration (int, optional): num of iterations. Defaults to 1.
    """
    h, w = W.shape
    # 初始化
    u = torch.normal(0, 1, size=(1, h)).squeeze()
    v = torch.normal(0, 1, size=(1, w)).squeeze()
    
    # power iteration
    for _ in range(iteration):
        u = F.normalize(torch.mv(W, v), dim=0)
        v = F.normalize(torch.mv(W.T, u), dim=0)
    
    # ||W||_2的近似解
    sigma = torch.dot(u, torch.mv(W, v))

    return W / sigma
```
</CodeGroupItem>

<CodeGroupItem title="pytorch">

```python
import torch
from torch.nn.utils import spectral_norm # 未来会被下面的实现取代
# from torch.nn.utils.parametrizations import spectral_norm

# spectral_norm(module, name='weight', n_power_iterations=1, eps=1e-12, dim=None)
snm = spectral_norm(nn.Linear(20, 40))
torch.linalg.matrix_norm(snm.weight, 2) # output: 1.0
```
</CodeGroupItem>
</CodeGroup>
