---
title: shell
lang: zh-CN
sidebarDepth: 2
---

## shell 是什么

核心功能：允许你执行程序，输入并获取某种半结构化的输出。

## shell 基础

```shell
hostname:~$ # 主机名:当前目录 $显示当前并非root用户
hostname:~$ echo hello
```
shell 基于空格分割命令并进行解析，执行第一个单词代表的程序，后续单词将作为程序访问的参数

### 环境变量
shell去哪里找需要执行的程序呢？shell是一个编程环境，有变量，条件，循环和函数，在shell中执行命令就是在执行一段shell可以理解的代码。如果执行的命令不是shell的关键字，shell就会咨询**环境变量$PATH**，其中，不同的路径由":"分割。

当然，不用$PATH，直接给出执行程序的路径也可以。
```shell
echo $PATH
/bin/echo $PATH
```

### ls -l & chmod
```shell
#权限     TODO  TODO  TODO 文件大小(B)  最后修改时间 文件名
-rw-r--r-- 1   user  user    220     May 25 02:38 .bash_logout
-rw-r--r-- 1   user  user   3771     May 25 02:38 .bashrc
```
权限由10个字符表示：
* 第一个：d 表示这是一个目录
* 后面每3个一组： 表示文件所有者(u,user)，用户组(g,group)，其他所有人(o,other)所具有的权限
* - 表示相应无权限
* -rwx 分别表示**读，写，执行**权限

`chmod 0777 FILE`: 表示将FILE权限设为-rwxrwxrwx。第一个参数表示文件类型。如果不是4个数，会在前面补0，如4实际为0004。
`chmod u+x FILE`: 表示为用户添加FILE执行权限。[ugoa][+-=][rwx]

### 在程序间创建连接--重定向

shell中程序有两个主要的流：
* 输入流：键盘 '/dev/stdin'
* 输出流：显示器  '/dev/stdout', '/dev/stderr'
* 空：忽略输出 /dev/null

当然，可以重定向
```shell
echo hello > hello.txt # hello
cat < hello.txt > hello2.txt # hello2.txt 中内容: hello
echo world >> hello.txt # hello\nworld
# echo \ world >> hello.txt # hello\n world 空格需要转义
# echo ' world' >> hello.txt # hello\n world 或用引号(单，双都可)包裹
```
\>, < 用于重定向流，>>用于追加内容。  

管道(pipes)："|" 操作符，用于将一个程序的输出和另一个程序的输入连接起来。

### root
sudo 可以让用户以root的身份执行紧跟着的程序。

只有根用户才能做的操作：向`sysfs`文件写入内容，该文件暴露了一些内核参数，所以用户可以在运行时配置系统内核。系统被挂载在`/sys`下。

## shell脚本
* 变量赋值：`foo=bar`，**不能有空格**
* 访问变量：`$foo`
* 字符串：单引号表示原义字符串，其中的变量不会被转义。而双引号中变量会被转义。

### bash函数
```shell
mcd(){
    mkdir -p "$1"
    cd "$1"
}
```

bash使用很多特殊变量表示参数
|符号|含义|
|:---:|:---|
| $0 | 脚本名 |
| $1~$9 | 第n个参数 |
| $@ | 所有参数 |
| $# | 参数个数 |
| $? | 前一个命令的返回值 |
| $$ | 当前脚本的进程识别码 |
| !! | 完整的上一条命令，包括参数 |
| $_ | 上一条命令的最后一个参数 |

命令通常使用`STDOUT`返回输出值，使用`STDERR`返回错误码。返回值0表示正常执行，其他都表示有错误发生。可以搭配短路运算符(`&&`,`||`)进行条件判断。

* 同一行的多个命令可以用 ; 分隔
* 命令替换 (command substitution):以变量的形式获取一个命令的输出。通过 \$(CMD) 这样的方式来执行CMD这个命令时，它的输出结果会替换掉\$(CMD)。例如，如果执行 for file in $(ls) ，shell首先将调用ls ，然后遍历得到的这些返回值。

示例
```shell
#!/bin/bash

echo "Starting program at $(date)" # date会被替换成日期和时间

echo "Running program $0 with $# arguments with pid $$"

for file in "$@"; do
    grep foobar "$file" > /dev/null 2> /dev/null
    # 如果模式没有找到，则grep退出状态为 1
    # 我们将标准输出流和标准错误流重定向到Null，因为我们并不关心这些信息
    if [[ $? -ne 0 ]]; then # [[ 中的命令必须前后空一格 ]]
        echo "File $file does not have any foobar, adding one"
        echo "# foobar" >> "$file"
    fi
done
```
在bash中进行比较时，尽量使用双方括号 [[ ]] 而不是单方括号 [ ]，这样会降低犯错的几率，尽管这样并不能兼容 sh。

