---
title: CSS布局
lang: zh-CN
sidebarDepth: 1
---

## 浮动布局
要实现将图片移动到网页一侧，并且让文字围绕图片的效果，浮动是唯一的方法。这也是设计浮动的初衷。

### 双容器模式
通过将内容放置到两个嵌套的容器中，然后给内层的容器设置外边距，让它在外层容器中居中。
::: details 示例代码
双容器外层为body，内层为.container
```html
<!doctype html>
<head>
  <style>
    /* 全局设置为border-box */
    :root {
      box-sizing: border-box;
    }

    *,
    ::before,
    ::after {
      box-sizing: inherit;
    }

    body {
      background-color: #eee;
      font-family: Helvetica, Arial, sans-serif;
    }

    /* 猫头鹰选择器 */
    body * + * {
      margin-top: 1.5em;
    }

    header {
      padding: 1em 1.5em;
      color: #fff;
      background-color: #0072b0;
      border-radius: .5em;
      margin-bottom: 1.5em;
    }

    .main {
      padding: 0 1.5em;
      background-color: #fff;
      border-radius: .5em;
    }

    .container {
      max-width: 1080px;
      margin: 0 auto;
    }

  </style>
</head>

<body>
  <div class="container">
    <header>
      <h1>Franklin Running Club</h1>
    </header>

    <main class="main clearfix">
      <h2>Running tips</h2>

      <div>
        <div class="media">
          <img class="media-image" src="shoes.png">
          <div class="media-body">
            <h4>Strength</h4>
            <p>
              Strength training is an important part of
              injury prevention. Focus on your core&mdash;
              especially your abs and glutes.
            </p>
          </div>
        </div>

        <div class="media">
          <img class="media-image" src="runner.png">
          <div class="media-body">
            <h4>Cadence</h4>
            <p>
              Check your stride turnover. The most efficient
              runners take about 180 steps per minute.
            </p>
          </div>
        </div>

        <div class="media">
          <img class="media-image" src="runner.png">
          <div class="media-body">
            <h4>Change it up</h4>
            <p>
              Don't run the same every time you hit the
              road. Vary your pace, and vary the distance
              of your runs.
            </p>
          </div>
        </div>

        <div class="media">
          <img class="media-image" src="shoes.png">
          <div class="media-body">
            <h4>Focus on form</h4>
            <p>
              Run tall but relaxed. Your feet should hit
              the ground beneath your hips, not out in
              front of you.
            </p>
          </div>
        </div>

      </div>
    </main>
  </div>
</body>
```
:::

### 容器折叠
浮动元素不同于普通文档流的元素，它们的高度不会加到父元素上。这会造成容器折叠问题(容器内所有元素都浮动了，容器的高度就撑不开)。

解决方案1  
因为浮动元素的外边距不会折叠到清除浮动容器的外部，非浮动元素的外边距则会正常折叠。所以h2和.container的外边距折叠了，h2的内容紧贴在容器顶部。
```css
.clearfix::after {
    display: block; /* clear只对块级元素有效。 */
    content: " "; /* 设置content让伪元素出现在文档中 */
    clear: both; /* clear: both声明让该元素移动到浮动元素的下面，而不是侧面。clear的值还可以设置为left或者right，这样只会相应地清除向左或者向右浮动的元素。因为空div本身没有浮动，所以容器就会扩展，直到包含它，因此也会包含该div上面的浮动元素。 */
}
```

解决方案2  
使用display: table能够包含外边距，是因为利用了CSS的一些特性。创建一个display: table元素，也就在元素内隐式创建了一个表格行和一个单元格。外边距无法通过单元格元素折叠，从而所有子元素的外边距都会包含在容器的顶部和底部之间。
```css
.clearfix::before,
.clearfix::after {
    display: table;
    content: " ";
}
.clearfix::after {
    clear: both;
}
```

### 浮动陷阱
第一个元素下有很大一片空白。
![浮动陷阱](/assets/img/float-trap.png)

要想修复这个问题很简单：清除第三个浮动元素上面的浮动。更通用的做法是，清除每行的第一个元素上面的浮动。
```css
.media {
    float: left;
    margin: 0 1.5em 1.5em 0; /* 猫头鹰选择器会导致第一个元素没有margin-top，从而第一行顶端对不齐。故重设 */
    width: calc(50% - 1.5em); /* 为margin留出空间 */
    padding: 1.5em;
    background-color: #eee;
    border-radius: 0.5em;
}

/* 清除每行的第一个元素上面的浮动 */
.media:nth-child(odd) {
    clear: left;
}
```

