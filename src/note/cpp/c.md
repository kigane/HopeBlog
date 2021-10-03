---
title: C语言
lang: zh-CN
sidebarDepth: 1
---

## Union和匿名结构
Union: 定义类似struct，但内存分配方式不一样。struct会为所有成员分配内存空间，union是所有成员共用一个内存空间，大小以最大的成员为准。
匿名：通常嵌套于union或strcut中，可以用外层类型的变量名直接访问匿名的结构成员。union中的匿名比较有用，因为可以将一系列成员包裹起来以获取更大的内存空间。
```c
#include <stdio.h>
#include <stdint.h>

typedef union  
{
    union
    {
        uint32_t _32;
        uint16_t _16;
        uint8_t _8[2];
    } gpr[8]; // 32B

    struct
    {
        uint32_t eax, ecx, edx, ebx, esp, ebp, esi, edi;
        uint64_t pc;
    }; // 40B
} CPU;


int main(int argc, char const *argv[])
{
    CPU cpu;
    cpu.gpr[0]._32 = 666;
    printf("CPU size: %d\n", sizeof(CPU)); // 40
    printf("cpu.eax: %d\n", cpu.eax);      // 666
    return 0;
}
```

### bitfield
只能在struct或union中声明。  
```c
struct {
      /* field 4 bits wide */
      unsigned field1 :4;
      /*
       * unnamed 3 bit field
       * unnamed fields allow for padding
       */
      unsigned        :3;
      /*
       * one-bit field
       * can only be 0 or -1 in two's complement!
       */
      signed field2   :1;
      /* align next field on a storage unit */
      unsigned        :0;
      unsigned field3 :6;
}full_of_fields;
```
* 1bit的有符号bitfield只能表示0和-1.
* bitfield可以用const，volatile修饰
* C不能保证机器内的字段的排序。标准没有定义，取决于机器和编译器的实现。
* 要强制对准到存储单元边界，请在想要对齐的字段之前使用零宽度字段。
* gcc可能是从LSB开始分配的。

## getopt(int argc, char* const argv[], const char* optstring)
选项处理过程

```c
int optind; // argv中下一个要处理的元素的索引(初始为 1)
int opterr; // 是否输出错误信息
int optopt; // 导致错误的选项字符
char* optarg;

struct option {
    const char *name; // 长选项(--option)的名称
    int has_arg; // 0:无参数 1:有参数 2:参数可选
    int *flag; // flag为NULL：getopt_long()返回val。否则getopt_long()返回0，flag指向的变量值为val(如果该option用户设置了的话)
    int val; // 返回值或放入flag
}; // 结构体数组的最后一个元素必须设为0
```
如果getopt()找到下一个选项字符，就返回那个字符，更新optind和一个static变量nextchar

optstring包含了所有合法的选项，如果字符后面跟着一个`:`，说明需要参数，两个说明是可选参数。  
如果选项中包含文本(-oarg, o 是选项，arg是文本)，则文本会保存在optarg中其他情况下，optarg设为0.
GNU扩展,optstring中的`W:`表示将`-W foo`看作`--foo`看待。

默认情况下,getopt()按输入顺序排列argv的内容。所以，所有的非选项参数放在最后。
optstring的首字符决定使用的模式
* `+` 遇到任何一个非选项参数就终止选项处理
* `-` 强制将所有非选项参数看作选项的参数
`--` 在任何模式下都可以强行终止选项处理过程。

Errors
* 处理的选项不再optstring中
* 设置为有参数的选项没有检测到参数
处理
* 默认输出错误信息，将导致错误的选项字符放在optopt中，函数返回 ?
* 如果调用者将opterr设为0，则不会输出错误信息，函数仍返回 ?
* 如果optstring的第一个字符(不包括描述模式的`+,-`)为`:`。函数同样不输出错误信息，并且在设为有参数的选项没有参数时返回值变为`:`，从而可以区别出这种情况。