在shebang行(脚本第一行)中使用env命令(!/usr/bin/env bash)是一种好的实践，env会用PATH环境变量来进行定位，从而提高脚本的可移植性。


* 函数只能用与shell使用相同的语言，脚本可以使用任意语言。因此在脚本中包含 shebang 是很重要的。
* 函数仅在定义时被加载，脚本会在每次被执行时加载。这让函数的加载比脚本略快一些，但每次修改函数定义，都要重新加载一次。
* 函数会在当前的shell环境中执行，脚本会在单独的进程中执行。因此，函数可以对环境变量进行更改，比如改变当前工作目录，脚本则不行。脚本需要使用export将环境变量导出，并将值传递给环境变量。

### 文件描述符
* 0 STDIN  标准输入 键盘 '/dev/stdin'
* 1 STDOUT 标准输出 显示器 '/dev/stdout', '/dev/stderr'
* 2 STDERR 标准错误
* 空：忽略输出 /dev/null

当文件描述符(0,1,2)与重定向符号"<, >"组合之后，就可以重新定向输入，输出，及错误。

* `command    2>file1` 命令执行的错误信息保存到了file1文件中。显示屏只是显示正确的信息。
* `command    1>file1  2>file2` 命令执行后，没有显示。因为正确输出到file1，错误定向到file2
* `command    &>file1` 命令执行后，输出和错误都定向到file1中
PS:2>file 可以放在命令的前面，也可以放在后面。效果一样。

在shell脚本中，进行流的重定向
* exec 1> file1
* exec 2> file2
* exec 0< file0

指定命令的输出传到STDERR指定的文件: `echo "some output" >&2`


## shell工具
### 查看程序执行时间--time

### 查找文件--find
find [-H] [-L] [-P] [-D debugopts] [-Olevel] [starting-point...] [expression]

find会搜索以每个给出的starting-point为根的文件树，找出匹配expression的文件。默认的starting-point为`.`。

选项
* -P 将symbolic links视为文件，不搜索其指向的文件。这是默认行为
* -L 搜索symbolic links指向的文件
* -H 不搜索symbolic links，除了在处理命令行参数的时候。(应该说的是最后的expression)
* 以上三个只能选一个。同时出现，只有最后一个生效。
-------
* -D 打印find命令的诊断信息
-------
* -Olevel 优化等级
    * 0,1 默认等级。expressions重新排序，-name,-regex测试首先进行
    * 2 -type,-xtype首先执行。
    * 3 所有cost-based查询优化符都会启用。如果有必要的话，测试的顺序会以代价小的优先。


表达式--描述如何匹配文件和如何处理匹配的文件
* 组成
    * Tests 返回T/F，通常以文件的属性为判断基础。
    * Actions 会产生其他影响。也会返回T/F，但以action的成功与否为基础。
    * Global options 总返回true。会影响所有Tests和Actions的行为。
    * Positional options 总返回true。只影响紧随其后的Tests或Actions。
    * Operators expression中其他东西的连接符。默认为 `-a` 即 `AND`
* Positional options
    * -daystart 时间度量从今天0:00开始，而非24小时前。
    * -regextype type 改变正则表达式的语法。具体请 -regextype help
    * -warn,-nowarn 打开或关闭警告信息
* Global options
    * -d/-depth 先处理每个目录的内容，再处理目录本身
    * -maxdepth levels 目录树的最大展开深度。0表示只处理starting-point本身这个根节点。
    * -mindepth levels 目录树的最小展开深度。1表示只不处理starting-point本身这个根节点。