### 媒体对象
图片在一侧，一段文字出现在图片的旁边。这是一种很典型的网页布局，称为“媒体对象”。  
块级格式化上下文(block formatting context, BFC)  
BFC是网页的一块区域，元素基于这块区域布局。虽然BFC本身是环绕文档流的一部分，但它将内部的内容与外部的上下文隔离开。这种隔离为创建BFC的元素做出了以下3件事情。
1. 包含了内部所有元素的上下外边距。它们不会跟BFC外面的元素产生外边距折叠。
2. 包含了内部所有的浮动元素。
3. 不会跟BFC外面的浮动元素重叠。

---

给元素添加以下的任意属性值都会创建BFC。
* float: left或right，不为none即可。
* overflow:hidden、auto或scroll，不为visible即可。最简单，推荐使用。
* display:inline-block、table-cell、table-caption、flex、inline-flex、grid或inline-grid。拥有这些属性的元素称为块级容器。
* position:absolute或position: fixed。

### 网格系统
大部分流行的CSS框架包含了自己的网格系统。它们的实现细节各不相同，但是设计思想相同：在一个行容器里放置一个或多个列容器。列容器的类决定每列的宽度。
* 通常网格系统的每行被划分为特定数量的列，一般是12个，但也可以是其他数。每行子元素的宽度可能等于1~12个列的宽度。
* 行元素负责清除浮动，设置负外边距调整列头尾对齐，等等。
* 列元素都浮动，用百分比宽度+不同类控制列宽(`.column-n{width:xx%}`)。column-

## Flexbox
* 给元素添加display: flex，该元素变成了一个弹性容器(flex container)，它的直接子元素变成了弹性子元素(flex item)。
* 弹性子元素默认是在同一行按照从左到右的顺序并排排列。
* 弹性容器像块元素一样填满可用宽度，但是弹性子元素不一定填满其弹性容器的宽度。
* 弹性子元素高度相等，该高度由它们的内容决定。  
* 子元素按照主轴线排列，主轴的方向为主起点(左)到主终点(右)。垂直于主轴的是副轴。方向从副起点(上)到副终点(下)。
* Flexbox允许使用margin: auto来填充弹性子元素之间所有的可用空间
* flex属性控制弹性子元素在主轴方向上的大小,在这里指的元素的宽度。flex属性是三个不同大小属性的简写：flex-grow、flex-shrink和flex-basis。
    * flex-basis：默认值为0%,即不占任何宽度。flex-basis定义了元素大小的基准值，即一个初始的“主尺寸”。flex-basis属性可以设置为任意的width值，包括px、em、百分比。它的初始值是auto，此时浏览器会检查元素是否设置了width属性值。如果有，则使用width的值作为flex-basis的值；如果没有，则用元素内容自身的大小。如果flex-basis的值不是auto, width属性会被忽略。
    * flex-grow：默认值为1。每个弹性子元素的flex-basis值计算出来后，它们(加上子元素之间的外边距)加起来会占据一定的宽度。加起来的宽度不一定正好填满弹性容器的宽度，可能会有留白。多出来的留白(或剩余宽度)会按照flex-grow(增长因子)的值分配给每个弹性子元素，flex-grow的值为**非负整数**。如果一个弹性子元素的flex-grow值为0，那么它的宽度不会超过flex-basis的值；如果某个弹性子元素的增长因子非0，那么这些元素会增长到所有的剩余空间被分配(按给定的权重分配)完，也就意味着弹性子元素会填满容器的宽度。
    * flex-shrink：默认值为1。lex-shrink属性与flex-grow遵循相似的原则。计算出弹性子元素的初始主尺寸后，它们的累加值可能会超出弹性容器的可用宽度。如果不用flex-shrink，就会导致溢出。每个子元素的flex-shrink值代表了它是否应该收缩以防止溢出。如果某个子元素为flex-shrink: 0，则不会收缩；如果值大于0，则会收缩至不再溢出。按照flex-shrink值的比例，值越大的元素收缩得越多。
    * PS:当flex-basis为0%时，内边距会改变弹性子元素的初始主宽度计算的方式。
![examples](/assets/img/flux-layout-example.png)
* Flexbox的另一个重要功能是能用弹性容器的flex-direction属性切换主副轴方向。它的初始值(row)控制子元素按从左到右的方向排列；指定flex-direction: column能控制弹性子元素沿垂直方向排列(从上到下)。Flexbox还支持row-reverse让元素从右到左排列，column-reverse让元素从下到上排列

