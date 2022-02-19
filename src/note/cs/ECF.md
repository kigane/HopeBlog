---
title: 异常控制流
lang: zh-CN
sidebarDepth: 2
---

## 异常
### 异常和异常处理
* 异常(exception)：就是控制流中的突变，用来相应处理器状态中的某些变化。
* 事件(event)：即状态变化。在处理器中，状态被编码为不同的位和信号。
* 异常号(exception number)：系统为每种类型的异常分配的唯一的非负整数标识。
* 异常表(exception table)：当处理器检测到事件发生时，会通过该表调用相应的异常处理程序。其起始地址位于一个特殊的CPU寄存器--异常表基址寄存器。在系统启动时，由操作系统分配和初始化。
* 在异常处理程序完成后，根据事件的类型，处理程序的处理方式不同。

### 异常的类别
* 中断(interrupt):是由硬件造成的，即来自处理器外部的I/O设备的信号的结果。因此，是异步的。从中断返回时，总是返回到下一条指令。(过程：执行$I_{curr}$，发生中断，执行完$I_{curr}$，调用中断处理程序，处理程序返回到下一条指令$I_{next}$)
* 陷阱(trap)：是有意的异常。用于为用户程序和内核之间提供系统调用，让用户程序可以向内核请求服务。具体而言，用户执行`syscall n`指令，会触发一个trap，trap的处理程序解析参数，并调用适当的内核程序。另外：系统调用运行于内核模式。
* 故障(fault)：由可能能被错误处理程序修正的错误引起。如果故障处理程序能修正(如缺页异常)，则返回$I_{curr}$并重新执行这个引起异常的指令，如果无法修正(如除零，段错误)，则调用内核的abort例程，终止该程序。
* 终止(abort)：由不可恢复的致命错误引起，通常是硬件错误。调用内核的abort例程，终止该程序。

::: details Linux异常和系统调用
* 除法错误(0)：除零或除法溢出时发生。Unix不会从除法错误中恢复，而是会终止程序。Linux shell会报告"Floating exception"。
* 一般保护故障(13)：原因很多，通常是因为程序引用的未定义的虚拟内存区域或试图写一个只读的文本段。Linux不会恢复这类故障，会终止程序并报告"Segmentation fault"。
* 缺页异常：//TODO

系统调用:syscall  
* 系统调用时，%rax保存系统调用号，%rdi,%rsi,%rdx,%r10,%r8,%r9顺序包含最多6个参数。系统调用返回时，%rcx,%r11会被破坏，%rax包含返回值。返回值为负(-4095~-1)，说明发生了错误，会设置相应的errno。
* 常用系统调用
    * 0 read 读文件
    * 1 write 写文件
    * 2 open 打开文件
    * 3 close 关闭文件
    * 4 stat 获取文件信息
    * 9 mmap 将内存页映射到文件
    * 12 brk 重置堆顶
    * 32 dup2 复制文件描述符
    * 33 pause 挂起进程，直到有信号到达
    * 37 alarm 设置定时器，时间到了发送一个alarm信号给进程，默认行为会终止进程
    * 39 getpid 获取进程ID
    * 57 fork 创建进程
    * 59 execve 执行一个程序
    * 60 _exit 终止进程
    * 61 wait4 等待一个进程终止
    * 62 kill 向一个进程发送一个信号
:::

## 进程
* 经典定义：一个执行中的程序的实例。
* 上下文(context)：程序正确运行所需的状态。包括内存中程序的的代码和数据，栈，GPRs，PC，环境变量以及打开的文件描述符的集合。
* 进程为应用程序提供的关键抽象：
    * 一个独立的逻辑控制流
    * 一个私有的地址空间

### 逻辑控制流
即执行程序的PC值的序列。
![ECF01](/assets/img/csapp-ecf-01.png)  
关键点：进程是轮流使用处理器的，每个进程执行其流的一部分，然后被preempted(暂时挂起)，然后轮到其他进程。

