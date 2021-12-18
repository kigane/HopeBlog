---
title: Attention is all you need
category: Thesis
time: 2021-11-14
---

## 摘要
- Transformer，一个新的网络架构，只使用注意力机制(attention mechanism)，完全没用循环和卷积
- 对于机器翻译任务，性能表现更好，可并行度更高，训练时间大量减少
- 可以泛化到其它任务上
- [代码实现](https://github.com/tensorflow/tensor2tensor)


## 结论
- Transformer是第一个完全用注意力机制的序列转录模型(sequence transduction model)，它将encoder-decoder架构中最常用的循环层(recurrent layers)替换成multi-headed self-attention。
- 对于机器翻译任务，确实性能表现更好，训练时间更少
- 作者认为Transformer不仅可以应用到文本处理上，在图像，语音，视频上应该也可行。让生成不那么时序化也是另一个研究方向。

## 导言
- 循环模型最主要的缺点是难以并行化，训练时间长。因为它要计算序列的隐藏状态h~t~时，必须先计算h~t-1~。
- 已经有人将attention机制应用于encoder-decoder架构了，但是是和循环模型一起使用的。
- 我们只用attention机制，效果更好

## 相关工作
- 有人试过用CNN来改进RNN，但这样做的缺点是序列相隔比较远的像素产生联系很难，用transformer就很容易了。但CNN有和好处是可以有多个输出通道，所以作者又提出了multi-headed self-attention用来模拟CNN的多输出通道的效果。
- self-attention机制不是作者的创新，相关工作已经有了。
- 作者的创新在于在encoder-decoder架构中只使用self-attention机制。

## ==模型架构==
TODO