---
title: JS 基础
lang: zh-CN
sidebarDepth: 2
---

## 变量

按照ECMA-262的定义，JavaScript的变量只是在特定时间用于保存特定值的一个名字而已。

### 变量基础
#### 类型
ECMAScript变量可能包含两种不同数据类型的值：基本类型值和引用类型值。
* 基本类型值指的是简单的数据段：包括 Undefined、Null、Boolean、Number和String 这五种。
* 引用类型值指那些可能由多个值构成的对象。引用类型的值是保存在内存中的对象。与其他语言不同，JavaScript不允许直接访问内存中的位置，也就是说不能直接操作对象的内存空间。在操作对象时，实际上是在操作对象的引用而不是实际的对象。(创建的对象只不给你直接访问的方式，对对象的所有的操作都是通过指针进行的)

#### 值传递
JavaScript中，变量的赋值，函数的传参都只有一种方式\-\-按值传递。基本类型不必多说。引用类型的“值传递”实际上类似于C/C++中的按指针传递，就是将指针的值复制一份。

#### 类型检测
typeof操作符是确定一个变量是字符串、数值、布尔值，还是undefined的最佳工具。对于对象，返回Object。对于函数(实现了`[[Call]]`方法的对象)，返回Function。

instanceof操作符。用法为：`result = variable instanceof Constructor`。
如果变量是给定引用类型的实例，就根据它的原型链来识别，即检查variable的原型链中是否存在Constructor.prototype，有则返回true。

根据规定，所有引用类型的值都是Object的实例。因此，在检测一个引用类型值和Object构造函数时，instanceof操作符始终会返回true。当然，如果使用instanceof操作符检测基本类型的值，则该操作符始终会返回false，因为基本类型不是对象。

### 执行环境及作用域
执行环境（execution context，也称“环境”）定义了变量或函数有权访问的其他数据，决定了它们各自的行为。每个执行环境都有一个与之关联的变量对象，环境中定义的所有变量和函数都保存在这个对象中。虽然我们编写的代码无法访问这个对象，但解析器在处理数据时会在后台使用它。

全局执行环境是最外围的一个执行环境。根据ECMAScript实现所在的宿主环境不同，表示执行环境的对象也不一样。
* 在Web浏览器中，全局执行环境被认为是window对象。
* 每个函数都有自己的执行环境。当执行流进入一个函数时，函数的环境就会被推入一个环境栈中。而在函数执行之后，栈将其环境弹出，把控制权返回给之前的执行环境。

当代码在一个环境中执行时，会创建变量对象的一个作用域链。用于保证对执行环境有权访问的所有变量和函数的有序访问。作用域链的前端，始终都是当前执行的代码所在环境的变量对象。如果这个环境是函数，则将其**活动对象**作为变量对象。活动对象在最开始时只包含一个变量，即arguments对象（这个对象在全局环境中是不存在的）。作用域链中的下一个变量对象来自包含（外部）环境，而再下一个变量对象则来自下一个包含环境。这样，一直延续到全局执行环境；全局执行环境的变量对象始终都是作用域链中的最后一个对象。

标识符解析是沿着作用域链一级一级地搜索标识符的过程。搜索过程始终从作用域链的前端开始，然后逐级地向后回溯，直至找到标识符为止（找不到就报错）。
内部环境可以通过作用域链访问所有的外部环境，但外部环境不能访问内部环境中的任何变量和函数(作用域链是个单向链表:thinking:)。
**函数参数也被当作变量来对待**，因此其访问规则与执行环境中的其他变量相同。

### 垃圾收集
JavaScript具有自动垃圾收集机制，也就是说，执行环境会负责管理代码执行过程中使用的内存。主要有两种策略

