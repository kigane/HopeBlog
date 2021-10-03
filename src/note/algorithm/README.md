---
title: 算法
lang: zh-CN
sidebarDepth: 1
---

## 随机生成表达式
[参考](https://softwareengineering.stackexchange.com/questions/195813/generating-random-math-expression/195850#195850)
```python
4 + 2                          
3 * 6 - 7 + 2                  
6 * 2 + (5 - 3) * 3 - 8        
(3 + 4) + 7 * 2 - 1 - 9        
5 - 2 + 4 * (8 - (5 + 1)) + 9  
(8 - 1 + 3) * 6 - ((3 + 7) * 2)
```

设置产生规则
* E -> I
* E -> (E '+' E)
* E -> (E '*' E)  

通过递归可以生成符合要求的表达式。但会产生很多多余的括号。

* E -> I
* E -> M '*' M
* E -> E '+' E
* M -> I
* M -> M '*' M
* M -> '(' E '+' E ')'  

这种规则不会产生多余的括号。

```c
// 简单的实现
int num = 0;
char num_buf[20] = {};
uint32_t choose(unit32_t n); // 产生0~n-1中的随机整数。

void gen_rand_expr(int flag)
{
    switch (choose(6))
    {
        case 0: 
            gen_rand_expr(false);
            strcat(buf, "*");
            gen_rand_expr(false);
            break;
        case 1:
            if (!flag) strcat("buf", "(");
            gen_rand_expr(false);
            strcat(buf, "+");
            gen_rand_expr(false);
            if (!flag) strcat("buf", ")");
        default:
            num = gen_num();
            sprintf(num_buf, "%u", num);
            strcat(buf, num_buf);
            break;
    }
}
```
