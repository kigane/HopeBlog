---
title: i386
lang: zh-CN
sidebarDepth: 2
---

## 基本编程模型
### 内存组织和分段(Segmentation)
物理内存由8-bit的字节组成的序列构成。每个字节有一个唯一的地址，范围$[0, 2^{32}-1]$，共4GB。

内存组织模型有两种
* flat address space 由大小为4GB的单个数组组成
* segmented address space 由16383($2^{14}-1$)个线性地址空间集合组成，每个地址空间最多4GB。
    * 内存空间最大为64TB($2^{46}$B)。称为逻辑地址空间
    * 可以看作最多16383个一维子空间的集合，每个子空间就是一个Segment。子空间的地址是连续的。
    * 逻辑地址空间的指针由两个部分组成
        * 16bits的segment selector，用于确定Segment
        * 32bits的offset，用于确定Segment内的字节。

详见第5章。

### 数据类型
操作数(Operand)的基础数据类型
* Byte 8bits
* Word 16bits
* DoubleWord 32bits

注意：Word的地址不必对齐到偶数地址，DoubleWord的地址不必对齐到能被4整除的地址。这样数据结构的弹性最大，内存利用率最高。但使用32-bits的总线传输效率会较低。为了更好的传输性能，数据结构应该要设计为尽量对齐。

---

操作数(Operand)的基础数据类型只有三种，但根据使用指令的不同，可以识别出额外的基础数据类型
* Integer: 用二进制补码表示。最高有效位(MSB)为符号位。
* Ordinal: 用二进制原码表示。无符号位。
* Near Pointer: 32-bit 逻辑地址。用于flat model或Segment内部。
* Far Pointer: 48-bit 逻辑地址。仅用于segmented model。
* String: Byte,Word,DoubleWord的连续序列。
* Bit field: bit的连续序列。最大32位。起始bit任意。
* Bit string: bit的连续序列。起始bit任意。最大$2^{32}-1$bits。
* BCD: 每个字节表示一个十进制数字，0-3这4个bit表示一个数字(只有0-9有意义)。4-7个4个bit在乘除中必须为0，在加减中可以是任意值。
* Packed BCD:每个字节表示两个十进制数字。每半个字节表示一个数字。

## 寄存器

80386共有16个寄存器，可分为3类
* 通用寄存器(General registers) 8个32-bit寄存器，主要用于保存操作数
* 段寄存器(Segment registers) 这6个寄存器决定了在任一时刻，那个segment是可寻址的。
* 状态和指令寄存器(Status and instruction registers) 用于记录和改变处理器的状态。

### 通用寄存器
![通用寄存器](/assets/img/general-registers.png)  

其中
* EAX, EDX, ECX, EBX, EBP, ESI, EDI, ESP是32位寄存器;
* AX, DX, CX, BX, BP, SI, DI, SP是16位寄存器;
* AL, DL, CL, BL, AH, DH, CH, BH是8位寄存器.

某些指令会使用特定的寄存器，如：双精度浮点乘除运算，I/O，字符串指令，循环，栈操作等等。

### 段寄存器
![其他寄存器](/assets/img/other-registers.png)
完整的程序通常由许多不同的模块组成，每个模块包括指令和数据。 但是，在程序执行期间的任一时刻，实际使用到的仅为程序模块的小子集。 80386架构通过提供直接访问当前模块环境的指令和数据的机制来利用这一点，必要时可以访问额外的段。

执行中的程序可以在任一时刻立即访问六个内存段。这六个内存段分别用寄存器CS,SS,DS,ES,FS,GS标识，每个段寄存器唯一确定一个特定的程序段，并可以高速访问。
* CS(Code Segment) 对应保存当前执行的指令序列所在的段。CS的值只能通过控制转移指令(e.g JMP,CALL)，中断或异常隐式改变。
* SS(Stack Segment) 子程序调用，参数，过程激活记录通常会在栈上分配内存。所有的栈操作都会使用SS来定位栈。不像CS, SS寄存器可以显式加载，因此程序员可以动态定义栈。
* DS，ES，FS和GS寄存器指定四个数据段，每个数据段都可由当前执行的程序寻址。对四个单独的数据区域的可访问性有助于程序有效地访问不同类型的数据结构。有些程序可能需要访问不止4个数据段，此时需要在程序执行期间改变这4个寄存器的值。这需要程序在访问特定数据时，需要先加载正确的段寄存器。

