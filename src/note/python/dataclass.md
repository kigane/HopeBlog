---
icon: page
title: Python数据类
author: Leonhardt
category: Python
tag:
  - python
sidebarDepth: 1
sticky: false
star: false
time: 2022-04-05
---

## dataclasses
数据类，即一种主要用于存放数据的类。如果要手动写的话，需要在`__init__`方法中写一大段样板代码，并且可能需要重写`__eq__`，`__repr__`等方法。这些代码都高度重复，手写又很麻烦。Python从3.7开始内置了dataclasses模块，用于解决这个问题。

### 基本用法

```python
from dataclasses import asdict, astuple, dataclass, field
import inspect

@dataclass()
class Book():
    id: int = 0
    name: str = 'no name'
    isbn: str
    references: list = field(default_factory=list)

b = Book(0, 'hello', '123-2341-5345')
print(inspect.getmembers(Book, inspect.isfunction))
print(astuple(b))
print(asdict(b))
```
定义一个Book数据类，有三个属性，其中两个有默认值。用inspect模块查看Book类，可知其自动添加了`__init__`,`__eq__`,`__repr__`三个方法。通过dataclasses模块提供的astuple,asdict方法可以很轻松的将Book对象转换为其值的元组或字典。

### 冻结实例
在@dataclass()装饰器参数中指定frozen=True即可。这样实例在创建后就不可更改，若有更改则会引发FrozenInstanceError。

```python
@dataclass(frozen=True)
class Person:
     first_name: str = "Ahmed"
     last_name: str = "Besbes"
     age: int = 30
     job: str = "Data Scientist"
```

### 计算属性
有时候需要的某些属性是依赖于其他属性定义的。这时可以使用`field()`和定义`__post_init__()`函数处理这些属性。  
field中
- init=False 表示初始化类实例时不需要传入该参数
- repr=True 表示在`__repr__`中显示该属性。为False则不显示。

```python
from dataclasses import dataclass, field

@dataclass
class Person:
    first_name: str = "Ahmed"
    last_name: str = "Besbes"
    age: int = 30
    job: str = "Data Scientist"
    full_name: str = field(init=False, repr=True)
    def __post_init__(self):
         self.full_name = self.first_name + " " + self.last_name
```

### 实例排序
dataclasses默认没有添加`__gt__`,`__ge__`等比较方法的。在@dataclass()装饰器参数中指定order=True后，默认的比较方法是：按照属性在类中的定义顺序逐一比较。
         

## pydantic
作用和dataclasses类似。功能更强大，但需要安装pydantic包。

### 基础使用

```python
import pydantic
from typing import Optional

class Book(pydantic.BaseModel):
    title: str
    author: str
    publisher: str
    price: float
    isbn_10: Optional[str]
    isbn_13: Optional[str]
    subtitle: Optional[str]
    author2: Optional[Author]
```

### 属性检查
定义一个方法，有两个参数，一个类，一个属性值。用`@classmethod`修饰，再用`@pydantic.validator("isbn_10")`指定要检查的属性，

```python
class ISBN10FormatError(Exception):
    def __init__(self, value: str, message: str) -> None:
        self.value = value
        self.message = message
        super().__init__(message)


class Book(pydantic.BaseModel):
    ... # 同上

    @pydantic.validator("isbn_10")
    @classmethod
    def isbn_10_valid(cls, value) -> None:
        """Validator to check whether ISBN10 is valid"""
        chars = [c for c in value if c in "0123456789Xx"]
        if len(chars) != 10:
            raise ISBN10FormatError(
                value=value, message="ISBN10 should be 10 digits.")

        def char_to_int(char: str) -> int:
            if char in "Xx":
                return 10
            return int(char)

        if sum((10 - i) * char_to_int(x) for i, x in enumerate(chars)) % 11 != 0:
            raise ISBN10FormatError(
                value=value, message="ISBN10 digit sum should be divisible by 11."
            )
        return value
```

### 模型检查

```python
class ISBNMissingError(Exception):
    def __init__(self, title: str, message: str) -> None:
        self.title = title
        self.message = message
        super().__init__(message)

class Book(pydantic.BaseModel):
    ... # 同上
    @pydantic.root_validator(pre=True)
    @classmethod
    def check_isbn_10_or_13(cls, values):
        """Make sure there is either an isbn_10 or isbn_13 value defined"""
        if "isbn_10" not in values and "isbn_13" not in values:
            raise ISBNMissingError(
                title=values["title"],
                message="Document should have either an ISBN10 or ISBN13",
            )
        return values
```

### 设置
在pydantic数据类内定义Config类，在Config类中使用pydantic设置。

```python
    class Config:
        """Pydantic config class"""
        allow_mutation = False # 让实例不可变
        anystr_lower = True # 将所有str保存为str.lower()
```

### 将pydantic数据对象转为python字典对象

```python
print(books[0].dict(exclude={"price"})) # 转为字典时不包括price属性
print(books[0].dict(include={"price"})) # 转为字典时只包括price属性
```