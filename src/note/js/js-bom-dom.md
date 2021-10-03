---
title: BOM&DOM&Event
lang: zh-CN
sidebarDepth: 2
---

## BOM
* window
    * window对象是JS的全局对象，所有全局作用域的变量和函数，都会变成window对象的属性和方法。
    * 全局变量和定义在window对象上的属性间的唯一差别是，全局变量不能delete，而window对象上的属性可以。
    * 访问未声明的全局变量会抛出错误，而访问未声明的window对象属性会返回undefined。
    * 页面中每个frame都有自己的window对象，每个window对象都有一个name属性，`window.frames[name]`可以访问指定frame
    * window.top对象始终指向最外层的frame，即浏览器窗口。
    * window.parent指向外层的frame
    * window.self === window
    * window.open(url, windowOrFrameName, features, replaceInHistory) 在windowOrFrameName上打开新的url，如果windowOrFrameName不存在，用指定的features创建新窗口。被open的窗口的window.opener指向原窗口，原窗口对被open的窗口一无所知。
    * 对话框：alert, confirm, prompt
* location
    * window.location === document.location
    * location.href 完整的url。
    * location.host hostname:port
    * location.hostname
    * location.port
    * location.pathname 
    * location.search 以?开头的查询字符串
    * location.hash url中#+后面部分。除了该属性，修改其他属性都会导致浏览器重新加载。
    * location.replace(url) 加载新url，原url不会添加到历史记录中。
    * location.reload(bImpose) 重新加载(false: 可能从缓存中加载，true: 从服务器重新加载)
* navigator
    * navigator.cookieEnabled
    * navigator.userAgent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36 Edg/93.0.961.38"
* history
    * history.back() 回退一页
    * history.forward() 前进一页
    * history.go(num) num>0时前进，反之后退。 

### 间歇调用和超时调用
* setTimeout(CallBackFn, time-ms) 经过time-ms后将当前任务添加到任务队列中。如果队列为空，则立即执行，否则，等待。
* setInterval(CallBackFn, time-ms)
* 两个函数都会返回一个id标识符，可以调用相应的clearTimeout(id), clearInterval(id)取消调用。
* 两个函数都是在全局作用域中执行的。无论在哪里调用。
* 通常很少用setInterval，因为后一个间歇调用可能会在前一个间歇调用结束前启动。
```js
var num = 0
var max = 10

function incrementNum() {
    num++
    if (num < max) {
        setTimeout(incrementNum, 500)
    } else {
        alert("Done")
    }
}

setTimeout(incrementNum, 500)

// 相当于setInterval(incrementNum, 500)
```

## Event
### 事件流
事件流描述的是从页面接受事件的顺序。
* 事件冒泡：事件开始时由嵌套最深的元素接收，然后逐级向上传播。
* 事件捕获：事件开始时由window对象接收，然后逐级向下传播到嵌套最深的元素。
* DOM2级事件：规定事件流包括三个阶段
    * 事件捕获阶段 1
    * 处于目标阶段 2
    * 事件冒泡阶段 3

### 事件处理程序
即响应某个事件的函数。
```html
<input type="Button" value="Click Me" onclick="showMessage()"/>
```
* 这里showMessage为事件处理程序调用的函数。在该函数内部，this为事件的目标元素(本例中为input)。
* 在这个函数作用域内，可以像访问局部变量一样访问document和元素本身的成员。如果当前元素是一个表单元素(在form内)，则作用域中还会包含form元素。
* 在html中指定事件处理程序可能会有时差问题，即html元素渲染好了，但showMessage函数还不可用，即JS还没执行到。
* DOM0级事件处理程序：用JS选中DOM对象中的指定元素，再将一个函数赋给事件处理程序(例如，el.onclick)。
* DOM2级事件处理程序：使用
    * addEventListener(eventName, EventCallBackFn, isCapture) 
    * removeEventListener(eventName, EventCallBackFn, isCapture)
    * isCapture为true，表示在捕获阶段处理事件，为false表示在冒泡阶段处理事件。
    * remove时的参数必须和add时的参数一模一样。如果add时使用的是匿名函数，则无法remove。
    * 这种方式可以为同一个事件设置多个处理函数。按照添加顺序触发。

### 事件对象
浏览器会将event对象传入事件处理程序中。  