处理器将基址与由段寄存器选择的段地址相关联。即先通过段寄存器找到相应的段，再用32-bit基址在段内寻址。

#### 栈的实现
栈操作相关寄存器
* SS 一个系统可以有多个栈，每个栈大小最多可达4GB。由SS直接寻址的栈，通常被称为“当前”栈。SS自动用于所有栈操作，由处理器处理。
* ESP ESP始终指向栈的栈顶(栈是从高地址向低地址扩展的，所以栈顶的地址最小)。ESP被PUSH,POP,子程序调用和返回，中断隐式引用。
* EBP EBP指向当前过程确定的栈帧的基址(栈帧的最高地址，不会随栈的变换而改变)。因此适用于访问栈中的元素。

#### 标志寄存器--EFLAGS
![EFLAGS](/assets/img/EFLAGS.png)
标志可以分为3组
* Status flags：用于让某个指令的结果影响下一个指令。算数指令使用前6个
    * CF(Carry Flag): 有进位或借位发生是设置，否则清除。
    * PF(Parity Flag): 如果结果的低8bit有偶数个1，则设置，否则清除。
    * AF(Adjust Flag): 用于BCD数据运算。如果AL的低4位有进位或借位则设置，否则清除。
    * ZF(Zoro Flag): 如果结果为0则设置，否则清除。
    * SF(Sign Flag): 结果的最高有效位。
    * OF(Overflow Flag): 溢出标志。($C_n \oplus C_{n-1},C_n$是最高位是否溢出，$C_{n-1}$是次高位是否溢出)
    * TF(Trap Flag): 陷阱标志。Debug时用到。
* Control flags：
    * DF(Direction Flag): 当字符串指令自减时设置(即从高地址向低地址处理字符串时)，反之清除。
* System flags：
---
#### 指令指针  
程序计数器(PC) -- EIP (Extended Instruction Pointer) 指向要执行的指令

### 指令格式
指令=操作+操作数类型&操作数位置

**指令中常见元素**
* Prefix 在指令之前的1-2个字节，修改指令的操作。
    * Segment override 显式指定指定应该使用的段寄存器，覆盖默认的。
    * Address size 产生16或32位地址
    * Operand size 产生16或32位操作数
    * Repeat 字符串指令使用该前缀，让该指令作用于string的每个元素。
* Opcode 操作码。确定指令的操作
* Register specifier 一条指令可以指定1-2个寄存器操作数。寄存器指示符要么和Opcode在一个字节(+rb,+rw...)，要么和Address mode在一个字节。
* Addressing-mode specifier 决定操作数是寄存器还是内存位置。如果是内存位置，决定是否使用位移，基址寄存器，索引寄存器和缩放因子。
* SIB byte (scale, index, base) 当addressing-mode specifier暗示要使用索引寄存器来计算操作数的地址时，指令中会包含一个SIB字节来编码基址寄存器，索引寄存器和缩放因子。
* Displacement 当addressing-mode specifier暗示要使用位移来计算操作数的地址时，位移会编码在指令中。位移是一个**有符号整数**，通常8-bit就足够，按需要可以扩展到16-bit，32-bit。
* Immediate operand 立即数，就是指令的直接操作数。可以是8,16,32位。为了以防万一有8bit操作数和32/16-bit操作数合并的操作，通常会自动扩展。

### 操作数选择 Operand Selection
操作数是指令操纵的数据，一个指令可以有0或多个操作数。操作数可以位于
* 指令本身(立即数)
* 寄存器
* 内存
* I/O端口  

对于有操作数的指令，操作数可以是隐式的，显式的，或者既有隐式操作数又有显式操作数。例如
* AAM(Ascii Adjust for mutiplication) 作用于AX寄存器。隐式，
* XCHG EAX,EBX 显式
* PUSH COUNTER 显式+隐式 内存变量COUNTER拷贝到栈中
---

**大多数指令有隐式操作数。所有的算数操作数都会更新EFLAGS。**

---

