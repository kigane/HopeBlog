---
title: VuePress 默认主题设置
lang: zh-CN
sidebarDepth: 2 
---

## frontmatter
必须在每个 .md 文件开头，通常以 yaml 格式表示。
```yaml
---
title: hello vuepress
lang: zh-CN

sidebarDepth: 2 
navbar: false 
sidebar: false
search: false
tags:
  - configuration
  - theme
  - indexing
prev: ./some-other-page
next: false
pageClass: custom-page-class
layout: SpecialLayout
---
```
* title 会自动作为 sidebar 的一级链接标题(优先级低于在 config.js 中配置)。
* sidebarDepth 见下文内嵌链接
* navbar 用于在本页面关闭导航栏
* sidebar 用于在本页面关闭侧边栏
* search 用于在本页面关闭搜索框
* tag 用于搜索(内置的搜索只搜索文章的 h2, h3 和 frontmatter 中设置的 tags)
* prev 文章底部，上一篇文章的链接
* next 文章底部，下一篇文章的链接
* pageClass 为这一页自定义一个 class，用于在 .vuepress/styles/index.styl 添加自定义 css
* layout 通常每个 .md 文件内容都是在容器 `<div class="page">` 中渲染的，包含侧边栏，上一篇，下一篇链接等。使用这个选项，可以设置使用特定的 vue 组件渲染该 .md 文件。(.vuepress/components/SpecialLayout.vue)


## navbar
外部链接自动获得两个属性 target="_blank" & rel="noopener noreferrer"。你也可以自定义。
* text 是显示的标题
* ariaLabel 不知道有什么用
* link 当然就是链接啦
* items 用于套娃，最多两层(第一层有下拉菜单，第二层之间有分割线)。
```js{7}
themeConfig: {
    logo: '/assets/img/ChernoLogo.png', // 左上角的图标
    // 导航栏
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'External', link: 'https://google.com' , target:'_self', rel:false },
      {
        text: 'Languages',
        ariaLabel: 'Language Menu',
        items: [ // 还可以继续套娃
          {
            text: 'Chinese',
            ariaLabel: 'Chinese Menu', // 没啥用啊，这属性
            items: [
              { text: 'ah', link: 'https://google.com' },
              { text: 'nj', link: 'https://google.com' },
            ]
          },
          {
            text: 'English',
            ariaLabel: 'English Menu', // 没啥用啊，这属性
            items: [
              { text: 'sf', link: 'https://google.com' },
              { text: 'ny', link: 'https://google.com' },
            ]
          },
        ]
      }
    ],

```

## sidebar
```js
// .vuepress/config.js
module.exports = {
  themeConfig: {
    sidebar: [
      '/',
      '/page-a',
      ['/page-b', '显示指定链接标题']
    ]
  }
}
```
指定路径时，可以忽略.md后缀，以'path/'结尾的路径，对应的内容为 path/README.md。如果需要显示指定标题，则如例子中的第三行。

### 内嵌链接
默认抓取 Markdown 文档的所有二级标题作为当前链接的子链接。对应的设置为 themeConfig.sidebarDepth = 1。

sidebarDepth = 0 表示没有子链接。
sidebarDepth = 2 会抓取h2,h3作为子链接。最大层次就是2。效果见本文。

这个设置除了在配置中改，也可以在 .md 的 frontmatter 部分改。
```yaml
---
sidebarDepth: 0
---
```

### 展开所有子链接
```js
// .vuepress/config.js
module.exports = {
  themeConfig: {
    displayAllHeaders: true // Default: false
  }
}
```

### 导航栏分组
顾名思义
```js
sidebar: [
      {
        title: 'Group1', // 必须要有分组名
        collapsable: false, // 默认是折叠，设为 true 表示直接展开
        children: ['/blog/', '/blog/test'] // 有多个分组成员
      },
      { // 只有一个分组成员
        title: 'Group2',
        path: '/guide/',
      },
      '/',
    ]
```

### 多重侧边栏
不同的分区可以对应不同的侧边导航栏。  
**fallback 必须放在最后！**  
auto 的意思是这一个 md 自动生成一个它独占的侧边栏。
```js{14}
sidebar: {
      '/foo/': [
        '',     /* /foo/ */
        'one',  /* /foo/one.html */
        'two'   /* /foo/two.html */
      ],

      '/bar/': [
        '',      /* /bar/ */
        'three', /* /bar/three.html */
        'four'   /* /bar/four.html */
      ],

      '/baz/': 'auto', /* automatically generate single-page sidebars */

      // fallback
      '/': [
        '',        /* / */
        'contact', /* /contact.html */
        'about'    /* /about.html */
      ]
    }
```

## code groups
CodeGroupItem之间需要空一行
```html
<CodeGroup>
<CodeGroupItem title="YARN">
\`\`\`bash
yarn create vuepress-site [optionalDirectoryName]
\`\`\`
</CodeGroupItem>

<CodeGroupItem title="NPM">
\`\`\`bash
npx create-vuepress-site [optionalDirectoryName]
\`\`\`
</CodeGroupItem>
</CodeGroup>
```
效果如下

<CodeGroup>
<CodeGroupItem title="YARN">
```bash
yarn create vuepress-site [optionalDirectoryName]
```
</CodeGroupItem>

<CodeGroupItem title="NPM">
```bash
npx create-vuepress-site [optionalDirectoryName]
```
</CodeGroupItem>
</CodeGroup>