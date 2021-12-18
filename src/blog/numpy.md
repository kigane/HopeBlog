---
title: numpy用法
category: Python
tag:
  - numpy
time: 2021-12-05
---

## 索引
### 采样
x是一维数组，`x[i]`，为x的第i个元素，np支持数组索引，`x[[i, j, k]]`，得到`[x[i], x[j], x[k]]`。如果`x[]`中传入的数组大于一维，得到的结果类似于将数组flatten后作为索引，得到的结果再reshape成索引数组的形状。
```python
x = np.arange(12)
y = np.array([[1, 2, 3, 4], [2, 3, 4, 7]])
x[y] # y必须是np数组才行
# array([[1, 2, 3, 4],
#        [2, 3, 4, 7]])
```

## np.clip
```python
# numpy.clip(a, a_min, a_max, out=None, **kwargs)
a = np.arange(5)
np.clip(a, 1, 3) # [1,1,2,3,3]
```

## np.random.shuffle
原地打乱数组元素的顺序
```python
x = np.arange(10)
np.random.shuffle(x)
```

## np.cumsum
计算列表元素的累积和
```python
a = np.array([[1,2,3], [4,5,6]])
# 未指定axis则会先flatten，再计算cumsum
np.cumsum(a) # 1, 3, 6, 10, 15, 21
# 沿指定轴计算 
np.cumsum(a,axis=0) # [[1, 2, 3], [5, 7, 9]]
```

## np.diff
计算列表相邻元素之间的差值
```python
# numpy.diff(a, n=1, axis=-1, prepend=<no value>, append=<no value>)
x = np.array([1, 2, 4, 7, 0])
np.diff(x) # [1, 2, 3, -7]
# n表示递归地做n次diff
np.diff(x, n=2) # [1, 1, -10]
# prepend=1表示在a的最后一维的所有列表前添加一个1，再计算cumsum。append同理
np.diff(x, prepend=1) # [0, 1, 2, 3, -7]
```

## np.ma.masked_where
得到列表中满足条件的元素被设为True的掩码
```python
# ma.masked_where(condition, a, copy=True)
a = np.arange(4)
c = ma.masked_where(a <= 2, a)
# c: masked_array(data=[--, --, --, 3],
#              mask=[ True,  True,  True, False],
#        fill_value=999999)
c[0]=99
# masked_array(data=[99, --, --, 3],
#              mask=[False,  True,  True, False],
#        fill_value=999999)
```
- masked_equal(a, value, copy=True)
- masked_less_equal(a, value, copy=True)
- masked_inside(a, v1, v2, copy=True)
- ma.masked_invalid(a, copy=True)
- ...

填充被masked的位置，使用np.ma.filled
```python
x = np.ma.array([1,2,3,4,5], mask=[0,0,1,0,1], fill_value=-999)
x.filled()
# array([   1,    2, -999,    4, -999])
```