指令可以显示引用1-2个操作数。有两个操作数的指令，其结果一定会覆盖其中一个操作数，称为目标操作数(dest)，另一个则称源操作数(src)。有两个显式操作数的指令，一个操作数为内存(M)或寄存器(R),另一个操作数一定是寄存器或立即数(Immediate)允许的操作有
* R-to-R
* R-to-M
* M-to-R
* I-to-R
* I-to-M

M-M模式在字符串处理指令中存在，但两个操作数都是隐式表示的。Push,Pop也有点特殊。

I: 指令中的有符号数字字面量 
R: 对应各个寄存器

Memory Operand  
数据操纵指令在处理内存操作数时，必须指明包含该操作数的段(segment)和操作数在段中的位置(offset)。然而，为了速度和指令编码的简练，将段选择器(segment selector)放在高速的段寄存器中。因此数据操纵指令只需要指明offset即可。  
内存寻址
* 大多数数据操纵指令访问内存时都显式包含一个指示寻址方法的字节modR/M字节。通常跟在opcode后。如果操作数为内存地址，则最终地址LA = SR + (B,I,s,D的各种组合)，其中(B:基址寄存器，I:索引寄存器，s:缩放因子，D:位移)。当用到索引寄存器的时候，modR/M字节后会跟着一个字节，指示使用的索引寄存器和缩放因子。
* 某些特殊的寻址
    * LA = SR + D 某些MOV指令，隐式使用EAX，offset写在指令中。
    * 字符串操作
        * 使用 DS:ESI 寻址，如MOVS, CMPS, OUTS, LODS, SCAS
        * 使用 ES:EDI 寻址，如MOVS, CMPS, INS, STOS
    * 栈操作，使用 SS:ESP 寻址。 如PUSH, POP, PUSHA, PUSHAD, POPA, POPAD, PUSHF, PUSHFD, POPF, POPFD, CALL, RET, IRET, IRETD以及异常和中断。

#### 默认的段寄存器选择规则
内存引用 | 段寄存器 | 规则
------- | ------- | -------
指令 | CS | 在预取(prefetch)指令时自动选择
栈 | SS | 任何栈push,pop操作。以EBP/ESP为基址的寻址
Local Data | DS | 其他
Dest Strings | ES | 字符串指令的 dest

#### 有效地址计算
![有效地址计算](/assets/img/effective-address.png)

对以modR/M定义的内存操作数，在目标段内的有效地址由3个部分组成
* 指令中的位移元素。因为是编码在指令中，所以适合地址的固定部分
    * 简单标量操作数的位置
    * 静态(static)分配的数组的开头
    * record中某个item的offset
* 基址寄存器
* 变址寄存器(可能会乘以缩放因子2, 4, 或 8，上图错了)
    * 基址+变址适合动态决定的地址
    * 栈中的局部变量和过程参数
    * records[i]
    * 二维数组中的一维数组的起始
    * 动态分配的数组地址
* 注意，ESP不能作为变址寄存器。EBP，ESP作为基址寄存器时，默认的段寄存器为SS。
* 当数组元素大小为2,4,8时，由于scaling的存在，索引比较高效(不用分开移动或多次使用指令)。

常用的寻址组合，段寄存器省略
* A = D 位移本身就是地址。通常用于static分配内存的操作数。
* A = B 寄存器中的值就是地址。某些变量。
* A = B + D 
    * 当索引的static array元素大小不是2,4,8B时。D为目标元素的offset。
    * 访问records数组中的某个item。B为某个record，D为item的offset
* A = Ixs + D 当索引的static array元素大小是2,4,8B时。D为数组首地址。
* A = B + I + D 
    * 二维数组，D为m[0][0]，
    * 访问records数组中的某个item。B为records[0]，D为item的offset
* A = B + Ixs+ D 最一般的寻址格式
    * 在汇编代码中写作 displacement(R[base_reg], R[index_reg], scale_factor)
    * 其它寻址格式都可以看作这种一般格式的特例

### 中断和异常(Interrupts and Exceptions)
80386有两个机制来打断程序执行
* 异常：是对在程序执行期间CPU检测到的特定条件作出回应的同步事件(synchronous event)。
* 中断：是外部设备需要注意时触发的异步事件(asynchronous event)

