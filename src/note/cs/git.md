---
title: git
lang: zh-CN
sidebarDepth: 1
---

## 资源
[交互式Git入门网站 强烈推荐!!!](https://learngitbranching.js.org/?locale=zh_CN)  
[Pro Git 中文版](https://git-scm.com/book/zh/v2)  
[Oh Shit, Git!?! 简短的介绍了如何从Git错误中恢复](https://ohshitgit.com/)

[Git 的数据模型](https://eagain.net/articles/git-for-computer-scientists/)  
[Git from the Bottom Up](https://jwiegley.github.io/git-from-the-bottom-up/1-Repository/1-directory-content-tracking.html)

## Git 的数据模型

### 快照
在Git的术语里，文件被称作Blob对象，也就是一组数据。目录则被称之为“树”，它将名字与 Blob 对象或树对象进行映射（使得目录中可以包含其他目录）。快照则是被追踪的最顶层的树。

```text
<root> (tree)
|
+- foo (tree)
|  |
|  + bar.txt (blob, contents = "hello world")
|
+- baz.txt (blob, contents = "git is wonderful")
```
这个顶层的树包含了两个元素，一个名为 “foo” 的树，以及一个 blob 对象 “baz.txt”。

### 历史记录
在 Git 中，历史记录是一个由快照组成的有向无环图。这代表 Git 中的每个快照都有一系列的“父辈”，也就是其之前的一系列快照。注意，快照具有多个“父辈”而非一个，因为某个快照可能由多个父辈而来。例如，经过合并后的两条分支。

在 Git 中，这些快照被称为“提交”。

### 数据模型的伪码表示
```python
// 文件就是一组数据
type blob = array<byte>

// 一个包含文件和目录的目录
type tree = map<string, tree | blob>

// 每个提交都包含一个父辈，元数据和顶层树
type commit = struct {
    parent: array<commit>
    author: string
    message: string
    snapshot: tree
}
```

### 对象和内存寻址
```python
// git中的对象类型
type object = blob | tree | commit

objects = map<string, object>

// Git 在储存数据时，所有的对象都会基于它们的 SHA-1 哈希 进行寻址
def store(object):
    id = sha1(object)
    objects[id] = object

def load(id):
    return objects[id]
```

### 引用
现在，所有的快照都可以通过它们的 SHA-1 哈希值来标记了。但这也太不方便了，谁也记不住一串 40 位的十六进制字符。(Git对哈希的处理很智能。你只需要提供能够唯一标识提交记录的前几个字符即可。但还是很不方便)

针对这一问题，Git 的解决方法是给这些哈希值赋予人类可读的名字，也就是引用（references）。**引用是指向提交的指针**。与对象不同的是，它是可变的（引用可以被更新，指向新的提交）。例如，master 引用通常会指向主分支的最新一次提交。
```python
references = map<string, string>

def update_reference(name, id):
    references[name] = id

def read_reference(name):
    return references[name]

def load_reference(name_or_id):
    if name_or_id in references:
        return load(references[name_or_id])
    else:
        return load(name_or_id)
```

 通常情况下，我们会想要知道“我们当前所在位置”，并将其标记下来。这样当我们创建新的快照的时候，我们就可以知道它的相对位置（如何设置它的“父辈”）。在 Git 中，我们当前的位置有一个特殊的索引，它就是 “HEAD”。

 如果想看 HEAD 指向，可以通过 cat .git/HEAD 查看， 如果 HEAD 指向的是一个引用，还可以用 git symbolic-ref HEAD 查看它的指向。

### 仓库
Git仓库就是对象(文件，目录，提交)和引用(分支，HEAD, hash, tag)。

在硬盘上，Git仅存储对象和引用：因为其数据模型仅包含这些东西。所有的 git 命令都对应着对提交树的操作，例如增加对象，增加或删除引用。

## 相对引用
 * 使用 `ref^` 向上移动1个提交记录(ref^^,2个)
 * 使用 `ref~<num>` 向上移动多个提交记录，如 ~3(1也可以省略)
 * 应用：移动分支，使用-f选项让分支指向另一个提交。例如:`git branch -f main HEAD~3`
 * `^<num>`: 如果父节点不止一个，ref^就指向产生该节点(在这里merge的)的父节点，`ref^2`就指向另一个节点
 * 链式移动: `git checkout ~^2~3`

## 暂存区
Git 中还包括一个和数据模型完全不相关的概念，但它确是创建提交的接口的一部分。允许您指定下次快照中要包括那些改动。

使用场景：您开发了两个独立的特性，然后希望创建两个独立的提交，其中第一个提交仅包含第一个特性，而第二个提交仅包含第二个特性。

## tag
**永远指向某个提交记录的标识**。通常软件发布新的大版本，或者是修正一些重要的Bug或是增加了某些新特性这种重要的修改可以添加一个tag。

tag可以(在某种程度上 —— 因为标签可以被删除后重新在另外一个位置创建同名的标签)永久地将某个特定的提交命名为里程碑，然后就可以像分支一样引用了。

更难得的是，它们并不会随着新的提交而移动。你也不能检出到某个标签上面进行修改提交，它就像是提交树上的一个锚点，标识了某个特定的位置。

```bash
git tag tagName refspec # 在refspec提交上建立一个标签tagName
git tag tagName # 在HEAD指向的提交上建立一个标签
git describe refspec # 结果格式为tagName_distance_ghash，tagName是离refspec最近的tag的名称，distance是refspec离tag的距离，hash是refspec hash值的前几位。
```

## cheatsheet
Git中“refspec” 是一个自造的词，意思是Git能识别的位置(比如分支foo或者HEAD~1)。如果需要refspec参数缺省为HEAD。

基础
* git help \<command\>: 获取 git 命令的帮助信息
* git init: 创建一个新的 git 仓库，其数据会存放在一个名为 .git 的目录下
* git status: 显示当前的仓库状态
* git add \<filename\>: 添加文件到暂存区
* git commit: 创建一个新的提交
* git commit --allow-empty: 创建一个新的提交，允许没有修改
* git log: 显示历史日志
* git log --author who: 显示who提交的历史日志
* git log --all --graph --decorate: 可视化历史记录（有向无环图）
* git diff \<filename\>: 显示与暂存区文件的差异
* git diff \<revision\> \<filename\>: 显示某个文件两个版本之间的差异
* git checkout \<revision\>: 更新 HEAD 和目前的分支

分支和合并
* git branch: 显示分支
* git branch \<name\>: 创建分支
* git checkout -b \<name\>: 创建分支并切换到该分支
* git merge refspec: 合并到当前分支
* git mergetool: 使用工具来处理合并冲突
* git rebase: 将一系列补丁变基（rebase）为新的基线

远端操作
* git remote: 列出远端
* git remote add \<name\> \<url\>: 添加一个远端
* git push \<remote\> \<local branch\>:\<remote branch\>: 将对象传送至远端并更新远端引用
* git branch --set-upstream-to=\<remote\>/\<remote branch\>: 创建本地和远端分支的关联关系
* git fetch: 从远端获取对象/索引
* git pull: 相当于 git fetch; git merge
* git clone: 从远端下载仓库

撤销
* git commit --amend: 编辑提交的内容或信息。在提交树中HEAD所指节点的父节点下生成一个新的commit节点，并指向新的commit节点，原节点的子节点不会保留。所以最好只对叶节点使用 --amend.
* git reset HEAD~1: 撤销最近一次commit，在reset后所做的变更还在，但是处于未加入暂存区状态。适合在本地修改。
* git revert refspec: 会commit一次，将最近一次commit的修改撤销。适合多人协作时，撤销已push的修改。
* git checkout -- \<file\>: 丢弃修改

Git 高级操作
* git config: Git 是一个 高度可定制的 工具
* git clone --depth=1: 浅克隆（shallow clone），不包括完整的版本历史信息
* git add -p: 交互式暂存
* git rebase to [from]: from不写默认为HEAD所指节点。将从from节点和to节点的最近公共父节点(不包括该父节点)到from结点本身的所有节点按顺序复制到to节点下，HEAD将指向被复制的from节点，另外from节点(路径上的其他节点的引用不会动)上的引用(分支，tag等)也会指向新的from节点。用于将from分支上的工作转移到to分支上。PS：如果from为to的祖先节点，则rebase只是将from的引用移动到to上。
* git rebase -i ref~n: 交互式变基(经典左闭右开/下闭上开)
* git cherry-pick refspec1 refspec2 ...:可以将提交树上任何其他地方的提交记录取过来追加到HEAD上（不能是HEAD上游的提交）
* git blame: 查看最后修改某行的人
* git stash: 暂时移除工作目录下的修改内容
* git bisect: 通过二分查找搜索历史记录
* git describe refspec: 结果格式为tagName_distance_ghash，tagName是离refspec最近的tag的名称，distance是refspec离tag的距离，hash是refspec hash值的前几位。
* .gitignore: 指定 故意不追踪的文件

### git stash
`git stash`命令会暂时缓存任何你未提交的修改，包括暂存区的和未暂存的(没有通过`git add`命令添加到暂存区的，包括新add的增删文件，修改add过的文件)，不包括未追踪的文件。stash就相当于将之前的修改都隐藏了起来，之后的操作不会受到之前修改的限制。
注意：stash只保留在本地库中，不会被推送到远程库。
```bash
# 做一些修改1
git stash
# 再做一些修改2
git stash
# 再再做一些修改3，并提交 假设三次修改的是不同的文件
# some changes
git commit
# 不想要修改2了
git stash pop
# 继续从修改1开始
git stash apply
```
注意：git stash apply会将修改应用到所有分支。比如，在test分支修改了一个文件，stash以后再apply回来，这样master分支中也会有一个未提交的修改。

## 远程仓库
### git clone
git clone somerepo后，本地就有了somerepo的完整提交树，并且多了origin/master,origin/dev....等多了origin/前缀的远程分支(另有origin/HEAD->origin/main说明远程分支的HEAD指向哪里)。

远程分支反映了远程仓库(在你上次和它通信时)的状态。

远程分支有一个特别的属性，在你检出时自动进入分离HEAD状态(不是HEAD指向的分支上有\*，而是HEAD独立显示出来)。Git这么做是因为不能直接在这些分支上进行操作, 你必须在本地完成你的工作, （更新了远程分支之后）再用远程分享你的工作成果。

### git fetch 
完成了仅有的但是很重要的两步:

1. 从远程仓库下载本地仓库中缺失的提交记录
2. 更新远程分支指针(如 o/main)

实际上将本地仓库中的远程分支更新成了远程仓库相应分支最新的状态。但并不会改变你本地仓库的状态。它不会更新你的 main 分支，也不会修改你磁盘上的文件。

要实际更新，需要使用git merge将远程和本地分支合并。(git cherry-pick, git rebase也可以)

### git pull
实际等同于 git fetch + git merge。 
用法参考`git push`/`git fetch`

### git push
`git push remoteRepo place` (remoteRepo 通常为 origin)  
`git push remoteRepo <source>:<remote branch>`  (source是refspec，如果remote branch是远程仓库中的分支名(没有origin/前缀)且不存在会自动创建新的)
`git push remoteRepo :foo` (会删除远程的foo分支)
将本地提交同步到远程，并将本地仓库的远程分支也更新好。

PS：git fetch 语法类似，只是方向相反罢了。

### 最常见团队合作工作流
从某个commit之后，你和同事分别修改各自的代码，现在你的同事已经将他的代码同步到远程库了，你的代码该如何提交。(假设没有冲突)。

方案一：git fetch; git rebase origin/main; git push 
方案二: git fetch; git merge origin/main; git push
方案一简化版：git pull --rebase; git push
方案二简化版: git pull; git push

### 远程服务器拒绝!(Remote Rejected)
如果你是在一个大的合作团队中工作, 很可能是main被锁定了, 需要一些Pull Request流程来合并修改。如果你直接提交(commit)到本地main, 然后试图推送(push)修改, 你将会收到这样类似的信息:

> ! [远程服务器拒绝] main -> main (TF402455: 不允许推送(push)这个分支; 你必须使用pull request来更新这个分支.)

远程服务器拒绝直接推送(push)提交到main, 因为策略配置要求 pull requests 来提交更新.

你应该按照流程,新建一个分支, 推送(push)这个分支并申请pull request,但是你忘记并直接提交给了main.现在你卡住并且无法推送你的更新.

解决办法
新建一个分支feature, 推送到远程服务器. 然后reset你的main分支和远程服务器保持一致, 否则下次你pull并且他人的提交和你冲突的时候就会有问题.
```bash
git reset --hard o/main # 重置索引和工作树。 自o/main以来的工作树中跟踪文件的任何更改都被丢弃。
git checkout -b feature rawmainSHA # reset不会删除已有的commit。所以仍能checkout到你修改过commit，同时新建分支。
git push origin feature # 将你的修改(现在在feature中)同步到远端的feature分支

# 我认为更好的方法
git branch feature
git push origin feature
git reset --hard origin/main
git checkout feature
```
然后再申请pull request。

### 合并特性分支
有些开发人员只在 main 上做 push、pull —— 这样的话 main 总是最新的，始终与远程分支 (o/main) 保持一致。

这个工作流，分两个步骤：
1. 将特性分支集成到 main 上 
2. 推送并更新远程分支 git pull --rebase; git push

### rebase 和 merge
在开发社区里，有许多关于 merge 与 rebase 的讨论。以下是关于 rebase 的优缺点：
* 优点: Rebase 使你的提交树变得很干净, 所有的提交都在一条线上
* 缺点: Rebase 修改了提交树的历史。比如, 提交 C1 可以被 rebase 到 C3 之后。这看起来 C1 中的工作是在 C3 之后进行的，但实际上是在 C3 之前。

一些开发人员喜欢保留提交历史，因此更偏爱 merge。而其他人可能更喜欢干净的提交树，于是偏爱 rebase。

### 远程跟踪
直接了当地讲，main 和 o/main 的关联关系就是由分支的“remote tracking”属性决定的。main 被设定为跟踪 o/main —— 这意味着为 main 分支指定了推送的目的地以及拉取后合并的目标。

当你克隆时, Git 会为远程仓库中的每个分支在本地仓库中创建一个远程分支（比如 o/main）。然后再创建一个跟踪远程仓库中活动分支的本地分支，默认情况下这个本地分支会被命名为 main。
这也解释了为什么会在克隆的时候会看到下面的输出：
> local branch "main" set to track remote branch "o/main"

自己指定本地分支和远程分支的映射
1. git checkout -b notmain origin/main
2. git branch -u origin/main foo # foo不写就默认使用当前分支

之后commit,push这个notmain分支到远程库，实际就会更新远程库的main分支。

