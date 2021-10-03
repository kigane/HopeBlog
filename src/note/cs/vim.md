---
title: vim
category: 使用指南
# 一个页面可以有多个标签
tag:
  - 页面配置
  - 使用指南
sticky: true
star: true
---

## Vim基础

### 资料
[学习Vim](https://missing-semester-cn.github.io/2020/editors/)  
vimtutor : Vim安装时自带的教程  
[Vim Adventures](https://vim-adventures.com/)  
[Vim 小技巧](https://vimways.org/2019/)

![Vim 键盘图](/assets/img/vim-keyboard.png)

### 改键
ubantu  
* setxkbmap -option caps:escape capslock映射为esc
* setxkbmap -option ctrl:nocaps capslock映射为ctrl

### 模式
Vim的设计以大多数时间都花在阅读、浏览和进行少量编辑改动为基础，因此它具有多种操作模式：

* 正常模式：在文件中四处移动光标进行修改
* 插入模式：插入文本
* 替换模式：替换文本
* 可视化(一般，行，块)模式：选中文本块
* 命令模式：用于执行命令

在不同的操作模式下，键盘敲击的含义也不同。

按下 `ESC` 从任何其他模式返回正常模式。 在正常模式，键入 `i` 进入插入 模式， `R` 进入替换模式， `v` 进入可视(一般)模式， `V` 进入可视(行)模式， `Ctrl-V`, 有时也写作 `^V`进入可视(块)模式， `:` 进入命令模式。

Vim 最重要的设计思想是 Vim 的界面本身是一个程序语言。键入操作本身是命令， 这些命令可以组合使用。这使得移动和编辑更加高效，特别是一旦形成肌肉记忆。

### 缓存，标签页，窗口
Vim 会维护一系列打开的文件，称为“缓存”。一个 Vim 会话包含一系列标签页，每个标签页包含一系列窗口(分隔面板)。每个窗口显示一个缓存(可以是同一个缓存)。

Vim 默认打开一个标签页，这个标签也包含一个窗口。

### 基操

* `vim $(fzf)`
* `:q`退出(关闭窗口)
* `:w`保存当前文件(写)
* `:w FILE` 另存为
* `:wq`保存然后退出
* `:e {文件名}` 打开要编辑的文件
* `:ls`显示打开的缓存
* `:help {标题}` 打开帮助文档
    * `:help :w`打开 `:w`命令的帮助文档
    * `:help w`打开 `w` 移动的帮助文档

### 移动
正常模式下
在 Vim 里面移动也被称为 “名词”， 因为它们指向文字块。
* 基本移动: hjkl (左， 下， 上， 右)
* 单词word： w (下一个词的首字母)， b (当前词首)， e (当前词尾) ge(上一个单词词尾)
* 广义单词WORD： W, B, E, gE (广义单词为空格之间的所有字符，单词为数字字母下划线的序列)
* 段落： `{`, `}`。段落是由空行隔开的代码段。
* 行： 0 (行初)， ^ | _ (第一个非空格字符)， $ (行尾)
* 屏幕： H (屏幕首行)， M (屏幕中间)， L (屏幕底部)
* 文件： gg (文件头)， G (文件尾)
* 行数： `:{num}<CR>` 或者 `{num}G` 转到第num行
* ctrl+f 向下翻页
* ctrl+b 向上翻页
* ctrl+d 向下翻半页
* ctrl+u 向上翻半页
* **杂项： % (找到配对，比如各种括号)**
* 查找： f{字符}， t{字符}， F{字符}， T{字符}
    * 查找(find)/到(until) 向前/向后 在本行的{字符}
    * `,` / `;` 用于导航匹配

### 编辑
Vim 的编辑命令也被称为 “动词”， 因为动词可以施动于名词。
* O / o 在之上/之下插入行，并进入编辑模式
* r{char}: 替换一个字符
* R: 进入替换模式
* d{移动命令} 删除 {移动命令}
    * 例如， dw 删除词, d$ 删除到行尾, d0 删除到行头。
* c{移动命令} 改变 {移动命令}
    * 例如， cw 改变词 相当于 d{移动命令} 再 i
* cc 删除该行并在该行进入插入模式
* x 删除字符（等同于 dl）
* s 替换字符（等同于 xi）
* 可视化模式 + 操作
    * 选中文字, d 删除 或者 c 改变
* u 撤销, Ctrl-r 重做
* y 复制 (复制大段需要进入VISUAL模式)
* yy 复制一行
* p 粘贴 (也可将刚刚删除的内容(储存在Vim寄存器中)粘贴到光标后)

### 计数
你可以用一个计数来结合“名词”和“动词”，这会执行指定操作若干次。

* 3w 向前移动三个词
* 5j 向下移动5行
* 7dw 删除7个词

### 搜索
* 搜索: `/{正则表达式}`, `n` / `N` 用于导航匹配，向后/向前
    * set hls(earch) 设置搜索高亮
    * :noh 清楚高亮显示
* :grep 系统的grep
* :vimgrep pattern path 在目录中搜索pattern。`**`表示递归搜索。 `**/*.c`搜索具体文件类型。
    * 执行后，vim会跳转到第一个匹配项处
    * :cn, :cp 逐个浏览匹配项
    * :copen 显示匹配列表

### 修饰语

你可以用修饰语改变“名词”的意义。修饰语有 i，表示“内部”或者“在内“，和 a， 表示”周围“。

* ci( 改变当前括号内的内容
* ci[ 改变当前方括号内的内容
* da' 删除一个单引号字符串， 包括周围的单引号

### 扩展Vim
Vim 有很多扩展插件。从 Vim 8.0 开始，你可以使用内置的插件管理系统。只需要创建一个 ~/.vim/pack/vendor/start/ 的文件夹，然后把插件放到这里。

[vimawesome](https://vimawesome.com/)

## practice vim
* `.` 用于重复一次修改。(从进入插入模式开始到按ESC退出为止的所有操作)。
* `u` 撤销一次修改。输入间隔的停顿时间较长时，就退出吧。可以控制撤销粒度。
* 在插入模式中使用Up,Down等光标键，将会产生一个新的撤销块。可以认为是先退回普通模式，在执行jklh。也会影响`.`命令。 

* `f{char}` 用于在一行内查找下一个指定字符，并立即将光标移动到那里。
* `;` 会重复向后查找上次f命令查找的字符
* `,` 和`;`方向相反
* j,k,0,$用于操作实际行，但加上g前缀后操作屏幕行。
* `:s/target/replacement` 使用`&`重复。
* `*` 查找当前光标下的单词。光标会跳到下一个匹配项。

* `<C-h>` 删除前一个字符，同BS
* `<C-w>` 删除前一个单词
* `<C-u>` 删除至行首。这三个命令比较通用。
* `<C-o>` 进入插入-普通模式，执行一个命令后返回插入模式。
* `<C-r>=` 使用表达式寄存器计算一个表达式，并插入结果。
* `<C-v>{123}` 插入三位数ASCII码对应的字符
* `<C-v>u{1234}` 插入Unicode码对应的字符
* `<C-k>{char1}{char2}` 插入组合字符表示的单个字符
*  `ga` 查看光标所在字符的 ASCII码，Unicode码，字符组合(digr)

* `<C-g>` 在可视模式和选择模式中切换
* `o` 在可视模式中可以切换固定的端点。
* `gv` 重新选择上次的高亮选区


* `:xx` 由于历史原因，被称为Ex命令
* [range]格式为{start},{end}。 
    * `.`表示当前行
    * `%`表示所有行
    * `'<,'>`表示当前高亮选区
    * start，end也可以是模式。如`:/<html>/,/<\/html>/p`打印html标签所在行及之间的所有行。
    * start,end也可以加上偏移。如`:/<html>/+1,/<\/html>/-1p`打印html标签之间的所有行(不包括所在行)。
    * 0 表示文件第一行上方的虚拟行
* :{num} num被解析为地址，会跳转到指定行。
* :[range]normal {commands} 对指定范围内的所有行执行相同的命令
* :copy | :co | :t 复制指定行并粘贴到当前行下方。不会使用寄存器。
* `@:` 重复上次Ex命令
* `q:` 打开命令行窗口，记录了Ex命令历史，可以轻松重复以前的Ex命令
* :shell 打开shell。exit回到vim。
* `z<CR>` 将光标行放到屏幕顶端
* `zz` 将光标行放到屏幕中间

### Text Object
* aw: a word
* iw: inner word
* aW: a WORD
* as: a setence
* is
* ap: a paragraph
* ip
* `a[ | a]` a [] block, `"[content]"->"[content]"`
* `i[ | i]` inner [] block, `"[content]"->"content"`
* a,i作为前缀省略
* `(,),b `
* `<,>`
* `t` tag block `<a>content</a>`
* `{,},B`
* "
* '
* `

## Vim进阶

### vim生成的文件
* backup 是普通的加~备份.
* undofile 加后缀un~。用于在下次打开文件时也可以执行撤销命令撤销上次的修改。
* writebackup 是防止灾难时的加~备份, 特点是文件正常写入之后就会自动删除. 也就是说如果你的文件有正常写入(不正常情况通常发生在磁盘快要满的时候), 你是很难见到这个文件出现的.
* swapfile 也是防止灾难, 不过是缓冲区的备份, 也就是你正在编辑的内容. 如果你在编辑的时候电脑断电或者Vim发生异常退出, 而你没有保存, 你可以从.file.txt.swp里恢复这个文件.

禁止备份功能  
在~/.vimrc中添加
```html
set nobackup
set noundofile
set nowritebackup
set noswapfile
" 备份到某个目录  // 表示会保存目录信息到文件名中
set directory=$HOME/.vim/tmp//
set backupdir=$HOME/.vim/tmp//
set undodir=$HOME/.vim/tmp//
```

### 搜索和替换

* `:s/foo/bar/g` 当前行的foo替换成bar
* `:%s/foo/bar/gc` 所有行的foo替换成bar，且需要一个个确认(`c`)
* `:5,12s/foo/bar/g` 5-12行的foo替换成bar

### 宏
* q{字符} 来开始在寄存器{字符}中录制宏
* q停止录制
* @{字符} 重放宏
* 宏的执行遇错误会停止
* {计数}@{字符}执行一个宏{计数}次

### 在Vim中执行外部命令
`:!external command<CR>`: `!`和回车之间的都是被当做外部命令执行。

### 保存选中部分，取回内容
按v进入可视化模式，移动以选择内容。然后`:w FILE`即可。  
注意按`:`后底部出现了`:'<,'>`。

`:r FILE` 将FILE内容放入光标下一行  
`:r !cmd` 将cmd的输出放入光标下一行

### 设置
`:set xxx`
* ic : 搜索时忽略大小写
* hls : 高亮匹配的字符
* noxxx : 取消xxx设置

### 自动补全
Vim命令也有自动补全，`tab`补全唯一的一个,`ctrl-d`显示所有候选。

### 代码折叠
* 在.vimrc中设置 set foldmethod=syntax|indent
* zc 折叠
* zo 展开
* za 折叠展开切换
* zR 打开所有折叠
* zM 关闭所有折叠

### 命令重映射
* :map 递归映射
* :unmap 取消映射
* :mapclear 清除所有映射
* :noremap 非递归映射
* 前缀
    * nore: 非递归
    * n: 在普通模式下生效
    * v | x: VISUAL模式
    * i: INSERT模式
    * c: 命令模式
* 键表
    * `<k0>` - `<k9>` 小键盘 0 到 9
    * `<S-...>` Shift＋键
    * `<C-...>` Control＋键
    * `<M-...>` Alt＋键 或 meta＋键
    * `<A-...>` 同 `<M-...>`
    * `<Esc>` Escape
    * `<Up>` 光标上移键
    * `<Space>` 空格
    * `<Tab>` Tab
    * `<CR>` 等于`<Enter>`
    * `<f1>~<f12>`
    * `<home> <insert> <del> <end>`
    * `<nop>` 无操作

```html
" 在插入模式下加入一对引号或括号
inoremap ' ''<esc>i
inoremap " ""<esc>i
inoremap ( ()<esc>i
inoremap [ []<esc>i
inoremap { {}<esc>i
```

### 先导键(leader key)
本质是用户或插件自定义的快捷键的命令空间。默认的先导键为`\`。
```html
" 需要放在.vimrc的顶部
" let mapleader = ','
let mapleader = "\<space>" " mapleader变量中不含特殊字符，所以转义字符是必要的
" 使用先导键
nnoremap <leader>w :w<cr> " 用leader-w保存文件 
```

### vim寄存器
使用`"`访问寄存器
* 无名寄存器 复制粘贴默认使用的寄存器。可用`"`访问
* a~z寄存器 用于手动复制数据。例如，将一个单词复制到a寄存器,`"ayw`,粘贴`"ap`
* 0~9寄存器 最近10次删除的历史记录
* 只读寄存器
    * `%` 当前文件名
    * `#` 文件所在目录
    * `.` 最后插入的文本
    * `:` 最后执行的命令
* `*` 系统的主粘贴板
* `+` Linux中`<C-c|v>`使用的粘贴板
* 使用:reg rid 访问寄存器内容 

## 多文件，多窗口

* :help window-moving
* :help window-resize
* :ls 显示所有buffer。 %当前焦点所在的文件。#轮换文件，按`C-^`可以切换到该文件。a活动窗口。
* :w! 将磁盘中的文件读入缓冲区。即回滚所有修改。
* :q! 不修改，关闭所有窗口。
* `<C-w><C-w>` 按住ctrl，连续按ww可以循环切换窗口。
* :pwd 查看vim当前工作目录。默认是在shell中打开vim时，shell的工作目录。
* :lcd {path} 设置当前窗口的本地工作目录 
* :windo lcd {path} 为所有窗口设置本地工作目录 
* % 在文件路径中表示当前缓冲区的完整文件路径。按tab展开。
* %:h 当前缓冲区的完整文件路径，去除了文件名。
* 重映射 `cnoremap <expr>%% getcmdtype() == ':' ? expand('%:h').'/' : '%%'`

在不同文件buffer间切换
* :bn 下一个文件buffer
* :bp 上一个文件buffer
* :ls 输出buffer列表 %表示当前窗口的缓冲区，a表示活动的缓冲区(可见)。
* :b[num] 切换到第num个buffer
* :b{bufname} 使用文件名切换
* :bd 删除缓冲区
* :e file 打开文件
* :jumps 显示vim的跳转列表。
    * `<C-o>` 在跳转列表中后退
    * `<C-i>` 前进
* :changes 显示vim的修改记录表。
    * g; 跳转到上一次修改的地方
    * g, 下
* :find 在当前path下查找文件或文件夹。不支持模糊。不加**则不会进入子文件夹
* set path+=...
* :set path? 查看path的值
* gf 跳转到光标下的文件


用 `:sp` / `:vsp | :vs` 来分割窗口  
同一个缓存可以在多个窗口中显示。

切换
* `<C-W> j` 下一个
* `<C-W> k` 上一个
* `<C-W> h` 左边一个
* `<C-W> l` 右边一个
* `<C-W> w` | `<C-W> <C-w>` 一个一个遍历窗口
* `<C-W> o` 只保留当前窗口
* `:close` 关闭当前窗口，不会退出Vim

标签页
* :tabnew [file] 打开新标签页
* :tabedit [file] 打开新标签页
* gt | :tabnext
* gT | :tabprevious
* Ngt 跳转到标签页N
* :tabclose
* :tabmove N 将当前标签页移动到第N个标签页之后
* :tabonly
* `<C-w> T` 将当前窗口移动到一个新标签页

调整窗口大小
* `[num]<C-W> +` 当前窗口增加一行
* `[num]<C-W> -` 当前窗口减少一行
* :resize +n|-n 简写:res。垂直。
* :vertical resize +n|-n 简写:vert res。水平
* `<C-W> =` 将所有窗口宽高恢复一致。

## 会话(session)
* 保存 `:mksession ~/.vim/sessions/xxx.vim` | `:mks ~/.vim/sessions/xxx.vim`
* 恢复 `vim -S ~/.vim/sessions/xxx.vim`

## 插件
:so % 在vim中直接source当前文件

### vim-plug
* 下载文件 `curl -fLo ~/.vim/autoload/plug.vim --create-dirs https://raw.github.com/junegunn/vim-plug/master/plug.vim`
* vim-plug初始化 在.vimrc中添加两个call。
* 插件管理
    * 添加插件 `Plug <username>/<repo>`
    * :PlugInstall 安装添加的插件
    * :PlugUpdate 更新插件
    * :PlugUpgrade 更新vim-plug。需要source一下。
    * :PlugClean 移除不用的插件
* 插件延迟加载
    * Plug 'scrooloose/nerdtree', {'on', : 'NERDTreeToggle'} 在执行'NERDTreeToggle'命令时再加载
    * Plug 'junegunn/goyo.vim', {'for', : 'markdown'} 按文件类型加载
```shell
call plug#begin()
Plug 'mileszs/ack.vim'
Plug 'easymotion/vim-easymotion.vim'
call plug#end()
```

### ctags
`sudo apt-get install ctags`

#### 生成tags文件
在源码根目录下
```shell
ctags -R --exclude=.git --exclude=vendor/* --...
```
这样就会生成一个tags文件，ctags需要这个文件实现跳转。  
常用的选项可以写在 ~/.ctags 文件中
```shell
-R
--exclude=.git
--exclude=vendor/*
...
```

自动生成ctags
```html
autocmd BufWritePost *.c *.h *.cpp silent! !ctags -R &
```

#### How to use
* 找一个指定的tag，并用Vim打开其定义位置，在shell中使用 `vim -t <tag>`，也可以使用正则
* 在Vim中
    * `ctrl+]`(有多个tag时，会选一个直接进入) 或 `g]`(有多个会显示一个列表) 或 `:ta[g] ctrl+rw` 跳转到tag
    * `:ts tag_name` 列出所有tag_name匹配的tag
    * `:pts tag_name` `:ts`功能，但有预览  
    * `ctrl+w}` 或 `:ptag ctrl+rw` 预览tag
    * `ctrl+wz` 或 `:pc` 关闭上面打开的预览
    * `:tn` 或 `:tp` 在多个匹配的tag上跳转
    * `ctrl+t` 向tag栈底跳一格(相当于返回上一个tag)
    * `:tags` 显示tag栈，当前活动的有 `>` 标记
* 使用正则
    * `:tag main` 直接跳转到 tag "main"
    * `:tag /^get` 直接跳转到以"get"开头的 tag
    * `:tag /Final$` 直接跳转到以"Final"结尾的 tag
    * `:tag /norm` 列出包含"norm"的 tag
    * `:tag /Final$\C` 列出以"Final"结尾的 tag
PS：记得要保持tags索引文件最新

### YouCompleteMe
需要安装cmake和llvm。因为该插件需要编译代码。 `sudo apt-get install cmake llvm`
```html
" .vimrc中配置vim-plug
let g:plug_timeout = 300 " 为插件增加超时时间
Plug 'Valloric/YouCompleteMe', {'do': './install.py'}
```
:source ~/.vimrc | PlugInstall

### ack
mileszs/ack.vim 
* :Ack [opts] {pattern} [{dirs}]
* --cc为c，--rr为r。ack规定语言必须大于一个字符。
* 在搜索结果中
    * ? 命令帮助
    * o 同 enter
    * O 打开文件并关闭搜索窗口
    * go 打开文件但焦点保持在搜索结果窗口
    * q 退出
    * v,h,t,V,H,T 小写打开并切换到，大写打开但焦点保持在搜索结果窗口
    * gv 在右边打开一个窗口，焦点保持在搜索结果窗口

### ctrlp 
完整路径模糊查找。可查文件，buffer，最近使用文件(MRU)， tag等等。

* c-p 打开查找面板
* c-d 选择文件查找|路径查找
* c-r 开关正则匹配
* c-f, c-b 在file查找 ,buffer查找 ,mru查找中切换。
* c-j, c-k 在查找结果中上下移动
* c-t 在新tab页中打开
* c-x,c-v 在新窗口中打开。(x-上下， v-左右)
* c-z 标记多个文件，c-o打开这些文件
* c-y 新建文件如果目录不存在，则创建

### easy-motion
easymotion/vim-easymotion
* \\w 向后跳转到单词头
* \\b 向前跳转到单词头
* \\s 双向跳转到指定字符
* \\j 向下跳转到行首
* \\k 向上跳转到行首

### vim-bookmark
Action | Shortcut | Command
-------|----------|--------
在当前行添加/删除书签 | mm | :BookmarkToggle
Add/edit/remove当前行的书签名 | mi | :BookmarkAnnotate name
显示所有书签 | ma | :BookmarkShowAll
清除当前buffer的所有书签 | mc | :BookmarkClear
清除所有buffer的所有书签 | mx | :BookmarkClearAll
下一个书签 | mn | :BookmarkNext
上一个书签 | mp | :BookmarkPrev
将当前行的书签向上移动n行 | nmkk | :BookmarkMoveUp n
将当前行的书签向下移动n行 | nmjj | :BookmarkMoveDown n
将当前行的书签移动到第n行 | nmg | :BookmarkMoveToLine n
将书签保存到文件中 |  | :BookmarkSave FILE
从文件中加载书签 |  | :BookmarkLoad FILE

### snippet 
* :UltiSnippetsEdit 编辑当前类型文件的snippets
* 格式

## vim-script

### 语法
* set 为Vim内部选项赋值
* let 对非Vim内部变量
* 没有bool类型，1为真，0为假
* 作用域前缀
    * g: 全局作用域。默认
    * v: Vim所定义的全局作用域
    * I: 局部作用域
    * b,w,t: 当前缓冲区，窗口，标签页
    * s: :source'd执行的Vim脚本中的局部文件作用域
    * a: 函数的参数
* echom 输出，可以用:message查看输出历史
* 条件表达式 
    * if expr
    * else if expr
    * else
    * endif
    * (expr ? true : false)
* 文本比较 
    * == 文本比较
    * =~ 正则匹配
    * !~ 正则不匹配
    * 后缀?|#表示忽略|考虑大小写
    * 无后缀是否忽略取决于Vim的内置选项ignorecase
* 函数调用：如果是单独调用，必须在前面加个call。在表达式中，则不必。
* list：类似python的list。add,insert,remove,sort,extend,index,empty,len,count
* dict: 代码跨多行时，要在行尾加`\`. :help dict
* 循环
    * for expr in exprs
    * endfor
    * while expr
    * endwhile
* 函数 
    * function! Funcname() 函数名首字母必须大写。!防止多次定义
    * endfunction
* 和Vim交互
    * execute 将参数解析为Vim命令并执行
    * normal 执行按键序列
    * silent 隐藏其他命令的输出
    * has 检查Vim是否支持某个功能 :help feature-list
    * confirm
    * input
* :help eval