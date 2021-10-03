---
title: C++ 小知识
lang: zh-CN
sidebarDepth: 2
---

## lvalue & rvalue
简单来说
* 左值(lvalue)：是变量，占用某一块确定的内存。
* 右值(rvalue)：是字面量或临时量。

```cpp
int i = 10; // i 是左值， 10 是右值(字面量) 
int a = i; // a, i 都是左值
int b = a + i; // b 是左值，a+i 是右值(临时量)

int GetInt(){ int a = 7;return a;}    // 返回值是右值
int& GetInt(int& a){ a = 7;return a;} // 返回值是左值

// 有一些方法如下
void GetVal1(int a){cout << a;}
void GetVal2(int& a){cout << a;}
void GetVal3(const int& a){cout << a;}
void GetVal4(int&& a){cout << a;}

GetVal1(a+i); // 正常
GetVal2(a+i); // 编译错误，非常量引用的初始值必须为左值
GetVal3(a+i); // 正常。常量引用的初始值可以是左值，也可以是右值 ==> 所以字符串参数常常声明为常量引用。
GetVal4(a+i); // 正常。&& 表示右值引用。
GetVal4(b); // 编译错误，无法将右值引用绑定到左值。
```

有啥好处呢？好处在于可以通过重载函数，区分出传入的参数是不是临时的，因此可以做一些特殊处理。
```cpp
// 可以接受左值和右值
void PrintName(const string& name){cout << "[lvalue]" << name;}
// 对于右值，有特殊重载
void PrintName(string&& name){cout << "[rvalue]" << name;}
```

## 移动语义(move semantics)
先看一个例子
```cpp
class String
{
public:
    String() = default;
    String(const char* str)
    {
        printf("Created!\n");
        m_Size = strlen(str);
        m_Data = new char[m_Size];
        memcpy(m_Data, str, m_Size);
    }

    String(const String& other)
    {
        printf("Copied!\n");
        m_Size = other.m_Size;
        m_Data = new char[m_Size];
        memcpy(m_Data, other.m_Data, m_Size);
    }

    ~String()
    {
        printf("Deleted!\n");
        delete m_Data;
    } 

    void Print()
    {
        for (int i = 0; i < m_Size; ++i)
            printf("%c", m_Data[i]);
        printf("\n");
    }
private:
    int m_Size;
    char* m_Data;
};

class Entity
{
public:
    Entity() = default;
    Entity(const String& name) : m_Name(name) {}
    void PrintName(){ m_Name.Print(); }
private:
    String m_Name;
};

int main() {
    Entity entity("Sekiro");
    entity.PrintName();
}
```
执行结果为：
```cmd
Created!
Copied!
Deleted!
Sekiro
```
这意味着，在Entity(String name)的初始化列表中，为右值"Sekiro"调用String的相应构造函数，再调用String的拷贝构造函数，将其值传入Entity.m_Name，最后销毁保存"Sekiro"的临时对象。 
一个简单的赋值操作，竟调用了两次构造函数，在堆上分配了两次内存。问题很大:thinking:。  

解决方法是，对于传入的右值做特殊处理，在构造出来临时对象后，直接赋值，不要再调用拷贝构造函数。
```cpp
// 在String中添加
String(String&& other) noexcept
{
    printf("Moved!\n");
    m_Size = other.m_Size;
    m_Data = other.m_Data;

    // 临时变量会被销毁，所以需要防止析构时删除数据
    other.m_Data = nullptr;
    other.m_Size = 0;
}

// 在 Entity 中修改 std::move(name) 相当于 (String&&) name
Entity(const String& name) : m_Name(std::move(name)){}
```
现在执行结果为
```cmd
Created!
Moved!
Deleted!
Sekiro
```
节省了一次堆内存分配。

## inline
直接在类中声明并实现的方法是隐式的inline函数，不需要再加inline前缀。

## constexpr
指明变量或函数的值可以出现在常量表达式中。通过添加constexpr来声明的变量或函数，可以在编译期进行计算。
* literal type: 标量类型，引用类型，以及前两种的数组类型。(C++20还可能有更多)
* constexpr 变量，函数返回值和参数类型必须是literal type。
* inline是将函数体直接搬过来，减少函数调用的开销。constexpr是直接将编译器可计算的结果算出来，来减少调用，执行函数的开销。
```cpp
#include<iostream>
using namespace std;
  
constexpr long int fib(int n)
{
    return (n <= 1)? n : fib(n-1) + fib(n-2);
}
  
int main ()
{
    // value of res is computed at compile time. 执行的非常快。
    const long int res = fib(30); 
    cout << res;
    return 0;
}
```

## 可变参数
* 在 stdarg.h 中
* va_list 为存储可变参数的类型。即function中的 `...`
* va_start() 宏。有两个参数，第一个为va_list类型的变量，第二个为可变参数`...`的前一个参数。用于初始化可变参数列表。
* va_arg() 宏。有两个参数，第一个为va_list类型的变量，第二个为用于接受可变参数的类型。用于获取可变参数列表中的下一个参数。(PS:printf的format string就是用于确定va_arg需要处理的变量类型。)
* va_end() 宏。一个参数，为va_list类型的变量。用于清理va_list

示例：
```cpp
#include <stdarg.h>
double avg(int num, ...)
{
    va_list args;
    double sum = 0;
    va_start(args, num);
    for (int i = 0; i < num; ++i)
    {
        sum += va_arg(args, double);
    }
    va_end(args);
    return sum / num;
}

int main(int argc, const char* argv[])
{
    printf("average = %4.2f\n", avg(3, 1.2, 3.4, 5.6));
```
PS: float在通过`...`传递时，会被提升为double。如果用float接收，程序会abort。
