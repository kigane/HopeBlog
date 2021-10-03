---
title: gdb
lang: zh-CN
sidebarDepth: 1
---

## gdb cheatsheet
[gdb 文档](https://sourceware.org/gdb/onlinedocs/gdb/index.html#SEC_Contents)

* -g: 生成debugging symbols，使得调试更高效。-ggdb，包含gdb规定的符号。

gdb [--args] program [args]进入debug模式
* set args \<args\>
* run: 执行程序
* kill: 关闭执行的程序
* help

检查栈
* backtrace/where | bt: 查看调用栈
* backtrace/where full: 查看调用栈，也打印栈帧中的变量
* frame frame#: 查看指定帧(backtrace列出的信息开头的数字)

变量和内存
* x/nfu addr: examine addr。查看指定地址的值
    * n: 要打印的unit数量
    * f: format
    * u: unit (b:Byte 1B, h:Half-word 2B, w:Word 4B, g:Giant word 8B)
* p \<what\>: 查看变量的值
* p arr[n]@m: 查看数组arr从n开始数，共m个元素
* print/format \<what\>: 查看变量的值
* display/format \<what\>: 在每个step指令后打印变量的值
* undisplay display#: 不再监视
* enable/disable display#
* \<what\>
    * expressions
    * filename::variable_name
    * function::variable_name
    * {type}address : 在address处的内容，解释为C的type类型。
    * $register: 有名字的寄存器，如$esp--栈指针，$ebp--帧基址，$eip--指令指针
* format
    * a: 指针
    * c: 读为int，打印为char
    * d: 有符号int
    * f: 浮点数
    * o: 八进制int
    * s: Try to treat as C string
    * t: 二进制int
    * u: 无符号int
    * x: 十六进制int

查看源码
* list line_number: 查看101行附件10行
* list from,to: 查看从from到to行
* list -: 查看前10行
* list \<where\>

断点
* break where: 在指定位置设置一个断点(会输出断点所在具体位置，注意到断点有序号，Breakpoint 1 at 0x29fa0: file main.cc, line 52.)
* where
    * function_name
    * line_number: 当前文件的某行
    * file:line_number
* delete breakpoint#: 删除指定断点
* enable breakpoint
* disable breakpoint
* clear: 删除所有断点
* condition 1 var==666: 仅当变量var的值为666时，才触发断点1。
* break/watch \<where\> if \<condition\>
* watch where // breakpoint 和 watchpoint 共用编号。
* watchpoint 有两种实现方式，具体取决于你的系统。软件实现方式为在每一步执行后都测试一次expr的值，会很慢。硬件方式更快。
* watch [-l|-location] expr [thread thread-id] [mask maskvalue]  为expr设置一个监视点。如果expr的值改变了，则停止执行。
    * thread thread-id 指定某个线程，只有该线程修改expr的值时才停止执行。(仅限硬件实现)
    * -l 告诉gdb，如果expr的结果是个地址，则查看该地址的内容。如果结果不是地址，则输出一个错误。
    * mask maskvalue 默认开启-l。maskvalue用于同时查看多数地址。 watch foo mask 0xffffff00？
* rwatch expr 在expr被程序读取时break
* awatch expr 在expr被读取或被修改时都break
* delete/enable/disable watchpoint#

步进
* gdb的一个有用的特性：如果直接按回车，会重复执行上一个命令
* step: 到下一行。如果有函数会进入函数
* next: 到下一行。不会进入函数
* finish: 将当前函数执行完
* continue | cont: 继续正常执行
* quit: 退出

反向执行
* record 反向执行的前置条件
* reverse-step
* reverse-next
* reverse-continue
* reverse-finish 回到函数执行前
* set exec-direction reverse 所有next,step...全变为逆向操作
* set exec-direction forward 恢复正常

信息
* info args: 当前栈帧的函数参数
* info breakpoints/watchpoints
* info locals: 当前栈帧的本地变量
* info sharedlibrary: 列出已加载的动态库
* info signals: 列出所有信号和他们当前是如何处理的
* info threads
* show directories: 列出GDB搜索涉及到的源文件
* show listsize
* whatis variable_name: 输出变量的类型

## gdb-tui
标志
* `>` 当前执行的行
* 断点表示 [b|B][+|-]
    * `b` 表示还没到的断点
    * `B` 表示至少到过一次的断点
    * `+` 表示 enabled
    * `-` 表示 disabled

* C-x a/A/C-a: 进入或离开TUI模式
* C-x 1: 保留一个窗口
* C-x 2: 保留两个窗口
* C-x o: 切换当前活动的窗口
* C-x s: 切换到TUI的单键模式
* PgUp,PgDn,上下左右可用于操作活动窗口。
* 当焦点不在cmd窗口时，C-p相当于Up,C-b相当于Left,C-f相当于Right,C-n相当于Down
* C-l: 刷新窗口

单键模式
* s: step
* i: step Into
* n: next
* o: step Over
* r: run
* c: continue
* f: finish
* d: down 在frame stack中向下一层 
* u: up 在frame stack中向上一层 
* q: 退出单键模式
* v: info local
* w: where

TUI命令
* tui enable: 进入上次使用的tui窗口模式，或默认窗口模式。
* tui disable
* tui new-layout name window weight [window weight ...]: 新建一个名为name的TUI窗口布局。
    * 可以使用layout name使用该布局
    * window 有四种 src,asm,regs,cmd
    * weight 是权重，用于确定每个窗口占屏幕的比例。status的权重应总是设为0
    * 默认是从上到下分割。加-horizontal可改为从左到右分割。
    * 示例1：(gdb) tui new-layout example src 1 regs 1 status 0 cmd 1
    * 示例2：(gdb) tui new-layout example {-horizontal src 1 asm 1} 2 status 0 cmd 1
    * 9.2版本还没有实装
* layout name：使用内置布局或新建的布局
    * prev: 前一个
    * next: 后一个
    * src: 显示源码和命令窗口
    * asm：显示汇编和命令窗口
    * split：显示源码，汇编和命令窗口
    * regs：显示寄存器窗口。如果在src模式则上为寄存器，中为源码。如果在split和asm模式，则上为寄存器，中为汇编。
* focus name: 改变当前活动窗口。
* refresh: 刷新窗口
* winheight name +count： 改变窗口大小
* winheight name -count： 改变窗口大小
* tui reg group：显示不同的寄存器分组
    * general: 通用寄存器
    * float: 浮点数寄存器
    * system: 系统寄存器
    * vector: 向量寄存器
    * all

* set tui compact-source [on|off]：设置源码的行号和代码间的距离。on-仅一个空格，off-一个tab。

## 小技巧
* 对一个大数组，p arr[n]@m，查看数组arr从n开始数，共m个元素
* gdb 命令输出在src模式下可见部分太小了。可以使用
    * set trace-commands on
    * set logging on
    * cd where/gdb/is/running
    * tail -f -n 30 gdb.txt
    * less +F gdb.txt 可以代替tail。 ctrl+c，退出等待输入模式，进入普通less模式，shift+f进入。
    * 进入TUI模式后，日志会停止，这是个gdb bug。先set logging off，再set logging on即可正常显示。
