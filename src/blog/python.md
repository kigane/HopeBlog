---
title: python
category: python
sidebarDepth: 1
---

## 基础
### 内置方法
* `any(lst)`: lst中任意元素为True则返回True。即列表所有元素取or。
* `all(lst)`: lst中所有元素为True才返回True。即列表所有元素取and。

### import
#### module
* dir(): 无参数，查看全局命名空间的变量
* dir(module): 查看指定模块的变量
* 一个.py文件可看作一个模块
    * import module (as alias) 引入module，可使用module命名空间及其内的变量
    * from module import var 将var从module中导入全局命名空间

#### package
* 一个目录，包含目录和子模块。
* 创建一个package需要在目录下创建一个`__init__.py`
* 需要在`__init__.py`中引入子模块，否则import package时空有命名空间，而无内容

#### 模块查找顺序
* sys.module
* python标准库
* sys.path

#### 相对导入
* `.`，当前目录, `..`上一级目录, `...`上上一级目录。

#### importlib 模块
* `import_module('module_name', package=__name__)` 返回值即模块
* package用于考虑相对导入

### 解包(自动)
* 等号右边的序列可以直接解包为单个元素，只要在左边分配同样数量的变量。
* 数量必须相同，否则会报错
* 可以部分解包，即在等号左边某个变量前加`*`号，则其会接受所有为未分配的值，并形成一个数组。(序列元素数量必须多于分配的变量数)。例如 `a, *b, c = [1, 2, 3, 4, 5]`，则有`b=[2,3,4]`

### 压缩(zip)
* `zip(range(3), reverse(range(5))) -> [(0, 4), (1, 3), (2, 2)]`
* 创建字典时很有用: dict(zip(keys, values))

### itertools.chain
* itertools.chain(range(3), range(4), range(5))
* 作用是将三个生成器(range())合并成一个新的，生成`[0,1,2,0,1,2,3,0,1,2,3,4]`

### 函数
#### 参数
* `def add(*args)`: 这里`*`作用是将所有剩下的未解析参数打包到一个元组中，赋给args。调用时可以用`*args`的到解包后的值。
* `def init(**kwargs)`: 这里`**`作用是将所有剩下未解析的关键字参数打包成字典，赋给kwargs。
* `def say(a, b, *, key=val...)`: 这里`*`是标识符，左边是位置参数，右边是关键字参数。
* 参数类型的声明顺序
    * 必须参数
    * 可选参数(提供默认值的参数)
    * `*args`
    * `**kwargs`

#### 函数注解
* python中对参数类型(参数后的冒号部分)和返回值类型(函数括号后，行尾冒号前的`->xx`部分)的描述方法
* `def prepend_rows(row:list, prefix:str) -> list:`
* 这些部分属于注解而非表达式，所以内容是无限制的。

### lambda
* `f = lambda x: x*x`
* 语法: `lambda params:body`, `lambda: body`
* body必须是返回一个值的单个表达式

### 类
#### 基础
* python类声明的主体是一个代码块，可以包含任何有效的python代码
* 在类声明中声明的变量会成为类对象的一个属性(即，类会创建一个新的命名空间记录这些变量)
* super(Class, instance, ...) 使用instance的MRO，从Class位置开始向上找。

#### 动态加载
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

#### 成员变量
- getattr() 用名称检索成员变量 访问类中不存在的成员变量时会触发`__getattr__`(d['attr'])
- setattr() 用名称设置成员变量 设置类成员时触发`__setattr__`(d.attr = 'attr')
- delattr() 用名称删除成员变量 删除类成员时触发`__delattr__`(del d.attr)
- `__str__` toString方法
- `__repr__` 在解释器中单独引用对象时触发
 
### 打包到pip
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

## plt
### markevery--指定会在图上标记的点的位置，间距
* markevery=3 每三个数据点标记一个(标记，不标记，不标记，标记...)
* markevery=(30, 3) 第30个之后，每三个数据点标记一个
* `markevery=[1,2,3,4]` 手动给出需要标记的点
* markevery=slice(30, 90, 3) 在给定的区间(30, 90)内，每三个数据点标记一个
* 整型是以数据顺序为准，若是浮点型则以坐标轴长度为准。

### 极坐标
* subplot_kw={'projection': 'polar'} 映射到极坐标上

## pytorch
https://pytorch.org/get-started/locally/#windows-anaconda

### 可重复性
* torch.backends.cudnn.benchmark = False 固定cuDNN在程序运行时使用的卷积算法
* torch.backends.cudnn.deterministic = True  程序运行时设定的算法也可能不同，将其确定下来
* torch.manual_seed(seed) 设置CPU和CUDA的RNG种子
* torch.cuda.manual_seed_all(seed) 设置所有GPU的RNG种子
* np.random.seed(seed) 设置NumPy的全局RNG种子

### 基础
* 函数以_结尾，说明函数会原地修改调用者
* torch.matmul 矩阵乘法
* torch.no_grad() 禁止gradient操作
* tensor.detach() 将张量从求梯度时建立的计算图中去掉，需要固定参数时很有用
* tensor.cpu() 在CPU内存中返回对象的copy，如果已经在CPU了，则什么也不做
* tensor.item() 当Tensor只有一个元素时，返回相应的python原生对象
* torch.mean(tensor) 可以用dim=aixNum指定要在多维数组的那个维度求mean, 用keepdim=True可以让结果以指定的dim消失，但其他dim保留的形式显示。
* tensor.std()
* tensor.squeeze(dim) 去除指定的只有一个元素的维度
* tensor.unsqueeze(dim) 添加一个只有一个元素的维度
* dim=x，x为tensor.shape的第x+1个元素
* tensor.transpose(dim1, dim2) 转置两个指定维度
* torch.cat([x, y, z], dim=1) 将张量x,y,z在dim=1轴上合并
* 模型的保存加载
    * torch.save(model.state_dict(), PATH)
    * model = Model(*args, **kargs)
    * model.load_state_dict(torch.load(PATH))
    * model.eval()
* dataloader
    * drop_last=True 如果batch_size不能被样本数整除，则丢弃最后一个不完整的batch。
    * pin_memory=True the data loader will copy Tensors into CUDA pinned memory(CUDA的固定内存，可直接用物理地址访问，速度快) before returning them. 

- 广播机制
    - 每个张量必须至少有1维
    - 维数遍历是从最后一维开始的，可广播的条件是，两个张量相应的维度
        - 相等
        - 其中一个是1
        - 其中一个不存在
    - 其中
        - 相等，就是正常情况
        - 其中一个不存在时，就加一维，令其成为1
        - 其中一个为1，会将其复制扩张到另一个张量的大小
- torch.normal(mean, std, size, *, out=None) → Tensor 生成正态分布的随机数组成的tensor

## tqdm
用在被遍历的可迭代对象上，自动产生进度条。
```python
from tqdm import tqdm
from tqdm.notebook import tqdm_notebook
import time
for i in tqdm(range(20), desc='Process Bar'):
    time.sleep(0.5)
```