---
title: JS 对象
lang: zh-CN
sidebarDepth: 2
---

ECMA-262把对象定义为：“无序属性的集合，其属性可以包含基本值，对象或函数。”  
简单地说，对象就是一个散列表，包含一系列 key-value 对，其中值可以是数据或函数。  

## 理解对象
ECMAScript 中有两类属性(property)：数据属性和访问器属性。  
属性的特征由 ECMA 定义的内部特性(attribute)描述。

### 数据属性的特性
1. `[[Configurable]]`：表示
    * 能否通过 delete 删除属性从而可以重新定义属性
    * 能否修改属性的特性
    * 能否把属性修改为访问器属性
2. `[[Enumerable]]`：表示能否通过 for-in 循环返回属性。
3. `[[Writable]]`：表示能否修改属性的值。
4. `[[Value]]`：保存这个属性的数据值。读取属性值的时候，从这个位置读；写入属性值的时候，把新值保存在这个位置。默认值为 undefined。  
对于使用字面量直接在对象上定义的属性(`var obj = {name: 'jack'}`)，`[[Configurable]]`,`[[Enumerable]]`,`[[Writable]]`默认为 true,`[[Value]]`为设置的值。

### 访问器属性的特性
访问器属性不包含数据值；它们包含一对 getter 和 setter 函数（都非必需）。在读取访问器属性时，会调用 getter 函数，这个函数负责返回有效的值；在写入访问器属性时，会调用 setter 函数并传入新值，这个函数负责决定如何处理数据。访问器属性必须用Object.defineProperty()来定义。
访问器属性有如下4个特性。
1. `[[Configurable]]`：表示
    * 能否通过 delete 删除属性从而可以重新定义属性
    * 能否修改属性的特性
    * 能否把属性修改为数据属性
2. `[[Enumerable]]`：表示能否通过 for-in 循环返回属性。
3. `[[Get]]`：在读取属性时调用的函数。默认值为undefined。
4. `[[Set]]`：在写入属性时调用的函数。默认值为undefined。
访问器属性不能直接定义，必须使用 Object.defineProperty() 来定义。

### Object.defineProperty()
要修改属性默认的特性，必须使用 ECMAScript 5 的 Object.defineProperty() 方法。这个方法接收三个参数：属性所在的对象、属性的名字和一个描述符对象。其中，描述符（descriptor）对象的属性必须是：configurable、enumerable、writable&value或者get&set。设置其中的一或多个值，可以修改对应的特性值。

设置访问器属性时，可以同时指定getter和setter。只指定getter意味着属性是不能写，尝试写入属性会被忽略。在严格模式下，尝试写入只指定了getter函数的属性会抛出错误。类似地，只指定setter函数的属性也不能读，否则在非严格模式下会返回undefined，而在严格模式下会抛出错误。

::: warning 注意  
在调用 Object.defineProperty() 方法时，如果不指定，configurable、enumerable 和 writable 特性的默认值都是 false。而且，一旦把属性定义为不可配置的，就不能再把它变回可配置了，因为它已经不可配置了:rofl:。通常不用特意将configurable设为true，因为很少会有修改特性的需求。
:::

ECMAScript 5又定义了一个Object.defineProperties()方法。利用这个方法可以通过描述符一次定义多个属性。这个方法接收两个对象参数：第一个参数是要添加和修改其属性的对象，第二个参数是一个对象，其属性与第一个对象中要添加或修改的属性一一对应。
```js
var book = {}

Object.defineProperties(book, {
    _year: {
        writable: true,
        value: 2000
    },
    edition: {
        writable: true,
        value: 0
    },
    year: {
        get: function() {
            return this._year
        },
        set: function(y) {
            this._year = year
            this.edition++
        }
    }
})

// 对book用for-in循环，啥也打印不出来。
```

使用ECMAScript 5的Object.getOwnPropertyDescriptor()方法，可以取得给定属性的描述符。这个方法接收两个参数：属性所在的对象和要读取其描述符的属性名称。返回值是一个对象，如果是访问器属性，这个对象的属性有configurable、enumerable、get和set；如果是数据属性，这个对象的属性有configurable、enumerable、writable和value。  
Object.getOwnPropertyDescriptors(obj)，取得obj的所有属性描述符。

