---
icon: page
title: 构建图片数据集
author: Leonhardt
category: Python
tag:
  - pytorch
sidebarDepth: 1
sticky: false
star: false
time: 2022-04-03
---

## ImageFolder
`torchvision.datasets.ImageFolder(root, transform = None, loader=<function default_loader>)`
- root: 数据集的根目录
- transform: 图像的预处理操作
- loader: 图像加载函数，默认使用Pillow。给定路径，返回图片。

一个通用的图片数据加载器，要求数据集以以下方式组织

```md
directory/
├── class_x
│   ├── xxx.ext
│   ├── xxy.ext
│   └── ...
│       └── xxz.ext
└── class_y
    ├── 123.ext
    ├── nsdf3.ext
    └── ...
    └── asd932_.ext
```

即，给定的根目录下，每一个文件夹中只保存一个类别的数据。文件夹的名称会作为类别的名称，保存在dataset.classes中，类别名到类别编码的映射保存在dataset.class_to_idx中(编码默认按字典序生成)。dataset.imgs即其内部保存的数据列表，其元素为`(img_path, class_num)`元组。访问`dataset[0]`，返回的是`(PIL.Image.Image, class_num)`元组(没有使用任何transform)。  

支持的图片格式有`('.jpg', '.jpeg', '.png', '.ppm', '.bmp', '.pgm', '.tif', '.tiff', '.webp')`。


