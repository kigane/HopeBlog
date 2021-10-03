---
title: CSS 模块化
lang: zh-CN
sidebarDepth: 1
---

## 模块化CSS
是指把页面分割成不同的组成部分，这些组成部分可以在多种上下文中重复使用，并且互相之间没有依赖关系。最终目的是，当我们修改其中一部分CSS时，不会对其他部分产生意料之外的影响。

### 基础样式
每个样式表的开头都要写一些给整个页面使用的通用规则，模块化CSS也不例外。这些规则通常被称为基础样式，其他的样式是构建在这些基础样式之上的。

::: details https://necolas.github.io/normalize.css/
```css
/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */

/* Document
   ========================================================================== */

/**
 * 1. Correct the line height in all browsers.
 * 2. Prevent adjustments of font size after orientation changes in iOS.
 */

html {
  line-height: 1.15; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
}

/* Sections
   ========================================================================== */

/**
 * Remove the margin in all browsers.
 */

body {
  margin: 0;
}

/**
 * Render the `main` element consistently in IE.
 */

main {
  display: block;
}

/**
 * Correct the font size and margin on `h1` elements within `section` and
 * `article` contexts in Chrome, Firefox, and Safari.
 */

h1 {
  font-size: 2em;
  margin: 0.67em 0;
}

/* Grouping content
   ========================================================================== */

/**
 * 1. Add the correct box sizing in Firefox.
 * 2. Show the overflow in Edge and IE.
 */

hr {
  box-sizing: content-box; /* 1 */
  height: 0; /* 1 */
  overflow: visible; /* 2 */
}

/**
 * 1. Correct the inheritance and scaling of font size in all browsers.
 * 2. Correct the odd `em` font sizing in all browsers.
 */

pre {
  font-family: monospace, monospace; /* 1 */
  font-size: 1em; /* 2 */
}

/* Text-level semantics
   ========================================================================== */

/**
 * Remove the gray background on active links in IE 10.
 */

a {
  background-color: transparent;
}

/**
 * 1. Remove the bottom border in Chrome 57-
 * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.
 */

abbr[title] {
  border-bottom: none; /* 1 */
  text-decoration: underline; /* 2 */
  text-decoration: underline dotted; /* 2 */
}

/**
 * Add the correct font weight in Chrome, Edge, and Safari.
 */

b,
strong {
  font-weight: bolder;
}

/**
 * 1. Correct the inheritance and scaling of font size in all browsers.
 * 2. Correct the odd `em` font sizing in all browsers.
 */

code,
kbd,
samp {
  font-family: monospace, monospace; /* 1 */
  font-size: 1em; /* 2 */
}

/**
 * Add the correct font size in all browsers.
 */

small {
  font-size: 80%;
}

/**
 * Prevent `sub` and `sup` elements from affecting the line height in
 * all browsers.
 */

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

/* Embedded content
   ========================================================================== */

/**
 * Remove the border on images inside links in IE 10.
 */

img {
  border-style: none;
}

/* Forms
   ========================================================================== */

/**
 * 1. Change the font styles in all browsers.
 * 2. Remove the margin in Firefox and Safari.
 */

button,
input,
optgroup,
select,
textarea {
  font-family: inherit; /* 1 */
  font-size: 100%; /* 1 */
  line-height: 1.15; /* 1 */
  margin: 0; /* 2 */
}

/**
 * Show the overflow in IE.
 * 1. Show the overflow in Edge.
 */

button,
input { /* 1 */
  overflow: visible;
}

/**
 * Remove the inheritance of text transform in Edge, Firefox, and IE.
 * 1. Remove the inheritance of text transform in Firefox.
 */

button,
select { /* 1 */
  text-transform: none;
}

/**
 * Correct the inability to style clickable types in iOS and Safari.
 */

button,
[type="button"],
[type="reset"],
[type="submit"] {
  -webkit-appearance: button;
}

/**
 * Remove the inner border and padding in Firefox.
 */

button::-moz-focus-inner,
[type="button"]::-moz-focus-inner,
[type="reset"]::-moz-focus-inner,
[type="submit"]::-moz-focus-inner {
  border-style: none;
  padding: 0;
}

/**
 * Restore the focus styles unset by the previous rule.
 */

button:-moz-focusring,
[type="button"]:-moz-focusring,
[type="reset"]:-moz-focusring,
[type="submit"]:-moz-focusring {
  outline: 1px dotted ButtonText;
}

/**
 * Correct the padding in Firefox.
 */

fieldset {
  padding: 0.35em 0.75em 0.625em;
}

/**
 * 1. Correct the text wrapping in Edge and IE.
 * 2. Correct the color inheritance from `fieldset` elements in IE.
 * 3. Remove the padding so developers are not caught out when they zero out
 *    `fieldset` elements in all browsers.
 */

legend {
  box-sizing: border-box; /* 1 */
  color: inherit; /* 2 */
  display: table; /* 1 */
  max-width: 100%; /* 1 */
  padding: 0; /* 3 */
  white-space: normal; /* 1 */
}

/**
 * Add the correct vertical alignment in Chrome, Firefox, and Opera.
 */

progress {
  vertical-align: baseline;
}

/**
 * Remove the default vertical scrollbar in IE 10+.
 */

textarea {
  overflow: auto;
}

/**
 * 1. Add the correct box sizing in IE 10.
 * 2. Remove the padding in IE 10.
 */

[type="checkbox"],
[type="radio"] {
  box-sizing: border-box; /* 1 */
  padding: 0; /* 2 */
}

/**
 * Correct the cursor style of increment and decrement buttons in Chrome.
 */

[type="number"]::-webkit-inner-spin-button,
[type="number"]::-webkit-outer-spin-button {
  height: auto;
}

/**
 * 1. Correct the odd appearance in Chrome and Safari.
 * 2. Correct the outline style in Safari.
 */

[type="search"] {
  -webkit-appearance: textfield; /* 1 */
  outline-offset: -2px; /* 2 */
}

/**
 * Remove the inner padding in Chrome and Safari on macOS.
 */

[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
}

/**
 * 1. Correct the inability to style clickable types in iOS and Safari.
 * 2. Change font properties to `inherit` in Safari.
 */

::-webkit-file-upload-button {
  -webkit-appearance: button; /* 1 */
  font: inherit; /* 2 */
}

/* Interactive
   ========================================================================== */

/*
 * Add the correct display in Edge, IE 10+, and Firefox.
 */

details {
  display: block;
}

/*
 * Add the correct display in all browsers.
 */

summary {
  display: list-item;
}

/* Misc
   ========================================================================== */

/**
 * Add the correct display in IE 10+.
 */

template {
  display: none;
}

/**
 * Add the correct display in IE 10.
 */

[hidden] {
  display: none;
}
```
:::