### 并发
* 一个逻辑流的执行在**时间上**与另一个流重叠，称为并发流(concurrent flow)，这两个流被称为并发的执行。
* 并发(concurrency)：多个流并发的执行。
* 多任务(multitask)：一个进程和其他进程轮流运行。
* 时间片(time slice)：一个进程执行其逻辑控制流的一部分的每一时间段。
* 并行流(parallel flow)：两个流并发地运行在不同的处理器或计算机上。并行流是并发流的真子集。

### 私有地址空间
![ECF02](/assets/img/csapp-ecf-02.png)  
进程为每个程序提供私有地址空间。通用结构如图。

### 用户模式和内核模式
用户模式是处理器提供的一种机制，限制应用可以执行的指令和可访问的地址空间范围，即不能使用特权指令和访问地址空间中的内核区。处理器通过某状态寄存器中的一个模式位(mode bit)确定进程处于用户模式还是内核模式。  
* 特权指令(privileged instruction)：如停止处理器，改变模式位，发起I/O操作。
* 用户只能通过系统调用接口间接访问内核的代码和数据。任何直接访问的尝试都会导致abort。
* 进程从用户模式切换到内核模式的唯一方式是使用interrupt,fault,trap的异常处理程序。异常发生时，会调用异常处理程序，异常处理程序运行于内核模式中。异常处理程序返回后，就切换回用户模式。
* Linux中
    * /proc文件系统提供许多用户可以访问的内核数据结构。如/proc/cpuinfo,/proc/:pid/maps(进程使用的内存段)
    * /sys文件系统提供关于系统总线和设备的低层信息。

### 上下文切换
* 进程上下文
    * 用户级上下文：程序块，数据块，用户堆栈
    * 系统级上下文：
        * 进程标识信息： pid
        * 进程现场信息：寄存器内容(GPRs，浮点寄存器，某些状态寄存器)
        * 进程控制信息：PC，某些状态寄存器
        * 内核：内核栈和内核数据结构，包括页表，进程表，文件表。
* 上下文切换
    * 保存当前进程上下文
    * 恢复被切换到的进程的上下文
    * 将控制转移给新进程
* 上下文切换时机
    * 内核执行系统调用时。系统调用发起I/O请求，或使用sleep系统调用等等。
    * 系统周期性中断。所有系统都有某种产生周期性定时器中断的机制，通常为1或10ms。每次发生定时器中断，内核就能判定出当前进程已经运行了足够长的时间，并切换到另一个进程。

## 系统调用错误处理
Unix系统级函数出错时，会返回-1，并设置全局整数变量errno来表示什么出错了。`strerrno(errno)`返回错误的具体描述。
```c
void unix_error(char *msg) {
    fprintf(stderr, "%s, %s\n", msg, strerr(errno));
    exit(0);
}

// fork 的错误包装函数
pid_t Fork(void) {
    pid_t pid;
    if (pid = fork() < 0)
        unix_error("Fork error");
    return pid;
}
```

## 进程控制
* 每个进程都有一个唯一的正整数进程 ID(PID)。
* 每个进程都只属于一个进程组，进程组也是用一个正整数 ID 来标识的。默认的，子进程和父进程同属于一个进程组。
* 进程的三种状态
    * 运行：进程正在 CPU 上执行，或在等待被执行且最终会被调度。
    * 停止：进程被挂起(suspended)，不会被调度。
        * 会导致停止的信号：SIGSTOP, SIGTSTP, SIGTTIN, SIGTTOU
        * 进程再次运行信号：SIGCONT
    * 终止：进程永远停止。进程终止有三种原因
        * 收到一个默认行为是终止进程的信号
        * 从主程序返回
        * 调用exit()函数

