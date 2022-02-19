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