属性/方法 | 类型 | 只读 | 说明
------|----|----|---
type | String | Y | 事件的类型
target | Element | Y | 事件的目标。(最上层元素？)
currentTarget | Element | Y | 当前正在处理事件的元素。事件处理程序中的this。
eventPhase | Integer | Y | 表明事件处理程序的阶段
bubbles | Boolean | Y | 表明事件是否冒泡
detail | Integer | Y | 事件相关细节信息
cancelable | Boolean | Y | 表明是否可以取消事件的默认行为
preventDefault() | Function | Y | 如果cancelable为true，取消事件的默认行为。
defaultPrevented | Boolean | Y | 为true，说明已经调用了preventDefault()
stopImmediatePropagation() | Function | Y | 取消事件进一步捕获或冒泡，同时阻止任何事件被调用。
stopPropagation() | Function | Y | 如果bubbles为true，取消事件进一步捕获或冒泡。
trusted | Boolean | Y | 为true表明是浏览器生成的，为false表示由JS生成的

### 事件类型
#### UI事件
* load 
    * 当页面完全加载后（包括所有图像、JavaScript文件、CSS文件等外部资源），就会触发window上面的load事件。
    * EventUtil.addHandler(window, "load", function(e) {...})。建议使用。
    * 或在body元素中添加onload属性。
    * img元素也有load事件，在图片加载完成时触发。
* unload：在文档被完全卸载后触发。只要用户从一个页面切换到另一个页面，就会发生unload事件。而利用这个事件最多的情况是清除引用，以避免内存泄漏。
* select：当用户选择文本框（`<input>`或`<texterea>`）中的一或多个字符时触发。
* resize：当窗口或框架的大小变化时在window或框架上面触发。
* scroll：当用户滚动带滚动条的元素中的内容时，在该元素上面触发。
* resize和scroll触发频率很高。注意代码的简洁。

#### 焦点事件
* blur：在元素失去焦点时触发。这个事件不会冒泡。
* focus：在元素获得焦点时触发。不冒泡
* focusin：冒泡版focus
* focusout：冒泡版blur

#### 鼠标和滚轮事件
* click：在用户单击主鼠标按钮或者按下回车键时触发。
* dblclick：在用户双击主鼠标按钮时触发。
* mousedown：在用户按下了任意鼠标按钮时触发。不能通过键盘触发这个事件。
* mouseup：在用户释放鼠标按钮时触发。
    * event.button:0表示主鼠标按钮，1表示中间的鼠标滚轮按钮,2表示次鼠标按钮。
* mousemove：当鼠标指针在元素内部移动时重复地触发。不能通过键盘触发这个事件。
* mouseout：在鼠标指针位于一个元素上方，然后用户将其移入另一个元素时触发。从A元素移动到B元素上，会触发A的mouseout，B的mouseover，A的relatedTarget是B，B的relatedTarget是A。
* mouseover：在鼠标指针位于一个元素外部，然后用户将其首次移入另一个元素边界之内时触发。
* 事件触发顺序：mousedown->mouseup->click->mousedown->mouseup->click->dbclick
* mousewheel：滚动鼠标滚轮时触发。与mousewheel事件对应的event对象除包含鼠标事件的所有标准信息外，还包含一个特殊的wheelDelta属性。当用户向前滚动鼠标滚轮时，wheelDelta是120的倍数；当用户向后滚动鼠标滚轮时，wheelDelta是-120的倍数。

---

* 视口坐标位置：事件对象的clientX和clientY属性，表示事件发生时鼠标指针在视口中的水平和垂直坐标。
* 页面坐标位置：事件对象的pageX和pageY属性，能告诉你事件是在页面中的什么位置发生的。
* 屏幕坐标位置：事件对象的screenX和screenY属性，表示事件发生时鼠标指针相对于整个屏幕的水平和垂直坐标。
* 修饰键：事件对象的shiftKey、ctrlKey、altKey和metaKey属性，如果相应的键被按下了，则值为true。

#### 键盘和文本事件
* keydown：当用户按下键盘上的任意键时触发，而且如果按住不放的话，会重复触发此事件。
* keypress：当用户按下键盘上的字符键时触发，而且如果按住不放的话，会重复触发此事件。按下Esc键也会触发这个事件。
* keyup：当用户释放键盘上的键时触发。
* textInput：这个事件是对keypress的补充，用意是在将文本显示给用户之前更容易拦截文本。在文本插入文本框之前会触发textInput事件。
    * 任何可以获得焦点的元素都可以触发keypress事件，但只有可编辑区域才能触发textInput事件。
    * textInput事件只会在用户按下能够输入实际字符的键时才会被触发，而keypress事件则在按下那些能够影响文本显示的键时也会触发（例如退格键）。
    * event.inputMethod
        * 0，表示浏览器不确定是怎么输入的。
        * 1，表示是使用键盘输入的。
        * 2，表示文本是粘贴进来的。
        * 3，表示文本是拖放进来的。
        * 4，表示文本是使用IME输入的。
        * 5，表示文本是通过在表单中选择某一项输入的。
        * 6，表示文本是通过手写输入的（比如使用手写笔）。
        * 7，表示文本是通过语音输入的。
        * 8，表示文本是通过几种方法组合输入的。
        * 9，表示文本是通过脚本输入的。
