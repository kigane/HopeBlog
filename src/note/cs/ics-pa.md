---
title: ICS-PA心得
lang: zh-CN
sidebarDepth: 1
---

## PA1

### NEMU准备
```js
nemu
├── include                    # 存放全局使用的头文件
│   ├── common.h               # 公用的头文件
│   ├── cpu
│   │   ├── decode.h           # 译码相关
│   │   └── exec.h             # 执行相关
│   ├── debug.h                # 一些方便调试用的宏
│   ├── device                 # 设备相关
│   ├── isa                    # ISA相关
│   ├── isa.h                  # ISA相关
│   ├── macro.h                # 一些方便的宏定义
│   ├── memory                 # 访问内存相关
│   ├── monitor
│   │   ├── log.h              # 日志文件相关
│   │   └── monitor.h
│   └── rtl
│       ├── pesudo.h           # RTL伪指令
│       └── rtl.h              # RTL指令相关定义
├── Makefile                   # 指示NEMU的编译和链接
├── Makefile.git               # git版本控制相关
├── runall.sh                  # 一键测试脚本
└── src                        # 源文件
    ├── device                 # 设备相关
    ├── engine
    │   └── interpreter        # 解释器的实现
    ├── isa                    # ISA相关的实现
    │   ├── mips32
    │   ├── riscv32
    │   ├── riscv64
    │   └── x86
    ├── main.c                 # 你知道的...
    ├── memory
    │   └── paddr.c            # 物理内存访问
    └── monitor
        ├── cpu-exec.c         # 指令执行的主循环
        ├── debug              # 简易调试器相关
        │   ├── expr.c         # 表达式求值的实现
        │   ├── log.c          # 日志文件相关
        │   ├── ui.c           # 用户界面相关
        │   └── watchpoint.c   # 监视点的实现
        └── monitor.c
```
* make ISA=$ISA run
* 在cmd_c()函数中, 调用cpu_exec()的时候传入了参数-1，但参数类型是uint64_t,因此实际的值为$2^{64}-1$，即0xffffffffffffffff。
* 三个对调试有用的宏(在nemu/include/debug.h中定义)
    * Log()是printf()的升级版, 专门用来输出调试信息, 同时还会输出使用Log()所在的源文件, 行号和函数. 当输出的调试信息过多的时候, 可以很方便地定位到代码中的相关位置
    * Assert()是assert()的升级版, 当测试条件为假时, 在assertion fail之前可以输出一些信息
    * panic()用于输出信息并结束程序, 相当于无条件的assertion fail
* 内存通过在nemu/src/memory/paddr.c中定义的大数组pmem来模拟. 在客户程序运行的过程中, 总是使用vaddr_read()和vaddr_write() (在nemu/include/memory/vaddr.h中定义)来访问模拟的内存. vaddr, paddr分别代表虚拟地址和物理地址.
* "单元"是指有独立含义的子串, 它们正式的称呼叫token.
* \33 即 ESC。
* makefile中使用awk，因为makefile中`$`会被特殊对待，所以awk的program text中的`$`要用`$$`表示。注意awk的action要写在`{}`中。
* fopen文件路径，在nemu目录下make run时，当前目录就是nemu。
* 超级经典错误，if (tokens[p].type = '*')。。。。少写个等号
* strncpy(dest, src, n) 如果n个字符中没有'\0'，dest中不会主动加。如果dest中原来字符数大于n,则复制后要使src==dest，需要手动添加'\0'(dest[n] = '\0')

```js
<expr> ::= <number>    # 一个数是表达式
  | "(" <expr> ")"     # 在表达式两边加个括号也是表达式
  | <expr> "+" <expr>  # 两个表达式相加也是表达式
  | <expr> "-" <expr>  # 接下来你全懂了
  | <expr> "*" <expr>
  | <expr> "/" <expr>
```

### 如何调试
一些软件工程相关的概念:
* Fault: 实现错误的代码, 例如if (p = NULL)
* Error: 程序执行时不符合预期的状态, 例如p被错误地赋值成NULL
* Failure: 能直接观测到的错误, 例如程序触发了段错误

调试其实就是从观测到的failure一步一步回溯寻找fault的过程, 找到了fault之后, 我们就很快知道应该如何修改错误的代码了. 但从上面的例子也可以看出, 调试之所以不容易, 恰恰是因为:
* fault不一定马上触发error
* 触发了error也不一定马上转变成可观测的failure
* error会像滚雪球一般越积越多, 当我们观测到failure的时候, 其实已经距离fault非常遥远了

