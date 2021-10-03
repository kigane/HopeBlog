---
title: css 小技巧
lang: zh-CN
sidebarDepth: 1
---

## 背景与边框
### 透明边框
元素的背景默认会占据border+padding+content区域。即background-clip: border-box。  
要实现元素背景外有一圈透明边框，需要修改background-clip为padding-box。则背景只占据padding+content区域。再将边框设为透明即可。

### 多重边框
box-shadow:一个正值的扩张半径加上两个为零的偏移量以及为零的模糊值，得到的“投影”其实就像一道实线边框。并且，它支持逗号分隔语法，我们可以创建任意数量的投影。  
::: warning 注意
1. box-shadow不会影响布局。所以，需要通过margin或padding模拟边框占据的空间。   
2. box-shadow不会响应鼠标事件，这可以通过使用内圈边框(加 inset 关键字)解决。
:::

---

outline:如果只需要两层边框，那就可以先设置一层常规边框，再加上outline(描边)属性来产生外层的边框。相比于box-shadow只能产生实现边框，outline和border一样，有更多边框样式。  
outline-offset:控制outline和border的间距，可以取负值，实现简单的缝边效果。如果负值和border的宽度相同，则两个边框会重合，outline在上。

::: warning 注意
outline不一定会贴合border-radius属性产生的圆角，因此如果元素是圆角的，它的描边可能还是直角的。这种行为被CSS工作组认为是一个bug，因此未来可能会改为贴合border-radius圆角。
:::

### 边框内圆角
使用两个容器，外层设置背景+padding，内层设置border-radius即可。

### 条纹背景
backgound-img: linear-gradient(...)  
* 如果多个色标具有相同的位置，它们会产生一个无限小的过渡区域，过渡的起止色分别是第一个和最后一个指定值。从效果上看，颜色会在那个位置突然变化，而不是一个平滑的渐变过程。
* 如果某个色标的位置值比整个列表中在它之前的色标的位置值都要小，则该色标的位置值会被设置为它前面所有色标位置值的最大值。
```css
backgound-img: linear-gradient(to right, black 30%, white 0, white 70%, black 0)  /* 黑白黑 */
```

---
斜向条纹  
```css
background-image: repeating-linear-gradient(-45deg, black, black 10px, azure 0, azure 20px);
/*
相当于
linear-gradient(-45deg, 
black, black 10px, azure 0, azure 20px
black 20px, black 30px, azure 0, azure 40px
black 40px, black 50px, azure 0, azure 60px
...)
*/
```

## 布局
https://1linelayouts.glitch.me/
### 紧贴底部的页脚
想要的效果是，页头和页脚的高度由其内部因素来决定，而内容区块的高度应该可以自动伸展并占满所有的可用空间。  
```css
/*
<div class="sf-container">
    <header><h1>Site Name</h1></header>
    <main>
        <p>haha There should have some content</p>
        <p>haha There should have some content</p>
        <p>haha There should have some content</p>
    </main>
    <footer>
        <p>copyright &copy; 2021</p>
    </footer>
</div>
*/

.sf-container {
    display: flex;
    flex-direction: column;
    min-height: 98vh;
}

main {
    flex: 1;
}
```

## oneline css
### 水平，垂直居中
```css
.parent {
    display: grid;
    place-items:center;
}
```

### The Deconstructed Pancake
```css
.parent {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.box {
    flex: 1 1 150px; /*  Stretching: */
    /* flex: 0 1 150px;   No stretching: */
    margin: 5px;
}
```

### sidebar
左侧边栏最小150px，最大25%。其余空间由内容占据。
```css
.parent {
    display: grid;
    grid-template-columns: minmax(150px, 25%) 1fr;
}
```

### Pancake Stack
display:grid中的auto表示元素扩展到能容纳网格元素内容。  
fr类似flex中的增长因子。  
```css
.parent {
    display: grid;
    grid-template-rows: auto 1fr auto;
}
```

### 经典圣杯布局
```css
.parent {
    display: grid;
    grid-template: auto 1fr auto / auto 1fr auto;
}
  
header {
    padding: 2rem;
    grid-column: 1 / 4;
}

.left-side {
    grid-column: 1 / 2;
}

main {
    grid-column: 2 / 3;
}

.right-side {
    grid-column: 3 / 4;
}

footer {
    grid-column: 1 / 4;
}
```

### 12-span(网格布局)
```css
.parent {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
}
  
.span-12 {
    grid-column: 1 / span 12;
}

.span-6 {
    grid-column: 1 / span 6;
}

.span-4 {
    grid-column: 4 / span 4;
}

.span-2 {
    grid-column: 3 / span 2;
}

/* centering text */
.section {
    display: grid;
    place-items: center;
    text-align: center
}
```

### RAM
* auto-fill 会尽可能多的产生网格列，因此，和repeat，minmax合用时，当容器特别宽时，可能会有多余的轨道空出来。
* auto-fit 同auto-fill，但当容器特别宽时已有元素或轨道会扩展，直到占满容器宽度。
* 当容器宽度较小时，两者表现相同。
```css
.parent {
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}
```

## 回到顶部
* 利用a标签href为#时会自动会到顶部的特性。
* css中设置 `* { scroll-behavior:smooth }`