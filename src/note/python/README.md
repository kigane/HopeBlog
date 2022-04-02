---
title: python
category: Python
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

### 模块查找顺序
* 当前工作目录(cwd)
* python标准库, PYTHONPATH环境变量指定位置
* sys.path

::: tip 提示
通过os.environ字典可以查看当前环境变量
:::

### 只导入一次
导入模块时，如果模块中有可执行代码，则会执行。(`if __name__ == '__main__'`就是用于防止意外执行不希望执行的代码)。  
重复导入相同模块，什么也不会发生。

## 解包(自动)
* 等号右边的序列可以直接解包为单个元素，只要在左边分配同样数量的变量。
* 数量必须相同，否则会报错
* 可以部分解包，即在等号左边某个变量前加`*`号，则其会接受所有为未分配的值，并形成一个数组。(序列元素数量必须多于分配的变量数)。例如 `a, *b, c = [1, 2, 3, 4, 5]`，则有`b=[2,3,4]`


## 函数
### 参数
* `def add(*args)`: 这里`*`作用是将所有剩下的未解析参数打包到一个元组中，赋给args。调用时可以用`*args`的到解包后的值。
* `def init(**kwargs)`: 这里`**`作用是将所有剩下未解析的关键字参数打包成字典，赋给kwargs。
* `def say(a, b, *, key=val...)`: 这里`*`是标识符，左边是位置参数，右边是关键字参数。
* 参数类型的声明顺序
    * 必须参数
    * 可选参数(提供默认值的参数)
    * `*args`
    * `**kwargs`

### 函数注解
* python中对参数类型(参数后的冒号部分)和返回值类型(函数括号后，行尾冒号前的`->xx`部分)的描述方法
* `def prepend_rows(row:list, prefix:str) -> list:`
* 这些部分属于注解而非表达式，所以内容是无限制的。

### lambda
* `f = lambda x: x*x`
* 语法: `lambda params:body`, `lambda: body`
* body必须是返回一个值的单个表达式

## 类
### 基础
* python类声明的主体是一个代码块，可以包含任何有效的python代码
* 在类声明中声明的变量会成为类对象的一个属性(即，类会创建一个新的命名空间记录这些变量)
* super(Class, instance, ...) 使用instance的MRO，从Class位置开始向上找。

### 动态加载
* python所有的类都是type()的子类
* type()用于实例化类的三部分信息:
    * 类名称
    * 基类
    * 命名空间字典，在执行类的主体时被填充
* type()称为元类

```python
class A(int):
    spam = 'eggs'

# 等价于
# 第一个A是为了创建类， 第二个A是用于将类名绑定到命名空间，两者可以不同(实际用时也确实是不同的)
A = type('A', (int,), {'spam': 'eggs'})
```

#### 自定义元类
```python
# 通过继承type自定义元类
class SimpleMeta(type):
    def __init__(cls, name, bases, attrs):
        print(name)
        super(SimpleMeta, cls).__init__(name, bases, attrs)

# 使用元类，效果是：python会自动将类定义传递给元类进行处理
class Example(metaclass=SimpleMeta):
    pass # 效果和标准类型一样
```

### 成员变量
- getattr() 用名称检索成员变量 访问类中不存在的成员变量时会触发`__getattr__`(d['attr'])
- setattr() 用名称设置成员变量 设置类成员时触发`__setattr__`(d.attr = 'attr')
- delattr() 用名称删除成员变量 删除类成员时触发`__delattr__`(del d.attr)
- `__str__` toString方法
- `__repr__` 在解释器中单独引用对象时触发
 
## 打包到pip
* 新建文件夹
* 将package放进去(包含__init__.py)
* 在根目录新建setup.py
* 在根目录执行
    * python setup.py bdist_wheel 打包成wheel
    * python setup.py sdist 打包成tar
* 在打包好的文件目录下pip install 打包好的文件名
* pip uninstall setup.name 即可卸载

```python
from setuptools import setup
from setuptools import find_packages

setup(name='MySheet',
      version='0.1',
      author='hwk',
      author_email='abc@fg.com',
      url='https://hello.com',
      packages=find_packages(),
      zip_safe=False,
)
```

## anaconda
### 常用命令
* conda list: 查看安装了哪些包。
* conda env list: 查看当前存在哪些虚拟环境
* conda create -n your_env_name python=X.X: 创建python版本为X.X、名字为your_env_name的虚拟环境。your_env_name文件可以在Anaconda安装目录envs文件夹下找到。
* activate your_env_name: Windows下激活虚拟环境
* deactivate 退出
* Linux下，激活，退出都在开头加一个source
* conda remove -n your_env_name --all: 移除虚拟环境
* conda install package_name: 在当前环境中安装包
* conda install -n your_env_name package_name: 在指定环境中安装包
* update, remove语法和install相同
* conda search pname: 模糊搜索package
* conda search --full-name pname: 全名查找
* conda env export > environment.yml: 导出环境配置
* conda env create -f environment.yml: 导入环境配置


## tqdm
用在被遍历的可迭代对象上，自动产生进度条。
```python
from tqdm import tqdm
from tqdm.notebook import tqdm_notebook
import time
for i in tqdm(range(20), desc='Process Bar', postfix="Postfix loss=xx"):
    time.sleep(0.5)
```