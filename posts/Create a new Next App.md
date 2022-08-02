---
title: 'Create a new Next App'
date: '2022-08-02'
tags: 'Nextjs'
---

Next.js：React 开发框架

试试 Next.js 吧，这是一个 React 开发框架。Next.js 为上述所有问题提供了解决方案。但更重要的是，它能确保您和您的团队成功地构建 React 应用程序。

Next.js 具有同类框架中最佳的“开发人员体验”和许多内置功能。列举其中一些如下：

* 直观的、 基于页面 的路由系统（并支持 动态路由）
* 预渲染。支持在页面级的 静态生成 (SSG) 和 服务器端渲染 (SSR)
* 自动代码拆分，提升页面加载速度
* 具有经过优化的预取功能的 客户端路由
* 内置 CSS 和 Sass 的支持，并支持任何 CSS-in-JS 库
* 开发环境支持 快速刷新
* 利用 Serverless Functions 及 API 路由 构建 API 功能
* 完全可扩展

### Setup

*`npx create-next-app nextjs-blog --use-npm --example "https://github.com/vercel/next-learn/tree/master/basics/learn-starter"`
*`cd nextjs-blog`
*`npm run dev`


### `Page Componment`

`import Head from 'next/head'`

In Next.js, a page is a React Component exported from a .js, .jsx, .ts, or .tsx file in the pages directory. Each page is associated with a route based on its file name.

Example: If you create pages/about.js that exports a React component like below, it will be accessible at /about.


* pages/index.js is associated with the / route.
* pages/posts/first-post.js is associated with the /posts/first-post route.


`Two forms of Pre-rendering`
Next.js has two forms of pre-rendering: **Static Generation** and **Server-side Rendering**. The difference is in when it generates the HTML for a page.

`Static Generation (Recommended)`: The HTML is generated at build time and will be reused on each request.
`Server-side Rendering`: The HTML is generated on each request.

Importantly, Next.js lets you choose which pre-rendering form you'd like to use for each page. You can create a "hybrid" Next.js app by using Static Generation for most pages and using Server-side Rendering for others.

We recommend using Static Generation over Server-side Rendering for performance reasons. Statically generated pages can be cached by CDN with no extra configuration to boost performance. However, in some cases, Server-side Rendering might be the only option.

You can also use `Client-side Rendering` along with Static Generation or Server-side Rendering. That means some parts of a page can be rendered entirely by client side JavaScript. To learn more, take a look at the Data Fetching documentation.

### `Link Componmnet`

`import Link from 'next/link'`

*使用Link在Next App做頁面導覽會有比用tag a在瀏覽器中導覽較好的效能,, 
*連結到外部還是需要用tag a不能使用Link

	
### `Assets, Metadata, and CSS`
	
1.Assets
	
*next/image is an extension of the HTML img element, evolved for the modern web
*resizing & Optimizing imgae
*optimizes images on-demand, as users request them.
*lazy load by default

```
import Image from 'next/image';

const YourComponent = () => (
  <Image
    src="/images/profile.jpg" // Route of the image file
    height={144} // Desired size with correct aspect ratio
    width={144} // Desired size with correct aspect ratio
    alt="Your Name"
  />
);
```

2.Metadata

*`next/Head`

```
import Head from 'next/head';
<Head>
  <title>Create Next App</title>
  <link rel="icon" href="/favicon.ico" />
</Head>
```

*`next/Script` load 3-party Script
*strategy `lazyload` `onload`

```
import Script from 'next/script';

 <Head>
        <title>First Post</title>
      </Head>
      <Script
        src="https://connect.facebook.net/en_US/sdk.js"
        strategy="lazyOnload"
        onLoad={() =>
          console.log(`script loaded correctly, window.FB has been populated`)
        }
      />
```

3.CSS

```
<style jsx>{`
  …
`}</style>
```


### Layout

`Componets`

*模組化code

Componments/layout
```
export default function Layout({ children }) {
  return <div>{children}</div>;
}
```

*模組化code css

Componmnets/layout.module.css
*add css to componets

```
import styles from './layout.module.css';

export default function Layout({ children }) {
  return <div className={styles.container}>{children}</div>;
}
```

### Global Style

*全域的css

pages/_app.js
```
import '../styles/global.css';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
```

### Pre-rendering

*SSG 

Static Generation is the pre-rendering method that generates the HTML at build time. The pre-rendered HTML is then reused on each request.

![](https://i.imgur.com/XTbCm14.png)


*SSR

Server-side Rendering is the pre-rendering method that generates the HTML on each request.

![](https://i.imgur.com/1MvLsE2.png)


### Fetch Data


*`getSortedPostsData` 讀取資料(檔案, database,...)

lib/post.js
```
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
    };
  });
  // Sort posts by date
  return allPostsData.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
}
```

*fetch data from database

```
import someDatabaseSDK from 'someDatabaseSDK'

const databaseClient = someDatabaseSDK.createClient(...)

export async function getSortedPostsData() {
  // Instead of the file system,
  // fetch post data from a database
  return databaseClient.query('SELECT posts...')
}
```

*SSG 使用 `getStaticProps` fetch Data

```
import { getSortedPostsData } from '../lib/posts';

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}
```

*SSR 使用 `getServerSideProps`

```
export async function getServerSideProps(context) {
  return {
    props: {
      // props for your component
    },
  };
}
```

### Dynamic Routes

*dynamic pages depand on external data

![](https://i.imgur.com/I7k1cj7.png)


![](https://i.imgur.com/DDXrTDC.png)


post/[id].js



### Render Markdown

`npm install remark remark-html`