---
icon: page
title: 用tensorboard可视化模型，数据和训练
author: Leonhardt
category: Pytorch
tag:
  - visualization
sidebarDepth: 1
sticky: false
star: false
time: 2022-03-26
---

## 准备
SummaryWriter:向tensorboard写入的关键对象。创建该对象时，需要指定持久化文件保存的文件夹路径。如果路径不存在，会自动创建。  

运行tensorboard: tensorboard --logdir logpath

```python
from torch.utils.tensorboard import SummaryWriter
writer = SummaryWriter('log/FMNIST')
```

## 写入图片
添加global_step参数后，可以向同一个ImageName写入多次，会有一个类似进度条的东西，通过调节可以查看不同step写入的图像。正适合用于查看GAN生成的图像变化。

```python
writer.add_image('ImageName', img, global_step=step)
```

## 查看模型
```python
writer.add_graph(model, model_input)
```

## Projector--可视化高维数据
通过PCA,T-SNE等方法将数据降维到三维。
- features: 需要降维显示的高维特征
- metadata: 每个feature对应的类别
- label_img: 数据点对应的图像，可在可视化中展示。可选。

```python
writer.add_embedding(
    features,
    metadata=class_labels,
    label_img=data,
    global_step=batch_idx,
)
```

## 记录loss等标量和plt.figure
```python
writer.add_scalar('Name', loss, global_step=step)
writer.add_figure('Name', fig, global_step=step)
```

## 绘制PR-曲线
- `classes[class_index]`：类别标签。只是一个Name。
- tensorboard_truth: ground_truth。
- tensorboard_probs: specific_class_predicted_probability。

PR-CURVE的绘制过程中specific_class_predicted_probability将用np.histogram处理，默认分成128个区间。其中，ground_truth作为weights参数计算预测为正的样本数。1-ground_truth作为weights参数计算预测为负的样本数。

```python
def add_pr_curve_tensorboard(class_index, test_probs, test_label, global_step=0):
    '''
    Takes in a "class_index" from 0 to 9 and plots the corresponding
    precision-recall curve
    '''
    tensorboard_truth = test_label == class_index
    tensorboard_probs = test_probs[:, class_index]

    writer.add_pr_curve(classes[class_index],
                        tensorboard_truth,
                        tensorboard_probs,
                        global_step=global_step)
```

## 查看权重分布
实际就是将传入的weights拉成一维，然后画出直方图。

```python
writer.add_histogram("fc1", weights, global_step=global_step)
```

## 记录超参数
`add_hparams(hpyrams, metrics)`  
会以列表，平行坐标或散点图的方式展示超参数对度量的影响。

```python
writer.add_hparams(
    {"lr": learning_rate, "bsize": batch_size},
    {
        "accuracy": sum(accuracies) / len(accuracies),
        "loss": sum(losses) / len(losses),
    },
)
```

## 从tfevents中读取数据

```python
from tensorflow.python.summary.summary_iterator import summary_iterator

tfevent_filename = "path/to/events.out.tfevents.xxxx"

for event in summary_iterator(tfevent_filename):
    # print(event.wall_time)
    # print(event.step)
    for v in event.summary.value:
        print(v.tag)
        print(v.HasField('image'))
        print(v.HasField('simple_value'))
        
"""
tfevents迭代器打印出的内容

wall_time: 1648622763.1866968
file_version: "brain.Event:2"

wall_time: 1648622764.5857239
summary {
  value {
    tag: "Loss"
    simple_value: -9831.6953125
  }
}

wall_time: 1648622764.7647285
summary {
  value {
    tag: "Your Image"
    image {
      height: 266
      width: 530
      colorspace: 3
      encoded_image_string: "\211PNG\r\n\032\n\000\000\000\rIHDR\000\000......"
    }
  }
}
"""

```