## 创建对象
Object构造函数或对象字面量都可以用来创建单个对象，但这些方式有个明显的缺点：会产生大量的重复代码。
```js
var p1 = {
    name: "wyz",
    age: 21,
    sayHi: function(){alert("says Hi")}
};
var p2 = {
    name: "gtl",
    age: 22,
    sayHi: function(){alert("says Hi")}
};
```

### 工厂模式
```js
function createPerson(name, age)
{
    var o = new Object();
    o.name = name;
    o.age = age;
    o.sayHi = function(){alert("says Hi")};
    return o;
}

var p1 = createPerson("wyz", 21); 
var p2 = createPerson("gtl", 22); 
```
工厂模式虽然解决了创建多个相似对象代码重复的问题，但却没有解决对象识别的问题（即怎样知道一个对象的类型）。

### 构造函数模式
```js
function Person(name, age)
{
    this.name = name;
    this.age = age;
    this.sayHi = function(){alert("says Hi")};
}

var p1 = new Person("wyz", 21);
var p2 = new Person("gtl", 22);
```
注意到构造函数 Person() 的特点
* 没有显式地创建对象
* 直接将属性和方法赋给了this对象
* 没有return语句

要创建Person的新实例，必须使用new操作符。以这种方式调用构造函数实际上会经历以下4个步骤
1. 创建一个新对象；
2. 将构造函数的作用域赋给新对象（因此this就指向了这个新对象）:thinking: ；
3. 执行构造函数中的代码（为这个新对象添加属性）；
4. 返回新对象。

使用构造函数的主要问题，就是每个方法都要在每个实例上重新创建一遍。
::: tip 提示
p1和p2都有一个名为sayHi()的方法，但那两个方法不是同一个Function的实例。即 p1.sayHi != p2.sayHi
:::

### 原型模式
我们创建的每个函数都有一个prototype（原型）属性，这个属性是一个指针，指向一个对象，而这个对象的用途是包含可以由特定类型的**所有实例共享**的属性和方法。

```js
function Person(){}
Person.prototype.name = "wyz";
Person.prototype.age = 21;
Person.prototype.sayHi = function(){alert(this.name);};

var p1 = new Person();
p1.sayHi(); // "wyz"
var p2 = new Person();
p2.name = "gtl";
p2.sayHi(); // "gtl"
```

::: tip 提示
理解ECMAScript中原型对象的性质：
1. 无论什么时候，只要创建了一个新函数，就会根据一组特定的规则为**该函数创建一个prototype属性**，这个属性指向(可以理解为指针:smirk:)函数的原型对象。所有原型对象都会默认获得一个constructor属性，这个属性是一个指向prototype属性所属函数的指针（Person.prototype.constructor == Person）。而通过这个构造函数对象，我们还可继续为原型对象添加其他属性和方法。创建了自定义的构造函数之后，其原型对象默认只会取得constructor属性；至于其他方法，则都是从Object继承而来的。
2. 当调用构造函数创建一个新实例后，该**实例的内部将包含一个指针，指向构造函数的原型对象**(p1.\_\_proto\_\_ == Person.prototype)。ECMA-262第5版中管这个指针叫`[[Prototype]]`。虽然在脚本中没有标准的方式访问`[[Prototype]]`，但Firefox、Safari和Chrome在每个对象上都支持一个属性__proto__；而在其他实现中，这个属性对脚本则是完全不可见的。
3. ECMAScript 5增加了一个新方法，叫Object.getPrototypeOf()，在所有支持的实现中，这个方法返回`[[Prototype]]`的值。:joy:
:::