```c
#include <sys/types.h>
#include <unistd.h>
pid_t getpid(void); // 返回调用进程的PID
pid_t getppid(void); // 返回调用进程的父进程的PID
pid_t getpgrp(void); // 返回调用进程的进程组ID
int setpgid(pid_t pid, pid_t pgid); // 将pid进程的进程组改为pgid。成功返回0，否则返回-1。
// setpgid(0,0)表示用当前进程的pid为名创建进程组，并将当前进程加入该进程组。
pid_t fork(void); // 创建子进程，子进程返回0，父进程返回子进程的PID。
pid_t waitpid(pid_t pid, int *statusp, int options); // 等待pid子进程停止或终止
pid_t wait(int *status); // 等价于 waitpid(-1, &status, 0)
unsigned int sleep(unsigned int secs); // 将进程挂起(suspend)指定秒数
int pause(void); // 将进程挂起，直到该进程收到一个信号
// 在当前进程的上下文中加载并运行一个新程序
int execve(const char *filename, const char *argv[], const char *envp[]); 

#include <stdlib.h>
void exit(int status); // 以status为退出状态终止进程
char *getenv(const char *name); // 返回指定的环境变量
int setenv(const char *name, const char *newvalue, int overwrite); // 设置环境变量
void unsetenv(const char *name); // 删除环境变量
```

### fork()
* fork()函数调用一次，返回两次。在子进程中返回0，在父进程中返回子进程的 PID。
* fork()函数创建的子进程和所在的进程是并发运行的独立进程。内核能以任意方式交替执行它们的逻辑控制流中的指令。
* fork()函数创建的子进程拥有相同但独立的地址空间。
* fork()函数创建的子进程和所在进程共享文件。
* 进程图：每个顶点对应一条程序语句，有向边 a->b 表示语句 a 在语句 b 之前执行。在 fork 处分为两支。
::: details 例题
```c
int main() {
    int x = 1;
    if (Fork() == 0)
        printf("p1: x=%d\n", ++x);
    printf("p2: x=%d\n", --x);
    exit(0);
}
// 其输出为:
// 子进程：p1: x=2  p2: x=1
// 父进程：p2: x=0 
// 012的出现顺序不定(除了2一定在1前)
```
:::

### waitpid()--回收子进程
* 进程的回收(reaped)：当一个进程由于某种原因终止时，内核并不是立即把它从系统中清除。相反，进程被保持在一种已终止的状态中，直到被它的父进程回收。当父进程回收已终止的子进程时，内核将子进程的退出状态传递给父进程，然后抛弃已终止的进程，从此时开始，该进程就不存在了。  
* 僵死进程(zombie)：终止了，但还没被回收的进程。会消耗内存资源。
* 如果一个父进程终止了，内核会安排 init 进程成为它的子进程的养父。init 进程的 PID 为 1，是在系统启动时由内核创建的，它不会终止，是所有进程的祖先。如果父进程没有回收它的僵死子进程就终止了，那么内核会安排 init 进程去回收它们。

waitpid函数
* 通常行为：waitpid挂起调用进程的执行，直到它的等待集合(wait set)中的一个子进程终止。如果等待集合中的一个进程，在waitpid调用时就已经终止了，则立即返回。返回子进程的PID(此时子进程已被回收)。
* 参数 pid：指定等待集合
    * pid > 0: 等待集合就是pid指定的单独的子进程。
    * pid = -1：等待集合就是父进程的所有子进程。
    * pid = 0：等待集合就是在父进程所在进程组的所有子进程。
    * pid < 0: 等待集合就是在|pid|指定的进程组中的所有子进程。
* 参数 options：修改 waitpid 的默认行为
    * 0:默认值。通常行为。
    * WNOHANG:如果等待集合中的一个进程，在 waitpid 调用时就已经终止了，则立即返回。如果等待集合中任何子进程都没有终止，也立即返回，返回值为 0。
    * WUNTRACED:不仅在终止时返回，停止时也返回。(停止的进程不会被回收)
    * WCONTINUED:不仅在终止时返回，在一个停止的程序继续运行时也返回。
    * 选项可以组合
