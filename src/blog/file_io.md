---
title: 文件操作
author: Leonhardt
category: Python
tag:
  - python
sidebarDepth: 1
sticky: false
star: false
time: 2021-12-16
---

## os
| 方法  | 作用  | 补充说明  |
| --------- |----------| -----|
| os.chdir(path) | 修改当前工作目录 | 会改变getcwd()的结果  |
| os.getcwd() | 获取当前工作目录 |   |
| os.mkdirs(path) | 创建目录，可以直接创建不存在的父目录再创建子目录，如果目录已存在则抛出错误 | 可以使用exist_ok=True参数，使在创建已存在的目录时不抛出错误。 |
| os.removedirs(path) | 删除指定目录，可以是子目录，如果不存在也不会出现错误 |   |
| os.rename(old, new) | 重命名文件 | 可以是文件或目录。对于目录，如果old不存在，也会创建一个new。对于文件，如果old不存则抛出错误 |
| os.stat(path) | 查询文件meta数据 | st_size(Byte), 时间都是秒数，需要用datatime转换为可读的形式 |
| os.walk(path) | 递归遍历指定路径的所有子文件和目录 | 返回一个三元组的Iterator，(dirpath:str, dirnames:list, filenames:list)分别代表(正在遍历的目录，该目录下的子目录，该目录下的文件)。DFS先序遍历。 |
| os.environ | 返回一个环境变量字典 | os.environ.get(env_name)获取指定环境变量 |
| os.path.join(patha, pathb) | 拼接路径 |  |
| os.path.basename(path) | 文件名 |  |
| os.path.dirname(path) | 文件所在的目录名 |  |
| os.path.split(path) | 返回(文件所在的目录名, 文件名) | 实际是找到最后一个分割符，将path分为两部分放入元组 |
| os.path.splitext(path) | 返回(文件名, 扩展名) | 实际是找到最后一个"."，将path分为两部分,扩展名包含"." |
| os.path.exists(path) | 确认文件或目录是否存在 |   |
| os.path.isdir(path) | 确认path是否为目录 |   |
| os.path.isfile(path) | 确认path是否为文件 |   |

## shutil
| 方法  | 作用  | 补充说明  |
| --------- |----------| -----|
| shutil.copyfile(src, dst) | 复制文件 | dst不能是目录 |
| shutil.copy(src, dst) | 复制文件 | dst可以是目录，此时会将src文件放在dst目录下。dst不存在会创建一个文件 |
| shutil.move(src, dst) | 递归地移动文件或目录 | dst不存在会创建一个文件 |
| shutil.copytree(src, dst) | 复制目录中的所有内容到目标目录中 | src/xx -> dst/xx，dst不存在会创建 |
| shutil.make_archive(basename, format, root) | 将root目录中的所有内容添加到压缩文件中 | format通常设为"zip" |
| shutil.unpack_archive(archive_file) | 解压 | |


