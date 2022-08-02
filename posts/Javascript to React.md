---
title: 'Javascript to React'
date: '2022-08-02'
tags: 'Nextjs'
---

### 1.HTML vs the DOM

HTML 是 page裡面的code, DOM 是由你的code產生更新在page上的內容, Like Generative Art Code都是同一份, 但隨著不同執行產生不一樣的Art Work 這些不同的結果就是 

This is because the HTML represents the initial page content, whereas the DOM represents the updated page content which was changed by the JavaScript code you wrote.

![](https://i.imgur.com/LCRkV9o.png)

`Imperative vs Declarative Programming`

`imperative programming`

```javascript
<script type="text/javascript">
  const app = document.getElementById('app');
  const header = document.createElement('h1');
  const headerContent = document.createTextNode('Develop. Preview. Ship. 🚀');
  header.appendChild(headerContent);
  app.appendChild(header);
</script>
```

`Declarative Programming`

```jsx
<script type="text/jsx">
function Header() {
  return <h1>Develop. Preview. Ship. 🚀</h1>;
}
function HomePage() {
  return <div></div>;
}

ReactDOM.render(<Header />, app);
</script>
```

### 2.Setup

```
<html>
  <body>
    <div id="app"></div>
    <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    <!-- Babel Script -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script type="text/jsx">
      const app = document.getElementById('app');
      ReactDOM.render(<h1>Develop. Preview. Ship. 🚀</h1>, app);
    </script>
  </body>
</html>
```

react script 瀏覽器並不認識 需要指定type="text/jsx" 也需要javascript Compiler Babel.

What is JSX?
JSX is a syntax extension for JavaScript that allows you to describe your UI in a familiar HTML-like syntax. The nice thing about JSX is that apart from following three JSX rules, you don’t need to learn any new symbols or syntax outside of HTML and JavaScript.

Note that browsers don’t understand JSX out of the box, so you’ll need a JavaScript compiler, such as a Babel, to transform your JSX code into regular JavaScript.

### 3.React Core Concepts
There are three core concepts of React that you'll need to be familiar with to start building React applications. These are:

Components
Props
State


### 4.Components

*Header
*Homepage
*Components 字首大寫

```
function Header() {
  return <h1>Develop. Preview. Ship. 🚀</h1>;
}

function HomePage() {
  return (
    <div>
      <Header />
    </div>
  );
}

ReactDOM.render(<HomePage />, app);
```

### 5.Props

*元素的屬性

![](https://i.imgur.com/LQaLGJz.png)

title prop
```
function Header({ title }) {
  return <h1>{title ? title : 'Default title'}</h1>;
}

function Page() {
  return (
    <div>
      <Header title="React 💙" />
      <Header title="A new title" />
    </div>
  );
}
```
透過 array map 到 key prop
```
function HomePage() {
  const names = ['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton'];

  return (
    <div>
      <Header title="Develop. Preview. Ship. 🚀" />
      <ul>
        {names.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 6.State


![](https://i.imgur.com/mmOSbDd.png)

*監聽事件
```
function HomePage() {
  //    ...
  function handleClick() {
    console.log('increment like count');
  }

  return (
    <div>
      {/* ... */}
      <button onClick={handleClick}>Like</button>
    </div>
  );
}
```
*元素綁定
```
function HomePage() {
  // ...
  const [likes, setLikes] = useState()

  function handleClick() {
    setLikes(likes + 1)
  }}

  return (
    <div>
      {/* ... */}
      <button onClick={handleClick}>Likes ({likes})</button>
    </div>
  )
}
```

### React to Next 

*install nodejs
*npm install react react-dom next
*package.json

```
{
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "latest",
    "react": "17.0.2",
    "react-dom": "17.0.2"
  }
}
```

*code

```
import { useState } from 'react';

function Header({ title }) {
  return <h1>{title ? title : 'Default title'}</h1>;
}

export default function HomePage() {
  const names = ['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton'];
  const [likes, setLikes] = useState(0);

  function handleClick() {
    setLikes(likes + 1);
  }

  return (
    <div>
      <Header title="Develop. Preview. Ship. 🚀" />
      <ul>
        {names.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>

      <button onClick={handleClick}>Like ({likes})</button>
    </div>
  );
}
```