异常和中断很类似，都会引起处理器暂时暂停(suspend)当前程序的执行，并执行另一个优先级更高的程序。它们的主要区别在于引发原因。异常总是可重现的，只要以同样的程序和数据再次执行。而中断通常独立于当前执行的程序。

中断详见第9章。应用程序员通常不处理中断，只处理异常。系统程序员需要定义应用程序和异常机制之间的接口，并提供给应用程序员。

//TODO

Reserved Exceptions and Interrupts
Vector Number | Description
------- | -------
0 | Divide Error
1 | Debug Exceptions
2 | NMI Interrupt
3 | Breakpoint
4 | INTO Detected Overflow
5 | BOUND Range Exceeded
6 | Invalid Opcode
7 | Coprocessor Not Available
8 | Double Exception
9 | Coprocessor Segment Overrun
10 | Invalid Task State Segment
11 | Segment Not Present
12 | Stack Fault
13 | General Protection
14 | Page Fault
15 | (reserved)
16 | Coprocessor Error
17-32 | (reserved)

## 应用指令集
### 数据移动指令
#### 通用数据移动指令
* MOV (move) 
* XCHG (exchange) 交换两个操作数。不需要临时变量，可代替3条MOV指令。在实现semaphores(信号量)及类似的进程同步数据结构时很有用。如果有一个操作数是M，则XCHG自动激活LOCK信号。

#### 栈操作指令
* PUSH 降低ESP，再将源操作数放到ESP指的位置。通常用于过程调用时保存参数或在栈上保存临时变量。
* PUSHA (Push All Registers) 将八个通用寄存器的值存到栈中。顺序为EAX,EDX,ECX,EBX,OLD ESP,EBP,ESI,EDI。可以简化过程调用时保存寄存器的值操作。
* POP 将栈中保存的值放到目标操作数，再提高ESP。
* POPA 将栈中的个通用寄存器的值取出，并用这些值重设寄存器。但忽略OLD ESP。

#### 类型转换指令
* CWD (Convert Word to Doubleword) 
* CDQ (Convert Doubleword to Quad-Word)
* CBW (Convert Byte to Word) 
* CWDE (Convert Word to Doubleword Extended)
* 只能操作EAX中的数据。可用于被除之前被除数的扩展。都是有符号扩展。
---
* MOVSX (Move with Sign Extension)
* MOVZX (Move with Zero Extension)
* 可使用任何寄存器。另一个操作可以为M或R。

### 二元算术指令
会影响CF,SF,OF,ZF四个flag。

#### 加减指令
* ADD (Add Integers) 如果溢出，设置CF=1
* ADC (Add Integers with Carry)  如果CF=1，再+1。否则同ADD
* INC (Increment) +1。不影响CF
* SUB (Subtract Integers) 如果借位(borrow)，设置CF=1
* SBB (Subtract Integers with Borrow) 如果CF=1，再-1。否则同SUB
* DEC (Decrement) -1。不影响CF

#### 比较和取负指令
* CMP (Compare)  用dest-src，更新OF, SF, ZF, AF, PF, 和 CF 标志，但不会改变dest和src的值。
* NEG (Negate)  0-dest

#### 乘法指令
* MUL (Unsigned Integer Multiply) 源操作数和累加器(EAX/AX/AL)相乘，结果大小为操作数的两倍。如果结果的上半部分不为0，则将CF,OF设为1，否则设为0。
* IMUL (Signed Integer Multiply) 
    * 单操作数 和MUL一样，另一个乘数隐式为EAX/AX/AL。取决于操作数的大小。
    * 双操作数 其中一个操作数一定在通用寄存器中，结果也放在通用寄存器中。
    * 三操作数 一个必定是有符号立即数，一个在寄存器或内存中，剩下一个通常是通用寄存器，存储乘积。
    * 结果大小为操作数的两倍。如果结果的上半部分不为0，则将CF,OF设为1，否则设为0。
    * 双，三操作数的形式结果会被截断(truncate)到源操作数的长度。也因此兼容无符号数的乘，因为乘积的低半部分是相同的。

#### 除法指令
如果除数为0或商超过EAX/AX/AL的表示范围，则触发一个异常(interrupt zero)  
DIV (Unsigned Integer Divide) 被除数隐式存储在EAX中。商不为整数时向0舍入。
IDIV (Signed Integer Divide) 同DIV。余数的符号同被除数。

