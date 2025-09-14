---
title: "Notes on JavaScript"
date: "2023-08-10"
excerpt: ""
tags: ["Notes", "Tech"]
author: "Ed"
---

## Intro

JavaScript 是轻量级解释型语言。浏览器接受到 JavaScript 代码，并以代码自身的文本格式运行它。技术上，几乎所有 JavaScript 转换器都运用了一种叫做**即时编译**（just-in-time compiling）的技术；当 JavaScript 源代码被执行时，它会被编译成二进制的格式，使代码运行速度更快。尽管如此，JavaScript 仍然是一门解释型语言，因为编译过程发生在代码运行中，而非之前。

---

## Where to

### Internal

Scripts can be placed in the `<body>`, or in the `<head>` section of an HTML page, or in both.

But placing scripts at the bottom of the `<body>` element improves the display speed, because script interpretation slows down the display:

```HTML
<script>
  document.addEventListener("DOMContentLoaded", () => {
    //code here...
  });
</script>
```

`DOMContentLoaded` here is an event listener, which listens for the browser's `DOMContentLoaded` event, which signifies that the HTML body is completely loaded and parsed. The JavaScript inside this block will not run until after that event is fired.

### External

Scripts can also be placed in external files:

```HTML
<script src="myScript.js" defer></script>
```

`defer` here is an attribute that can be added to the `<script>` tag. It indicates that the script should be executed after the HTML content is parsed. This can help improve page loading performance because it allows the HTML to be rendered before executing the JavaScript. This is especially useful for scripts that interact with the DOM (Document Object Model).

External scripts cannot contain `<script>` tags.

Placing scripts in external files has some advantages:

- It separates HTML and code
- It makes HTML and JavaScript easier to read and maintain
- Cached JavaScript files can speed up page loads

### Script loading strategies

In the external case, we did not need to use the `DOMContentLoaded` event because the `defer` attribute solved the problem for us. We didn't use the `defer` solution for the internal JavaScript example because `defer` only works for external scripts.

An old-fashioned solution to this problem used to be to put your script element right at the bottom of the body (e.g. just before the `</body>` tag), so that it would load after all the HTML has been parsed. The problem with this solution is that loading/parsing of the script is completely blocked until the HTML DOM has been loaded. On larger sites with lots of JavaScript, this can cause a major performance issue, slowing down your site.

There are actually two modern features we can use to bypass the problem of the blocking script — `async` and `defer`:

![[asyncdefer.svg]]

- `async` and `defer` both instruct the browser to download the script(s) in a separate thread, while the rest of the page (the DOM, etc.) is downloading, so the page loading is not blocked during the fetch process.
- scripts with an `async` attribute will execute as soon as the download is complete. This blocks the page and does not guarantee any specific execution order.
- scripts with a `defer` attribute will load in the order they are in and will only execute once everything has finished loading.
- If your scripts should be run immediately and they don't have any dependencies, then use `async`.
- If your scripts need to wait for parsing and depend on other scripts and/or the DOM being in place (e.g. they modify one or more elements on the page), load them using `defer` and put their corresponding `<script>` elements in the order you want the browser to execute them.

#### takeaway

不同于 JS，CSS 应该尽可能被放置在 HTML 的开头，例如 `<title>` 下方。否则 viewers 会观察到网页样式变化的过程，which is not good.

### Seperation of concerns

Changing styles directly via JS (e.g. `btn.style.color="red"`) is not the best practice. Instead, you should keep all the style settings in CSS, and change/toggle them via `classList` in JS.

```JS
document.querySelect("button").classList.add("invisible");
```

```CSS
.invisible {
	visibility: hidden;
}
```

This practice makes it a lot easier for you to debug. Behaviors are JS's job, while CSS holds responsibility for styles.

### Output

JavaScript can "display" data in different ways:

- Writing into an HTML element, using `innerHTML`.
  - The common way.
- Writing into the HTML output using `document.write()`.
  - Using after an HTML document is loaded, will delete all existing HTML.
  - Should only be used for testing.
- Writing into an alert box, using `window.alert()`.
  - The `window` keyword can be skipped since in JS the `window` object is of global scope.
- Writing into the browser console, using `console.log()`.
  - For debugging purposes.

JavaScript does not have any print object or print methods.

You cannot access output devices from JavaScript.

The only exception is that you can call the `window.print()` method in the browser to print the content of the current window.

## Syntax

### Statements

A **JavaScript program** is a list of programming **statements**.

In HTML, JavaScript programs are executed by the web browser. The statements are executed, one by one, in the same order as they are written.

