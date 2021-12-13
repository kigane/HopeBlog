---
title: 随机数
category: blog
tag:
  - random
time: 2021-12-05
---

## 固定种子
np.random.seed(seed)

## 均匀分布的随机数
### [0, 1)内
```python
# random.rand(d0, d1, ..., dn)
np.random.rand() # 返回单个随机数
np.random.rand(3, 2) # 返回(3, 2)的随机数数组
(b - a) * np.random.rand() + a # [a, b)
```

### 指定范围内的离散的
```python
# random.randint(low, high=None, size=None, dtype=int)
np.random.randint(1, 7, (6,))
```

## 高斯分布的随机数
```python
# random.randn(d0, d1, ..., dn)
np.random.randn()
np.random.randn(3, 2)
mu + sigma * np.random.randn(3, 2)
```

## 其他分布
np.random.xx
- chisquare
- gamma
- 