### 简单的模块组织规则
* 模块的选择器由单个类名构成，这非常重要。这样通过给元素添加类名，就可以把这些样式复用到很多场景，比如针对表单输入给用户反馈，提供醒目的帮助文字，或者提醒用户注意免责声明条款等。使用相同的组件，就能产生一套风格一致的UI。

* 要把一个模块所有的代码集中放在同一个地方，这样一个接一个的模块就会组成我们最终的样式表。

* 通过定义一个以模块名称开头的新类名来创建一个修饰符(也叫变体类)。常用的写法是使用两个连字符来表示修饰符，比如message--error。双连字符的写法很容易区分哪部分是模块名称，哪部分是修饰符。
* 当模块需要有不同的外观或者表现的时候，就创建一个可以直接应用到指定元素的修饰符类。比如，写．dropdown--dark，而不是写成page-header.dropdown。通过这种方式，模块本身，并且只能是它本身，可以决定自己的样式表现。其他模块不能进入别的模块内部去修改它。这样一来，深色下拉列表并没有绑定到深层嵌套的HTML结构上，也就可以在页面上需要的地方随意使用。

* 对于多元素模块，如媒体对象。给主容器添加media类名来匹配模块名称。对于容器内的图片和正文，可以使用类名media__image和media__body。这些类名以模块名称开头，后跟双下划线，然后是子元素的名称。

* 模块封装的一个非常重要的原则--单一职责原则（Single Responsibility Principle）。有一条经验：“如果你不得不使用并（或者和）这个词来表述模块的职责，那你可能正在描述多项职责。” 尽可能让一个模块只负责一项职责。

* 应该尽量让需要定位的元素关联到同一个模块内的其他元素。只有这样，我们把模块放在另一个有定位的容器里的时候，才不会弄乱样式。

* 状态类（state class）代表着模块在当前状态下的表现。通常在模块里使用JavaScript动态地添加或移除它。按照惯例，状态类一般以is-或者has-开头。这样状态类的目的就会比较明显，它们表示模块当前状态下的一些特征或者即将发生的变化。状态类的代码要和模块的其他代码放在一起。使用JavaScript动态更改模块表现的时候，要使用状态类去触发改变。


### 预处理器
所有的预处理器（比如Sass或者LESS）都提供了把分散的CSS文件合并成一个文件的功能。我们可以用多个文件和多个目录来组织样式，最后提供一个文件给浏览器。这样可以减少浏览器发起的网络请求数，开发者也可以把代码文件拆分成易于维护的大小。
//TODO

### 工具类
有时候，我们需要用一个类来对元素做一件简单明确的事，比如让文字居中、让元素左浮动，或者清除浮动。这样的类被称为工具类（utility class）。工具类是唯一应该使用important注释的地方。事实上，工具类应该优先使用它。这样的话，不管在哪里用到工具类，都可以生效。