Divisor(SRC 除数) | Dividend(被除数) | Quotient(商) | Remainder (余数)
------- | ------- | ------- | -------
Byte | AX | AL | AH
Word | DX:AX | AX | DX
Doubleword | EDX:EAX | EAX | EDX

### 十进制算数指令
#### packed BCD指令
* DAA (Decimal Adjust after Addition)
* DAS (Decimal Adjust after Subtraction)

#### unpacked BCD指令
* AAA (ASCII Adjust after Addition) 
* AAS (ASCII Adjust after Subtraction) 
* AAM (ASCII Adjust after Multiplication)
* AAD (ASCII Adjust before Division)

### 逻辑指令
#### 布尔操作指令
* NOT 对一个R或M中的操作数取反码。不影响flags。
* AND/OR/XOR 操作数可以是R-R,R-M,I-R/M。会将OF，CF置零，AF的行为未定义，更新SF，ZF，PF。

#### 位测试和修改指令
首先将选中的bit的值符给CF，再将新值放到该bit上。

Instruction | Effect on CF | Effect on Selected Bit
------------|--------------|-----------------------
Bit (Bit Test) | CF ← BIT | (none)
BTS (Bit Test and Set) | CF ← BIT | BIT ← 1
BTR (Bit Test and Reset) | CF ← BIT | BIT ← 0
BTC (Bit Test and Complement) | CF ← BIT | BIT ← NOT(BIT)

#### 位扫描指令
* BSF (Bit Scan Forward) 从0-7/15/31扫描。保存第一个set bit(即1，unset bit就是0)的索引位置。如果全为0，则set ZF。反之清除。另外，如果被扫描的操作数全为0，则结果未定义。
* BSR (Bit Scan Reverse) 反过来扫描。

#### shift&rotate指令


### 控制转移指令
#### 无条件转移指令
* JMP (Jump)
    * 直接跳转 操作数写在指令中，且为有符号的立即数，表示相对位移(单位为Byte,Word,或DoubleWord)。计算的结果更新EIP。
    * 间接跳转 通过R或M指定应该执行的下一条指令的绝对地址。
* CALL 激活另一个过程(其地址可以在某个通用寄存器中，也可以是编码在指令中的内存地址)，在栈中保存CALL指令的下一条指令的地址(即当前EIP的值)，供RET使用。
* RET (Return From Procedure) 从栈中恢复CALL保存的EIP的值。
* IRET (Return From Interrupt) 将控制返回到被中断过程。在恢复EIP之外，还会恢复中断机制存储在栈中的flags。

#### 条件转移指令
Unsigned Conditional Transfers
Mnemonic | Condition Tested | "Jump If..."
---------|------------------|-------------
JA/JNBE | (CF or ZF) = 0 | above/not below nor equal
JAE/JNB | CF = 0 above or | equal/not below
JB/JNAE | CF = 1 below/not | above nor equal
JBE/JNA | (CF or ZF) = 1 | below or equal/not above
JC | CF = 1 | carry
JE/JZ | ZF = 1 | equal/zero
JNC | CF = 0 | not carry
JNE/JNZ | ZF = 0 | not equal/not zero
JNP/JPO | PF = 0 | not parity/parity odd
JP/JPE | PF = 1 | parity/parity even

-------

Signed Conditional Transfers
Mnemonic | Condition Tested | "Jump If..."
---------|------------------|-------------
JG/JNLE | ((SF xor OF) or ZF) = 0 | greater/not less nor equal
JGE/JNL | (SF xor OF) = 0 | greater or equal/not less
JL/JNGE | (SF xor OF) = 1 | less/not greater nor equal
JLE/JNG | ((SF xor OF) or ZF) = 1 | less or equal/not greater
JNO | OF = 0 not | overflow
JNS | SF = 0 not | sign (positive, including 0)
JO | OF = 1 | overflow
JS | SF = 1 | sign (negative)

### 杂项指令
* LEA (Load Effective Address) LEA DEST SRC。将SRC(一定是M)的地址存放到DEST(一定是R)中。例如，LEA EBX, EBCDIC_TABLE意为将EBCDIC_TABLE的首地址存放到EBX中。
* NOP (No Operation) 用于内存对齐。
* XLAT (Translate) 将AL中的一个字节替换成用户指定的表中的一个字节。当执行XLAT时，EBX是表的首地址，AL中的值为表的索引。执行XLAT后，AL的内容变为表中指定位置的内容，EBX的值不变。因为AL只有8-bit，所以表最多256B。