* statusp参数指向子进程的退出状态信息status。
    * `<sys/wait.h>`中定义了一些宏，用于解释status。
   * WIFEXITED(status)：如果于进程通过调用 exit 或者返回正常终止，就返回真。
    * WEXITSTATUS(status)：返回一个正常终止的子进程的退出状态。只有在 WIFEXITED() 返回为真时，才会定义这个状态。
    * WIFSIGNALED(status)：如果子进程是因为一个未被捕获的信号终止的，. 那么就返回真。
    * WTERMSIG(status)：返回导致子进程终止的信号的编号。只有在 WIFSIGNALED() 返回为真时，才定义这个状态。
    * WIFSTOPPED(status)：如果引起返回的子进程当前是停止的，那么就返回真。
    * WSTOPSIG(status)：返回引起子进程停止的信号的编号。只有在 WIFSTOPPED() 返回为真时，才定义这个状态。
    * WIFCONTINUED(status)：如果子进程收到 SIGCONT 信号重新启动，则返回真。
* 错误条件
    * 如果调用进程没有子进程(没创建或者已经回收完了)，则 waitpid 返回 -1，并设置 errno 为 ECHILD。
    * 如果 waitpid 函数被一个信号中断，则返回 -1，并设置 errno 为 EINTR。

### execve函数
* execve 函数在当前进程上下文中加载并运行一个新程序，并会**覆盖**当前进程的地址空间，不会创建新进程，而是继承原进程的PID和已打开文件列表。
* execve 参数列表中，filename 为要加载的可执行目标文件， argv，envp 为传递给 main 函数的参数。
* execve 加载 filename 后，调用_start()启动代码，启动代码设置栈，并将控制传递给新程序的 main 函数。
* main 函数的原型 `int main(int argc, char *argv[], char *envp[]);`
    * argc 为 argv 数组中非空指针的数量
    * agrv 数组中 `argv[0]` 为可执行目标文件名，之后为执行时所带的参数列表。
    * envp 数组保存环境变量字符串(内容为"name=value"的键值对)。

## 信号
* 一种比硬件异常，上下文切换更高层的软件形式异常，它允许进程和内核中断其他进程。
* 一个信号就是一个消息，它通知进程系统中发生了一个某类型的事件。
* 某种信号类型对应每种系统事件。  

序号 | 名称 | 默认行为 | 相应事件 | 
---|----|------|------|-
1 | SIGHUP | 终止 | 终端线挂断 | 
2 | SIGINT | 终止 | 来自键盘的中断 | 
3 |SIGQUIT | 终止 | 来自键盘的退出 | 
4 | SIGILL | 终止 | 非法指令 
5 | SIGTRAP | 终止并转储内存 | 跟踪陷阱 | 
6 | SIGABRT | 终止并转储内存 | 来自 abort 函数的终止信号 | 
7 | SIGBUS | 终止 | 总线错误 | 
8 | SIGFPE | 终止并转储内存 | 浮点异常 | 
9 | SIGKILL | 终止 | 杀死程序 | 
10 | SIGUSR1 | 终止 | 用户定义的信号 1 | 
11 | SIGSEGV | 终止并转储内存 | 无效的内存引用（段故障） | 
12 | SIGUSR2 | 终止 | 用户定义的信号 2 | 
13 | SIGPIPE | 终止 | 向一个没有读用户的管道做写操作 | 
14 | SIGALRM | 终止 | 来自 alarm 函数的定时器信号 | 
15 | SIGTERM | 终止 | 软件终止信号 | 
16 | SIGSTKFLT | 终止 | 协处理器上的栈故障
17 | SIGCHLD | 忽略 | 一个子进程停止或者终止 | 
18 | SIGCONT | 忽略 | 继续进程如果该进程停止 | 
19 | SIGSTOP | 停止直到下一个SIGCONT | 不是来自终端的停止信号 | 
20 | SIGTSTP | 停止直到下一个SIGCONT | 来自终端的停止信号 | 
21 | SIGTTIN | 停止直到下一个SIGCONT | 后台进程从终端读 
22 | SIGTTOU | 停止直到下一个SIGCONT | 后台进程向终端写 | 
23 | SIGURG | 忽略 | 套接字上的紧急情况 
24 | SIGXCPU | 终止 | CPU 时间限制超出 | 
25 | SIGXFSZ | 终止 | 文件大小限制超出 | 
26 | SIGVTALRM | 终止 | 虚拟定时器期满 | 
27 | SIGPROF | 终止 | 剖析定时器期满 | 
28 | SIGWINCH | 忽略 | 窗口大小变化 
29 | SIGIO | 终止 | 在某个描述符上可执行 I/O 操作 
30 | SIGPWR | 终止 | 电源故障