工具类的作用立竿见影。在页面上做点小事儿的时候不需要创建一个完整的模块，这种情况下可以用一个工具类来实现。但是不要滥用工具类。对于大部分网站，最多十几个工具类就够用了。

::: details 示例
```css
.text-center {
  text-align: center !important;
}

.float-left {
  float: left;
}

.clearfix::before,
.clearfix::after {
    content: " ";
    display: table;
}

.clearfix::after {
    clear: both;
}

.hidden {
  display: none !important;
}
```
:::

## 模式库
把模块清单整合成一组文档，在大型项目中已经成为通用做法。这组文档被称为模式库（pattern library）或者样式指南（style guide）。模式库不是网站或者应用程序的一部分，它是单独的一组HTML页面，用来展示每个CSS模块。模式库是你和你的团队在建站的时候使用的一个开发工具。

### KSS
一个模式库构建工具。

1. 创建项目文件夹
2. npm init -y 初始化项目
3. npm install --save-dev kss 安装KSS
4. 配置KSS配置文件
  * 新建kss-config.json
  * 在package.json中添加一条构建命令 `"build": "kss --config kss-config.json"`
5. 编写KSS文档
6. npm run build 构建KSS模式库

::: details kss-config.json
```json
{
  "title": "My pattern library",
  "source": [
    "./css" // KSS将扫描的CSS源文件路径
    // 如果使用了预处理器，比如SASS或者Less，源文件目录应该指向SASS或者Less文件，
    // 但是css字段应该指向编译生成的CSS样式表。
  ],
  "destination":  "docs/", // 生成的模式库文件路径
  "css": [
    "../css/styles.css" // 相对于destination路径的css文件路径
  ],
  "js": [
    "../js/docs.js" // 相对于destination路径的js文件路径
  ]
}
```
:::

### 编写KSS文档
KSS会按照特定的方式在样式表中搜寻注释。注释中包含了标题（通常是模块名称）、描述信息、示例HTML代码和用来表示该模块在目录中位置的Styleguide注释。这几个部分之间通过空白行彼此间隔，便于KSS区分它们。严格来讲，只有最后的Styleguide注释是KSS必需的，如果没有这一行，KSS就会忽略整个注释块。
```css
/*
Dropdown  // 文档标题

// 一些描述，使用Markdown语法
A dropdown menu. Clicking the toggle button opens
and closes the drawer.

Use JavaScript to toggle the `is-open` class in
order to open and close the dropdown.

Markup: // 用来举例说明模块的用法。KSS把这些HTML转化成模式库，以便读者预览效果，复制粘贴。
<div class="dropdown">
  <button class="dropdown__toggle">Open menu</button>
  <div class="dropdown__drawer">
    Drawer contents
  </div>
</div>

Styleguide Dropdown // 在KSS目录中出现的名字，最多可有三级，写法为 one.two.three。可用于分组
*/
.dropdown {
  ...
}
...
```
::: warning 注意
要牢记HTML片段中不能有空白行，因为对KSS来讲，空白行就意味着markup这部分结束了。  
KSS生成新页面的时候不会主动删除旧页面。如果重命名或者移动源码中的一部分文档，docs目录下的相应文件还在原地，与新文件共存。
:::

---

KSS提供了阐述多重变体的方法，可以在模式库里把每个都渲染出来。  
`{{modifier_class}}`注释指明修饰符类所属的位置。Markup后面一段则为可用修饰符列表。
```css
/*
Buttons

Buttons are available in a number of sizes and
colors. You may mix and match any size with any
color.

Markup:
<button class="button {{modifier_class}}">
  click here
</button>

.button--success  - A green success button
.button--danger   - A red danger button
.button--small    - A small button
.button--large    - A large button

Styleguide Buttons
*/
```

---

概览文件  
模式库的主页。在css目录下面新建一个名为homepage.md的文件。这是一个markdown格式的文件，用来整体介绍模式库。  
::: warning 注意
你可能会注意到目录中Overview链接仍然不能工作，因为现在是在磁盘上直接打开模式库文件，KSS把Overview链接指向了．/而不是index.html。要解决这个问题，我们需要通过HTTP服务器访问模式库，这样．/在浏览器里会链接到index.html。
:::

---

JS  
有些模块需要JavaScript配合一起工作。这时候，要为页面添加一些简单的JavaScript来演示模块的行为。没必要在模式库里引入一个功能齐全的JavaScript库。大多数情况下，切换不同的状态类就够了。  
KSS会把js数组里列出的所有脚本文件都添加到页面上。我们可以把代码写到这些脚本文件中，为模块提供最基本的功能。 
```js
(function () {
  var dropdowns = document.querySelectorAll('.dropdown__toggle');
  Array.prototype.forEach.call(dropdowns, function(dropdown) {
    dropdown.addEventListener('click', function (event) {
      event.target.parentNode.classList.toggle('is-open');
    });
  });
}());
```