#### 更简单的原型语法
```js
function Person(){};
var p1 = Person(); // 把这一行移动到 Person.prototype 赋值后就没问题了
Person.prototype = {、
    // constructor: Person, // 最好也加上这行
    name: "wyz",
    age: 21,
    sayHi: function(){alert(this.name);}
}
p1.sayHi(); // error p1.__proto__ 指向的老对象没有 sayHi 函数
```
此时，instanceof操作符会返回正确的结果。
::: danger 特别小心
因为 Person.prototype 和 p1.\_\_proto\_\_ 都是指针。经过这样"简单"的赋值之后， Person.prototype 指向新的对象，而 p1.\_\_proto\_\_ 仍然指向原来的原型对象:skull:。并且，新的对象的 constructor 等于 Object 而不是 Person 了，而且 constructor 的特性 `[[enumarable]]` 也从默认的 false 变成了 true。
:::

#### 查找对象属性
每当代码读取某个对象的某个属性时，都会执行一次搜索，目标是具有给定名字的属性。搜索首先从对象实例本身开始。如果在实例中找到了具有给定名字的属性，则返回该属性的值；如果没有找到，则继续搜索指针指向的原型对象，在原型对象中查找具有给定名字的属性。如果在原型对象中找到了这个属性，则返回该属性的值。   
也就是说，如果我们在实例中添加了一个属性，而该属性与实例原型中的一个属性同名，那我们就在实例中创建该属性，该属性将会屏蔽原型中的那个属性。(就近原则:smirk:)
::: tip 提示
使用hasOwnProperty()方法(从Object继承来的)可以检测一个属性是存在于实例中(返回true)，还是存在于原型中。(加了Own的都只能操作实例本身的属性:smile:)
:::

要取得对象上所有可枚举的实例属性，可以使用ECMAScript 5的Object.keys()方法。
如果你想要得到所有实例属性，无论它是否可枚举，都可以使用Object.getOwnPropertyNames()方法。

#### 原型的动态性
由于在原型中查找值的过程是一次搜索，因此我们对原型对象所做的任何修改都能够立即从实例上反映出来——即使是先创建了实例后修改原型也照样如此

#### 原型模式的缺点
原型模式的最大问题是由其共享的本性所导致的。
原型中所有属性是被很多实例共享的，这种共享对于函数非常合适。对于那些包含基本值的属性倒也说得过去，毕竟，通过在实例上添加一个同名属性，可以隐藏原型中的对应属性。然而，对于包含引用类型值的属性来说，问题就比较突出了。
```js
function Person(){};
Person.prototype = {
    name: "wyz",
    age: 21,
    friends: ["cl", "gtl"],
    sayHi: function(){alert(this.name);}
}
var p1 = new Person();
p1.friends.push("jiege");
var p2 = new Person();
alert(p2.friends); // "cl", "glt", "jiege"
```

### 组合使用构造函数模式和原型模式
创建自定义类型的最常见方式，就是组合使用构造函数模式与原型模式。构造函数模式用于定义实例属性，而原型模式用于定义方法和共享的属性。
这样，每个实例都会有自己的一份实例属性的副本，但同时又共享着对方法的引用，最大限度地节省了内存。另外，这种混成模式还支持向构造函数传递参数；可谓是集两种模式之长。:clap:

```js
function Person(name, age)
{
    this.name = name;
    this.age = age;
}

Person.prototype = {
    constructor: Person,
    sayHi: function() {
        alert(this.name);
    }
}

var p1 = new Person("wyz", 21);
var p2 = new Person("gtl", 22);
```

### 动态原型模式
```js
function Person(name, age)
{
    this.name = name;
    this.age = age;

    if (typeof this.sayHi != "function")
    {
        Person.prototype.sayHi = function(){alert("says Hi")};
    }
    ...
}

var p1 = new Person("wyz", 21);
var p2 = new Person("gtl", 22);
```
if语句检查的可以是初始化之后应该存在的任何属性或方法——不必用一大堆if语句检查每个属性和每个方法；只要检查其中一个即可。

### 寄生构造函数
这种模式的基本思想是创建一个函数，该函数的作用仅仅是封装创建对象的代码，然后再返回新创建的对象
```js
function Person(name, age)
{
    var o = new Object(); // 得到扩充版Object对象(或Array对象等)
    o.name = name;
    o.age = age;
    o.sayHi = function(){alert("says Hi")};
    return o;
}

var p1 = new Person("wyz", 21);
var p2 = new Person("gtl", 22);
```
除了使用new操作符并把使用的包装函数叫做构造函数之外，这个模式跟工厂模式其实是一模一样的。

