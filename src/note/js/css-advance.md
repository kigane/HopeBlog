---
title: CSS 高级话题
lang: zh-CN
sidebarDepth: 1
---

## 背景，阴影和混合模式
backgrounp属性是以下8个属性的简写
* background-image——指定一个文件或者生成的颜色渐变作为背景图片。
    * 可以是一个图片url路径，如url(bg.png)
    * 也可以是一个渐变函数，如linear-gradient(to-right, white, blue)
* background-position——设置背景图片的初始位置。
* background-size——指定元素内背景图片的渲染尺寸。
* background-repeat——决定在需要填充整个元素时，是否平铺图片。
* background-origin——决定背景相对于元素的边框盒、内边距框盒(初始值)或内容盒子来定位。
* background-clip——指定背景是否应该填充边框盒(初始值)、内边距框盒或内容盒子。
* background-attachment——指定背景图片是随着元素上下滚动(初始值)，还是固定在视口区域。注意，使用fixed值会对页面性能产生负面影响。
* background-color——指定纯色背景，渲染到背景图片下方。

### 渐变
#### linear-gradient
linear-gradient函数使用三个参数来定义行为：角度、起始颜色和终止颜色。例如角度值是to right，意思是渐变从元素的左侧开始(起始颜色)，平滑过渡到右侧(终止颜色)。

---

指定渐变的角度
* to right，to top，to bottom，to bottomright等
* 使用更确切的单位，更精确地控制角度。值0deg代表垂直向上，更大的值会沿着顺时针变化
    * deg——角度
    * rad——弧度
    * turn——代表环绕圆周的圈数。可以使用小数来表示不足一圈，比如0.25turn相当于90deg。
    * grad——百分度(gradian)。一个完整的圆是400grad,100grad相当于90deg。