### input
* input元素可以是文本和密码输入框以及很多类似的HTML5输入框，比如数字、邮箱、日期输入框。它还可以是看起来完全不一样的输入元素，即单选按钮和复选框。`input:not([type=checkbox]):not([type=radio])`可以排除单选按钮和复选框。
* 对input设置了display: block，让它们单独占据一行，还要将其宽度设置为100%。通常情况下，块级元素会自动填满可用宽度，但是input比较特殊，其宽度由size属性决定，而它表示不出滚动条的情况下大致能容纳的字符数量。如果不指定的话，该属性就会恢复为默认值。

### 更多属性
flex-container
![flex-container](/assets/img/flex-more1.png)
flex-item
![flex-item](/assets/img/flex-more2.png)

## 网格布局
* 跟Flexbox类似，网格布局也是作用于两级的DOM结构。设置为display: grid的元素成为一个网格容器(grid container)。它的子元素则变成网格元素(griditems)。容器会表现得像一个块级元素，100%填充可用宽度。
* 容器的grid-template-columns和grid-template-rows。这两个属性定义了网格每行每列的大小。新单位fr，代表每一列(或每一行)的分数单位(fraction unit)。这个单位跟Flexbox中flex-grow因子的表现一样。
* 容器的grid-gap属性定义了每个网格单元之间的间距。也可以用两个值分别指定垂直和水平方向的间距(比如grid-gap: 0.5em 1em)。

---

* 网格的组成部分
    * 网格线(grid line)——网格线构成了网格的框架。一条网格线可以水平或垂直，也可以位于一行或一列的任意一侧。如果指定了grid-gap的话，它就位于网格线上。
    * 网格轨道(grid track)——一个网格轨道是两条相邻网格线之间的空间。网格有水平轨道(行)和垂直轨道(列)。
    * 网格单元(grid cell)——网格上的单个空间，水平和垂直的网格轨道交叉重叠的部分。
    * 网格区域(grid area)——网格上的矩形区域，由一个到多个网格单元组成。该区域位于两条垂直网格线和两条水平网格线之间。
    * repeat(num, pat1, ...)：将pat重复num次。类似宏。例如，repeat(4, auto) === auto auto auto auto。
* 网格线编号从左上角为1开始递增，负数则指向从右下角开始的位置。
* 网格元素定位：
    * grid-column, grid-row：两个属性，有四个值，代表四个网格线，切出的封闭矩形即为元素占据的区域。例如：grid-column:1/3; grid-row:2/4;在九宫格中代表左下四个格子。
    * span n 表示扩展至n格。例如，grid-row:span 1 表示在水平网格轨道只占一格。
* 另一种定位方式--使用命名的网格区域
    * grid-template-areas属性：值为一系列加引号字符串，每一个字符串代表网格的一行，字符串内用空格区分每一列。在CSS中画一个可视化的网格形象。句点，代表留空。必须每个网格都要命名。
    * 例如`"title title"\n "nav nav"\n "main aside1"\n "main aside2"\n`
* 和Flex的对比：
    * Flexbox本质上是一维的，而网格是二维的。
    * Flexbox是以内容为切入点由内向外工作的，而网格是以布局为切入点从外向内工作的。用网格给网页的主区域定位是因为我们希望内容能限制在它所在的网格内，但是对于网页上的其他元素，比如导航菜单，则允许内容对布局有更大的影响。也就是说，文字多的元素可以宽一些，文字少的元素则可以窄一些。同时这还是一个水平(一维)布局。因此，用Flexbox来处理这些元素更合适。
* 当设计要求元素在两个维度上都对齐时，使用网格。当只关心一维的元素排列时，使用Flexbox。这意味着网格更适合用于整体的网页布局，而Flexbox更适合对网格区域内的特定元素布局。

---

* 隐式网格(implicit grid)。使用grid-template-*属性定义网格轨道时，创建的是显式网格(explicit grid)，但如果网格元素放在声明的网格轨道之外，就会创建隐式轨道以扩展网格，直到包含该元素。
* 隐式网格轨道默认大小为auto，也就是它们会扩展到能容纳网格元素内容。可以给网格容器设置grid-auto-columns和grid-auto-rows，为隐式网格轨道指定一个大小(比如，grid-auto-columns: 1fr)。