getopt()返回值
* 如果所有的命令行选项都处理完了，则返回 -1.
* 如果遇到没在optstring中指定的字符，返回 ?
* 如果遇到选项丢失参数的情况，看optstring中的第一个字符，如果是`:` 则返回 `:`，否则返回 ?

`int getopt_long(int argc, char* const argv[], const char* optstring, const struct option* longopts, int* longindex)`

getopt_long(),getopt_long_only()
* 当识别到短选项时，也返回值
* 长选项，见flag注释。
* Error和-1和getopt()一样
* 识别到模糊匹配和冗余参数会返回 ?
* longindex为longopts的索引，如果不为NULL的话

## readline
`char* readline(const char* prompt)`  
GNU的命令行编辑接口。readline会从终端读入一行并返回，其参数prompt为命令行开头的提示符(例如gdb中的"(gdb)")。其返回值不包括换行符，仅保留输入的文本。另外返回值使用malloc分配内存的，调用者需要手动free。

## str系列
strtok
* `char *strtok(char *str, const char *delim)`： 使用了static buffer，不是线程安全的。
* `char *strtok_r(char *str, const char *delim, char **saveptr)`: 多线程安全
* 这个函数用于将字符串分解为一系列非空token(子串)。第一次调用strtok时str是需要被分解的字符串，之后处理相同字符串时str必须为NULL。delim参数为用于分解的分隔符，可以指定多个字符为同一级分隔符。
* strtok内部有一个指针，该指针决定了每个token的起点。第一次调用时指向str的第一个字符，第二次调用时指向第一个分割符后第一个不是分割符的字符，如果找不到这样的字符，strtok返回NULL。
* 每个token的终点为分隔符(会被替换为'\0')或null('\0')。
* strtok的返回值要么是非空字符串，要么是NULL。(例如,'aaa;bbb'分隔符为';',顺序调用strtok的返回值为 'aaa', 'bbb', NULL)
```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char const *argv[])
{
    char *str1, *str2, *token, *subtoken;
    char *savaptr1, *saveptr2;
    int j;
    if (argc != 4)
    {
        fprintf(stderr, "Usage: %s string delim subdelim\n", argv[0]);
        exit(EXIT_FAILURE);
    }

    for (j = 1, str1 = argv[1]; ;j++, str1 = NULL)
    {
        token = strtok_r(str1, argv[2], &savaptr1);
        printf("saveptr1 %d %s\n", j, savaptr1); // 剩余未处理的部分
        if (token == NULL)
            break;
        printf("%d: %s\n", j, token);

        for (str2 = token; ; str2 = NULL)
        {
            subtoken = strtok_r(str2, argv[3], &saveptr2);
            if (subtoken == NULL)
                break;
            printf(" --> %s\n", subtoken);
        }
    }

    exit(EXIT_SUCCESS);
    return 0;
}
```


* `size_t strlen(const char *s)`:返回字符串的长度，即string中有多少byte。不包含'\0'。
* `size_t strnlen(const char *s, size_t max)`:返回字符串的长度，但不会超过最大值。
* `int strcmp(const char *s1, const char *s2)`: 比较两个字符串是否相等。逐字符比较，如果第一个不相等的字符s1 < s2，则返回负值，反之返回正值。都相等则返回0。
* `int strncmp(const char *s1, const char *s2, size_t n)`:比较两个字符串是否相等，但只比前n个。
* `int strcoll(const char *s1, const char *s2)`:比较两个字符串是否相等，基于程序当前的locale设置解释的字符串,locale的值为环境变量LC_COLLATE。
* `char *strcpy(char *dest,const char *src)`: 复制字符串，包含最后的'\0'。dest需要足够大。返回dest指针。
* `char *strncpy(char *dest,const char *src, size_t n)`:将src的前n个字符复制到dest。注意如果前n个字符中没有'\0'，则dest也不会添加，导致dest没有正常的终止符。如果n>strlen(src)+1，剩下的字符会用'\0'补全。
* `char *strcat(char *dest, const char *src)`: 将src(不包括'\0')连接到dest后，dest的'\0'会被覆盖，且会在整个字符串后添加一个'\0'。dest要足够大。
* `char *strncat(char *dest, const char *src, size_t n)`:类似strcat。但最多使用src中的n个字符。另外，src可以没有'\0'。

