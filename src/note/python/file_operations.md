---
icon: page
title: Python文件操作
author: Leonhardt
category: Python
tag:
  - python
sidebarDepth: 1
sticky: false
star: false
time: 2022-03-30
---

## os.walk()
`os.walk(top[, topdown=True])`: 从top目录开始，先序遍历所有子目录

```python
for root, dirs, files in os.walk(path):
  print(root) # str
  print(dirs) # list
  print(files) # list
  print('\n')
```

## pathlib & os & os.path
path.xxx表示实例方法，Path.xxx表示类方法(@classmethod)。  

### 文件操作
| os & os.path  | pathlib       | 作用  |
| ------------- | ------------- | -----|
| os.chmod(mode) | path.chmod(mode) | 改变文件模式和权限 |
| os.mkdir(path) | path.mkdir(path, parents=False) | 创建一个名为 path 的目录,如果中间目录不存在会报错 |
| os.makedirs(path, exist_ok=False) | path.mkdir(path, parents=True, exist_ok=False)  | 如果 exist_ok 为 false（默认），则在目标已存在的情况下抛出 FileExistsError。为 True 则忽略该异常。 |
| os.rename(src, dst) | path.rename(target) | 重命名。如果dst已存在，则失败。 |
| os.replace(src, dst) | path.replace(target) | 重命名。但dst是文件，且存在时，会直接替换。target无论是文件或目录都会直接替换。 |
| os.rmdir(path) | path.rmdir() | 移除此目录。此目录必须存在且为空。 |
| os.remove(path) | 无对应方法 | 移除此文件。不能是目录。 |

### 路径操作
| os & os.path  | pathlib       | 作用  |
| ------------- | ------------- | -----|
| os.stat(path) | path.stat() | 检查文件属性 |
| os.path.abspath(path) | path.resolve() | 返回path的标准化的绝对路径 |
| os.getcwd() | Path.cwd() | 返回当前工作目录路径 |
| os.path.exists(path) | path.exists() | 检测文件或目录是否存在 |
| os.listdir(path='.') | path.iterdir() | 列出path的所有子文件和子目录 |
| os.path.isdir(path) | path.is_dir() | 检测path是否为目录 |
| os.path.isfile(path) | path.is_file() | 检测path是否为文件 |
| os.path.join(path, \*paths) | path.joinpath(\*other) | 拼接路径 |
| os.path.basename(path) | path.name | 返回path的基本名称。这是将path传入函数split()之后，返回的一对值中的第二个元素 |
| os.path.dirname(path) | path.parent | 返回path的目录名称。这是将path传入函数split()之后，返回的一对值中的第一个元素 |
| os.path.splitext(path) | path.suffix | 将path拆分为(root, ext)对使得root + ext == path，并且ext为空或以句点打头并最多只包含一个句点。path.suffix == ext |

::: tip os.path.split(path)
将path拆分为一对，即(head,tail)，其中，tail是路径的最后一部分，而head里是除最后部分外的所有内容。tail部分不会包含斜杠，如果path以斜杠结尾，则tail将为空。如果path中没有斜杠，head将为空。如果path为空，则head和tail均为空。head末尾的斜杠会被去掉，除非它是根目录（即它仅包含一个或多个斜杠）。在所有情况下，join(head,tail)指向的位置都与path相同（但字符串可能不同）。另head==dirname()和tail==basename()。
:::

## shutil

### 高阶文件操作
- shutil.copyfile(src, dst): 复制文件src到文件dst。
- shutil.copy(src, dst) & shutil.copy2(src, dst: 文件src拷贝到文件或目录dst。
- shutil.copytree(src, dst, ignore=None, copy_function=copy2, dirs_exist_ok=False): 将以src为根起点的整个目录树拷贝到名为dst的目录并返回目标目录。dirs_exist_ok指明是否要在dst或任何丢失的父目录已存在的情况下引发异常。
- shutil.rmtree(path): 删除一个完整的目录树；path 必须指向一个目录。
- shutil.move(src, dst, copy_function=copy2): 递归地将一个文件或目录 (src) 移至另一位置 (dst) 并返回目标位置。

### 压缩操作
- shutil.make_archive(base_name, format[, root_dir[, base_dir]])
  - base_name: 要创建的文件名称，包括路径，去除任何特定格式的扩展名。
  - format: 归档格式。
    - "zip" (如果 zlib 模块可用)
    - "tar", "gztar" (如果 zlib 模块可用)
    - "bztar" (如果 bz2 模块可用)
    - "xztar" (如果 lzma 模块可用)
  - root_dir: 归档文件的根目录，归档中的所有路径都将是它的相对路径。相当于先os.chdir(root_dir)。
  - base_dir: 要执行归档的起始目录。也就是说base_dir将成为归档中所有文件和目录共有的路径前缀。base_dir必须相对于root_dir给出。
  - root_dir 和 base_dir 默认均为当前目录。
  - 这个函数不是线程安全的
- shutil.unpack_archive(filename[, extract_dir[, format]])
  - 解包一个归档文件。filename是归档文件的完整路径。
  - extract_dir是归档文件解包的目标目录名称。 如果未提供，则将使用当前工作目录。
- shutil.get_archive_formats(): 返回支持的归档格式列表。