---
指定渐变的颜色节点
* 一个渐变可以接受任意数量的颜色节点，节点之间通过逗号分隔。渐变会自动均匀地平铺这些颜色节点。也可以在渐变函数中为每个颜色节点明确指定位置。例如linear-gradient(90deg, red 0%, white 50%, blue 100%)
* 条纹效果：linear-gradient(90deg, red 40%, white 40%, white 60%, blue 60%)。如果在同一个位置设置两个颜色节点，那么渐变会直接从一个颜色变换到另一个，而不是平滑过渡。因为第一个颜色节点是红色，在40%的位置，所以渐变从左侧边缘一直到40%是纯红色，最后一个颜色节点是蓝色，也是在60%的位置，这样就会直接变换成蓝色，然后一直到右侧边缘是蓝色。
* repeating-linear-gradient(-45deg, #57b, #57b 10px, #148 10px, #148 20px)。条纹进度条。

#### radial-gradient
另一类渐变是径向渐变。线性渐变是从元素的一端开始，沿着直线过渡到另一端，而径向渐变不同，默认情况下，渐变在元素中是从中心开始，平滑过渡到边缘。渐变整体呈椭圆形，跟随元素大小进行变化。

跟线性渐变一样，径向渐变同样支持颜色节点。你可以提供多个节点，使用百分比或者长度单位指定节点位置。你也可以把径向渐变设置为圆形而非椭圆，甚至可以指定渐变中心点的位置。repeating-radial-gradient()函数可以重复生成图样，形成同心圆环。

![radial-gradient](/assets/img/radial-gradient.png)

### 阴影
有两个属性可以创建阴影，box-shadow可以为元素盒子生成阴影，text-shadow可以为渲染后的文字生成阴影。  

box-shadow: x y blur-radius expand-radius shodow-color  
* x 水平偏移
* y 垂直偏移
* blur-radius 用来控制阴影边缘模糊区域的大小，可以为阴影生成一个更柔和、有点透明的边缘。
* expand-radius 用来控制阴影的大小，设置为正值可以使阴影全方位变大，设为负值则会变小。
* shodow-color 阴影颜色
* inset 关键字，让阴影出现在元素内部
* 可以同时设置多个阴影，用逗号分隔即可
* 文本阴影的语法也基本上完全一样：水平偏移量、垂直偏移量、模糊半径(可选)和颜色。但文本阴影不支持inset关键字和扩展半径值。

```css
.button:active {
    box-shadow: inset 0 0 0.5em #124, inset 0 0.5em 1em rgba(0,0,0,0.4);
  }
```

### 混合模式
大部分情况下，不论是使用真正的图片还是渐变，元素一般只会使用一张背景图片。但某些情况下你可能想要使用两张或者更多的背景图片，CSS是支持这么做的。使用多个背景图片时，列表中排在前面的图片会渲染到排序靠后的图片上面。一般是希望第二张图片也可以透视显示。这时就可以使用混合模式(blend mode)。  
![blend](/assets/img/blend-mode.png)

```html
<!doctype>
<div class="blend"></div>

<style>
.blend {
    min-height: 400px;
    background-image: url(images/bear.jpg), url(images/bear.jpg);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: -30vw, 30vw;
    background-blend-mode: multiply;
}
</style>
```

## 对比，颜色和间距
### 对比
对比是设计中的一种手段，通过突出某物来达到吸引注意力的目的。我们的眼睛和思维天生对模式比较敏感，一旦某种东西破坏了模式的整体效果，我们就自然而然地注意到了它。  
若要起到对比的效果，页面必须先建立模式，就如同必须先有了规矩才能打破规矩。  
推进样式代码复用，就可以确保网站中使用一致的模式。建立统一的模式，然后打破模式，突出网页上最重要的部分，这是专业设计师的一个核心思路。  
CTA，即Call To Action的缩写，是一种针对核心元素的营销手段，希望引导用户使用。

### 颜色
调色板：一般会有一种主色，其他颜色基于主色。其他颜色一般是同一色系不同明暗度的颜色，还有一些补充颜色。大部分调色板也会有黑色和白色，以及少量的灰色。因为这些颜色会在CSS中多次重复出现，所以将它们指定为变量可以节省很多时间

颜色表示法：
* 十六进制表示法：#fffffff,#000
* rgb(), rgba()：描述红、绿、蓝彩色值的颜色表示法，使用十进制而非十六进制。取值范围为0-255。
* hsl(), hsla()：是一种更适合人类读取的颜色表示法。需要3个参数。
    * 第一个参数表示色相，是一个0~359的整数值。这代表色相环上的360度，从红色(0)、黄色(60)、绿色(120)、青色(180)、蓝色(240)、洋红色(300)依次过渡，最后回到红色。
    * 第二个参数表示饱和度，是一个代表色彩强度的百分数，100%的时候颜色最鲜艳，0%就意味着没有彩色，只是一片灰色。
    * 第三个参数表示明度，也是百分数，代表颜色有多亮(或者多暗)。大部分鲜艳的颜色是使用50%的明度值。明度值设置得越高，颜色越浅，100%就是纯白色；设置得越低，颜色越暗，0%就是黑色。

---

为某种颜色寻找一个搭配的颜色，最简单的方式是找到它的补色(complement)。补色位于色相环的对侧位置，蓝色的补色是黄色；绿色的补色是紫色；红色的补色是青色。使用HSL颜色值时，计算补色非常简单，为色相值加上或者减去180即可。

检查背景和文本的对比度是否符合要求。[CSS colorcontrast checker: contrast-ratio](https://contrast-ratio.com/)

### 间距
这部分工作里的大多数内容可以简单归结为正确设置元素的外边距。一般从最容易的地方开始，哪怕后面可能需要再做一些调整。  
我们需要思考两件事情，一个是是否需要使用相对单位，另一个是行高如何影响垂直间距。  

使用绝对单位会比较容易，但是使用相对单位会有很多好处，不论em还是rem(更有弹性，响应式)。

在盒模型中，元素的内容盒子为内边距所环绕，然后是边框，最后是外边距。但是对于段落和标题这样的元素，内容盒子并不是只有显示出来的文字区域，元素的行高决定了内容盒子最终的高度，这要超出字符的顶部和底部。
![行高](/assets/img/line-height.png)  
网页里的行高设为1.4。只有一行文字的元素，内容盒子的高度就是1.4em，文字在内部垂直居中。字号是16px，内容盒子的最终高度就是22.4px。额外的6.4px平均分配到文字的上方和下方。

如果为行内元素添加内边距，元素本身会变高，却不会增加文本行的高度。文本行的高度只由行高来决定。要解决这个问题，就需要增加每项的行高。如果一个元素是弹性子元素（或者行内块级元素），为了容纳它，其所在的行会随之增高。

**牢记行高可以影响垂直间距**。

## 排版
### Web字体
通过在线服务使用Web字体是最简单也最普遍的方式。谷歌字体有很多高质量并且开源的字体(还免费)，建议使用。  
选中字体后，复制link标签并添加到页面的head里，这样就为页面添加了一个包含字体描述的样式表。谷歌通过样式表为页面配置好了Web字体需要的设置，然后就可以在自己的样式表中随意使用Web字体了。需要使用font-family属性来指定字体。
::: tip 关于serif
Serif——字母笔画末端的小线条或者“爪状”装饰。包含serif的字体就被称为serif字体（例如Times New Roman）。如果没有serif，那就是sans-serif字体（例如Helvetica）。
:::

::: tip 字型和字体
字型（typeface）和字体（font）这两个术语经常被混为一谈。字型通常是指字体（比如Roboto）的整个家族，一般由同一个设计师创造。一种字型可能会存在多种变体和字重（比如细体、粗体、斜体、压缩，等等），这些变体的每一种可称之为一种字体（font）。
:::

### 调整字距
line-height和letter-spacing，这两个属性可以控制文本行之间的距离（垂直方向）和字符之间的距离（水平方向）。 
* line-height属性的初始值是关键字normal，大约等于1.2，但是在大部分情况下，这个值太小了。对于正文主体来说，介于1.4和1.6之间的值比较理想。
* letter-spacing通常从0.01em开始测试，直到你满意为止。
::: tip Tips
文字行越长，行高应该设置得越大。这样读者的眼睛扫到下一行的时候才更容易，不会注意力分散。理想情况下，每行文字的长度应该控制在45～75个字符，一般认为这样的长度最利于阅读。
:::

在设计领域，文本行之间的距离称为行距（leading，与bedding有点谐音），来源于印刷版每行文字之间添加的一条条的引导线（lead）。字符之间的距离称之为字距（tracking）。行高一般使用“点”作单位来描述，比如18pt，代表的是一行文字的高度加上它与下一行文字之间的距离。这实际上与CSS的line-height一样。你必须首先把它转化为跟字体一样使用像素单位，然后再计算出无单位数字。把pt值乘以1.333，就可以把pt转化为px（因为每英寸是96px，并且每英寸等于72pt, 96/72=1.333），即18pt×1.333=24px。然后除以字号，得到无单位的行高值，即24px/16px=1.5。字距通常会给定一个字数，比如100。因为这个数字表示1em的千分之一，所以除以1000就可以转化成em单位，即100/1000=0.1em。  

对于正文主体来讲，调整间距是为了使阅读体验效果更佳，但对于标题和其他内容很少的元素（比如按钮）来讲，影响不大。这时候间距可调整范围大大增加，就可以多多发挥创意了。也可以使用负数设置字符间距，让字符更紧凑。

## 过渡
### 从这边到那边
过渡是通过一系列transition-*属性来实现的。如果某个元素设置了过渡，那么当它的属性值发生变化时，并不是直接变成新值，而是使用过渡效果。
::: details Code
<button>Hover over me</button>
<style>
button {
    background-color: hsl(180, 50%, 50%);
    border: 0;
    color: white;
    font-size: 1rem;
    padding: .3em 1em;
    transition-property: all; /* 所有属性变化都使用过渡效果 */
    transition-duration: 0.5s; /* 过渡时间 */
}
button:hover {
    background-color: hsl(0, 50%, 50%);
    border-radius: 1em;
}
</style>
:::

* transition-property：指定哪些属性使用过渡。
* transition-duration：代表过渡到最终值之前需要多长时间
* 元素属性任何时候发生变化都会触发过渡：可以是状态改变的时候，比如：hover；也可以是JavaScript导致变化的时候，比如添加或者移除类影响了元素的样式。
* 过渡属性要设置在一个始终指向需要过渡的元素的选择器。因为虽然其他属性发生着变化，但你肯定不想过渡属性本身发生变化。
* 简写属性transition： transition:property duration timing-function delay
    * timing-function 定时函数，用来控制属性的中间值如何计算，实际上控制的是过渡过程中变化率如何加速或者减速。定时函数可以是一个关键字值，比如linear或者ease-in，也可以是自定义函数。
    * delay 延迟时间

### 定时函数
过渡让某个属性从一个值“移动”到另一个值，定时函数用来说明如何移动。
* linear：值以固定的速度改变
* ease-in：变化速度开始时慢，然后一直加速，直到过渡完成
* ease-out：是减速，开始时快速变化，结束时比较慢

定时函数是基于数学定义的贝塞尔曲线（Bézier curve）。浏览器使用贝塞尔曲线作为随时间变化的函数，来计算某个属性的值。
![定时函数](/assets/img/transition-timing-func.png)  
这些贝塞尔曲线都是从左下方开始，持续延伸到右上方。时间是从左向右递进的，曲线代表某个值在到达最终值的过程中是如何变化的。  

::: tip 设置定时函数
打开开发者工具并检查样式面板中的定时函数，旁边有一个小小的标志符号。点击标志符号会打开一个弹窗，可以在弹窗中修改定时函数的曲线。
:::

::: tip 过渡时间
按照经验来讲，大部分的过渡持续时间应该处于200～500ms。时间如果再长，用户就会感觉页面变得卡慢，页面响应让他们产生了无谓的等待，尤其是面对那些经常或者重复使用的过渡特效时。  
对于鼠标悬停、淡入淡出和轻微缩放特效，应该使用较快的过渡速度。一般要控制在300ms以下，有时候甚至可能要低到100ms。对于那些包含较大移动或者复杂定时函数的过渡，比如弹跳特效，要使用较长的300～500ms的持续时间。
:::

::: tip 选择定时函数
可以在下列场景中分别使用这三种函数。
* 线性——颜色变化和淡出、淡入效果。
* 减速——用户发起的变化。用户点击按钮或者划过元素的时候，使用ease-out或者类似曲线。这样用户就可以看到快速发生的反馈，及时响应输入，然后元素慢慢过渡到最终状态。
* 加速——系统发起的变化。当内容加载完成或者超时事件触发的时候，使用ease-in或者类似曲线。这样元素就可以慢慢引起用户注意，然后速度越来越快直到完成最终变化。
:::

---

另一种定时函数--阶跃steps()  
阶跃函数需要两个参数：阶跃次数和一个用来表示每次变化发生在阶跃的开始还是结束的关键词（start或者end）  
![阶跃函数](/assets/img/step-func.png)  
第二个参数的默认值是end，所以steps(3)等于steps(3, end)。

### 创建下拉菜单并添加过渡效果
使用透明度的过渡为下拉菜单的打开和闭合添加淡入淡出特效。  
```css
.dropdown__drawer {
    position: absolute;
    background-color: white;
    width: 10em;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s linear, /* 透明度过渡效果--淡出 */
                visibility 0s linear 0.2s; /* 淡出时，可见性在透明度过渡完成时再变化 */
}
.dropdown.is-open .dropdown__drawer {
    opacity: 1;
    visibility: visible;
    transition-delay: 0s; /* 菜单淡入时，可见性要立即变化，否则看不到淡入效果 */
}
```
visibility属性可以从页面上移除某个元素，有点类似于display属性，分别设置visible和hidden即可。但跟display不同的是，visibility可以支持动画。为它设置过渡不会使其逐渐消失，但transition-delay可以生效，而在display属性上是不生效的。  
为某个元素设置visibility: hidden可以从可见页面中移除该元素，但不会从文档流中移除它，这就意味着该元素仍然占位。其他元素会继续围绕该元素的位置布局，在页面上保留一个空白区域。在我们的例子中，不会影响到菜单，因为我们同时也设置了绝对定位。

---

实现自动高度
```css
.dropdown__drawer {
    position: absolute;
    background-color: white;
    width: 10em;
    height: 0;
    overflow: hidden;
    transition: height 0.3s ease-out;
}
.dropdown.is-open .dropdown__drawer {
    height: auto;
}
```
很遗憾，这种纯css写法不会奏效。因为过渡不支持auto，必须指定确定的高度值。但在css中没办法知道具体的高度值。因为只有当内容在浏览器中渲染完成之后才能确定高度，所以需要使用JavaScript来获取。   
页面加载完成后，访问DOM元素的scrollHeight属性，就可以获取到高度值。
```js
(function () {
    var toggle = document.getElementsByClassName('dropdown__toggle')[0];
    var dropdown = toggle.parentElement;
    var drawer = document.getElementsByClassName('dropdown__drawer')[0];
    var height = drawer.scrollHeight; // 元素的高度值

    toggle.addEventListener('click', function (e) {
        e.preventDefault();
        dropdown.classList.toggle('is-open');
        if (dropdown.classList.contains('is-open')) {
            drawer.style.setProperty('height', height + 'px');
        } else {
            drawer.style.setProperty('height', '0');
        }
    });
}());
```

## 变换
transform属性，它可以用来改变页面元素的形状和位置，其中包括二维或者三维的旋转、缩放和倾斜。用法：`transform:rotata(90deg)`
![变换](/assets/img/transformation.png)  
使用变换的时候要注意一件事情，虽然元素可能会被移动到页面上的新位置，但它不会脱离文档流。你可以在屏幕范围内以各种方式平移元素，其初始位置不会被其他元素占用。当旋转某元素的时候，它的一角可能会移出屏幕边缘，同样也可能会遮住旁边其他元素的部分内容。

::: warning 注意
变换不能作用在span或者a这样的行内元素上。若确实要变换此类元素，要么改变元素的display属性，替换掉inline（比如inline-block），要么把元素改为弹性子元素或者网格项目（为父元素应用display: flex或者display: grid）。
:::

* 变换是围绕基点（point of origin）发生的。基点是旋转的轴心，也是缩放或者倾斜开始的地方。这就意味着元素的基点是固定在某个位置上，元素的剩余部分围绕基点变换（但translate()是个例外，因为平移过程中元素整体移动）。
* 默认情况下，基点就是元素的中心，但可以通过transform-origin:x y属性改变基点位置。
    * 常用值：left, right, top, bottom, center
    * 基点也可以指定为百分比，从元素左上角开始测量。
* 可以对transform属性指定多个值，用空格隔开。变换的每个值从右向左按顺序执行，类似矩阵变换。

### 图标放大效果  
图标设置过宽度和高度，因此我们可以通过增大这些属性来放大它。但会重新计算文档流时，导致其周围的一些元素跟着移动。如果改用变换，那周围的元素不会受到影响。
```css
.nav-links__icon {
    transition: transform 0.2s ease-out;
}

.nav-links a:hover > .nav-links__icon,
.nav-links a:focus > .nav-links__icon {
    transform: scale(1.3);
}
```

### 飞入效果
菜单的标签没有必要一直保持可见状态。默认情况下可以把它们隐藏，只在相应位置保留图标，告诉用户菜单的位置。当用户移动鼠标到菜单或者导航元素上时，再把标签以淡入的方式展示出来。
```css
.nav-links {
    display: block;
    padding: 1em;
    margin-bottom: 0;
}
.nav-links > li + li {
    margin-left: 0;
}

.nav-links__label {
    display: inline-block;
    margin-left: 1em; /* 为过渡效果预留的空间 */
    padding-right: 1em;
    opacity: 0;
    transform: translate(-1em);
    transition: transform 0.4s cubic-bezier(0.2, 0.9, 0.3, 1.3), /*  */
                opacity 0.4s linear; /* 背景淡入淡出 */
}
.nav-links:hover .nav-links__label,
.nav-links a:focus > .nav-links__label {
    opacity: 1;
    transform: translate(0);
}

.nav-links__icon {
    transition: transform 0.2s ease-out;
}

.nav-links a:hover > .nav-links__icon,
.nav-links a:focus > .nav-links__icon {
    transform: scale(1.3);
}

/* 为每个菜单项设置不同的延迟时间。这样就可以使每段动画交错飞入显示
，不再一次性全部展示出来，就像翻滚的“波浪” */
.nav-links > li:nth-child(2) .nav-links__label {
    transition-delay: 0.1s;
}
.nav-links > li:nth-child(3) .nav-links__label {
    transition-delay: 0.2s;
}
.nav-links > li:nth-child(4) .nav-links__label {
    transition-delay: 0.3s;
}
.nav-links > li:nth-child(5) .nav-links__label {
    transition-delay: 0.4s;
}
```

### 3D变换
旋转和平移都可以在三个维度上实现：X轴、Y轴和Z轴。
```css
.a {
    transform: translate(15px, 50px); /* 等价于transform: translateX(15px) translateY(50px); */
    transform: rotate(30deg); /* 等价于transform: rotateZ(30deg); */
}
```

#### 透视距离
为页面添加3D变换之前，我们需要先确定一件事情，即透视距离（perspective）。变换后的元素一起构成了一个3D场景。接着浏览器会计算这个3D场景的2D图像，并渲染到屏幕上。透视距离类似相机到近平面的距离。

可以通过两种方式指定透视距离：使用perspective()变换或者使用perspective属性。
```html
<div class="container">
    <div class="row">
        <div class="box">One</div>
        <div class="box">Two</div>
        <div class="box">Three</div>
        <div class="box">Four</div>
    </div>
</div>
<style>
    .row {
        display: flex;
        justify-content: center;
        /* 给父容器设置透视距离，则所有子容器可看作一个整体，效果和单独设置不同 */
        /* perspective: 200px; .box的transform只设置rotateX */
    }

    .box {
        box-sizing: border-box;
        width: 150px;
        margin: 0 2em;
        padding: 60px 0;
        text-align: center;
        background-color: hsl(150, 50%, 40%);
        transform: perspective(200px) rotateX(30deg);
    }
</style>
```
::: warning 注意
* 添加透视距离是3D变换中非常重要的部分。如果不设置透视距离，离得远的元素不会显得变小，离得近的元素也不会显得变大。
* 透视距离小，3D效果就会比较强。透视距离大，3D效果就会比较弱。
:::

#### 其他3D属性
* perspective-origin：默认情况下，透视距离的渲染是假设观察者（或者镜头）位于元素中心的正前方。perspective-origin属性可以上下、左右移动镜头的位置。
* backface-visibility：如果你使用rotateX()或者rotateY()旋转元素超过90度，就会发现一些有趣的事情：元素的“脸”不再直接朝向你。它的“脸”转向别的地方，你会看到元素的背面。默认情况下背面是可见的，但我们可以为元素设置backface-visibility:hidden来改变它。添加这条声明之后，元素只有在正面朝向观察者的时候才可见，朝向别处的时候不可见。
    * 针对这项技术，一个可能的应用场景是把两个元素背靠背放在一起，就像卡片的两面。卡片的正面展示出来，背面隐藏。然后我们可以旋转它们的容器元素，使这两个元素都翻转过来，这样正面隐藏背面显现。
* transform-style:preserve-3d -- 假设对容器设置了透视距离，接下来对容器内的元素进行3D变换。容器元素渲染时，实际上会被绘制成2D场景，就像是3D对象的一张照片。这看起来没什么问题，因为元素最终就是要渲染到2D屏幕上的。如果接下来我们对容器元素进行3D旋转，就有问题了。这是因为实际上没有对整个场景进行旋转，只是旋转3D场景的2D照片。透视距离全都错了，场景中的立体感也被破坏了。这时transform-style:preserve-3d就有作用了。
    * 参考[css cube](https://davidwalsh.name/css-cube) 

## 动画
CSS中的动画包括两部分：用来定义动画的@keyframes规则和为元素添加动画的animation属性。

### 关键帧
关键帧（keyframe）是指动画过程中某个特定时刻。我们定义一些关键帧，浏览器负责填充或者插入这些关键帧之间的帧图像。
```html
<div class="box"></div>
<style>
.box {
    width: 100px;
    height: 100px;
    background-color: green;
    animation: over-and-back 1.5s linear 3;
}

@keyframes over-and-back {
0% {
    background-color: hsl(0, 50%, 50%);
    transform: translate(0);
}

50% {
    transform: translate(50px);
}

100% {
    background-color: hsl(270, 50%, 90%);
    transform: translate(0);
}
}
</style>
```
animation是简写属性。
* animation-name——代表动画名称，来自@keyframes规则定义。
* animation-duration——代表动画持续时间
* animation-timing-function——代表定时函数
* animation-iteration-count——代表动画重复的次数。初始值默认是1。

::: warning 注意
1. 颜色从0%的红色平滑过渡到100%的淡紫色，但是接下来动画重复的时候立即变回红色。如果你打算重复某个动画并希望整体衔接流畅，需要确保结束值和初始值相匹配。
2. 最后一次重复动画结束后，背景颜色变为绿色，即原样式规则中指定的值。但注意动画持续过程中，这句样式声明被@keyframes中的规则覆盖了。如果出现样式层叠，那么动画中设置的规则比其他声明拥有更高的优先级。
3. 优先级规则：用户代理样式 < 作者自定义样式 < @keyframe中定义的样式 < !important
:::

### 动画延迟和填充模式
可以使用animation-delay属性推迟动画开始的时间，该属性行为和transition-delay类似。  
```html
<style>
.flyin-grid {
    margin: 0 1rem;
    perspective: 500px; /* 添加透视距离 */
}

.flyin-grid__item {
    animation: fly-in 600ms ease-in; /* 添加动画 */
    /* animation-fill-mode: backwards; 加上这一句，动画前的元素的初始位置就对了 */
}
/* 添加动画延迟 */
.flyin-grid__item:nth-child(2) {
    animation-delay: 0.15s;
}
.flyin-grid__item:nth-child(3) {
    animation-delay: 0.3s;
}
.flyin-grid__item:nth-child(4) {
    animation-delay: 0.45s;
}


@media (min-width: 30em) {
.flyin-grid {
    display: flex;
    flex-wrap: wrap;
    margin: 0 5rem;
}

.flyin-grid__item {
    flex: 1 1 300px;
    margin-left: 0.5em;
    margin-right: 0.5em;
    max-width: 600px;
}

@supports (display: grid) { /* 查询浏览器是否支持grid属性，如果支持，则下面样式生效 */
    .flyin-grid {
        display: grid;
        /* 尽可能多的生成网格轨道，每个轨道至少300px，如果元素较少，会将非空轨道扩展以填满空白 */
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        grid-gap: 2em; /* 网格元素间距 */
    }

    .flyin-grid__item {
        max-width: initial; /* div 的 max-width 初始值为 none，即没有限制*/
        margin: 0;
    }
}
}

.card {
    margin-bottom: 1em;
    padding: 0.5em;
    background-color: white;
    color: hsl(210, 15%, 20%);
    box-shadow: 0.2em 0.5em 1em rgba(0, 0, 0, 0.3);
}
.card > img {
    width: 100%;
}

@keyframes fly-in {
    0% {
        transform: translateZ(-800px) rotateY(90deg);
        opacity: 0;
    }
    56% {
        transform: translateZ(-160px) rotateY(87deg);
        opacity: 1;
    }
    100% {
        transform: translateZ(0) rotateY(0);
    }
}
</style>

<main class="flyin-grid">
    <div class="flyin-grid__item card">
    <img src="images/chicken1.jpg" alt="a chicken"/>
    <h4>Mrs. Featherstone</h4>
    <p>
        She may be a bit frumpy, but Mrs Featherstone gets
        the job done. She lays her largish cream-colored
        eggs on a daily basis. She is gregarious to a fault.
    </p>
    <p>This Austra White is our most prolific producer.</p>
    </div>
    <div class="flyin-grid__item card">
    <img src="images/chicken2.jpg" alt="a chicken"/>
    <h4>Hen Solo</h4>
    <p>
        Though the most recent addition to our flock, Hen
        Solo is a fast favorite among our laying brood. She
        is a sassy and suspicious hen; we frequently have to
        follow her to find where she has hidden her loot from
        the other hens.
    </p>
    <p>This Snowy Easter Egger lays in delicate shades of
        blue and green. A full dozen of her eggs costs an
        additional $2.</p>
    </div>
    <div class="flyin-grid__item card">
    <img src="images/chicken3.jpg" alt="a chicken"/>
    <h4>Cluck Norris</h4>
    <p>
        Every brood has its brawler. Cluck Norris is our
        feistiest hen, frequently picking fights with other
        hens about laying territory and foraging space. Her
        sister hens continue to hope that she will follow the
        steps of her namesake (eventually) and focus the her
        strength of will for good.
    </p>
    <p>This Buff Chantecler is as robust and hardy as her
        Canadian forebears, laying through the coldest parts
        of the winter.</p>
    </div>
</main>
```
以上代码有一个问题：后面的元素在动画还没开始播放的时候就出现在了最终位置，开始播放时才转到动画初始位置。

使用animation-fill-mode可以在动画播放前或播放后应用动画样式。
* 初始值是none--意思是动画执行前或执行后动画样式都不会应用到元素上。
* backwards--在动画执行之前，浏览器就会取出动画中第一帧的值，并把它们应用在元素上。
* forwards--在动画播放完成后仍然应用最后一帧的值。
* both--会同时向前和向后填充。  
为页面添加后向填充模式可以修复动画开始时的元素跳动。

### 用动画传递意图
好的动画不是最后才加上的，而是融入到了开发过程中。它们向用户传达页面上某些事物的特殊含义。  
动画可以向用户表明按钮被点击了或者消息被接收了。如果你曾经提交过表单，回想一下是否经常记不清自己点没点过注册按钮，就知道这有多重要了。

[CSS Animista](https://animista.net/play/basic)