#### 标记清除（mark-and-sweep）
垃圾收集器在运行的时候会给存储在内存中的所有变量都加上标记。然后，它会去掉环境中的变量以及被环境中的变量引用的变量的标记。而在此之后仍有标记的变量将被视为准备删除的变量，原因是环境中的变量已经无法访问到这些变量了。最后，垃圾收集器完成内存清除工作，销毁那些带标记的值并回收它们所占用的内存空间。

#### 引用计数（reference counting）
释放那些引用次数为零的值所占用的内存。需要特别小心“循环引用”问题。

#### 性能
垃圾收集器是周期性运行的，而且如果为变量分配的内存数量很可观，那么回收工作量也是相当大的。
垃圾收集器是根据内存分配量运行的，具体一点说就是256个变量、4096个对象（或数组）字面量和数组元素（slot）或者64KB的字符串。达到上述任何一个**临界值**，垃圾收集器就会运行。
如果垃圾收集例程回收的内存分配量低于15%，则变量、字面量和（或）数组元素的临界值就会加倍。如果例程回收了85%的内存分配量，则将各种临界值重置回默认值。(比固定临界值性能好很多)

#### 内存管理
一旦数据不再有用，最好通过将其值设置为null来释放其引用——这个做法叫做解除引用（dereferencing）。这一做法适用于大多数全局变量和全局对象的属性。局部变量会在它们离开执行环境时自动被解除引用

## 函数
函数声明
```js
function funcName(args){
    // function body
};
```
函数表达式
```js
var func1 = function(args){
    // function body
}; // 匿名函数 
```
一个典型错误
```js
if (condition)
{
    function sayHi(){alert("Hi");};
}
else
{
    function sayHi(){alert("Hello");};
}
```
表面上看，以上代码表示在condition为true时，使用一个sayHi()的定义；否则，就使用另一个定义。实际上，这在ECMAScript中属于无效语法，JavaScript引擎会尝试修正错误，将其转换为合理的状态。但问题是浏览器尝试修正错误的做法并不一致。大多数浏览器会返回第二个声明，忽略condition; Firefox会在condition为true时返回第一个声明。这里用函数表达式就没问题了
```js
var func;
if (condition)
{
    func = function(){alert("Hi");};
}
else
{
    func = function(){alert("Hello");};
}
```

### 递归
经典例子+经典错误
```js
function factorial(num)
{
    if (num <= 1){return num;}
    else{ return num * factorial(num-1);}
    // return num * arguments.callee(num - 1) 即可。
}

var F = factorial;
factorial = null;
F(5); // TypeError: factorial is not a function
```
因为，F(5)内部调用的还是factorial(4)，但factorial已经被设为null了。所以在编写递归函数时，应该尽可能使用arguments.callee(arguments.callee是一个指向正在执行的函数的指针)。

但在严格模式下，不能通过脚本访问arguments.callee，访问这个属性会导致错误。不过，可以使用命名函数表达式来达成相同的结果

```js
var factorial = (function f(num){
        if (num <= 1){return num;}
        else{ return num * f(num-1);}
    });
var F = factorial;
factorial = null;
F(5); // 120
```

### 闭包
**闭包是指有权访问另一个函数作用域中的变量的函数**。创建闭包的常见方式，就是在一个函数内部创建另一个函数。

当某个函数被调用时，会创建一个执行环境（execution context）及相应的作用域链。然后，使用arguments和其他命名参数的值来初始化函数的活动对象（activation object）。但在作用域链中，外部函数的活动对象始终处于第二位，外部函数的外部函数的活动对象处于第三位，……直至作为作用域链终点的全局执行环境。

在另一个函数内部定义的函数会将包含函数（即外部函数）的活动对象添加到它的作用域链中。**当外部函数返回后，其执行环境的作用域链会被销毁，但它的活动对象仍然会留在内存中**。

由于闭包会携带包含它的函数的作用域，因此会比其他函数占用更多的内存。过度使用闭包可能会导致内存占用过多，我们建议读者只在绝对必要时再考虑使用闭包。虽然像V8等优化后的JavaScript引擎会尝试回收被闭包占用的内存，但请大家还是要慎重使用闭包。