## scanf系列&printf系列

* `int scanf(const char *format, ...)`  
* `int fscanf(FILE *stream, const char *format, ...)`  
* `int sscanf(const char *str, const char *format, ...)`  
* `sprintf, snprintf, fprintf`

* `int vscanf(const char *format, va_list ap)`
* `int vfscanf(FILE *stream, const char *format, va_list ap)`
* `int vsscanf(const char *str, const char *format, va_list ap)`

format可能包含转换规约(%m.nf)，转换的结果被储存在format后的指针中，指针的类型要可format中的转换规约一致。如果format中的%数量多于指针参数的数量，则结果未定义。反之，则多余的指针参数会被忽略。
* scanf从stdin读取输入。
* fscanf从指定的文件流stream中读取输入。
* sscanf从字符串str中读取输入。
* 加v的读取变量参数列表(a variable arguemnt list)

返回值
* 成功：返回匹配的转换数
* 失败：EOF

PS：format可以是变量而非双引号字符串。例如：打印程序的命令行参数。
```c
while (--argc > 0)
    printf((argc > 1) ? "%s " : "%s", *++argv);
```

### 转换规约
格式：`%#.#char` 其中第一个#为maximum field width。即最多匹配|输出的字符数。.#表示保留的小数点位数。char为转换说明符。
printf的格式串中
* \NNN 最多3八进制数字，表示对应的ASCII字符
* \xHH 最多两个十六进制数字，表示对应的ASCII字符
* \uHHHH Unicode字符
* \UHHHHHHHH Unicode字符

输入
* %: 匹配%。
* d: 匹配有符号十进制整数，对应的指针类型必须为int*。
* i: 匹配有符号整数，对应的指针类型必须为int*。用于scanf，如果输入的整数以0x开头，则以16进制读，以0开头，则以8进制读，否则以十进制读。
* o: 匹配无符号八进制整数。对应的指针类型必须为unsigned int*。
* u: 匹配无符号十进制整数。对应的指针类型必须为unsigned int*。
* x|X: 匹配无符号十六进制整数。对应的指针类型必须为unsigned int*。
* f | e | E | g | a: 匹配浮点数。对应的指针类型必须为float*。
* s: 匹配一连串字符，到空白符或字符数组满了(要留一个位置给自动加上的'\0')为止。对应的指针类型必须为char数组。
* %.5s: 表示从给定字符串中最多读5个字符。
* c: 匹配一个字符，不会加上'\0'。对应的指针类型必须为char*。
* \[char set\]: 匹配指定字符集中的字符。对应的指针类型必须为char*。特殊字符`]`，要匹配它，必须将它放在`[`后，要排除它，则需放在`^`后。 `-`必须放在字符集的开头或结尾。
* p: 匹配指针。对应的指针类型必须为void**。
* n: 没看懂

指针类型修改符
* h: 针对diouxXn,将指针类型改为short int 或 unsigned short int。
* hh: signed char, unsigned char
* j: intmax_t,uintmax_t
* t: ptrdiff_t
* z: size_t
* l: signed long int, unsigned long int; 针对f,则指针类型变为double; 针对c,s，相关的指针类型被认为是wide charater?
* L: signed long long int, unsigned long long int; long long double

* m: %ms, %#mc 为输入字符串分配一块内存，指针类型改为char**。