### 信号术语
* 发送信号：内核通过**更新目的进程上下文中的某个状态**，发送一个信号给目的进程。需要发送信号的两种原因
    * 内核检测到某个系统事件，如除零错误或子进程终止。
    * 一个进程调用了 kill 函数。
* 接收信号：当目的进程被内核强迫以某种方式对信号作出反应时，它就接收了信号。有三种反应
    * 忽略信号
    * 终止进程
    * 捕获信号：即调用信号处理程序。
* 待处理信号(pending signal)：发出了，但没被处理的信号。在任意时刻，对一个进程而言，每个信号类型最多有一个待处理信号，后续发到该进程的同类型信号会被丢弃。也就是说，一个进程，最多接收一个信号(正在处理)并有一个同类型的待处理信号。
* 阻塞：对于信号 k，进程 p 第一次收到信号 k 时，p 接收 k，并作出合理反应。在此期间，第二次收到信号 k 时，k 就处于待处理状态，此时就说信号 k 被隐式阻塞了。如果继续收到信号 k，直接丢弃。
* 内核为每个进程维护两个信号集合
    * 在 pending 位向量中维护待处理信号集合(被隐式阻塞的信号集合)
    * 在 blocked 位向量中维护被阻塞的信号集合(用sigprocmask()函数阻塞的)

### 发送信号
* /bin/kill 程序：kill -sigid pid。具体见man kill。
* 键盘：shell 中使用 job 表示进程。
    * Ctrl+C：内核发送一个 SIGINTR 信号到前台进程组中的每个进程。默认结果为终止前台进程。
    * Ctrl+Z：内核发送一个 SIGTSTP 信号到前台进程组中的每个进程。默认结果为停止前台进程。
* kill() 函数
* alarm() 函数，向进程自己发送 SIGALRM 信号。

```c
#include <sys/types.h>
#include <signal.h>
int kill(pid_t pid, int sig); // 向pid进程发送sig信号
unsigned int alarm(unsigned int secs); // 在secs后发送一个 SIGALRM 信号给自己。
```

### 接收信号
当内核将进程 p 从内核模式切换到用户模式时，它会检查进程 p 的为被阻塞的待处理信号的集合(pending & ~blocked)。如果集合为空，内核将控制直接传给 p 的逻辑控制流中的下一条指令。如果集合非空，则选择某个信号 k (通常是最小的)，并且强制 p 接收信号 k。引起相应的行为(终止，终止+转储内存(Core dump)，停止，执行信号处理程序)。

进程可以通过 signal 函数修改和信号相关联的默认行为，除了 SIGSTOP 和 SIGKILL。
```c
#include <signal.h>
typedef void (*sighandler_t)(int);
sighandler_t signal(int signum, sighandler_t handler); // 设置 signum 信号的信号处理程序为 handler。
```
其中 handler 可以是：
* SIG_IGN：忽略信号
* SIG_DFL：信号的默认行为
* 用户自定义函数。这个函数称为信号处理程序。调用信号处理程序称为**捕获信号**，执行信号处理程序称为**处理信号**。
* 信号处理程序可以被其他信号处理程序中断。

