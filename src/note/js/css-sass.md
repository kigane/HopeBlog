---
title: CSS 预处理器
lang: zh-CN
sidebarDepth: 2
---

## Sass
预处理器的工作原理是把我们写的源文件转译成输出文件，即常规CSS样式表。

### 安装
1. 新建项目目录并进入
2. npm init -y 初始化一个新的npm项目，创建package.json文件。
3. npm install --save-dev node-sass 安装node-sass包，并把它作为开发依赖写入package.json。在Windows系统中，需要先安装node-gyp包。(-g全局安装)

::: tip 选择语法
Sass支持两种语法：Sass和SCSS。它们的语言特性一样，但Sass语法去掉了所有的大括号和分号，严格使用缩进来表示代码结构，写法类似python。SCSS语法使用大括号和分号，更像常规CSS。 

SCSS文件使用．scss扩展名，Sass文件使用．sass扩展名。
:::

### 运行
1. 在项目目录新建两个子文件夹，分别叫作sass和build。源文件放在sass文件夹，Sass会使用这些文件来生成CSS文件，并放到build文件夹。
2. 编辑package.json文件，在脚本中添加一条命令`"sass": "sass sass/index.scss build/styles.css"`。这样就定义了一条sass命令，运行的时候会把sass/index.scss编译成build/styles.css这个新文件。
3. 写代码，npm run sass，得到styles.css

### 核心特性
源scss
```scss
$brand-blue: #0086b3;

a:link {
    color: $brand-blue;
}

.page-heading {
    font-size: 1.6rem;
    color: $brand-blue;
}
```
处理后生成的css
```css
a:link {
  color: #0086b3;
}

.page-heading {
  font-size: 1.6rem;
  color: #0086b3;
}/*# sourceMappingURL=index.css.map */
```
::: tip 源映射
源映射:一个特殊文件(.map)，计算机可以用它来追踪生成后的代码（在我们这里是CSS）中每一行对应的源代码中的那一行（Sass）。这个映射文件可以用在一些调试器中，包括浏览器的开发者工具。
:::

#### 行内计算
Sass支持使用+、-、*、/和%进行行内计算。这样我们就可以从一个初始值获得多个值。这个特性在两个值相关但不同的时候特别有用。

#### 嵌套选择器
Sass允许在代码块内嵌套选择器。你可以使用嵌套把有关联的代码分到一组。Sass会把外层声明块的选择器与嵌套选择器合并。默认情况下，外层的选择器会自动添加到编译代码的每个选择器前面，拼接的位置还会插入一个空格。要修改默认操作，可以使用&符号代表外层选择器想要插入的位置。
```scss
.site-nav {
    display: flex;

    > li {
        margin-top: 0;

        &.is-active {
            display: block;
        }
    }
}

/* 也可以在声明块内嵌套媒体查询 */
html {
    font-size: 1rem;

    @media (min-width: 45em) {
        font-size: 1.25rem;
    }
}
```
编译后
```css
.site-nav {
  display: flex;
}
.site-nav > li {
  margin-top: 0;
}
.site-nav > li.is-active {
  display: block;
}

html {
  font-size: 1rem;
}
@media (min-width: 45em) {
  html {
    font-size: 1.25rem;
  }
}/*# sourceMappingURL=index.css.map */
```

#### 局部文件--@import
局部文件可以允许你把样式分割成多个独立的文件，Sass会把这些文件拼接在一起生成一个文件。使用局部文件可以按照自己的想法随意组织文件，但最终只提供给浏览器一个文件，这样可以减少网络请求的数量。

将样式文件拆分为一系列局部文件，在index.scss中使用`@import "path"`引入，运行Sass的时候，局部文件会被编译，然后插入到@import规则指定的地方。相当于C的#include。

