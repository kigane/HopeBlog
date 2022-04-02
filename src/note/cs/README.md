---
icon: page
title: Window 小知识
author: Leonhardt
category: Window
sidebarDepth: 1
sticky: false
star: false
time: 2022-03-29
---

## bat

### 文件复制-robocopy
语法：`robocopy <source> <destination> [<file>[ ...]] [<options>]`  
source和destination都是目录，如果要复制文件，用file参数指定

常用选项：
- /s 复制子目录。默认不包含空目录。
- /e 复制子目录。默认包含空目录。
- /mov 移动文件，复制后删除原文件
- /move 移动文件和目录，复制后删除原文件
- /create Creates a directory tree and zero-length files only.

[详细文档](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/robocopy)

## 日期与时间
- `%DATE%` 当前本地日期
- `%TIME%` 当前本地时间
- `%DATE:~-4,4%` 当前本地日期字符串的最后4个字符
- `%TIME:~0,2%` 当前本地时间字符串前两个字符