* 有时候我们不想给一个网格轨道设置固定尺寸，但是又希望限制它的最小值和最大值。这时候需要用到minmax()函数。它指定两个值：最小尺寸和最大尺寸。浏览器会确保网格轨道的大小介于这两者之间。(如果最大尺寸小于最小尺寸，最大尺寸就会被忽略。)通过指定minmax(200px, 1fr)，浏览器确保了所有的轨道至少宽200px。
* repeat()函数里的auto-fill关键字是一个特殊值。设置了之后，只要网格放得下，浏览器就会尽可能多地生成轨道，并且不会跟指定大小(minmax()值)的限制产生冲突。
* auto-fill和minmax(200px, 1fr)加在一起，就会让网格在可用的空间内尽可能多地产生网格列，并且每个列的宽度不会小于200px。因为所有轨道的大小上限都为1fr(最大值)，所以所有的网格轨道都等宽。
* 如果网格元素不够填满所有网格轨道，auto-fill就会导致一些空的网格轨道。如果不希望出现空的网格轨道，可以使用auto-fit关键字代替auto-fill。它会让非空的网格轨道扩展，填满可用空间。

---

* 当不指定网格上元素的位置时，元素会按照其布局算法自动放置。
    * 默认情况下，布局算法会按元素在标记中的顺序将其逐列逐行摆放。
    * grid-auto-flow:row 如果一行放不下，算法会将它移动到下一行，寻找足够大的空间容纳它。
    * grid-auto-flow:column 如果一列放不下，算法会将它移动到下一列，寻找足够大的空间容纳它。
    * 还可以额外加一个关键字dense(比如，grid-auto-flow: column dense)。它让算法紧凑地填满网格里的空白，尽管这会改变某些网格元素的顺序。
* 默认情况下，每个网格元素都会扩展并填满整个网格区域，但是子元素不会，因此网格区域可能会出现多余的高度。一个简单的解决办法是用Flexbox。给图片标签加上flex-grow，强制拉伸图片填充空白区域。但是拉伸图片并不可取，因为这会改变图片的宽高比，导致图片变形。好在CSS为控制这一行为提供了一个特殊属性object-fit。默认情况下，一个img的object-fit属性值为fill，也就是说整个图片会缩放，以填满img元素。你也可以设置其他值改变默认行为。
    * cover：扩展图片，让它填满盒子(导致图片一部分被裁剪)。
    * contain：缩放图片，让它完整地填充盒子(导致盒子里出现空白)。
![图片缩放](/assets/img/img-object-fit.png)

---

对齐
* CSS给网格布局提供了三个调整属性：justify-content、justify-items、justify-self。这些属性控制了网格元素在水平方向上的位置。
* 还有三个对齐属性：align-content、align-items、align-self。这些属性控制网格元素在垂直方向上的位置。

### 特性查询
`@supports (display:grid) {...}`  
* @supports规则后面跟着一个小括号包围的声明。如果浏览器理解这个声明，它就会使用大括号里面的所有样式规则。如果它不理解小括号里的声明，就不会使用这些样式规则。
* @supports not(declaration)
* @supports (declaration) or (declaration)
* @supports (declaration) and (declaration)

## 定位
position属性的初始值是static。前面的章节里用的都是这个静态定位。如果把它改成其他值，我们就说元素就被定位了。而如果元素使用了静态定位，那么就说它未被定位。

前面介绍的布局方法是用各种操作来控制文档流的行为。定位则不同：它将元素彻底从文档流中移走。它允许你将元素放在屏幕的任意位置。还可以将一个元素放在另一个元素的前面或后面，彼此重叠。

### 固定定位
给一个元素设置position: fixed就能将元素放在视口的任意位置。  
这需要搭配四种属性一起使用：top、right、bottom和left。这些属性的值决定了固定定位的元素与浏览器视口边缘的距离。比如，top: 3em表示元素的上边缘距离视口顶部3em。  
设置这四个值还隐式地定义了元素的宽高。比如指定left: 2em; right: 2em表示元素的左边缘距离视口左边2em，右边缘距离视口右边2em。因此元素的宽度等于视口总宽度减去4em。top、bottom和视口高度也是这样的关系。  

::: details 模态框背景
用隐式定义的宽高拉伸空div，再设置背景色。
```html
<div class="modal-backdrop"></div>
<style>
.modal-backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
```
:::

### 绝对定位
* 固定定位让元素相对视口定位，此时视口被称作元素的包含块(containingblock)。绝对定位的行为也是如此，只是它的包含块不一样。绝对定位不是相对视口，而是相对最近的**祖先定位元素**。  
* 如果祖先元素都没有定位，那么绝对定位的元素会基于初始包含块(initial containing block)来定位。初始包含块跟视口一样大，固定在网页的顶部。