这个模式可以在特殊的情况下用来为对象创建构造函数。假设我们想创建一个具有额外方法的特殊数组。由于不能直接修改Array构造函数，因此可以使用这个模式。

关于寄生构造函数模式，有一点需要说明：首先，返回的对象与构造函数或者与构造函数的原型属性之间没有关系；也就是说，构造函数返回的对象与在构造函数外部创建的对象没有什么不同。为此，不能依赖instanceof操作符来确定对象类型。

### 稳妥构造函数模式
所谓稳妥对象，指的是没有公共属性，而且其方法也不引用this的对象。稳妥对象最适合在一些安全的环境中（这些环境中会禁止使用this和new），或者在防止数据被其他应用程序（如Mashup程序）改动时使用。与寄生构造函数模式类似，区别在于实例不用new操作符构造(因此方法不引用this对象)，而且只定义方法，不定义属性。
```js
function Person(name, age)
{
    var o = new Object();
    // 这里可以定义私有变量和函数。私有变量很安全，只有私有函数能访问。
    o.sayHi = function(){alert(name)};
    return o;
}

var p1 = Person("wyz", 21);
```
变量p1中保存的是一个稳妥对象，而除了调用sayHi()方法外，没有别的方式可以访问其数据成员。即使有其他代码会给这个对象添加方法或数据成员，但也不可能有别的办法访问传入到构造函数中的原始数据。

与寄生构造函数模式类似，使用稳妥构造函数模式创建的对象与构造函数之间也没有什么关系，因此instanceof操作符对这种对象也没有意义。

## 继承

### 原型链
ECMAScript中描述了原型链的概念，并将原型链作为实现继承的主要方法。其基本思想是利用原型让一个引用类型继承另一个引用类型的属性和方法。
基本模式如下
```js{8}
function BaseClass(){this.baseProp = "base";}
BaseClass.prototype.baseFunc = function(){
    return this.baseProp;
};

function DerivedClass(){this.derivedProp = "derived";};
// 继承了BaseClass
DerivedClass.prototype = new BaseClass(); // 替换原型必须在添加方法前，否则白加。
DerivedClass.prototype.derivedFunc = function(){
    return this.derivedProp;
};

var instance = new DerivedClass();
console.log(instance.baseFunc()); // "base"
```
本例的原型链大概长这样:laughing:
instance.\_\_proto\_\_-->DerivedClass.prototype(即new BaseClass())-->BaseClass.prototype-->Object.prototype

原型链的第一个问题来自包含引用类型值的原型。包含引用类型值的原型属性会被所有实例共享；而这也正是为什么要在构造函数中，而不是在原型对象中定义属性的原因。

原型链的第二个问题是：在创建子类型的实例时，不能向超类型的构造函数中传递参数。实际上，应该说是没有办法在不影响所有对象实例的情况下，给超类型的构造函数传递参数。

### 借用构造函数(constructor stealing)
这种技术的基本思想相当简单，即在子类型构造函数的内部调用超类型构造函数。
```js{7}
function Base(){
    this.colors = ["red", "green", "blue"];
};

function Derived(){
    // 继承。用 apply(this)也行
    Base.call(this);
};
var instance1 = new Derived();
instance1.colors.push("black");
console.log(instance1.colors);// 多一个 "black"
var instance2 = new Derived();
console.log(instance1.colors);
```
这样一来，就会在新SubType对象上执行SuperType()函数中定义的所有对象初始化代码。结果，SubType的每个实例就都会具有自己的colors属性的副本了。

相对于原型链而言，借用构造函数有一个很大的优势，即可以在子类型构造函数中向超类型构造函数传递参数。
```js{7}
function Base(name){
    this.name = name;
};

function Derived(){
    // 继承。用 apply(this)也行
    Base.call(this, "wyz");
    this.age = age;
};
```
这还不够。

