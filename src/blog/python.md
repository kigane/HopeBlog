---
title: python
lang: zh-CN
sidebarDepth: 1
---

## import
### module
* dir(): 无参数，查看全局命名空间的变量
* dir(module): 查看指定模块的变量
* 一个.py文件可看作一个模块
    * import module (as alias) 引入module，可使用module命名空间及其内的变量
    * from module import var 将var从module中导入全局命名空间

### package
* 一个目录，包含目录和子模块。
* 创建一个package需要在目录下创建一个`__init__.py`
* 需要在`__init__.py`中引入子模块，否则import package时空有命名空间，而无内容