::: details 关闭按钮
对于这种Close按钮，用户通常期望看到一个类似于x的图形化显示，如何做到？  
你可能首先想到将按钮里的文字close换成x，但是这会导致可访问性的问题：辅助的屏幕阅读器会读按钮里的文字。因此要给这个按钮一些有意义的提示。在使用CSS之前，HTML本身必须有意义。  
相反，你可以用CSS隐藏close，并显示x。总共需要两步。  
1. 将按钮的文字挤到外面，并隐藏溢出内容。   text-indent:xxem+overflow:hidden
2. 将按钮的::after伪元素的content属性设置为x，并让伪元素绝对定位到按钮中间。  
PS:乘法符号的Unicode字符更对称，也更好看。HTML字符&times；可以显示为这个字符，但在CSS的content属性里，必须写成转义的Unicode数字：\00D7。
:::

### 相对定位
相对定位将元素从初始位置移走，但是其他元素不受影响(好像被移走的元素还在原来的位置一样)。  
跟固定或者绝对定位不一样，不能用top、right、bottom和left改变相对定位元素的大小。这些值只能让元素在上、下、左、右方向移动。可以用top或者bottom，但它们不能一起用(bottom会被忽略)。同理，可以用left或right，但它们也不能一起用(right会被忽略)。  
可以用这些属性调整相对元素的位置，把它挤到某个位置，但这只是相对定位的一个冷门用法。更常见的用法是使用position: relative给它里面的绝对定位元素创建一个包含块。

### 层叠上下文和z-index
浏览器将HTML解析为DOM的同时还创建了另一个树形结构，叫作渲染树(render tree)。它代表了每个元素的视觉样式和位置。同时还决定浏览器绘制元素的顺序。  
* 顺序很重要，因为如果元素刚好重叠，后绘制的元素就会出现在先绘制的元素前面。  
* 通常情况下(使用定位之前)，元素在HTML里出现的顺序决定了绘制的顺序。
* 定位元素时，这种行为会改变。浏览器会先绘制所有非定位的元素，然后绘制定位元素。默认情况下，所有的定位元素会出现在非定位元素前面。
* 通常情况下，模态框要放在网页内容的最后，body关闭标签之前。以防止模态框被其他定位元素遮挡。
* z-index属性的值可以是任意整数(正负都行)。z表示的是笛卡儿x-y-z坐标系里的深度方向。拥有较高z-index的元素出现在拥有较低z-index的元素前面。拥有负数z-index的元素出现在静态元素后面。
  * z-index只在定位元素上生效，不能用它控制静态元素。
  * 给一个定位元素加上z-index可以创建层叠上下文。
* 层叠上下文之外的元素无法叠放在层叠上下文内的两个元素之间。例如a有层叠上下文，本身z-index为2，其内有z-index为100的元素，b元素将a完全遮住，z-index为4。渲染出的结果只能看到b，a内的任何元素都会为遮挡。(可以这么理解：2.100 < 4)
* 所有层叠上下文内的元素会按照以下顺序，从后到前叠放
  * 层叠上下文的根
  * z-index为负的定位元素(及其子元素)
  * 非定位元素
  * z-index为auto的定位元素(及其子元素)
  * z-index为正的定位元素(及其子元素)

### 粘性定位
它是相对定位和固定定位的结合体：正常情况下，元素会随着页面滚动，当到达屏幕的特定位置时，如果用户继续滚动，它就会“锁定”在这个位置。最常见的用例是侧边栏导航。
```html
<aside class="col-sidebar">
  <div class="affix">
    <ul class="submenu">
      <li><a href="/">Home</a></li>
      <li><a href="/coffees">Coffees</a></li>
      <li><a href="/brewers">Brewers</a></li>
      <li><a href="/specials">Specials</a></li>
      <li><a href="/about">About us</a></li>
    </ul>
  </div>
</aside>
<style>
.affix {
  position: sticky;
  top: 1em;
}
</style>
```
top值设置了元素最终固定的位置：距离视口的顶部1em。  
粘性元素永远不会超出父元素的范围，所以本例中affix不会超出col-sidebar的范围。当滚动页面的时候，col-sidebar会一直正常滚动，但是affix会在滚动到特定位置时停下来。如果继续滚动得足够远，粘性元素还会恢复滚动。这种情况只在父元素的底边到达粘性元素的底边时发生。  
注意，只有当父元素的高度大于粘性元素时才会让粘性元素固定