### 组合继承
```js
function Base(name){
    this.name = name;
    this.colors = ["red", "green", "blue"];
};
Base.prototype.sayHi = function(){alert(this.name);};

function Derived(name, age){
    // 继承属性
    Base.call(this, name);
    this.age = age;
};
// 继承方法
Derived.prototype = new Base();
Derived.prototype.constructor = Derived;
// 子类定义新方法
Derived.prototype.printAge = function(){
    console.log(this.age;);
};
```
使用借用构造函数继承属性，使用原型链继承方法。:clap::clap::clap:

### 原型式继承
```js
function object(o)
{
    function F(){};
    F.prototype = o;
    return new F();
}
```
在object()函数内部，先创建了一个临时性的构造函数，然后将传入的对象作为这个构造函数的原型，最后返回了这个临时类型的一个新实例。从本质上讲，object()对传入其中的对象执行了一次浅复制。
克罗克福德主张的这种原型式继承，要求你必须有一个对象可以作为另一个对象的基础。如果有这么一个对象的话，可以把它传递给object()函数，然后再根据具体需求对得到的对象加以修改即可。

ECMAScript 5通过新增Object.create()方法规范化了原型式继承。这个方法接收两个参数：一个用作新对象原型的对象和（可选的）一个为新对象定义额外属性的对象。在传入一个参数的情况下，Object.create()与object()方法的行为相同。

在只想**让一个对象与另一个对象保持类似**的情况下，原型式继承是完全可以胜任的。不过别忘了，包含引用类型值的属性始终都会共享相应的值，就像使用原型模式一样。

### 寄生式继承
```js
function another(original)
{
    clone = object(original);
    clone.sayHi = function(){alert("Hi")};
    return clone;
}
```
another() 返回的对象原型是original，并添加了额外的sayHi()函数。其实就是把添加函数的行为硬编码到函数中去了。

在主要考虑对象而不是自定义类型和构造函数的情况下，寄生式继承也是一种有用的模式。前面示范继承模式时使用的object()函数不是必需的；任何能够返回新对象的函数都适用于此模式。

使用寄生式继承来为对象添加函数，会由于不能做到函数复用而降低效率；这一点与构造函数模式类似。

### 寄生组合式继承
前面说过，组合继承是JavaScript最常用的继承模式；不过，它也有自己的不足。**组合继承最大的问题就是无论什么情况下，都会调用两次超类型构造函数**：一次是在创建子类型原型的时候，另一次是在子类型构造函数内部。没错，子类型最终会包含超类型对象的全部实例属性，但我们不得不在调用子类型构造函数时重写这些属性

好在我们已经找到了解决这个问题方法——寄生组合式继承。所谓寄生组合式继承，即通过借用构造函数来继承属性，通过原型链的混成形式来继承方法。其背后的基本思路是：不必为了指定子类型的原型而调用超类型的构造函数，我们所需要的无非就是超类型原型的一个副本而已。本质上，就是使用寄生式继承来继承超类型的原型，然后再将结果指定给子类型的原型。寄生组合式继承的基本模式如下所示。

```js
function inheritPrototype(Derived, Base){
    var prototype = object(Base.prototype);    // 创建对象
    prototype.constructor = Derived; //增强对象
    Derived.prototype = prototype;   // 指定对象
};
```
应用方法
```js{12}
function Base(name){
    this.name = name;
    this.colors = ["red", "green", "blue"];
};
Base.prototype.sayHi = function(){alert(this.name);};

function Derived(name, age){
    Base.call(this, name);
    this.age = age;
};
// 继承方法
inheritPrototype(Derived, Base); // 这里省了一个 new Base()
// 子类定义新方法
Derived.prototype.printAge = function(){
    console.log(this.age;);
};

console.log(Derived.prototype.__proto__ == Base.prototype)// true
```
这个例子的高效率体现在它只调用了一次SuperType构造函数，并且因此避免了在SubType.prototype上面创建不必要的、多余的属性。与此同时，原型链还能保持不变；因此，还能够正常使用instanceof和isPrototypeOf()。开发人员普遍认为寄生组合式继承是引用类型最理想的继承范式。