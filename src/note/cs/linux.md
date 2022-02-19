---
title: Linux - Ubantu
lang: zh-CN
sidebarDepth: 2 
---

## 安装
[NJU PA0](https://nju-projectn.github.io/ics-pa-gitbook/ics2020/0.1.html)  
分区：此电脑->管理->磁盘管理，选择磁盘，右键->压缩卷，分配适当空间即可，不用新建简单卷。  

## 设置
* sudo apt install gnome-tweaks
* sudo apt remove gnome-shell-extension-ubantu-dock
* sudo dpkg -i package_file.deb

## 关于键位
* C == ctrl, S == shift, M == meta | alt | esc
* ESC == `C-[`
* Up == `C-p`
* Down == `C-n`
* Left == `C-b`
* Right == `C-f`

在vim等应用中`C-s`会导致无法交互，据说是和software flow control有关。按`C-q`可以退出这种状态。

## ANSI转义码
* CSI 控制序列起始符 `ESC[`
* SGR 修改接下来的字符外观 `CSI n m` n为字符外观选项，可以控制字符颜色，斜体，下划线，闪烁等外观。m为SGR终止符。`CSI n m`相当于`CSI 0 m`。可以使用多个选项，中间用`;`隔开即可。如`\033[4;31m`，为红色带下划线。
* `ESC` = `\033` = `\e`(echo -e时)

n | Name 
-|------
0 | Reset or normal, All attributes off
1 | Bold or increased intensity 
2 | Faint, decreased intensity, or dim
3 | Italic 
4 | Underline 
5 | Slow blink 
9 | Crossed-out, or strike 
10 | Primary (default) font 
11–19 | Alternative font
30–37 | Set foreground color 
38 | Set foreground color, Next arguments are 5;n or 2;r;g;b
39 | Default foreground color
40–47 | Set background color
48 | Set background color, Next arguments are 5;n or 2;r;g;b
49 | Default background color

### 8-bit颜色
* ESC[38;5;⟨n⟩m 设置字体颜色
* ESC[48;5;⟨n⟩m 设置背景颜色
* 0-  7:  standard colors (as in ESC [ 30–37 m) 
* 8- 15:  high intensity colors (as in ESC [ 90–97 m)
* 16-231:  6 × 6 × 6 cube (216 colors): 16 + 36 × r + 6 × g + b (0 ≤ r, g, b ≤ 5)
* 232-255:  grayscale from black to white in 24 steps

### 24-bit颜色(RGB)
* ESC[38;2;⟨r⟩;⟨g⟩;⟨b⟩m 设置RGB字体颜色
* ESC[48;2;⟨r⟩;⟨g⟩;⟨b⟩m 设置RGB背景颜色

## Unix哲学:
* 每个程序只做一件事, 但做到极致
* 用程序之间的相互协作来解决复杂问题
* 每个程序都采用文本作为输入和输出, 这会使程序更易于使用

## Linux命令

```shell
df -h # 查看硬盘空间使用情况
su - # 切换到root用户
adduser username sudo # 将用户分到sudo组
hostnamectl # 显示主机信息 在/etc/hostname /etc/hosts 中修改主机名
lscpu # 查看cpu信息
```

文件管理 - cd, pwd, mkdir, rmdir, ls, cp, rm, mv, tar  
文件检索 - cat, more, less, head, tail, file, find  
输入输出控制 - 重定向, 管道, tee, xargs  
文本处理 - vim, grep, awk, sed, sort, wc, uniq, cut, tr  
系统监控 - jobs, ps, top, kill, free, demsg, lsof  
具体见Shell页

### 别名
* `alias` 列出已定义的别名
* `alias shortname="your custom cmd"` 定义临时别名
* `unalias shortname` 取消
* `unalias -a` 全部取消
* 在~/.bashrc中定义，并 source ~/.bashrc。定义永久别名

PS:alias不支持参数，所以要使用参数的话，可以在.bashrc中定义shell函数。

### 特别
```shell
sudo dmesg # 输出OS的启动日志
```

## 环境变量
* 临时定义：`export name=value` -- 只对当前shell及其子shell有效
* 永久定义，使用配置文件
    * 用户: `~/.bash_profile`
    * 系统: `/etc/profile`

其他相关命令
* `env`: 查看所有环境变量
* `set`: 显示本地定义的shell变量,包括在.bashrc中定义的函数
* `unset`: 清除环境变量 unset HELLO
* `readonly`: 设置只读环境变量 readonly HELLO

## 工具

### strace
strace 的作用就是跟踪程序在运行时所做的每个系统调用，然后将跟踪结果显示在屏幕上供你查看。

* -f 跟踪所有 fork 的子进程
* -t 报告每次调用的时间，
* -e trace=open,close,read,write 只跟踪对这些系统调用的调用，并忽略所有其他调用

### tmux
`sudo apt-get install tmux`

* 获取所有命令列表: C-b ?
* 创建Session: tmux new -s session_name
* 离开Session: C-b d(程序仍会继续运行)
* 回到Session: tmux ls; tmux attach-session -t 0
* 结束Session: tmux kill-session -t session_name
* 列出所有Session: C-b s
* 重命名当前Session: C-b $

管理Tmux窗口
* `C-b c` 创建新窗口
* `C-b w` 列出所有窗口，从中选一个作为当前窗口
* `C-b 0-9` 切换到窗口0-9
* `C-b p | n` 切换到前|后一个窗口
* `C-b ,` 重命名当前窗口

pane
* `C-b %` 分割为左右两个pane
* `C-b "` 分割为上下两个pane
* `C-b o` 跳转到下一个pane
* `C-b h` 跳转到左边的pane。同理 j,k,l.
* `C-b q` 显示pane数量
* `C-b ;` 在当前和上一个pane间反复横跳
* `C-b x` 关闭当前pane
* `C-b {` 将当前pane移动到前一个pane位置
* `C-b }` 将当前pane移动到后一个pane位置
* `C-b C-o` 将所有窗口顺时针旋转
* `C-b M-o` 将所有窗口逆时针旋转
* `C-b !`   move the current pane into a new separate window (‘break pane’)

命令行
* `C-b [` 进入scroll模式，q退出
* `C-b PgUp` 进入scroll模式，并向上翻一页

调整窗口大小
* `C-b :` 会在底部显示命令行
    * 输入 resize-pana -Direction #
    * Direction: U, D, L, R
    * #：数字，当前窗口向某方向上调整的尺寸。

### tree
`sudo apt-get install tree`

* tree dir: 以树状形式展示文件夹内容
* tree: 相当于`tree .`
* -d: 只显示dir
* -f: 显示每个文件的完整路径
* -i: 不显示缩进
* -L level: 设置最大显示深度
* -P pattern: 只显示pattern匹配的文件(如果要显示.xx，需要加上-a)
* -I pattern: 不显示pattern匹配的文件
* --ignore-case
* --filelimit #: 不展开包含#个文件以上的文件夹

文件显示选项
* -Q: 文件名加上双引号
* -u: 显示用户名
* -g: 显示用户组名
* -D: 显示最后修改日期
* -s: 显示文件大小(byte)
* -h: 显示文件大小(更人性化)
* -F: 显示文件类型(/:dir, =:socket fils, *:可执行文件, |:FIFO, >:doors)

排序
* -t: 最后修改时间
* -U: 不排序
* -r: 逆序
* --dirsfirst: 文件夹放前面
* --sort=size (ctime, mtime, version)

输出模式
* -X: xml
* -J: json
* -H baseHREF: html


## makefile
[GNU make 手册](https://www.gnu.org/software/make/manual/html_node/index.html#SEC_Contents)

echoing：回显。通常make会将先执行的命令打印出来再执行该命令。使用-s选项关闭所有命令的回显。-n选项只打印命令，不执行。
在命令行开头加上`@`可关闭该命令的回显(-n仍会打印出来)。  

在命令行开头加上`-`表示如果该命令执行发生错误就忽略它。

### 基本规则
```makefile
target: file1 file2
    gcc -o a.out file1 file2
```

* #代表注释
* 命令行前必须有\<tab\>
* target和依赖文件之间以 `:` 隔开
* make target : 会执行相应命令行
* make: 会默认执行第一个target

```makefile
LIBS = -lm
OBJ = file1 file2
target: ${OBJ}
    gcc -o $@ ${OBJ} ${LIBS}
```

makefile的变量
* 变量从行开头开始写
* = 附近可以有空格
* 习惯上，用大写字母
* $(var)或${var}取得变量的值
* 可以使用shell的环境变量
    * 在make target命令行中指定的环境变量优先考虑
    * makefile内部定义的环境变量次之
    * shell的环境变量最后
* `$@` 代表 target 位置的内容
* `$xx` 称为[automatic variables](https://www.gnu.org/software/make/manual/html_node/Automatic-Variables.html)

### 设置变量&变量展开
make中变量展开方式有两种
* 递归展开: 使用 `=`或`define\n....\n endef`。 类似引用。
* 简单展开：使用 `:=` 或 `::=`。逐行处理。
* 变量还有一种条件设置方式：使用`?=`。即如果该变量已经定义了，不会再次定义覆盖以前的。

```makefile
foo = $(bar)
bar = $(ugh)
ugh = Huh?

x := abc
y := $(x) efg
x := later
x ?= condition

recursively:
    echo $(foo) # Huh? 
simply:
    echo $(y) # abc efg
condition:
    echo $(x) # later
```

### 判断
```makefile
ifeq (lhs, rhs) # ifneq(l, r)
# 如果lhs=rhs，则执行
else ifeq(l, r)
# 如果l=r，则执行
else
# 其他情况
endif
```

### include
* `include filenames`: 在make读到这一行的时候暂停，去读filenames，读完继续。如果指定的filename不存在，则会先输出警告信息，在make remade之后如果还不存在，则报错(fatal)。文件搜寻顺序为当前文件夹，prefix/include (通常是/usr/local/include) /usr/gnu/include, /usr/local/include, /usr/include。
* `-include filenames`: 如果filename不存在，则忽略它。

### 函数
函数调用语法
```makefile
$(function arg0, arg1, ...)
```

#### 文本处理函数
* subst函数: $(subst from, to , text)
* patsubst函数: $(patsubst pattern, replacement, text),注意这里的`%`相当于正则表达式中的通配符`*`。
* strip函数: $(strip string),将字符串开头和结尾的空白字符删除，字符串中词与词之间的空格只保留一个。
* findstring函数: $(findstring find, in),如果in中有find则返回find本身，否则返回空。
* filter函数: $(filter pattern..., text)，将text中每个词和各个pattern匹配，返回所有匹配任一pattern成功的词。
* filter-out函数: 返回匹配不成功的。
* sort函数: $(sort list)，将list中的单词按字典序返回，并且会去重。
* word函数: $(word n, text)，将text中的第n个词返回。n大于text中词数则返回空。
* wordlist函数: $(wordlist s, e, text),返回从s到e个单词。闭区间。
* words函数: $(words text),返回text中单词个数。
* firstword函数: $(firstwords text),返回text中第一个单词。
* lastword函数: $(lastwords text),返回text中最后一个单词。

```makefile
comma:= ,
empty:=
space:= $(empty) $(empty)
foo:= a b c
bar:= $(subst $(space),$(comma),$(foo)) # bar is now ‘a,b,c’
```

#### 文件名相关函数
```makefile
$(dir src/foo.c hacks) # src/ ./
$(notdir src/foo.c hacks) # foo.c hacks
$(suffix src/foo.c src-1.0/bar.c hacks) # .c .c
$(basename src/foo.c src-1.0/bar hacks) # src/foo src-1.0/bar hacks
$(addsuffix .c,foo bar) # foo.c bar.c
$(addprefix src/,foo bar) # src/foo src/bar
$(join a b,.c .o) #  a.c b.o // join list1,list2 将list1和list中的单词一一对应的连接。
$(wildcard pattern) # 输出当前目录下匹配的文件名。
$(realpath names…) # 输出name文件的绝对路径，name必须是存在的文件或文件名
$(abspath names…) # 输出name文件的绝对路径，name可以包含通配符
```

#### wildcard
`$(wildcard pattern...)`: 某些地方不能使用`%`通配符时，就需要使用该函数。输出当前目录下匹配的文件名。
```makefile
objects := $(patsubst %.c,%.o,$(wildcard *.c))

foo : $(objects)
        cc -o foo $(objects)
```

#### call
`$(call variable, param1, param2)`,其中variable是makefile中的变量，variable的值中的$(0)代表自身的名字，$(1)代表param1,$(2)代表param2，以此类推。
```makefile
reverse = $(2) $(1)

foo = $(call reverse,a,b) # foo = b a
```

#### shell
`$(shell shellcmd)`: 创建shell执行shellcmd，返回shellcmd的输出。返回状态存储在`.SHELLSTATUS`变量中
```makefile
contents := $(shell cat foo)
```

## ssh
```shell
sudo apt install openssh-client # 只连接别的机器
sudo apt install openssh-server # 本机作为服务器
/etc/init.d/ssh start # 手动启动server
/etc/init.d/ssh stop # 停止server
vim /etc/ssh/sshd_config # 配置文件，可修改端口号
/etc/init.d/ssh restart # 修改后需要重启server
ssh -p 22 user@ip # 登录另一台开了openssh-server的机器
hostname -I # 查看本机ip地址
```

[xshell 免费版](https://www.netsarang.com/zh/free-for-home-school/)

## 任务管理

* 将任务放到后台执行 `cmd &` 会显示任务的序号和相关的PID
* 为了不让后台任务的输出影响前台，可以重定向流
* 将当前任务放到后台暂停 `C-z`
* 查看当前任务状态 `jobs`
    * -l 列出任务序号，PID，任务状态，命令串
    * -r 仅列出后台run的任务
    * -s 仅列出后台stop的任务
    * `+` 表示最近被放到后台的任务。 `-` 表示最近第二个被放到后台的任务
* 将后台任务拿到前台处理 `fg [[%]jobnumber]`
    * 不加jobnumber，默认将最近被放到后台的任务拿出来
    * `fg -`，默认将最近第二个被放到后台的任务拿出来
    * `fg %1` 指定将任务序号为1的任务拿出来
* 让任务在后台的状态变成运行中 `bg [[%]jobnumber]`
* 管理后台任务 `kill -signal %jobnumber`
    * signal
        * -1: 重新读取一次参数的配置文件
        * -2: 相当于`C-c`
        * -9: 立刻强制删除一个任务
        * -15: 正常中止一个任务。默认值。

## 进程管理

* `ps -l` 查看当前bash的相关进程
    * F: 进程标识(process flag)，说明进程的权限
        * 4 root权限
        * 1 仅fork，没有exec
    * S: 进程状态
        * R: Running
        * S: Sleep
        * D: 不可被唤醒的睡眠状态，如等待I/O
        * T: 停止状态(stop)
        * Z: Zombie，僵尸状态，进程已经被中止但无法移出内存
    * UID: 进程所属用户的UID
    * PID,PPID: 进程号，父进程的进程号
    * C: CPU使用率(%)
    * PRI: Priority 进程优先级
    * NI: Nice 进程优先级相关
    * ADDR: 进程在内存的那个部分。running进程显示 `-`
    * SZ: 进程使用的内存大小
    * WCHAN: 进程是否在运行 `-`表示运行中
    * TTY: 登录者的终端位置
    * TIME: 进程实际使用的CPU运行时间 
    * CMD: 触发进程的命令
* `ps aux` 查看系统所有进程
    * VSZ: 进程使用的虚拟内存量(kB)
    * RSS: 进程使用的固定内存量(kB)
    * STAT: 同S
* `top` 动态查看进程的状态
    * -d n 指定更新状态间隔的秒数
    * -p PID 查看指定进程。要看多个进程，重复使用多次-p选项即可。
    * top 按键命令
        * ? 帮助
        * P 以CPU使用率排序
        * M 以内存使用率排序
        * N 以PID排序
        * T 以进程使用的CPU时间排序
        * q 退出
        * k 给某个PID一个signal
        * r 给某个PID一个新nice值
* `kill -signal PID` 同jobs

