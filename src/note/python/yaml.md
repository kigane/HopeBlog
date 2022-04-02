---
icon: page
title: YAML
author: Leonhardt
category: Python
tag:
  - python
sidebarDepth: 1
sticky: false
star: false
time: 2022-04-01
---

## 是什么
一种非常适合写配置文件的文件格式。和python一样，对缩进非常敏感。

## 怎么用

### 安装pyyaml
`pip install pyyaml`

### YAML语法简介
* 大小写敏感
* 使用缩进表示层级关系
* 缩进不允许使用tab，只允许空格
* 缩进的空格数不重要，只要相同层级的元素左对齐即可
* `#`表示注释
* `key: value`表示对象键值对, 冒号后面要加一个空格。可用缩进表示层级关系
* 以`-`开头的行表示构成一个数组。可以使用行内表示`[a, b, c, ...]`
* 使用~表示null
* 布尔值：TRUE/True/true/yes都行
* 可以使用科学计数法(1e+5), 二进制表示(0b0001_0001)
* 特殊字符需要加引号

### python读写

```python
import yaml
import json

# 读取
with open('config.yml', 'r') as f:
    yobj = yaml.safe_load(f) # 使用safe_laod而非load。因为load不安全。

# 写入
with open('c.yaml', 'w') as file:
    yaml.dump(yobj, file)

# 转为json
with open('c.json', 'w') as file:
    json.dump(yobj, file)
```

### 多YAML文档
YAML支持一个文件中定义多个文档。只需要用`---`将多个文档分开即可。python读取这样的文件时，会返回一个字典数组，每个字典对应一个文档。


<CodeGroup>
<CodeGroupItem title="python">

```python
import yaml

with open('multi_doc.yml', 'r') as file:
    docs = yaml.safe_load_all(file)

    for doc in docs:
        print(doc)
    # {'document': 1, 'name': 'erik'}
    # {'document': 2, 'name': 'config'}
```
</CodeGroupItem>

<CodeGroupItem title="yaml">

```yaml
document: 1
name: 'erik'
---
document: 2
name: 'config'
```
</CodeGroupItem>
</CodeGroup>