JavaScript statements are composed of:

- Values
- Operators
- Expressions
  - An expression is a combination of values, variables, and operators, which computes to a value.
- Keywords
- Comments

Semicolons separate JavaScript statements. Add a semicolon at the end of each executable statement. Ending statements with semicolon is not required, but highly recommended.

### Loops

- for
- while
- forEach
- for-of
- map

### Variables

Variables are containers for storing data/values and can be declared in 4 ways:

- Automatically
- Using `var`
  - Function scoped
  - Can be changed in scope
  - Avail bef declared
- Using `let`
  - Block scoped
  - Can be changed in scope
  - Only avail aft declaration
- Using `const`
  - Block scoped
  - Cannot be changed
  - Only avail aft declaration

Facts about const:

- Typically declared with all uppercase letters.
- **Must have a value**. Constants must be initialized, or an error will occur when running code.
- **Reference cannot be changed**. A `const` means the reference is protected from reassignment. The value is not *immutable* though and can change, especially if it's a complex construct like an object.

The `var` keyword should only be used in code written for older browsers. Since it's obsolete.

- Always declare variables
- Always use `const` if the value should not be changed
- Always use `const` if the type should not be changed (Arrays and Objects)
- Only use `let` if you can't use `const`
- Only use `var` if you MUST support old browsers.

If you re-declare a JavaScript variable declared with `var`, it will not lose its value.

You cannot re-declare a variable declared with `let` or `const`.

### Datatypes

JS has 7 basic datatypes and 1 special one, object:

- string
- number
- bigint
- boolean
- undefined
- symbol
- null
- object

#### Strings

There are 2 ways to format strings:

```JS
// Concatenate
str1 + ' ' + str2 + '!'
// Template literals
`${str1} ${str2}!`
// The above 2 lines are equivalent
```

#### Booleans