* Tests
    * 数字参数 +n 大于n, -n 小于n, n 正好n。
    -------
    * -xmin n 文件最后一次x是n分钟以前吗？
    * -xnewer reference 文件比指定文件的x更新吗？
    * -xtime n 文件最后一次x是n*24小时以内吗？(+1表示48小时以内，以次类推)
    * 其中x可为
        * a access，表示文件的上次使用时间。
        * c change，表示文件状态的上次修改时间。
        * m modify，表示文件数据的上次修改时间。没有mnewer，因为-newer的默认行为就是这个。
    * -newerXY reference 如果文件的X时间比Y时间新，则返回true。X,Y可以是
        * a accsess time
        * B birthtime
        * c inode status change time
        * m modification time
        * t reference直接解释为时间。
    * -used n 文件上次status改变后到最后access时间过了n天
    -------
    * -empty 空文件或空文件夹
    * -executable 当前用户可执行的文件
    * -gid n 文件的数字组(group)ID为n
    * -group gname 文件属于特定组
    * -uid n
    * -user uname
    * -ilname,-iname,-ipath,-iregex 忽略大小写版本
    * -inum n 文件有n个inode
    * -links n 文件有n个hard link
    * -lname pattern 文件是symbolic link且内容和pattern匹配。(如果使用的-L选项，则总返回false)
    * -name pattern 匹配文件名(只会用文件名取匹配，不包含任何`/`)。元字符`*` `?` `[]`会匹配以`.` 开头的文件。要忽略以`.`开头的文件和文件夹，使用-prune选项。
    * -path pattern 匹配完整的文件名(包含以某个starting point开始的路径，例如 ./src/hello.c)。注意：文件夹的末尾不会加`/`。 
    * -wholename pattern 匹配完整的文件名(绝对路径)。 
    * -regex pattern 匹配完整的文件名。(必须匹配整个完整的文件名，例如'./fubar3' 必须用'.*bar.'匹配)
    * -perm mode 所有的权限匹配。mode 0xxx，参考chmod
    * -perm -mode 所有的权限都有。 -[ugoa][rwx] 
    * -perm /mode 有其中一个权限
    * -readable 当前用户可读
    * -writable 当前用户可写
    * -size n[cwbkMG] 使用n单位的空间的文件，会舍入。
        * b 表示512B为一个单位
        * c bytes
        * w two-byte word
        * k KiB, 1024B
        * M MiB, 1024k
        * G GiB, 1024M
    * -type c 类型c包括
        * b block(buffered) special
        * c character(unbuffered) special
        * d 目录
        * p named pipe(FIFO)
        * f 常规文件
        * l symbolic link
        * s socket
        * D door
    * -xtype 对symbolic link类型的文件，xtype会检查该link文件，而type不会。
* Actions
    * -delete 删除文件，成功时返回true。
    * -exec cmd; 执行cmd;，当cmd返回状态0时返回true。cmd会为每个匹配的文件执行一次。cmd会在执行find命令的起始目录执行。`{}`表示当前匹配的文件，`;`表示命令结束。
    * -exec cmd {} + `-exec`的变体，执行cmd，所有匹配的文件都用空格连接后作为参数放在cmd后。
    * -execdir cmd ;
    * -execdir cmd {} + cmd会在匹配文件所在目录执行
    * -ok cmd ;
    * -okdir cmd ; 执行命令时会弹出提示框，问你是否执行。
    * -ls 以ls -dils 的格式输出当前文件。
    * -fls file 将-ls的输出输出到file文件中。 如果file不存在，创建一个新的，否则，覆盖(truncated)。
    * -print 将完整文件名输出，以newline隔开。默认选项
    * -print0  将完整文件名输出，以'\0'隔开。
    * -printf format
        * %p 文件名 '%h/%f'
        * %P 不包含starting-point的文件名
        * %f 纯文件名
        * %F 文件使用的文件系统
        * %h 文件所在的文件夹名
        * %y 文件的类型
        * %i 文件的十进制inode数
        * %k 文件大小kB
        * %m 文件的八进制权限bit
        * %M 文件的权限符号表示
        * %s 文件大小B
        * %t/%a/%c/%Tk/%Ak/%Ck 文件时间，k为时间的表示方式。
        * %d 文件在目录树中的深度，0表示根节点starting-point。
    * -fprint/-fprint0/-fprintf file [format] 
    * -prune 如果文件是目录，不要进入。如果使用了-depth,-delete，则无效。
    * -quit 立即退出。
* Operators 按优先级降序
    * ( expr ) 因为shell中括号有特殊含义，最好这么写'\(expr\)'
    * ! expr
    * expr1 [-a] expr2 -a等于AND
    * expr1 -o expr2 -o等于OR
    * expr1, expr2 两个表达式都会被评估，但最后一个表达式的返回值成为整个列表的返回值。可以用于搜索一些不同类型的目标，但只遍历一次。
    * 注意-a 比 -o 优先级高，意味着什么。举例来说，find . -name afile -o -name bfile -print 不会输出afile。