#### 经典错误
```js
function createFunc(){
    var result = new Array();
    for (var i = 0; i < 10; i++)
    {
        result[i] = function(){return i};
    }
    return result;
}
```
表面上看，似乎每个函数都应该返自己的索引值，即位置0的函数返回0，位置1的函数返回1，以此类推。但实际上，每个函数都返回10。因为每个函数的作用域链中都保存着createFunctions()函数的活动对象，所以它们引用的都是同一个变量i。
闭包只能取得包含函数中任何变量的最后一个值。

#### this 对象
this对象是在运行时基于函数的执行环境绑定的：在全局函数中，this等于window，而当函数被作为某个对象的方法调用时，this等于那个对象。不过，匿名函数的执行环境具有全局性，因此其this对象通常指向window。(当然，可以用call, apply修改this对象)

**每个函数在被调用时都会自动取得两个特殊变量：this和arguments。内部函数在搜索这两个变量时，只会搜索到其活动对象为止，因此永远不可能直接访问外部函数中的这两个变量。**

```js
var name = "The Window";
var object = {
    name: "the object",
    getName: function(){
        return this.name;
    }
};
object.getName() // "the object" 

var object1 = {
    name: "the object1",
    getName: function(){
        return function(){
            return this.name;
        };
    }
};
object1.getName()() // "The Window"

var object2 = {
    name: "the object2",
    getName: function(){
        var that = this; // 使用闭包保存了this
        return function(){
            return that.name;
        };
    }
};
object2.getName()() // "the object2" 
```

#### 闭包引起的内存泄露
```js
function assignHandler(){
    var elem = document.getElementById("some-id");
    elem.onclick = function(){
        alert(elem.id);
    }; // elem-->DOM元素, DOM元素的onclick是指向闭包，闭包中又有elem。因此产生了循环引用。
}
```
解决方法是
```js
function assignHandler(){
    var elem = document.getElementById("some-id");
    var id = elem.id;
    elem.onclick = function(){
        alert(id);
    }; 
    elem = null;
}
```

### 模仿块级作用域
用作块级作用域（通常称为私有作用域）的匿名函数的语法如下：
```js
(function(){
    // 这里是块级作用域
})()
```
JavaScript将function关键字当作一个函数声明的开始，而函数声明后面不能跟圆括号(不能这样`function(){}()`)。然而，函数表达式的后面可以跟圆括号。要将函数声明转换成函数表达式，只要像上面这样给它加上一对圆括号即可。

这种技术经常在全局作用域中被用在函数外部，从而限制向全局作用域中添加过多的变量和函数。一般来说，我们都应该尽量少向全局作用域中添加变量和函数。在一个由很多开发人员共同参与的大型应用程序中，过多的全局变量和函数很容易导致命名冲突。而通过创建私有作用域，每个开发人员既可以使用自己的变量，又不必担心搞乱全局作用域。例如

```js
(function(){
    var now = new Date();
    if (now.getMonth() == 0 && now.getDate() == 1){
        alert("Happy New Year!");
    }
})();
```

### 私有变量和单例模式
严格来讲，JavaScript中没有私有成员的概念；所有对象属性都是公有的。不过，倒是有一个私有变量的概念。任何在函数中定义的变量，都可以认为是私有变量，因为不能在函数的外部访问这些变量。

// TODO

### `[[scoped]]`
`[[scoped]]`是Chorme开发者工具内部使用的私有属性，显示了函数可访问的变量(即函数的作用域中的变量)。
```js
function a() {
  var foo = 'foo';
  var obj = {
    bar: function () {
      return foo;
    }
  };
  console.log(obj);
}
a();

// obj.bar
// [[Scopes]]: Scopes[2]
// 0: Closure (a)
//   foo: "foo"
// 1: Global
//   (all global variables)
```