在  [JavaScript](https://developer.mozilla.org/zh-CN/docs/Glossary/JavaScript)  中，**truthy**（真值）指的是在[布尔值](https://developer.mozilla.org/zh-CN/docs/Glossary/Boolean)上下文中，转换后的值为  `true`  的值。被定义为[假值](https://developer.mozilla.org/zh-CN/docs/Glossary/Falsy)以外的任何值都为真值。（即所有除  `false`、`0`、`-0`、`0n`、`""`、`null`、`undefined`  和  `NaN`  以外的皆为真值）。

如果第一个对象为真值，则[逻辑与运算](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Logical_AND)返回第二个操作数：

```JS
true && "dog"
// returns "dog"

[] && "dog"
// returns "dog"
```

- Equality
  - True if value are the same
  - Implicit datatype conversion when comparing
- Strict equality
  - True only if value and datatype are both the same
  - Use it to avoid potential problems caused by type conversion

```JS
3 == '3';
// returns true, since it converts '3' to 3
3 === '3';
// returns false
```

### Spread

```js
myFunction(a, ...iterableObj, b)
[1, ...iterableObj, '4', 'five', 6]
{ ...obj, key: 'value' }
```

## Objects

### Basics

Comparing two JavaScript objects **always** returns false:

```js
let x = new String("John");
let y = new String("John");
x == y; // false
x === y; // false
```

When object member is a func:

```js
const person = {
  age: 18,
  name: function () {
    //...
  },
  //or
  name() {
    //...
  },
};
```

#### How to initiate an obj with var as key?

```js
// will not work as desired!
var key = "fName";
var contact = {
  key: "Ed", // "key" here will be interpreted as a literal string "key" rather than the above variable `key`
  lName: "Suen",
};
```

What you should do is this:

```js
// before ES6
var key = "fName";
var contact = {};
contact[key] = "Ed";
// after ES6
var contact = {
  [key]: "Ed",
};
```

### Notations

There're 2 kinds of notations to refer to an object field:

- dot notation: `person.age`, `person.name()`
- bracket notation: `person['age']`, `person['name']()`

点表示法通常优于括号表示法，因为它更简洁且更易于阅读。然而，在某些情况下你必须使用括号。例如，如果对象属性名称保存在变量中，则不能使用点表示法访问该值，但可以使用括号表示法访问该值，因为点表示法只能接受字面量的成员的名字，不接受表示名称的变量：

```js
function logProperty(propertyName) {
  console.log(person[propertyName]);
}
logProperty("name"); //returns the func definition
logProperty("age");
//can't use this func to visit a func member:
//logProperty('name')();
//Uncaught TypeError: logProperty(...) is not a function
```

### Prototypes

JavaScript 中所有的对象都有一个内置属性，称为它的  **prototype**（原型）。它本身是一个对象，故原型对象也会有它自己的原型，逐渐构成了**原型链**。原型链终止于拥有  `null`  作为其原型的对象上。

#### 得到 prototype

```js
//.__proto__ attribute
myObject.__proto__; //it's nearly obsolete
//or
Object.getPrototypeOf(myObject);
```

#### 设置 prototype

1. Syntax structure

```js
const o = { a: 1 };
// o ---> Object.prototype ---> null

const b = ["yo", "whadup", "?"];
// 数组继承了 Array.prototype（具有 indexOf、forEach 等方法）
// b ---> Array.prototype ---> Object.prototype ---> null

function f() {
  return 2;
}
// 函数继承了 Function.prototype（具有 call、bind 等方法）
// f ---> Function.prototype ---> Object.prototype ---> null

const p = { b: 2, __proto__: o };
// 可以通过 __proto__ 字面量属性将新创建对象的 [[Prototype]] 指向另一个对象。
// 不要与 Object.prototype.__proto__ 访问器混淆
// p ---> o ---> Object.prototype ---> null
```

2. Object.create() method

```js
//not the best practice!
derived.prototype = Object.create(base.prototype);
derived.prototype.constructor = derived;
```

然而，因为这会重新为  `prototype`  属性赋值并删除  `constructor`  属性（所以以上代码中我们要重新指定 constructor），所以更容易出错，而且如果构造函数还没有创建任何实例，性能提升可能并不明显。

3. Object.setPrototypeOf()

JS 所有函数都有一个名为`prototype`的属性。当调用一个函数作为构造函数时，这个属性被设置为新构造对象的原型（按照惯例，在名为  `__proto__`  的属性中）。

```js
//bad performance
function base(paras) = {
	//...
};
function derived(paras) {
	//...
}
Object.setPrototypeOf(derived.prototype, base.prototype);
const instance = new derived(paras);
```

通过构造函数创建的每一个实例都会自动将构造函数的 prototype 属性作为其`[[Prototype]]`。

`consFunc.prototype`  默认具有一个自有属性：`constructor`，它引用了构造函数本身。即，`consFunc.prototype.constructor === consFunc`。这允许我们在任何实例中访问原始构造函数。

4. Implicit setting

```js
//without refering to the prototype directly
function Graph() {
  //...
}
Graph.prototype.someFunc = function (paras) {
  //...
};
const g = new Graph();
```

5. `__proto__`

```js
//bad performance and already obsolete
//so just don't use it
const obj = {};
obj.__proto__ = { prop: "value" };
obj.__proto__.__proto__ = { prop: "value" };
```

7. use class

As below.

#### Notes

原型是用于在实例之间共享方法和属性的，而构造函数本身不直接拥有原型的属性，它们通过原型链继承。

即一条继承链上面只可能有`consFunc.prototype`，而不可能有`consFunc`。

可以认为：`consFunc` 相当于与 `consFunc.prototype` 等价的 class 的构造函数。

JS 是完全动态、完全在执行期间确定的，而且根本没有静态类型。一切都是对象（实例）或函数（构造函数），甚至函数本身也是  `Function`  构造函数的实例。即使是语法结构中的“类”也只是运行时的构造函数。

JavaScript 中的所有构造函数都有一个被称为  `prototype`  的特殊属性，它与  `new`  运算符一起使用。对原型对象的引用被复制到新实例的内部属性  `[[Prototype]]`  中。例如，当你执行  `const a1 = new A()`  时，JavaScript（在内存中创建对象之后，为其定义  `this`  并执行  `A()`  之前）设置  `a1.[[Prototype]] = A.prototype`。然后，当你访问实例的属性时，JavaScript 首先检查它们是否直接存在于该对象上，如果不存在，则在  `[[Prototype]]`  中查找。会递归查询  `[[Prototype]]` ，直至找到或  `Object.getPrototypeOf`  返回  `null`。这意味着在  `prototype`  上定义的所有属性实际上都由所有实例共享，并且甚至可以更改  `prototype`  的部分内容，使得更改被应用到所有现有的实例中。

此外，要注意代码中原型链的长度，在必要时可以将其分解，以避免潜在的性能问题。此外，除非是为了与新的 JavaScript 特性兼容，否则**永远不应**扩展原生原型。

### OOP

Object-Oriented Programming.

Differences between JS and class-based OOP:

1. 在基于类的面向对象编程中，类与对象是两个不同的概念，对象通常是由类创造出来的实例。由此，定义类的方式（定义类的语法）和实例化对象的方式（构造函数）也是不同的。而在 JavaScript 中，我们经常会使用函数或对象字面量创建对象，也就是说，JavaScript 可以在没有特定的类定义的情况下创建对象。相对于基于类的面向对象编程来说，这种方式更为轻量，帮助我们更为方便地使用对象。
2. 在继承方式下，当一个子类完成继承时，由该子类所创建的对象既具有其子类中单独定义的属性，又具有其父类中定义的属性（以及父类的父类，依此类推）。而在原型链中，每一个层级都代表了一个不同的对象，不同的对象之间通过  `__proto__`  属性链接起来。原型链的行为并不太像是继承，而更像是**委派**（delegation）。委派同样是对象中的一种编程模式。当我们要求对象执行某项任务时，在委派模式下，对象可以自己执行该项任务，或者要求另一个对象（委派的对象）以其自己的方式执行这项任务。在许多方面，相对于继承来说，委派可以更为灵活地在许多对象之间建立联系（例如，委派模式可以在程序运行时改变、甚至完全替换委派对象）。

### Class in JS

#### Declaration

```js
class myClass {
  //attributes
  //constructor
  constructor(params) {
    //use 'this' to construct
  }
  //methods
}
```

#### Inheritance

```js
class mySubClass extends myFatherClass {
  //...
  constructor(params) {
    //must use super() first to call father-class constructor
    super(someParams);
  }
}
```

#### Encapsulation

```js
class myClass {
	//private data attributes begin with #
	#attr1;
	#attr2;
	//private methods also begin with #
	#method {
	}
}
```

## Functions

注意：有一类特殊的函数被称作方法（method），如`console.log`。方法和函数的区别在于，方法依附于一个对象上（比如`console`），而函数是自由自在的。但很多开发者也会将这两个术语混用。

Fun fact: a JS function can have 255 parameters at most.

### Function as parameter

1. The normal way

```JS
function displayDone() {
  console.log('3 秒过去了');
}
// 计时器的时间单位是毫秒
setTimeout(displayDone, 3000);
```

2. Anonymous functions

```JS
setTimeout(function() {
  console.log('3 秒过去了');
}, 3000);
```

3. Arrow / Fat arrow functions

The more modern way.

```JS
setTimeout(() => {
  console.log('3 秒过去了');
}, 3000);
```

The diff between arrow functions and traditional ones are not necessarily limited to a more concise appearance. For instance, `this` is static bind when initially created in arrow f's case, while it's dynamic in traditional func.

For an arrow func, the use of curly braces means explicit `return`, while the use of parentheses means implicit `return`:

```js
//equivalent
anArray.map((e) => {
  return e * 2;
});
anArray.map((e) => e * 2);
anArray.map((e) => e * 2);
```

## Events

Approaches to add event handler:

- method: `addEventListener()`
  - the best practice
- attribute: e.g. `onclick`
  - only one handler for one event
- inline: '<button onclick="bgChange()">按下我</button>'
  - never do this

Don't mess HTML with JS.

## Libraries

### jQuery

Just a library to relieve your pressure of having to write burdensome JS codes. A simplification to the syntax.

```JS
// equivalent
document.querySelector("h1").style("color") = "red";
jQuery("h1").css("color", "red");
$("h1").css("color", "red");
```

Always import jQuery before your local JS files, like this:

```HTML
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="index.js"></script>
```

And put them just above `</body>`. The point of doing so is to avoid the execution of JS files before HTML has been loaded, which may cause issues, e.g. invalid execution.

Alternatively, you can put them in `<head>` section:

```HTML
<head>
	<meta charset="uft-8">
	<title>jQuert</title>
	<link rel="stylesheet" href="styles.css">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
	<script src="index.js"></script>
</head>
```

In this case, JS will be executed before HTML is loaded, so the local JS file gotta look like this:

```JS
$(document).ready(() => {
	$("h1").css("color", "red");
});
```

## API

应用程序接口（Application Programming Interface，API）是已经建立好的一套代码组件，可以让开发者实现原本很难甚至无法实现的程序。

API 通常分为两类：

- Browser APIs (core JS language)
  - [`DOM (Document Object Model) API`](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model "DOM (Document Object Model)
  - [`Geolocation API`](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation "Geolocation API")
  - [`Canvas`](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API "Canvas")
  - [`WebGL`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API "WebGL")
  - [Audio and Video APIs](https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery)
- 3rd party APIs
