---
title: Pytorch Tensor 常用操作
author: Leonhardt
category: Python
tag:
  - pytorch
sidebarDepth: 1
sticky: false
star: false
time: 2022-01-04
---

## 可重复性
* np.random.seed(seed) 设置NumPy的全局RNG种子
* torch.manual_seed(seed) 设置CPU和CUDA的RNG种子
* if torch.cuda.is_available():
*   torch.cuda.manual_seed(42)
*   torch.cuda.manual_seed_all(42)
* torch.backends.cudnn.benchmark = False 固定cuDNN在程序运行时使用的卷积算法
* torch.backends.cudnn.deterministic = True  程序运行时设定的算法也可能不同，将其确定下来

## 创建张量
- torch.tensor(data, *, dtype=None, device=None, requires_grad=False, pin_memory=False) 总是会复制data
- torch.Tensor(shape/data), torch.rand(shape),torch.randn(shape) 默认生成FloatTensor
- 和numpy数组相互转换
    - some_tensor = torch.from_numpy(np_ary) 不会复制data，共享存储
    - some_tensor = torch.as_tensor(data, dtype=None, device=None) 如果dtype一致，则不会复制data
    - np_ary = some_tensor.cpu().numpy() # tensor需要在CPU上
- 转换为list
    - lst = some_tensor.tolist()
    - some_tensor = torch.tensor(lst)
- 张量数据类型的转换
	- some_tensor.item() 当Tensor只有一个元素时，返回相应的python原生对象
    - some_tensor.long()
    - some_tensor.int()
    - some_tensor.short()
    - some_tensor.bool()
    - some_tensor.half() 半精度浮点型
    - some_tensor.float()
    - some_tensor.double()
    - ...
    - some_tensor.to(torch.int)
    - a.type_as(b) 将a的数据类型转换为b的数据类型
- 改变数据存储位置
    - some_tensor.to(device)
    - some_tensor.cuda()
    - some_tensor.cpu()
- 不参与求导
    - some_tensor.detach()
    - some_tensor.requires_grad_(False)
- 两个张量比较的结果是一个bool类型的张量

## 改变张量形状
- some_tensor.view(shape)
- some_tensor.reshape(shape)
- some_tensor.permute()

## 矩阵相乘
- torch.matmul(a, b) == `a @ b` 矩阵相乘，支持广播机制
- torch.mm(a, b) 矩阵相乘，不支持广播机制
- torch.bmm(a, b) 批量相乘。(b, n, m)x(b, m, p)->(b, n, p)

## 广播机制
- 每个张量必须至少有1维
- 维数遍历是从最后一维开始的，可广播的条件是，两个张量相应的维度
	- 相等
	- 其中一个是1
	- 其中一个不存在
- 其中
	- 相等，就是正常情况
	- 其中一个不存在时，就加一维，令其成为1
	- 其中一个为1，会将其复制扩张到另一个张量的大小
 
## squeeze/unsqueeze
- torch.squeeze(input, dim=None, *, out=None) → Tensor
- torch.Tensor.squeeze(dim=None)
- squeeze将指定维度去除(维度必须大小为1，否则无事发生)
- unsqueeze在指定维度前添加一个新维度(大小为1)

## torch.max
- torch.sum() 机制类似torch.max，当然，没有参数为两个张量的sum
- torch.Tensor.sum() 功能和torch.sum()相同，只是原来的第一个位置参数变成了用来调用sum()的对象

```python
a = torch.arange(24).reshape((2, 3, 4))
b = np.arange(24)
np.random.seed(42)
np.random.shuffle(b)
b = torch.from_numpy(b).reshape((2, 3, 4))

# 求整个张量的最大值
ret1 = torch.max(a) # tensor(23)
ret1.item() # 23

# 求指定维度上的最大值，并且指定维度会消失(维度==>值)
# values: 记录最大值
# indices: 记录最大值在原维度的位置
# keepdim=True: 会保持原维度。其行为相当于在指定维度会保留一个元素
values, indices = torch.max(a, 2)
assert(values.shape == (2, 3))
values, indices = torch.max(a, 1)
assert(values.shape == (2, 4))
values, indices = torch.max(a, 2, keepdim=True)
assert(values.shape == (2, 3, 1))
values, indices = torch.max(a, 1, keepdim=True)
assert(values.shape == (2, 1, 4))

# 比较两个张量，返回一个由两个数组中更大的元素组成的新张量
c = torch.max(a, b)
"""
tensor([[[ 8, 16,  2, 18],
         [11,  9, 13,  7],
         [21,  9, 10, 12]],

        [[15, 13, 14, 22],
         [17, 20, 23, 19],
         [20, 21, 22, 23]]])
"""

```

## cat
- torch.cat(tensors, dim=0, *, out=None) -> Tensor
- tensors中每个tensor必须除了指定维度外，其他维度大小一致。

```python
x = torch.randn(2, 3)
torch.cat((x, x, x), 0) # (6, 3)
torch.cat((x, x, x), 1) # (2, 9)
```

## stack
- torch.stack(tensors, dim=0, *, out=None) → Tensor
- tensors中每个tensor维度大小必须一致
- 在新维度将所有tensor合并起来
- `torch.stack(tensors, dim=n) == torch.cat([torch.unsqueeze(t, dim=n) for t in tensors], dim=n)`

```python
x = torch.randn(2, 4)
torch.stack((x, x, x), 0) # (3, 2, 4)
torch.stack((x, x, x), 1) # (2, 3, 4)
```

## linspace
- torch.linspace(start, end, steps, *, out=None, dtype=None, layout=torch.strided, device=None, requires_grad=False) → Tensor
- 结果包含start，end共计steps个元素。`[start, ... , end]`
- 一个纸条，切三刀，平均分为四块，共5个点。
- torch.linspace(3, 10, steps=5) # tensor([  3.0000,   4.7500,   6.5000,   8.2500,  10.0000])