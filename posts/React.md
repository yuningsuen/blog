---
title: "Notes on React"
date: "2023-11-07"
excerpt: ""
tags: ["Notes", "Tech"]
author: "Ed"
---

## Intro

> A JavaScript library for building user interfaces

So it's a front-end framework essentially.

组件化: This is achieved partly through mixing of the different types of files(HTML, CSS, JS).

过去，人们习惯把这三种文件分开写，但 React 的每个组件都由一定数量的这三种代码组成，所以每个组件有自己的 styling 和 functionality。

Re-render: React 通过比较(i.e. diffing)新旧版本的 DOM 树来重新渲染**特定**组件

## JSX

### Principles

By importing React, we can therefore inject plain HTML into a JS file. The principle behind this magic is Babel, which is a JS compiler that converts next-gen JS(say, es6 or JSX) code into old-fashioned and browser-compatible JS that even IE can understand:

```jsx
import React from "react";
import ReactDOM from "react-dom";
//what we really wrote
ReactDOM.render(<h1>Hello World!</h1>, document.getElementById("root"));
//what BABEL converted into
import { jsx as _jsx } from "react/jsx-runtime";
ReactDOM.render(
  /*#__PURE__*/ _jsx("h1", {
    children: "Hello World!",
  }),
  document.getElementById("root")
);
```

减少代码量，更简洁易读。例如，下面两个代码块的作用完全相同：

```jsx
//JSX
ReactDOM.render(<h1>Hello World!</h1>, document.getElementById("root"));
```

```JS
//pure JS
var h1 = document.createElement("h1");
h1.innerHTML = "Hello World!";
document.getElementById("root").appendChild(h1);
```

Furthermore, we can inject **any** JS **expressions** inside the HTML code inside your JS file:

```jsx
const name = "ed";
ReactDOM.render(<h1>Hello {name}!</h1>, document.getElementById("root"));
```

On the contrary, we can't inject JS **statements** into i:

```jsx
const name = 'ed';
ReactDOM.render(<h1>Hello { if(name == 'ed'){name;}else{'no';}}!</h1>, document.getElementById("root"));
```

```js
//expressions
3 + 4;
"Hello" + "World";
myFunc();
true;
```

```js
//statements
var x = 5;
if (x > 0) {
  x -= 1;
}
for (var i = 0; i < 5; i++) {
  x += 1;
}
function myFunc() {
  return x;
}
```

```jsx
export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

### Attributes

Attributes from HTML are without doubt viable in JSX, except that they have to be turned from all-lower-case into camel-case:

```jsx
ReactDOM.render(
  <h1 contentEditable="true">Hi!</h1>,
  document.getElementById("root")
);
```

While in plain vanilla HTML you should code like `<h1 contenteditable="true">Hi!</h1>`

Notice this subtle difference.

And plus, `class` attribute in HTML is `className` in JSX.

### Styling

2 ways to style:

1. using a separate CSS file
2. inline styling

In most cases, you should use the first measure, which is also recommended by React.

However, there're some situations that inline styling is the better solution. E.g. when the styles are supposed to change for some reason:

```jsx
const customStyle = {
  color: "red",
  fontSize: "20px",
  border: "1px solid black",
};
//for whatever reason:
customStyle.color = "blue";
ReactDOM.render(
  <h1 style={customStyle}>Hello World!</h1>,
  document.getElementById("root")
);
```

Note that for inline styling, you should turn all the kebab-cased keys like `font-size` in CSS into camel-case like `fontSize`. And wrap all the values like `1px solid black` with quotation marks in order to turn them into strings, like `'1px solid black'`. Plus you're supposed to pass a JS object to `style={}`, which is required by JSX.

## Components

- If it represents an obvious "chunk" of your app, it's probably a component
- If it gets reused often, it's probably a component.

Use pascal case for the naming of components, like `HeadBar`. This allows React to differentiate between the custom components that we're building and the HTML elements that we're trying to get hold of that exists in the DOM.

The ES6 **import-export** functionality allows components to be viable between files.

### Controlled vs. uncontrolled component

> A component is “controlled” when the important information in it is driven by props rather than its own local state.

> Uncontrolled components are easier to use within their parents because they require less configuration. But they’re less flexible when you want to coordinate them together. Controlled components are maximally flexible, but they require the parent components to fully configure them with props.

- controlled: driven by props
- uncontrolled: driven by state

```jsx
// uncontrolled components
import { useState } from "react";

export default function SyncedInputs() {
  return (
    <>
      <Input label="First input" />
      <Input label="Second input" />
    </>
  );
}

function Input({ label }) {
  const [text, setText] = useState("");
  function handleChange(e) {
    setText(e.target.value);
  }
  return (
    <label>
      {label} <input value={text} onChange={handleChange} />
    </label>
  );
}
```

```jsx
// controlled components
import { useState } from "react";

export default function SyncedInputs() {
  const [text, setText] = useState("");
  return (
    <>
      <Input
        label="First input"
        text={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
      <Input
        label="Second input"
        text={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
    </>
  );
}

function Input({ label, text, onChange }) {
  return (
    <label>
      {label} <input value={text} onChange={onChange} />
    </label>
  );
}
```

### From uncontrolled to controlled

"Lifting state up":

1. Remove state from the child components
2. Add state to the common parent
3. Allow child to change the state by [passing an event handler down as a prop](https://react.dev/learn/responding-to-events#passing-event-handlers-as-props)

## State

### Hooks

Hooks can only be used in functional components, not applicable to class components.

Never access an event in `setState`s, because React events are synthetic, which means they are pooled and will be recycled at some point. And `setState`s are asynchronous, which may cause the reference of already recycled/invalid events.

```jsx
//good!
function handleChange(event) {
  const { value, name } = event.target;
  setFullName((prevValue) => {
    if (name === "fName") {
      return {
        fName: value,
        lName: prevValue.lName,
      };
    } else if (name === "lName") {
      return {
        fName: prevValue.fName,
        lName: value,
      };
    }
  });
}
```

```jsx
//bad! but still may work
function handleChange(event) {
  // const { value, name } = event.target;
  setFullName((prevValue) => {
    if (event.target.name === "fName") {
      return {
        fName: event.target.value,
        lName: prevValue.lName,
      };
    } else if (event.target.name === "lName") {
      return {
        fName: prevValue.fName,
        lName: event.target.value,
      };
    }
  });
}
```

## References

> **你应该传递不同的 key 给任何使用迭代方式渲染的东西**

[Airbnb JS Style Guide](https://github.com/airbnb/javascript)

[Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react)

## Props

```jsx
function App() {
  return (
    <div>
      <Header egProp="test" />
    </div>
  );
}
```

Props in components are just like props in functions.

However, you cannot use HTML attributes in components:

```jsx
function App() {
  return (
    <div>
      <Header id="header" /> // React will just regard this as a prop
    </div>
  );
}
```