例如
```shell
# 查找所有名称为src的文件夹
find . -name src -type d
# 查找所有文件夹路径中包含test的python文件
find . -path '*/test/*.py' -type f
# 查找前一天修改的所有文件
find . -mtime -1
# 查找所有大小在500k至10M的tar.gz文件
find . -size +500k -size -10M -name '*.tar.gz'
```
除了列出所寻找的文件之外，find还能对所有查找到的文件进行操作。这能极大地简化一些单调的任务。
```shell
# 删除全部扩展名为.tmp 的文件
find . -name '*.tmp' -exec rm {} \;
# 查找全部的 PNG 文件并将其转换为 JPG
find . -name '*.png' -exec convert {} {}.jpg \;
```

### xargs
xargs [opts] [cmd [initial-args]]

xargs从标准输入读取items(以blank或newline为分隔符划分，空行直接忽略)，建立并执行cmd命令。initial-args默认是用item填，直到达到系统定义的命令行限制。这样，cmd的总调用数会相对变少，性能表现好些。另外，xargs默认会将blank和newline特殊处理，所以，包含blank和newline的文件名不会被正确处理，需要使用-0选项。

选项
* -t, --verbose 在执行cmd前，将其用STDERR输出
* -p, --interactive 执行每个命令前让用户决定是否执行
* -a file, --arg-file=file 从file读取输入，而非STDIN。如果使用了这个选项，则STDIN在执行cmd时不会变，否则会被重定向到/dev/null。
* -r 如果标准输入为空，则不要执行任何cmd。xargs默认会至少执行一次
---
* -L max-lines 每个cmd使用的非空输入最多为max-line行。
* -n max-args, --max-args=max-args 每个cmd最多使用max-args的参数。如果在达到max-args之前，size超了，则停。
* -s max-chars, --max-chars=max-chars 限制每个cmd最多使用的字符数，包括cmd和initail-args和最后的'\0'。最多不能超过系统命令行限制。
* -x, --exit 如果size超了，直接退出
---
* --show-limits 显示os的命令行长度限制。 最好这么用：`xargs --show-limits 0< /dev/null`
* -P max-procs, --max-procs=max-proc 多线程执行。默认为1，设为0表示使用尽可能多的线程。
* -0, --null items会以'\0'结束，而非空格。所有字符都取字面量。通常和find -print0连用。
* -d delim, --delimiter=delim 输入item解析终止符。仅支持单个字符。
* -E eof-str 如果在输入的某一行出现了eof-str，则其余的输入被忽略。

```shell
find /tmp -name core -type f -print | xargs /bin/rm -f
find /tmp -name core -type f -print0 | xargs -0 /bin/rm -f
```

### wc--代码统计
print newline, word, and byte counts for each file.

用法 
* wc [OPTION] ... [FILE] ...
* wc [OPTION] ... --file0-from=F
* 如果没有指定FILE或FILE=-，则以标准输入为输入。

选项
* 统计信息显示的相对顺序：newline, word, character, byte, maximum line length
* -c, --bytes
* -m, --chars
* -l, --lines
* --files0-from=F 用C风格字符串指定的所有输入文件
* -L, --max-line-length
* -w, --words

### 查找代码--grep
grep 有很多选项，如 -C ：获取查找结果的上下文（Context）；-v 将对结果进行反选（Invert），也就是输出不匹配的结果。例如， grep -C 5 会输出匹配结果前后五行。当需要搜索大量文件的时候，使用 -R 会递归地进入子目录并搜索所有的文本文件。

### sed--流编辑器
sed [opts] [script] [input-file]

* -n 使用安静模式，不会总显示stdin的所有行，只显示被sed处理的行。
* -f scriptfile 读取文件中的操作脚本，并执行
* -r 使用扩展的正则表达式语法
* -i 直接修改文件内容
* script
    *  #a content: 在#行，后新增一行，内容为content
    *  #i content: 在#行，前新增一行，内容为content
    * l,hc content: 将l行到h行的内容替换为content
    * l,hd: 删除l行到h行。$表示最后一行
    * l,hp: 打印l行到h行。
    * [l,h]s/old/new/g: 查找并替换

### awk--行文本处理
常见用法: awk 'program text' file, 从file中读取输入，每一行都用'program text'处理。

* awk每次处理一行，最小处理单位为字段(field, 以空格分隔)
* 变量
    * $0 整行
    * $# 第#个字段
    * NF 一行的字段总数
    * NR 当前awk处理的是第几行
    * FS 目前的分隔符，默认为空格
* 逻辑运算 >,<,>=, <=, ==, !=

---

