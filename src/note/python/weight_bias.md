---
icon: page
title: 使用Weight&Bias记录实验数据
author: Leonhardt
category: Python
tag:
  - python
  - pytorch
  - visualization
sidebarDepth: 1
sticky: false
star: false
time: 2022-04-06
---

## 准备工作
- [注册](https://wandb.ai/site)，获取api-key
- `pip install wandb`
- `wandb login` 输入api-key

## 界面
Project
* Dashboard: 实验跟踪，各种图表，可视化记录的数据
* Artifacts: 数据集、模型的版本控制
* Sweeps: 超参数优化
* Reports: 保存和共享可重现的结果

每个Project下会包含很多Run，每个Run对应代码中的一个wandb.init()。通常，每次训练可以使用一个run，保存使用的数据集可以使用另一个run，训练出一个比较好的模型后，也可以用一个run保存。一次只能同时存在一个run，如果在代码中又打开一个新的run，则旧的会先停止。
* Charts ——包含有关损失、准确性等的信息。此外，它还包含我们数据中的一些示例。
* System ——包含系统负载信息：内存使用情况、CPU 使用情况、GPU 温度等。这是非常有用的信息，因为您可以控制 GPU 的使用情况并选择最佳批量大小。
* Model ——包含有关我们的模型结构（图形）的信息。
* Logs ——包括Keras 默认日志记录。
* Files ——包含在实验过程中创建的所有文件，例如：配置、最佳模型、输出日志、需求等。

## 基本使用

```python
import wandb
wandb.init(project='project_name', group='group_name',
              job_type='job_type', config=dict(xxx))
wandb.log({'accuracy': train_acc, 'loss': train_loss})
```
- project: 对应网页中的Project
- group,job_type: 用于分类不同的run
- config: 需要传入一个字典。其中内容作为网页table中的列出现，在代码中可用wandb.config访问该字典
- 在使用sweep时wandb.init的参数都没有用，config会使用从sweep_config中生成的配置。
- wandb.log: 类似 tensorboard 的 add_scalar

## sweep
超参数搜索。

### 准备

```python
sweep_config = {
'method': 'random',
'metric': {'goal': 'minimize', 'name': 'loss'},
'parameters': 
{
  'batch_size': {'distribution': 'q_log_uniform_values', 'max': 256, 'min': 32, 'q': 8},
  'dropout': {'values': [0.3, 0.4, 0.5]},
  'epochs': {'value': 1},
  'fc_layer_size': {'values': [128, 256, 512]},
  'learning_rate': {'distribution': 'uniform', 'max': 0.1, 'min': 0},
  'optimizer': {'values': ['adam', 'sgd']}
}
}
```
- method
  - grid: 遍历parameters中给定多个值的参数的所有组合。
  - random: 从某种分布中随机抽取参数，组合其他值。如上面的learning_rate，就是从U(0, 0.1)中抽取。
- metric
  - name: 必须是wandb.log({"xx": value})中的xx。
  - goal: minimize或maximize
- parameters
  - 自定义键值对。在每次run中，会选择一组参数，作为wandb.config的内容。
  - 多值：values
  - 单值: value
  - 如果用random策略，则可以指定参数值服从的分布
- name: 在网页上显示的sweep的名字

### 启动

```python
sweep_id = wandb.sweep(sweep_config, project='project_name')
wandb.agent(sweep_id, function=train, count=8)
```
- project: 指定sweep保存在哪个project
- function: 执行的方法。在方法内wandb.config会被sweep产生的一组参数初始化。另外，这个方法必须能不用参数调用。
- count: 最多执行次数。(要试几组参数)