理解了这些原因之后, 我们就可以制定相应的策略了:
* 尽可能把fault转变成error. 这其实就是测试做的事情, 所以我们在上一节中加入了表达式生成器的内容, 来帮助大家进行测试, 后面的实验内容也会提供丰富的测试用例. 但并不是有了测试用例就能把所有fault都转变成error了, 因为这取决于测试的覆盖度. 要设计出一套全覆盖的测试并不是一件简单的事情, 越是复杂的系统, 全覆盖的测试就越难设计. 但是, 如何提高测试的覆盖度, 是学术界一直以来都在关注的问题.
* 尽早观测到error的存在. 观测到error的时机直接决定了调试的难度: 如果等到触发failure的时候才发现error的存在, 调试就会比较困难; 但如果能在error刚刚触发的时候就观测到它, 调试难度也就大大降低了. 事实上, 你已经见识过一些有用的工具了:
  * -Wall, -Werror: 在编译时刻把潜在的fault直接转变成failure. 这种工具的作用很有限, 只能寻找一些在编译时刻也觉得可疑的fault, 例如if (p = NULL). 不过随着编译器版本的增强, 编译器也能发现代码中的一些未定义行为. 这些都是免费的午餐, 不吃就真的白白浪费了.
  * assert(): 在运行时刻把error直接转变成failure. assert()是一个很简单却又非常强大的工具, 只要在代码中定义好程序应该满足的特征, 就一定能在运行时刻将不满足这些特征的error拦截下来. 例如链表的实现, 我们只需要在代码中插入一些很简单的assert()(例如指针解引用时不为空), 就能够几乎告别段错误. 但是, 编写这些assert()其实需要我们对程序的行为有一定的了解, 同时在程序特征不易表达的时候, assert()的作用也较为有限.
  * printf(): 通过输出的方式观察潜在的error. 这是用于回溯fault时最常用的工具, 用于观测程序中的变量是否进入了错误的状态. 在NEMU中我们提供了输出更多调试信息的宏Log(), 它实际上封装了printf()的功能. 但由于printf()需要根据输出的结果人工判断是否正确, 在便利程度上相对于assert()的自动判断就逊色了不少.
  * GDB: 随时随地观测程序的任何状态. 调试器是最强大的工具, 但你需要在程序行为的茫茫大海中观测那些可疑的状态, 因此使用起来的代价也是最大的.

建议:
* 总是使用-Wall和-Werror
* 尽可能多地在代码中插入assert()
* assert()无法捕捉到error时, 通过printf()输出可疑的变量, 期望能观测到error
* printf()不易观测error时, 通过GDB理解程序的精确行为

### 一条指令在NEMU中的执行过程

事实上, 一个字节最多只能区分256种不同的指令形式. 当指令形式的数目大于256时, 我们需要使用另外的方法来识别它们. x86中有主要有两种方法来解决这个问题(在PA2中你都会遇到这两种情况):
* 一种方法是使用转义码(escape code), x86中有一个2字节转义码 0x0f, 当指令opcode的第一个字节是0x0f时, 表示需要再读入一个字节才能决定具体的指令形式(部分条件跳转指令就属于这种情况). 后来随着各种SSE指令集的加入, 使用2字节转义码也不足以表示所有的指令形式了, x86在2字节转义码的基础上又引入了3字节转义码, 当指令opcode的前两个字节是0x0f和0x38时, 表示需要再读入一个字节才能决定具体的指令形式.
* 另一种方法是使用ModR/M字节中的扩展opcode域来对opcode的长度进行扩充. 有些时候, 读入一个字节也还不能完全确定具体的指令形式, 这时候需要读入紧跟在opcode后面的ModR/M字节, 把其中的reg/opcode域当做opcode的一部分来解释, 才能决定具体的指令形式. x86把这些指令划分成不同的指令组(instruction group), 在同一个指令组中的指令需要通过ModR/M字节中的扩展opcode域来区分.

最一般的寻址格式是  
displacement(R[base_reg], R[index_reg], scale_factor)  
相应内存地址的计算方式为  
addr = R[base_reg] + R[index_reg] * scale_factor + displacement  
其它寻址格式都可以看作这种一般格式的特例

在NEMU中, RTL寄存器只有以下这些
* 不同ISA的通用寄存器(在nemu/include/isa/$ISA.h中定义)
* id_src, id_src2和id_dest中的操作数内容val(在nemu/include/cpu/decode.h中定义).
* 临时寄存器s0, s1, s2和t0(在nemu/include/rtl/rtl.h中定义)
* 零寄存器rz(在nemu/src/monitor/cpu-exec.c中定义), 它的值总是0
* x86的ISA相关译码信息中的内存基地址mbr

RTL基本指令包括(我们使用了一些简单的正则表达式记号):
* 寄存器-寄存器类型和寄存器-立即数类型的基本算术/逻辑运算, 包括rtl_(add|sub|and|or|xor|shl|shr|sar|setrelop)i?, 它们的定义用到了nemu/src/engine/interpreter/c_op.h中的C语言运算和interpret_relop()函数
* 寄存器-寄存器类型的乘除法运算, 包括rtl_i?(mul_[lo|hi]|div_[q|r]),
* 被除数为64位的除法运算rtl_i?div64_[q|r]
* guest内存访问rtl_lm, rtl_lms和rtl_sm
* host内存访问rtl_host_lm和rtl_host_sm
* 跳转, 包括直接跳转rtl_j, 间接跳转rtl_jr和条件跳转rtl_jrelop
* 终止程序rtl_exit(在nemu/src/monitor/cpu-exec.c中定义)

小型调用约定:
* 实现RTL伪指令的时候, 尽可能不使用dest之外的寄存器存放中间结果. 由于dest最后会被写入新值, 其旧值肯定要被覆盖, 自然也可以安全地作为RTL伪指令的临时寄存器.
* 实在需要使用临时寄存器的时候, 按照以下约定来使用:
* t0, t1, ... - 只能在RTL伪指令的实现过程中存放中间结果
* s0, s1, ... - 只能在译码辅助函数和执行辅助函数的实现过程中存放中间结果

RTL寄存器的生存期

任何指令都可以分解为以下4中操作
* 读取某一主存单元的内容，并将其装入某个寄存器（取指， 取数）
* 把一个数据从某个寄存器存入给定的主存单元中（存结果）
* 把一个数据从某寄存器送到另一寄存器或者ALU（取数，存结果）
* 进行算术或逻辑运算（PC+”1”，计算地址，运算）