#### 混入(mixin)
混入是一小段CSS代码块，可以在样式表任意地方复用。使用@mixin规则来定义，使用@include规则来调用。例如
```scss
@mixin clrfix {
    &::before {
        display: table;
        content: " ";
    }

    &::after {
        clear: both;
    }
}

.media {
    @include clrfix;
    background-color: #eee;
}
```
编译后
```css
.media {
  background-color: #eee;
}
.media::before {
  display: table;
  content: " ";
}
.media::after {
  clear: both;
}/*# sourceMappingURL=index.css.map */
```

---

还可以定义带参数的混入，就像平时编程中使用的函数一样。
```scss
@mixin alert-color($color, $bg-color) {
    color: $color;
    background-color: $bg-color;
}

.media-info {
    @include alert-color(blue, lightblue);
}
.media-info {
    @include alert-color(red, pink);
}
```
编译后
```css
.media-info {
  color: blue;
  background-color: lightblue;
}

.media-info {
  color: red;
  background-color: pink;
}/*# sourceMappingURL=index.css.map */
```

#### 扩展(extend)
sass还支持@extend规则。和mixin类似，但编译方式有所不同。对于扩展，sass不会多次复制相同的声明，而是把选择器组合在一起，这样它们就会包含同样的规则。
```scss
.message {
    padding: .3em .5em;
    border-radius: .5em;
}

.message-info {
    @extend .message;
    color: blue;
    background-color: lightblue;
}

.message-danger {
    @extend .message;
    color: red;
    background-color: pink;
}
```
编译后
```css
.message, .message-danger, .message-info {
  padding: 0.3em 0.5em;
  border-radius: 0.5em;
}

.message-info {
  color: blue;
  background-color: lightblue;
}

.message-danger {
  color: red;
  background-color: pink;
}/*# sourceMappingURL=index.css.map */
```
Sass复制了．message-info和．message-danger选择器，并上移到第一个规则集。这样做的好处是标记只需要引用一个类，无须两个都引入，从`<divclass="message message-info">`变成了`<div class="message-info">`。

::: tip 提示
@extend的输出长度通常会比mixin短一些。这是显而易见的，也很容易想到@extend更好一些，因为它最终输出的样式表更小（因此网络传输速度更快）。但也要知道mixin产生的大量重复代码，使用gzip可以压缩得比较小。只要你的服务器使用gzip压缩处理过所有的网络传输（当然，也应该这么做），增加的这些重复代码通常会比预期小得多。
:::

#### 颜色处理
Sass还有个不错的特性，它有一堆处理颜色的函数。[参考：AVisual Guide to Sass & Compass Color Functions](http://jackiebalzer.com/color)

#### 循环
使用`@for $var from start through/to end {}`

* through 包括 end
* to 不包括 end

```scss
$base-color: #036;

@for $i from 1 through 3 {
  ul:nth-child(3n + #{$i}) {
    background-color: lighten($base-color, $i * 5%);
  }
}

@for $i from 1 to 3 {
  ol:nth-child(3n + #{$i}) {
    background-color: lighten($base-color, $i * 5%);
  }
}
```
编译后
```css
ul:nth-child(3n+1) {
  background-color: #004080;
}

ul:nth-child(3n+2) {
  background-color: #004d99;
}

ul:nth-child(3n+3) {
  background-color: #0059b3;
}

ol:nth-child(3n+1) {
  background-color: #004080;
}

ol:nth-child(3n+2) {
  background-color: #004d99;
}/*# sourceMappingURL=index.css.map */
```

::: tip 提示
sass中的`#{expr}`称为Interpolation，用于将sass中的expr值计算出来，嵌入CSS块中。通常用于属性，选择器，@规则，还有例子中的nth-child参数部分等等。而在属性值用`#{expr}`，等于没用。
:::
```scss
@mixin corner-icon($name, $top-or-bottom, $left-or-right) {
  .icon-#{$name} {
    background-image: url("/icons/#{$name}.svg");
    position: absolute;
    #{$top-or-bottom}: 0;
    #{$left-or-right}: 0;
  }
}

@include corner-icon("mail", top, left);
```