### 信号的阻塞和解除
* 隐式阻塞机制：内核默认阻塞任何当前处理程序正在处理的信号类型的待处理信号。
* 显示阻塞机制：使用 sigprocmask 函数设置。

```c
#include <signal.h>
int sigprocmask(int how, const sigset_t *set, sigset_t *oldset); // 设置blocked位向量，阻塞信号。
int sigempty(sigset_t *set); // 初始化 set 为空集合
int sigfillset(sigset_t *set); // 初始化 set 为选择所有信号的集合
int sigaddset(sigset_t *set, int signum); // 将 signum 添加到 set
int sigdelset(sigset_t *set, int signum); // 从 set 中删除 signum
int sigismember(sigset_t *set, int signum); // 判断 signum 是不是 set 的成员
```

其中，how
* SIG_BLOCK： 将 set 中的信号添加到 blocked 中(blocked = blocked | set)
* SIG_UNBLOCK： blocked = blocked & ~set
* SIG_SETMASK：blocked = set

### 编写信号处理程序
信号处理是 Linux 系统编程最棘手的一个问题。因为
* 处理程序和主程序并发运行，共享同样的全局变量
* 如何及何时接收信号的规则常常违反人的直觉
* 不同系统有不同的信号处理语义

//TODO

* 信号时不排队的，每种信号最多一个正在处理，一个待处理，其余都是直接丢弃。因此，关于信号的一个关键思想是：如果存在一个未处理的信号，就表明至少有一个信号到达了。
* ps命令输出中的`<defunct>`表明进程为僵死进程。 

## 非本地跳转
另一种用户级异常控制流形式。通过 setjump 和 longjump 函数提供。
```c
#include <setjmp.h>
int setjmp(jmp_buf env); // 在 env 缓冲区中保存当前调用环境，供longjmp使用，返回0。
void longjmp(jmp_buf env, int retval); // 从 env 缓冲区中恢复调用环境，然后触发一个最近一次初始化 env 的 setjmp 调用的返回。然后 setjmp 返回，返回值为非零的 retval。
// 下面这两个是可被信号处理函数使用的版本。(但都不是异步信号安全的函数)
int sigsetjump(sigjmp_buf env, int savesigs); 
void siglongjmp(sigjmp_buf env, int retval);
```
longjmp不返回，而是直接跳转到最近的setjmp，让setjmp再次返回。


非本地跳转的一个重要应用就是允许从一个深层嵌套的函数调用中立即返回，通常是由检测到某个错误情况引起的。
::: details 示例
```c
#include "csapp.h"

jmp_buf buf;

int error1 = 0;
int error2 = 1;

void foo(void), bar(void);

int main()
{
    switch (setjmp(buf)) {
    case 0:
        foo();
        break;
    case 1:
        printf("Detected an error1 condition in foo\n");
        break;
    case 2:
        printf("Detected an error2 condition in foo\n");
        break;
    default:
        printf("Unknown error condition in foo\n");
    }
    exit(0);
}

/* Deeply nested function foo */
void foo(void)
{
    if (error1)
        longjmp(buf, 1);
    bar();
}

void bar(void)
{
    if (error2)
        longjmp(buf, 2);
}
```
:::

非本地跳转的另一个重要应用是使一个信号处理程序分支到一个特殊的代码位置，而不是返回到被信号到达中断了的指令的位置。
::: details 示例
```c
#include "csapp.h"

sigjmp_buf buf;

void handler(int sig)
{
    siglongjmp(buf, 1);
}

int main()
{
    if (!sigsetjmp(buf, 1)) {
        Signal(SIGINT, handler);
        Sio_puts("starting\n");
    }
    else
        Sio_puts("restarting\n");

    while (1) {
        Sleep(1);
        Sio_puts("processing...\n");
    }
    exit(0); /* Control never reaches here */
}
```
:::

## 操作进程的工具
* STRACE
* PS
* TOP
* PMAP