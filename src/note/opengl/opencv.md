---
title: OpenCV
lang: zh-CN
sidebarDepth: 1
---

## 简介
OpenCV是一个图像处理库。图像矩阵类Mat主要有两个部分,header部分记录图像矩阵的描述性信息，如大小，元素储存方式等等，另外一部分是一个指针，指向矩阵存储的内存。有自动内存管理，且使用了引用计数系统，Mat的赋值，复制构造函数只会复制header部分，指针部分指向同一块内存，最后一个指向该内存的指针负责回收内存。其指定存储方式的格式为:`CV_[The number of bits per item][Signed or Unsigned][Type Prefix]C[The channel number]`。Mat的输出格式可以用`format(mat, Formatter::FMT_PYTHON)`指定(`cout<<format(mat,...)`)。  
PS：OpenCV按BGR顺序存储RGB颜色。

## 遍历图像矩阵

* cv::Mat::isContinuous() 检查内存是否在同一行
* 检查图像是否加载成功可以看I.data是否为NULL，为NULL则加载失败。
* 遍历矩阵元素的方式
    * mat.depth()查看item的类型，mat.channels()查看元素的通道数。
    * mat.rows查看元素行数,mat.cols查看元素列数，mat.cols*mat.channels()是item总数。
    * `mat.ptr<typename>(i)` 取得指向矩阵第i行行首的指针。
    * `MatIterator_<typename> it` 不同类型的迭代器，推荐使用，在内存换行时有点优化。
        * `mat.begin<typename>()` 取得位于矩阵开头的迭代器。常用的RGB3通道对应typename为Vec3b
        * `mat.end<typename>()`
* cv::Mat::at(row,col) 取得第row行，第col列的元素的地址，并返回引用。
* cv::LUT(src,lut,dest) `dest[i]=lut[src[i]+d]`。如果src是无符号类型，则d=0，有符号类型则d=128。最快。

## 图像操作
* Mat img = imread(filename); 默认为3通道
* Mat img = imread(filename, IMREAD_GRAYSCALE); 单通道
* imwrite(filename, img); 保存到文件
* imshow("image", img); 显示图像
* cvtColor(img, grey, COLOR_BGR2GRAY);  改变颜色空间。
* src.convertTo(dst, CV_32F); 改变图像类型
* Rect r(10, 10, 100, 100); Mat smallImg = img(r); 将Rect指定的区域储存为另一个图像