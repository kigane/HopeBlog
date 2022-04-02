---
icon: page
title: 用Python制作gif图
author: Leonhardt
category: Python
tag:
  - python
sidebarDepth: 1
sticky: false
star: false
time: 2022-03-30
---

## 准备
安装 imageio 和 [pygifsicle](https://github.com/LucaCappelletti94/pygifsicle) 库。  

```python
pip install imageio
pip install pygifsicle
```

pygifsicle 只是 gifsicle 的Python接口，因此还需要安装 gifsicle 本体。  
- Windows系统需要下载二进制程序，然后将 gifsicle.exe 所在文件夹设为 path 环境变量。若执行`gifsicle --version`成功，则说明安装好了。
- Linux系统执行`sudo apt-get install gifsicle`即可。

## 代码

```python
import imageio as iio
from pygifsicle import optimize
from pathlib import Path


if __name__ == '__main__':
    img_dir = 'path/to/your/img_folder'
    path = Path(img_dir)
    gif_imgs = [iio.imread(img) for img in path.iterdir()] # 读取文件夹中的所有图片
    iio.mimsave('hello.gif', gif_imgs, format='GIF', duration=0.5) # 将图片制作为 gif
    optimize('hello.gif') # 优化 gif 文件体积。覆盖原文件
    optimize('hello.gif', 'new_hello.git') # 创建一个新文件
    print("finished")
```

