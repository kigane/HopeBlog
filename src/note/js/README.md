---
title: JS 小知识
lang: zh-CN
sidebarDepth: 2
---

## 箭头函数
类似 lambda 表达式。
```js
(params)=>{
    // body...
}
```
需要注意的是，箭头函数没有 this, 如果在箭头函数内使用了 this，会导致 this 作为变量一直向上级词法作用域查找，直至找到为止。这经常会导致错误。

## 提升(Hoisting)
JavaScript引擎的工作方式是，先解析代码，获取所有被声明的变量，然后再一行一行地运行。这造成的结果，就是所有的变量的声明语句，都会被提升到代码的头部，这就叫做变量提升（hoisting）。函数声明也一样。类似 C++ 中 static 的工作方式。

## in
* 在单独使用时，in操作符会在通过对象能够访问给定属性时返回true，无论该属性存在于实例中还是原型中
* 在使用for-in循环时，返回的是所有能够通过对象访问的、可枚举的（enumerated）属性，其中既包括存在于实例中的属性，也包括存在于原型中的属性。屏蔽了原型中不可枚举属性（即将`[[Enumerable]]`标记为false的属性）的实例属性也会在for-in循环中返回，因为根据规定，所有开发人员定义的属性都是可枚举的。

## exports&module.exports
模块是自包含的功能单元，可以在项目中共享和重复使用。
由于JavaScript最初没有模块的概念，随着时间的推移出现了各种竞争格式。Node.js中使用的是CommonJS格式。其他格式([可以参考这里](https://www.jvandemo.com/a-10-minute-primer-to-javascript-modules-module-formats-module-loaders-and-module-bundlers/))。

Node.js 内置了许多模块，例如
```js
const fs = require('fs');
const folderPath = './';

fs.readdir(folderPath, (err, files) => {
    files.forEach(file => {
        console.log(file);
    });
});
```
更多[可以参考这里](https://www.w3schools.com/nodejs/ref_modules.asp)

### 创建和导出模块
```js
// in ./user.js
const getName = () => {
  return 'Zrt';
};

exports.getName = getName;

// in ./index.js
const user = require('./user'); // .js 很显然，可以省略
console.log(`User: ${user.getName()}`); // User: Zrt
```

### 导出多个方法和值
```js
// in ./user.js
const getName = () => {
  return 'Zrt';
};

const getLocation = () => {
  return 'dzxx';
};

const dateOfBirth = '9.9.1999';

exports.getName = getName;
exports.getLocation = getLocation;
exports.dob = dateOfBirth;

// in ./index.js
const user = require('./user'); // .js 很显然，可以省略
console.log(
  `${user.getName()} lives in ${user.getLocation()} and was born on ${user.dob}.`
);
```

### 语法变体
```js
// ./user.js
exports.getName = () => {
  return 'Jim';
};

exports.getLocation = () => {
  return 'Munich';
};

exports.dob = '12.01.1982';

// ./index.js
// ES6 语法 Destructuring Assignment
const { getName, dob } = require('./user'); 
console.log(
  `${getName()} was born on ${dob}.`
);
```

### 导出默认值
如果一个模块只想导出一个东西，module.exports更常用。
```js
// ./user.js
class User {
  constructor(name, age, email) {
    this.name = name;
    this.age = age;
    this.email = email;
  }

  getUserStats() {
    return `
      Name: ${this.name}
      Age: ${this.age}
      Email: ${this.email}
    `;
  }
}

module.exports = User;

// ./index.js
const User = require('./user');
const jim = new User('Jim', 37, 'jim@example.com');

console.log(jim.getUserStats());
```

### console.log(module)
console.log(module);结果可以看到，exports属性。
```js
Module {
  id: '.',
  path: 'f:\\workspace\\MyBlogs\\docs\\guide',
  exports: {},
  parent: null,
  filename: 'f:\\workspace\\MyBlogs\\docs\\guide\\index.js',
  loaded: false,
  children: [
    Module {
      id: 'f:\\workspace\\MyBlogs\\docs\\guide\\test.js',
      path: 'f:\\workspace\\MyBlogs\\docs\\guide',
      exports: [Object],
      parent: [Circular],
      filename: 'f:\\workspace\\MyBlogs\\docs\\guide\\test.js',
      loaded: true,
      children: [],
      paths: [Array]
    }
  ],
  paths: [
    'f:\\workspace\\MyBlogs\\docs\\guide\\node_modules',
    'f:\\workspace\\MyBlogs\\docs\\node_modules',
    'f:\\workspace\\MyBlogs\\node_modules',
    'f:\\workspace\\node_modules',
    'f:\\node_modules'
  ]
}
```

## 三个点(`...`)
js中的`...`有两种意思。  
在函数参数列表中--剩余参数
```js
function myFunc(x, y, ...args)
{
  console.log(x);
  console.log(y);
  console.log(args);
}

myFunc(1, 2, 3, 4, 5, 7); // output: 1, 2, [3, 4, 5, 6]
```

spread operator -- 展开操作符  
展开可迭代对象的元素
```js
const featured = ['Deep Dish', 'Pepperoni', 'Hawaiian'];
const specialty = ['Meatzza', 'Spicy Mama', 'Margherita'];

const pizzas = [...featured, 'veg pizza', ...specialty];

console.log(pizzas); // 'Deep Dish', 'Pepperoni', 'Hawaiian', 'veg pizza', 'Meatzza', 'Spicy Mama', 'Margherita'

var obj1 = { foo: 'bar', x: 42 };
var obj2 = { foo: 'baz', y: 13 };

var clonedObj = { ...obj1 };
// Object { foo: "bar", x: 42 }

var mergedObj = { ...obj1, ...obj2 };
// Object { foo: "baz", x: 42, y: 13 }
```

## caller & callee
* JS中函数是对象，函数名是指针，函数参数用arguments数组保存。 
* arguments.callee是一个指向拥有该arguments对象的函数的指针。通常用于解耦函数和函数名。
* functionName.caller中保存着调用当前函数的函数的引用，如果是在全局作用域中调用，则为null。

## apply & call & bind & this
* this引用的是函数执行时的环境对象(全局对象window，或某个函数对象)。使用var声明的变量会被添加到最近的环境中。不加var声明的变量会被添加到全局环境中。
* apply和call可以用于传递参数，可以固定部分参数。但真正强大的地方是能通**第一个参数**修改this对象绑定，扩充函数的作用域，这种扩充作用域的方式，不需要对象和方法有任何耦合关系。
* bind会创建一个函数实例，其this值会被绑定到传给bind的参数。
```js
// 传参数
function sum(num1, num2) {
    return num1 + num2;
}

function callSum1(num1, num2) {
    return sum.apply(this, arguments)
}

function callSum2(num1) {
    return sum.apply(this, [num1, 5])
}

function callSum3(num1, num2) {
    return sum.call(this, num1, num2)
}

var bindSum = sum.bind(this);
```

修改绑定
```js
var o = { color: 'blue' }
var color = 'red'

function sayColor(){
  alert(this.color) // red
}

var objColor = sayColor.bind(o)
objColor() // blue

sayColor.apply(o) // blue
sayColor.call(o) // blue
```

## 正则
语法如下
```js
var text = "mom and dad and baby"
var pattern = /mom( and dad( and baby)?)?/gi  // /pattern/flags。产生一个RegEx对象。
var matches = pattern.exec(text) // pattern.exec(text) === text.match(pattern)
console.log(matches.index) // 匹配项位置：0
console.log(matches.input) // 输入字符串：mom and dad and baby
console.log(matches[0]) // 模式匹配到的子串
console.log(matches[1]) // 捕获组1 (捕获组，即正则中括号内的部分，如果没匹配上，则为undefined)
console.log(matches[2]) // 捕获组2 
// 如果没有捕获组，则matches只有第一项
```

## JSON
* JSON.stringify(obj, filter, indentOption):把JavaScript对象序列化为JSON字符串。只有数据，不包括方法。
  * filter可以是数组，包含要序列化的属性，不再其内的属性序列化时被忽略。
  * filter也可以是函数`function(key, value) {}`，将在每个键值对上调用。通常会用一个switch语句来分别决定如何处理不同的属性。函数的返回值为序列化时使用的value值。
  * indentOption指定json文件的缩进格式(数字表示以几个空格为缩进)。
* JSON.parse(jsonText, filter):把JSON字符串解析为原生JavaScript值。

假设把一个对象传入JSON.stringify()，序列化该对象的顺序如下
1. 如果对象存在toJSON()方法而且能通过它取得有效的值，则调用该方法。否则，返回对象本身。
2. 如果提供了第二个参数，应用这个函数过滤器。传入函数过滤器的值第(1)步返回的值。
3. 对第(2)步返回的每个值进行相应的序列化。
4. 如果提供了第三个参数，执行相应的格式化。

## Proxy对象
可以创建另一个对象的代理。拦截并重新定义对象的基础操作，如读写。使用方法和对象一样。
两个参数
* target: 目标对象
* handler: 一个对象，定义哪些操作会被拦截，如何重定义被拦截的操作。

PS:Reflect对象可用于指定对象原来的操作。

### 基础示例1
```js
const target = {
  message1: "hello",
  message2: "everyone"
};

const handler = {
  get: function(target, prop, receiver) {
    // prop：正要get的属性， receiver：代理对象或继承自代理的对象
    return "world";
  }
}; // 这样设置handler之后，无论获取什么属性，都只会返回"world"

const proxy = new Proxy(target, handler);
```

### 基础示例2
```js
const target = {
  message1: "hello",
  message2: "everyone"
};

const handler = {
  get: function (target, prop, receiver) {
    if (prop === "message2") { // 只特殊处理message2属性
      return "world";
    }
    return Reflect.get(...arguments); // 其他属性按原对象来
  },
};

const proxy = new Proxy(target, handler);

console.log(proxy.message1); // hello
console.log(proxy.message2); // world
```

### 数组示例
```js
let products = new Proxy([
  { name: 'Firefox', type: 'browser' },
  { name: 'SeaMonkey', type: 'browser' },
  { name: 'Thunderbird', type: 'mailer' }
],
{
  get: function(obj, prop) {
    // The default behavior to return the value; prop is usually an integer
    if (prop in obj) {
      return obj[prop]; // products[0]
    }

    // Get the number of products; an alias of products.length
    if (prop === 'number') {
      return obj.length; // products.number
    }

    let result, types = {};

    for (let product of obj) { // products[name]
      if (product.name === prop) {
        result = product;
      }
      if (types[product.type]) { // 根据type分类
        types[product.type].push(product);
      } else {
        types[product.type] = [product];
      }
    }

    // Get a product by name
    if (result) {
      return result;
    }

    // Get products by type
    if (prop in types) {
      return types[prop];
    }

    // Get product types
    if (prop === 'types') {
      return Object.keys(types);
    }

    return undefined;
  }
});

console.log(products[0]);          // { name: 'Firefox', type: 'browser' }
console.log(products.number);      // 3
console.log(products['Firefox']);  // { name: 'Firefox', type: 'browser' }
console.log(products['Chrome']);   // undefined
console.log(products.browser);     // [{ name: 'Firefox', type: 'browser' }, { name: 'SeaMonkey', type: 'browser' }]
console.log(products.types);       // ['browser', 'mailer']
```
