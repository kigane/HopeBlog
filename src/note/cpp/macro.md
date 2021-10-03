---
title: 宏
lang: zh-CN
sidebarDepth: 1
---

## 预定义的宏
注意：不同的编译器宏的名称可能不同。
* `__func__` 所在函数名
* `__FILE__` 所在文件名 
* `__LINE__` 所在行数 
* `__DATE__` 当前源文件的编译时间
* `` 

[MSVC](https://docs.microsoft.com/en-us/cpp/preprocessor/predefined-macros?view=msvc-160)

## #操作符

* #x 用来把参数转换成字符串
* a##b 将两个单独的符号合并成一个，且该符号必须是有效的。
* `## __VA_ARGS__` 这里##的作用在于，当可变参数的个数为0时，这里的##起到把前面多余的","去掉的作用,否则会编译出错
```cpp
#define __T(x)  L ## x // 如果x是字符串 "abc" 则__T(x) 相当于 L"abc"

#define paster( n ) printf_s( "token" #n " = %d", token##n )
int token9 = 9;
int main()
{
   paster(9); // 输出 token9 = 9
}
```

## 多行宏
对于复杂的多行宏。推荐的写法为
```c
#define some_marco()\
  do {\
    contents\
  } while (0)
```
[解释](https://stackoverflow.com/questions/1067226/c-multi-line-macro-do-while0-vs-scope-block)

