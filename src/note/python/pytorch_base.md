---
icon: page
title: Pytorch基础
author: Leonhardt
category: Python
tag:
  - pytorch
sidebarDepth: 1
sticky: false
star: false
time: 2022-04-19
---

## learning rate scheduler
学习率和优化器优化参数同时进行，所以step, T_max计算要考虑每轮迭代多少次。

```python
import torch
import torch.nn as nn
from torch.optim.lr_scheduler import StepLR, CosineAnnealingLR

initial_lr = 0.1

class model(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(in_channels=3, out_channels=3, kernel_size=3)
    def forward(self, x):
        pass

net = model()

optimizer = torch.optim.Adam(net.parameters(), lr=initial_lr)
scheduler = StepLR(optimizer, step_size=3, gamma=0.1) # 每过step_size个epoch，学习率乘以gamma
scheduler_cos = CosineAnnealingLR(optimizer, T_max=10, eta_min=0) # 学习率从初始逐渐降到eta_min,T_max指定总轮数

print("初始化的学习率：", optimizer.defaults['lr'])
for epoch in range(1, 11):
    # train

    optimizer.zero_grad()
    optimizer.step()
    print("第%d个epoch的学习率：%f" % (epoch, optimizer.param_groups[0]['lr']))
    # scheduler.step()
    scheduler_cos.step()
```

## nn.Module中的self.register_buffer()解析
该方法的作用是定义一组参数，该组参数的特别之处在于：模型训练时不会更新（即调用 optimizer.step() 后该组参数不会变化，只可人为地改变它们的值），但是保存模型时，该组参数又作为模型参数不可或缺的一部分被保存。

在用self.register_buffer('name', tensor) 定义模型参数时，其有两个形参需要传入。第一个是字符串，表示这组参数的名字；第二个就是tensor 形式的参数。

在模型定义中调用这个参数时（比如改变这组参数的值），可以使用self.name 获取。

在实例化模型后，获取这组参数的值时，可以用 net.buffers() 方法获取，该方法返回一个生成器（可迭代变量）