输出
[一些使用示例](https://alvinalexander.com/programming/printf-format-cheat-sheet/)

// FLag characters
* #: #必须紧跟在%后面，用于o，总是显示0####。用于x，总是显示0x####。用于[aAeEfFgG]，总是会显示小数点。注意：0,0x是被算进field  width的。
* 0: 不足的位在左边用0补足。如果指定了浮点数的精度，则被忽略。
* -: 在maximum field width的左边界对齐。
* ' ': 空格。有符号正数最前面放一个空格。
* +: 有符号正数前面加+。

// Sing Unix Specification
* ': 十进制数以千为单位加逗号。
* I: idu, 使用本地对应的字符输出。

* d,i:十进制有符号
* o,u,x,X
* e,E: [-]d.ddde[+-]dd
* f,F: 常见小数形式
* g,G: 看情况转换为f,e,F,G中的一种
* a,A: 十六进制的小数形式0xh.hhhp[+-]
* c
* s
* p
* n
* %

### *号
```c
printf("%*d", 9, 123); // '      1223'
```
`*`在格式串中表示filed witdh和precision这两个部分使用下一个参数表示。`*`本身所在的`%`对应的参数则延后一位。  
在Single UNIX Specification中还有另一种等价表示。
```c
printf("%2$*1$d", 9, 123);
```
其中`%2$`代替了`%`，`*2$`代替了`*`，`#$`代表使用对应的参数位置。值得一提的是，这种写法可以通过`#$`使用同一个变量。可惜，C99中没有这个功能。

## regex系列
```c
#include <sys/types.h>
#include <regex.h>

int regcomp(regex_t *preg, const char *regex, int cflags);
int regexec(const regex_t *preg, const char *string, size_t nmatch,
            regmatch_t pmatch[], int eflags);
size_t regerror(int errcode, regex_t *preg, char *errbuf, size_t errbuf_size);
void regfree(regex_t *preg);

typedef struct {
    regoff_t rm_so; // 匹配的子串开头位置
    regoff_t rm_eo; // 匹配子串的结尾位置，相对于子串开头。
} regmatch_t;
```

regcomp()用于将正则表达式编译为适用于后续regexec()搜索的形式。  
* preg 指针指向pattern buffer的储存区域
* regex 指针指向c风格字符串(the null-terminated string)
* cflags 用于决定编译的类型
    * REG_EXTENDED：使用POSIX扩展的正则表达式语法
    * REG_ICASE: 忽略大小写
    * REG_NOSUB: 不比报告匹配的位置。regexec()中的nmatch, pmatch参数会被忽略。
    * REG_NEWLINE: `*`不会匹配 newline, `[^...]` 即使不包含newline，也不会匹配newline。紧跟在newline后`^`匹配空字符。newline前的`$`也立即匹配空字符。
* eflags 
    * REG_NOTBOL: `^`总是匹配失败。常用于一大堆字符串被拆分为多个子串分别传入regexec()处理。
    * REG_NOTEOL: `$`总是匹配失败。  
* nmatch 匹配几个
* pmatch 匹配结果
* regcomp()返回0表示成功编译，其他为错误码。regexec返回0表示匹配成功，REG_NOMATCH表示匹配失败，其他为错误码。

所有的正则表达式的搜索都必须使用编译过的pattern buffer。因此regexec的preg参数必须是经过regcomp编译过的。
regerror()用于将regcomp()和regexec()的错误码转换为错误信息，存储在errbuf中。  
regfree()释放预编译的pattern buffer的内存。  

## system
`int system(const char *command);` 在 stdlib.h 中

使用fork(2)创建子进程使用execl(3)执行command: execl("/bin/sh", "sh", "-c", command, (char *)NULL);

## popen/pclose
```c
#include <stdio.h>
FILE *popen(const char *command, const char *type);
int pclose(FILE *stream);
```
* popen() 通过创建一个管道打开一个进程。因为管道是单向的，所以type只能是r或w。
* popen() 的返回值是一个标准I/O流，必须用pclose()关闭。
* popen() type=w时，向返回的流中写相当于向command的标准输入写。type=r时，从流中读，相当于从command的标准输出中读。