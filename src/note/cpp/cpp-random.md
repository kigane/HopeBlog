---
title: 随机数
lang: zh-CN
sidebarDepth: 1
---

## 线性同余法
```cpp
unsigned int PRNG() // pseudo-random number generator
{
    static unsigned int seed{5323};
    seed = 8253729 * seed + 2396403;
    return seed % 32768;
}
```
原理大致如上。这样简单的随机数不够"好"。

## C 标准库中的随机数生成
原理就是线性同余法，不同编译器实现略有不同，且大多有缺陷。仅供学习使用。
```cpp
#include <cstdlib> // for std::rand() and std::srand()
#include <ctime> // for std::time()

void PrintNumbersWithRand()
{
    std::srand(static_cast<unsigned int>(std::time(nullptr)));
    // 因为某些编译器中rand算法的缺陷，导致第一个随机数大概率相同，所以这里先调用一次去掉第一个
    std::rand();

    // 打印 100 个随机数
    for (int count{1}; count <= 100; ++count)
    {
        std::cout << std::rand() << '\t';

        if (count % 5 == 0)
            std::cout << '\n';
    }
}
```

## 一个好的伪随机数生成器(PRNG)的标准
* 应该以大致相同的概率生成每个数字(生成六个数字5,6,7,8,9的概率大致相等)，即数字分布均匀性。
* 生成序列中的下一个数字应该是不可预测。(num = num + 1)
* 生成的数字序列应该有良好的空间分布(生成0-9之间的随机数，不能只生成5,6,7,8,9，生成的数落在大，中，小范围内的概率也应大致相当)，即空间分布均匀性。
* 所有的PRNG都有周期性。通常，周期越大越好。

## 更好的随机数生成器
使用梅森旋转演算法(Mersenne Twister)。在C++11中引入。
```cpp
#include <iostream>
#include <random> // for std::mt19937
#include <ctime> // for std::time
 
int main()
{
	// 初始化 mersenne twister，将时间作为 seed。
	std::mt19937 mersenne{ static_cast<std::mt19937::result_type>(std::time(nullptr)) };
 
	// 生成 1-6 之间随机整数的PRNG
	std::uniform_int_distribution die{ 1, 6 }; // C++17
	// std::uniform_int_distribution<> die{ 1, 6 }; // C++11
 
	for (int count{ 1 }; count <= 48; ++count)
	{
		std::cout << die(mersenne) << '\t';

		if (count % 6 == 0)
			std::cout << '\n';
	}
}
```

## Effolkronium’s random library.
一个随机数库(纯头文件)。提供了便于使用的API。
```cpp
#include <iostream>
#include "random.hpp"
 
// get base random alias which is auto seeded and has static API and internal state
using Random = effolkronium::random_static;
 
int main()
{
	std::cout << Random::get(1, 6) << '\n';
	std::cout << Random::get(1, 10) << '\n';
    // decltype(val) is long double
	auto val = Random::get(1.l, -1.l)
	return 0;
}
```