mawk [-F separator] [-v var=value] [--] 'program text' [file...]  
mawk [-F separator] [-v var=value] [-f program-file] [--] [file...]

* -F 指定分隔符
* -v 预先设置变量
* -f 从指定的文件中读取awk程序
* file 输入，未指定则从STDIN中读取

---

AWK语言
* 程序结构： pattern{action}的序列 
    * pattern可以是 
        * BEGIN 在处理第一行之前顺序执行所有的 BEGIN 后的action。 
        * END 在处理最后一行之后顺序执行所有的 END 后的action。 
        * expr 
        * expr1, expr2
    * 语句以`;`或newline结束。
    * 控制流
        * if (expr) statement
        * if (expr) statement else statement
        * while (expr) statement
        * do statement while (expr)
        * for (opt_expr; opt_expr; opt_expr) statement
        * for (var in array) statement
        * continue
        * break
* 数据类型：numeric和string。
    * 所有numeric都是以浮点数为内部表示和运算。true == 1.0
    * string常量以双引号表示
* 正则表达式
    * expr ~ /regex/ 如果expr匹配regex，则返回1.
    * expr !~ /regex/ 如果expr不匹配regex，则返回1.
    * /r/ {action} 相当于 $0 ~ /r/ {action}, 当行匹配r时，才执行action
* 内置变量
    * $0 整行
    * $# 第#个字段
    * NF 第一行的字段总数
    * NR 当前awk处理的是第几行
    * FS 目前的field分隔符，默认为空格
    * RS record分隔符，默认为'\n'
    * OFS,ORS 输出时的相应分隔符
    * ARGC
    * ARGV
    * FILENAME 输入文件的文件名
* 内置函数
    * 数学函数
        * atan2(y, x)
        * cos(x)
        * sin(x)
        * exp(x)
        * int(x) 向0舍入
        * log(x) 自然对数
        * rand()
        * srand(seed)
        * sqrt(x)
    * mktime(format)
    * String
        * index(s, t) t在s中的起始位置
        * length(s)
        * match(s, r) 返回s中第一个r的位置
        * split(s, A, r) 用r分割s为一系列field，并以数组形式存储在A中。如果r省略，默认为FS。
        * sprintf(format, expr-list) 返回一个格式串
        * sub(r, s, t) 替换一次 将t中的r替换成s。 t缺省为$0
        * gsub(r, s, t) 全部替换
        * substr(s, i, n) 返回s第i个字符后的n个字符，n省略，则返回i后所有字符。(包含第i个)
        * tolower(s) 将s中全部字符换为小写
        * toupper(s) 
* 输出
    * print 将$0输出
    * print expr1,expr2,... 输出 expr1 OFS expr2 OFS...ORS
    * printf format, expr-list
    * getline 略
---
示例
1. 模拟cat {print}
2. 模拟wc {chars += length($0) + 1 # add 1 for the '\n'
           words += NF}
           END {print NR, words, chars}
3. 排序文件
```awk
{line[NR] = $0 ""} # 确保每一行都是string类型
END {
    isort(line, NR)
    for (i =1; i <=NR; i++) print line[i]    
}
 
function isort(A, n,  i, j, hold)
{
    for (i = 2; i <= n; i++)
    {
        hold = A[j = i]
        while (A[j-1] > hold)
        { j--; A[j+1] = A[j]}
        A[j] = hold
    }
}
```

### nl--加行号显示
`nl [opts] [file]` file为`-`或未指定时，从STDIN读入。

### 文件夹导航
fasd和autojump这两个工具来查找最常用或最近使用的文件和目录。

Fasd 基于frecency对文件和文件排序，也就是说它会同时针对频率（frequency ）和时效（ recency）进行排序。默认情况下，fasd使用命令 z 帮助我们快速切换到最常访问的目录。例如， 如果您经常访问/home/user/files/cool_project 目录，那么可以直接使用 z cool 跳转到该目录。对于 autojump，则使用j cool代替即可。

## cheatsheet
|命令|作用|
|:---:|:---|
| man | 用户手册 |
| cd | 切换目录 |
| pwd | 当前工作目录 |
| which | 确定某个程序名代表的是哪个具体程序 |
| ls | 显示目录包含的文件 |
| mv | 移动或重命名文件 |
| cp | 复制文件 |
| rm | 删除文件 |
| mkdir | 新建文件夹 |
| touch | 创建文件或修改文件时间 |
| chmod [mode] FILE | 修改文件权限 |
| grep [pattern] FILE | 打印pattern匹配成功的行  |
|  |  |
|  |  |