* 键盘事件与鼠标事件一样，都支持相同的修改键。而且，键盘事件的事件对象中也有shiftKey、ctrlKey、altKey和metaKey属性。

![KeyCode](/assets/img/js-keycode.png)
 keyCode: 即相应字符对应的ASCII码

#### 变动事件
* DOMSubtreeModified：在DOM结构中发生任何变化时触发。这个事件在其他任何事件触发后都会触发。
* DOMNodeInserted：在一个节点作为子节点被插入到另一个节点中时触发。
* DOMNodeRemoved：在节点从其父节点中被移除时触发。
* DOMNodeInsertedIntoDocument：在一个节点被直接插入文档或通过子树间接插入文档之后触发。这个事件在DOMNodeInserted之后触发。
* DOMNodeRemovedFromDocument：在一个节点被直接从文档中移除或通过子树间接从文档中移除之前触发。这个事件在DOMNodeRemoved之后触发。
* DOMAttrModified：在特性被修改之后触发。
* DOMCharacterDataModified：在文本节点的值发生变化时触发。

#### HTML5事件
* contextmenu事件：右键单击时触发，使用event.preventDefalut()取消默认菜单。因为contextmenu事件属于鼠标事件，所以其事件对象中包含与光标位置有关的所有属性。通常使用contextmenu事件来显示自定义的上下文菜单，而使用onclick事件处理程序来隐藏该菜单。
* DOMContentLoaded事件：在形成完整的DOM树之后就会触发，不理会图像、JavaScript文件、CSS文件或其他资源是否已经下载完毕。
* hashchange事件：HTML5新增了hashchange事件，以便在URL的参数列表（及URL中“#”号后面的所有字符串）发生变化时通知开发人员。之所以新增这个事件，是因为在Ajax应用中，开发人员经常要利用URL参数列表来保存状态或导航信息。

### 内存和性能
在JavaScript中，添加到页面上的事件处理程序数量将直接关系到页面的整体运行性能。导致这一问题的原因是多方面的。
1. 每个函数都是对象，都会占用内存；内存中的对象越多，性能就越差。
2. 必须事先指定所有事件处理程序而导致的DOM访问次数，会延迟整个页面的交互就绪时间。

#### 事件委托
click、mousedown、mouseup、keydown、keyup和keypress事件适合采用事件委托技术。利用了事件冒泡，在事件冒泡到较高层次时统一处理，这样只指定一个事件处理程序，就可以管理某一类型的所有事件。
```js
var list = document.getElementById("#app")

EventUtil.addHandler(list, "click", function(e){
    event = EventUtil.getEvent(event);
    var target = EventUtil.getTarget(event)

    switch (target.id) {
        case: "aBtn":
            document.title = "I changed the document's title"
            break
        case "bBtn":
            location.href = "http://www.baidu.com"
            break
        case: "cBtn":
            alert("Hi")
            break;
    }
})
```

#### 移除事件处理程序
内存中留有那些过时不用的“空事件处理程序”（dangling event handler），也是造成Web应用程序内存与性能问题的主要原因。

在两种情况下，可能会造成上述问题。
1. 从文档中移除带有事件处理程序的元素。这可能是通过纯粹的DOM操作，例如使用removeChild()和replaceChild()方法，但更多地是发生在使用innerHTML替换页面中某一部分的时候。如果带有事件处理程序的元素被innerHTML删除了，那么原来添加到元素中的事件处理程序极有可能无法被当作垃圾回收。(元素移除了，但事件处理程序还和元素保持着引用关系，浏览器很可能无法处理，而将元素和对事件处理程序的引用都保存在内存中，因而无法通过GC回收)
2. 卸载页面的时候。如果在页面被卸载之前没有清理干净事件处理程序，那它们就会滞留在内存中。每次加载完页面再卸载页面时（可能是在两个页面间来回切换，也可以是单击了“刷新”按钮），内存中滞留的对象数目就会增加，因为事件处理程序占用的内存并没有被释放。一般来说，最好的做法是在页面卸载之前，先通过onunload事件处理程序移除所有事件处理程序。在此，事件委托技术再次表现出它的优势——需要跟踪的事件处理程序越少，移除它们就越容易。