## 80386指令集说明
### 操作数和地址的大小(Operand-Size, Address-Size)
* default: 指令中的D-bit，为0表示16-bit，为1表示32-bit。
* 指令前缀: Operand-Size对应66H,Address-Size对应67H。其效果为对当前D-bit取反。(例如，有66H，D为0，则有效操作数大小为32-bit)
* 栈的Address-Size: 在SS中的数据段的B-bit。为0表示16-bit，即使用SP，为1表示32-bit，即使用ESP。
* 通常32-bit机器默认D-bit为1，指令如果出现66H前缀，表示要改变操作数大小为16-bit。

### 指令格式
![指令格式](/assets/img/80386-instruction-format.png)

可用的指令前缀(H表示该数为16进制)
* F3H REP prefix (used only with string instructions)
* F3H REPE/REPZ prefix (used only with string instructions)
* F2H REPNE/REPNZ prefix (used only with string instructions)
* F0H LOCK prefix
---
段覆盖指令前缀
* 2EH CS segment override prefix
* 36H SS segment override prefix
* 3EH DS segment override prefix
* 26H ES segment override prefix
* 64H FS segment override prefix
* 65H GS segment override prefix
* 66H Operand-size override
* 67H Address-size override

#### ModR/M and SIB Bytes
![ModR/M&SIB](/assets/img/modrm-sib.png) 
x86通过ModR/M字节来指示内存操作数
* mod(MSB的两位) 和r/m组合为32种可能的值，包括8个寄存器，24种寻址模式(indexing mode)
    * 32位寻址
    * 00 通常代表地址值在寄存器内
    * 01 通常代表地址值在寄存器内，还要加上modR/M字节后跟的8-bit位移
    * 10 通常代表地址值在寄存器内，还要加上modR/M字节后跟的32-bit位移
    * 11 取寄存器内的值
* reg/op(mod后三位) 取决于指令的opcode，通常代表寄存器编号，在某些指令中代表opcode信息。
* r/m(LSB的三位) 可能代表操作数使用的寄存器，看和mod的组合。

SIB字节在r/m为100时使用。加不加位移，位移几位看mod字段。
* ss 比例因子。00:1B, 01:2B, 10:4B, 11:8B。
* index 索引寄存器使用的通用寄存器编号
* base 基址寄存器使用的通用寄存器编号

#### 如何阅读指令格式说明页
* i386手册中的汇编语言格式都是Intel格式, 而objdump的默认格式是AT&T格式, 两者的源操作数和目的操作数位置不一样, 千万不要把它们混淆了! 否则你将会陷入难以理解的bug中.
* opcode
    * /digit(0-7) ModR/M字节只使用r/m域，reg/opcode字段包含的数字为指令操作码的扩展。对于含有/digit记号的指令形式, 需要通过指令本身的opcode和ModR/M中的扩展opcode共同决定指令的形式, 例如80 /0表示add指令的一种形式, 而80 /5则表示sub指令的一种形式, 只看opcode的首字节80不能区分它们.
    * /r 表示opcode后跟一个ModR/M字节，reg/opcode字段包含的数字为通用寄存器的编码。
    * cb, cw, cd, cp 操作码后的1-byte(cb),2-byte(cw),4-byte(cd),6-byte(cp)用于指定code offset(相对段寄存器的偏移)或是段寄存器的新值。例如CALL指令的一种
    * ib, iw, id 操作码，modR/M或SIB后的1-byte(ib),2-byte(iw),4-byte(id)是指令的立即数。是否有符号有操作码决定
    * +rb, +rw, +rd分别表示8位, 16位, 32位通用寄存器的编码. 和ModR/M中的reg域不一样的是, 这三种记号表示直接将通用寄存器的编号按数值加到opcode中 (也可以看成通用寄存器的编码嵌在opcode的低三位), 因此识别指令的时候可以通过opcode的低三位确定一个寄存器操作数.
