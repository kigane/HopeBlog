---
icon: page
title: Python爬虫
author: Leonhardt
category: Python
tag:
  - python
sidebarDepth: 1
sticky: false
star: false
time: 2022-03-31
---

## 准备

```sh
pip install beautifulsoup4
pip install lxml
pip install requests
```

- Beautiful Soup是一个可以从HTML或XML文件中提取数据的Python库.它能够通过你喜欢的转换器实现惯用的文档导航,**查找**,**修改**文档的方式.
- lxml是HTML或XML文件的解析器.速度很快.通常比python内置的解析器html.parser更好用.
- [requests](https://docs.python-requests.org/en/latest/user/quickstart/#response-content)用于获取网页

## Beautiful Soup介绍
Beautiful Soup将复杂HTML文档转换成一个复杂的树形结构,每个节点都是Python对象,所有对象可以归纳为4种:
- BeautifulSoup: 表示的是一个文档的全部内容.大部分时候,可以把它当作 Tag 对象.
- Tag:与XML或HTML原生文档中的tag相同.即对`<tagName attr=val>Tag Content</tagName>`的包装.
    - name：tag.name == 'tagName'
    - attributes: tag.attrs得到属性字典。也可以直接用tag对象取。`tag[attr] == tag.attrs[attr]`。通常属性返回值为字符串，但一些html规定的多值属性如果有多个值，则会返回字符串列表。
- NavigableString: 通过tag.string获取.包装tag中的字符串.即tag中的`Tag Content`.
- Comment: 是一个特殊类型的 NavigableString 对象.在tag中以`<!--Comment-->`或`<![CDATA[Comment]]>`形式出现。

### 遍历文档树

| 访问子节点     | 描述         |
| :-----------: |:-------------| 
| tag.tagName      | 查找并返回tag节点下的第一个tagName标签子节点。点操作符实际上相当于调用了`tag.find('tagName')`。具体见Tag类的`__getattr___()`方法 | 
| .contents & .children      | 将tag的子节点以NavigableString列表的方式输出. contents返回列表, children返回生成器。仅包含tag的直接子节点. | 
| .descendants | 返回的生成器可以对所有tag的子孙节点进行递归循环 | 
| .string | 如果tag只有一个 NavigableString 类型子节点,那么可以使用 .string 得到.如果tag包含了多个子节点,tag就无法确定 .string 方法应该调用哪个子节点的内容, .string 的输出结果是 None. | 
| .strings & .stripped_strings | 如果tag中包含多个字符串,可以使用 .strings 来循环获取。.stripped_strings是去掉多余的空格与空行的版本。 | 

| 访问父节点和兄弟节点 | 描述         |
| :-----------: |:-------------| 
| .parent   | 获取某个元素的父节点。注意：NavigableString的父节点是其所属的tag | 
| .parents      | 递归得到元素的所有父辈节点。`[..., 'html', '[document]', None]` | 
| .next_sibling & .previous_sibling | 查询一个兄弟节点 | 
| .next_siblings & .previous_siblings | 查询兄弟节点列表 | 

::: warning 注意
对于一个如下所示的复杂标签
```html
<p>
<a href="http://example.com/elsie" id="link1">Elsie</a>or
<a href="http://example.com/lacie" id="link2">Lacie</a> and
<a href="http://example.com/tillie" id="link3">Tillie</a>;
lived at the bottom of a well.
</p>
```
p的子节点有哪些呢？  
`['\n', <a href="http://example.com/elsie" id="link1">Elsie</a>, 'or\n', <a href="http://example.com/lacie" id="link2">Lacie</a>, ' and\n', <a href="http://example.com/tillie" id="link3">Tillie</a>, ';\nlived at the bottom of a well.\n']`  
类型分别为  
`[NavigableString, Tag, NavigableString, Tag, NavigableString, Tag, NavigableString]`

记住：文档节点类型有四种,BeautifulSoup,Tag,NavigableString,Comment.
:::

### 搜索文档树
主要方法为 find() 和 find_all()。所有`find_*`方法参数都一样。

`find(name=None, attrs={}, recursive=True, text=None, **kwargs)`: 返回在子节点中第一个符合条件的节点。
- name: 关于tag的过滤器
- attrs: 属性过滤器
- recursive: 默认递归搜索。设为False后只搜索一层。
- limit: 找到limit个匹配的元素后就结束。
- text=xxx: 通过 string 参数可以搜搜文档中的**字符串内容**.与 name 参数的可选值一样, string 参数接受 字符串 , 正则表达式 , 列表, True 
- kwargs: 设置属性过滤器。和attrs作用相同，会自动转为字典，写法更简单。
    - class_=xxx: 按class属性过滤

过滤器
- 字符串: 查找与字符串完整匹配的标签名
- 正则表达式: 通过正则表达式的 search() 来匹配标签名
- 列表: 将与列表中任一元素匹配的内容返回
- True: 可以匹配任何值
- 函数: 如果没有合适过滤器,那么还可以定义一个函数,函数只接受一个参数即节点,如果这个方法返回 True 表示当前元素匹配并且被找到,如果不是则返回 False

### 通过CSS选择器搜索
Beautiful Soup支持大部分的[CSS选择器](http://www.w3.org/TR/CSS2/selector.html), 在 Tag 或 BeautifulSoup 对象的 .select() 方法中传入字符串参数, 即可使用CSS选择器的语法找到tag.

### 解析部分文档
SoupStrainer 类可以定义文档的某段内容,这样搜索文档时就不必先解析整篇文档,只会解析在 SoupStrainer 中定义过的文档. 创建一个 SoupStrainer 对象并作为 parse_only 参数给 BeautifulSoup 的构造方法即可.  

SoupStrainer 类接受与典型搜索方法相同的参数：name , attrs , recursive , text , **kwargs 。

```python
from bs4 import SoupStrainer
only_a_tags = SoupStrainer("a")
# soup现在只包含a标签
soup = BeautifulSoup(html_doc, "html.parser", parse_only=only_a_tags)
```

## 爬取数据


## 解析数据


## 保存数据