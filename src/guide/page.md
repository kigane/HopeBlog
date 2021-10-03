---
# 这是页面的图标
icon: page
# 这是文章的标题
title: 页面配置
# 设置作者
author: Ms.Hope
# 设置写作时间
time: 2020-01-01
# 一个页面只能有一个分类
category: 使用指南
# 一个页面可以有多个标签
tag:
  - 页面配置
  - 使用指南
# 此页面会在文章列表指定
sticky: true
# 此页面会出现在首页的文章板块中
star: true
# 你可以自定义页脚
footer: 这是测试显示的页脚
---

## 页面信息

你可以在 Markdown 的 Frontmatter 中设置页面信息。

- 作者设置为 Ms.Hope。

- 写作时间应为 2020 年 1 月 1 日

- 分类为 “使用指南”

- 标签为 “页面配置” 和 “使用指南”

## 页面内容

你可以自由在这里书写你的 Markdown。

::: tip

- Markdown 文件夹的图片请使用相对链接 `./` 进行引用。

- `.vuepress/public` 文件夹的图片，请使用绝对链接 `/` 进行引用

:::

主题包含了一个自定义徽章章可以使用:

> 文字结尾应该有深蓝色的 徽章文字 徽章。 <Badge text="徽章文字" color="#242378" />

## 页面结构

此页面应当包含：

- 返回顶部按钮
- 路径导航
- 评论
- 页脚

## slide
@slidestart

## 幻灯片标题
一个拥有文字和 链接 的段落

---

## 代码高亮
```js{2}
const add = (a, b) => {
  if (typeof b === "undefined") return a + 1;

  return a + b;
};
```
@slideend

## mermaid
```mermaid
flowchart TB
    c1-->a2
    subgraph one
    a1-->a2
    end
    subgraph two
    b1-->b2
    end
    subgraph three
    c1-->c2
    end
    one --> two
    three --> two
    two --> c2
```