* instruction
    * 以下表示操作数的类型
    * rel8 相对地址，范围从包含指令末尾的之前的128个字符到指令结束后的127个字符
    * rel16,rel32 在同一个Segment内的相对地址。operand-size分别为16-bit和32-bit
    * ptr16:16, ptr16:32 FARPOINTER。略。
    * r8 AL, CL, DL, BL, AH, CH, DH, BH中的一个
    * r16 AX, CX, DX, BX, SP, BP, SI, DI中的一个
    * r32 EAX, ECX, EDX, EBX, ESP, EBP, ESI, EDI中的一个
    * imm8 8位有符号立即数。和word，DoubleWord的操作数同时使用时，会进行有符号扩展。
    * imm16 16位有符号立即数。
    * imm32 32位有符号立即数。
    * r/m8|16|32 存储在寄存器或内存中的1B|2B|4B操作数
    * m8|16|32 内存中的操作数
    * m16:16, M16:32 FARPOINTER内存操作数。略。
    * m16 & 32, m16 & 16, m32 & 32 内存数据对
    * moffs8, moffs16, moffs32 某些MOV变体使用的内存偏移(相对于当前Segment的基)，这些变体不会用到modR/M字节
    * Sreg 段寄存器。ES=0, CS=1, SS=2, DS=3, FS=4, and GS=5.
* clock 指令执行需要的时钟周期数
    * n 重复次数
    * m 执行的下一个指令中的组件数量
    * pm 保护模式
* description
    * 有两个操作数时，通常SRC在右，DEST在左。
    * `"(*"和"*)"`之间是注释
    * 寄存器的名字代表寄存器的内容。加了`[]`后，表示寄存器中内容是地址，该地址的内容为`[register]`代表的内容。
    * `[]` 就是取地址的内容。地址是相对于段基址的地址。
    * A := B 将B的值赋予A
    * OperandSize 代表指令中的 operand-size attribute。AddressSize，StackAddrSize类似
    * eSP 代表ESP或SP，取决于当前栈中的B-bit。
* opcode map
    * 操作数类型可以用Zz表示，Z表示寻址方式，z表示操作数长度
    * A 直接寻址。没有modR/M字节，操作数直接编码在指令中
    * E opcode后面紧接着一个modR/M字节，指定了操作数。操作数要么是通用寄存器，要么是内存地址。如果是内存地址
    * G modR/M字节的reg字段选择一个通用寄存器
    * F EFLAGS
    * I 立即数。其值编码在指令的下一个字节
    * J 指令包含一个相对EIP的相对位移(relative offset)
    * O 指令没有modR/M字节，操作数的偏移量被编码为单词或双字
    * 以下为操作数类型标识符，和operand size attribute无关的前面加-。
    * a 两个单字/双字操作数，在内存中
    * c byte/word
    * p 32/48位指针
    * s Six-byte pseudo-descriptor
    * v 单字/双字
    * -b byte
    * -w word
    * -d double-word
### 指令
```js
// PUSH
IF StackAddrSize = 16
THEN
 IF OperandSize = 16 THEN
 SP ← SP - 2;
 (SS:SP) ← (SOURCE); 
 ELSE
 SP ← SP - 4;
 (SS:SP) ← (SOURCE);
 FI;
ELSE
 IF OperandSize = 16
 THEN
 ESP ← ESP - 2;
 (SS:ESP) ← (SOURCE);
 ELSE
 ESP ← ESP - 4;
 (SS:ESP) ← (SOURCE);
 FI;
FI
```
* e8 cw CALL rel16 首先PUSH(IP)，在EIP=EIP+rel16&0x0000ffff
* 68 PUSH imm 

## Intel 和 AT&T 格式汇编的语法差异

type | Intel | AT&T
-----|------|-----
Comments | ; | //
Instructions | Untagged add | Tagged with operand sizes: addq
Registers | eax, ebx, etc. | %eax,%ebx, etc.
Immediates | 0x100 | $0x100
Indirect | [eax] | (%eax)
General indirect | [base + reg + reg * scale + displacement] | displacement(reg, reg, scale)

AT&T and Intel syntax use the opposite order for source and destination operands. Intel add eax, 4 is addl $4, %eax. The source, dest convention is maintained for compatibility with previous Unix assemblers. Note that instructions with more than one source operand, such as the enter instruction, do not have reversed order.