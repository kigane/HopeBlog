---
title: Effective Python
author: Leonhardt
category: Python
tag:
  - python
sidebarDepth: 1
sticky: false
star: false
time: 2021-12-16
---

## 用@property替代getter, setter写法
- 用@property修饰的方法可以当做属性使用，被修饰的方法可看作属性的getter方法。
- 用@attr.setter修饰的方法为属性的setter方法。
```python
class A:

    def __init__(self) -> None:
        self._grade = 0

    @property
    def grade(self):
        print('getter triggered')
        return self._grade
    
    @grade.setter
    def grade(self, val):
        self._grade = val
        print('setter triggered')
    
if __name__ == '__main__':
    a = A()
    a.grade = 5
    print(a.grade)
```

## 字典转对象
python读取json等数据时，会返回字典。因为python的字典不能用点操作符来访问，只能用`[key]`来访问，如果key是字符串，又嵌套了很多层，取内层值的时候很麻烦。因此希望将字典转换为对象，使用点操作符来访问。

```python
class DictObj():

    def __init__(self, in_dict):
        for k, v in in_dict.items():
            if isinstance(v, (list, tuple)):
                setattr(self, k, [DictObj(x) if isinstance(x, dict) else x for x in v])
            else:
                setattr(self, k, DictObj(v) if isinstance(v, dict) else v)
```