---
title: Hello Vuepress
---

## 遇到的问题
在根目录的readme中设置footer内容时使用双引号，会出现YAML Exception。项目无法正常编译。

## math
安装 markdown-it-katex 插件
```shell
yarn add markdown-it-katex -D
```
再设置
```js
// .vuepress/config.js
module.exports = {
  markdown: {
    // 开启代码块行号
    lineNumbers: true,
    // 选择目录层级
    toc: { includeLevel: [1, 2, 3] },
    // 加载插件
    extendMarkdown: md => {
      // use more markdown-it plugins!
      md.use(require('markdown-it-katex'))
    }
  },
  // 要使 markdown-it-katex 插件生效，还需要设置在每个 html 的 <head> 部分，加上一些依赖的引用。
  head: [
    ['link', {
      rel: 'stylesheet',
      href: 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.css'
    }],
    ['link', {
      rel: "stylesheet",
      href: "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.10.0/github-markdown.min.css"
    }],
  ]
}
```

效果如下：  
$\frac 1n = n^2_1$

$$\begin{array}{r}
{\left[\begin{array}{rr}
\cos \phi & \sin \phi \\
-\sin \phi & \cos \phi
\end{array}\right]\left[\begin{array}{cc}
\lambda_{1} & 0 \\
0 & \lambda_{2}
\end{array}\right]\left[\begin{array}{cc}
\cos \phi & -\sin \phi \\
\sin \phi & \cos \phi
\end{array}\right]=}
{\left[\begin{array}{ll}
\lambda_{1} \cos ^{2} \phi+\lambda_{2} \sin ^{2} \phi & \left(\lambda_{2}-\lambda_{1}\right) \cos \phi \sin \phi \\
\left(\lambda_{2}-\lambda_{1}\right) \cos \phi \sin \phi & \lambda_{2} \cos ^{2} \phi+\lambda_{1} \sin ^{2} \phi
\end{array}\right]}
\end{array}$$

## git hub tables

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

## container
::: tip
this is tips
:::

::: warning
this is warning
:::

::: danger STOP
this is danger warning
:::

::: details custom title
more details here
:::

## 语法高亮
代码块内某些行高亮。{}里面行号之间不能有空格。
``` glsl {2,6}
#version 330 core
(layout location = 0) in vec3 a_Pos

void main()
{
    gl_Position = a_Pos;
}
```

## 部署
按文档来，没成功。git push -f xxxxx master 会在github库中新建一个master分支，而且有时候推送失败，原因不明。  
因为我安装了 wsl2，执行bash命令会进入Ubantu18.04，也导致shell脚本出错。  
最终，解决方法如下：

在package.json中添加npm命令，用于执行shell脚本。
```js{4}
"scripts": {
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs",
    "docs:deploy": "deploy.sh"
  },
```

手动clone GithubPage关联库 https://github.com/username/username.github.io.git 到本地，并放在目录project/docs/.vuepress/下。(和生成的dist目录同级)  

deploy.sh内容为
```shell
#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run docs:build

# navigate into the build output directory
cd docs/.vuepress/dist

# 将一个目录下的一些文件移动到另一个目录下
cp -R * ../username.github.io

cd ../username.github.io

git add -A
git commit -m 'deploy'
git push

cd -

# 执行完不立即退出shell，便于查看错误信息。
read -n 1 -p 'Press any key to continue...'
```

deploy.sh 实际上完成了三件事
1. 执行 npm run docs:build 生成要发布的内容。(重复生成时 dist 文件夹会先被清空，再生成新文件。)
2. 将 dist 文件夹中的所有文件都复制到 username.githbu.io 文件夹中
3. 在 username.githbu.io 文件夹中(GithubPage关联的库)，提交修改并推送到远程库

## 全局Computed

因为 ketex 公式分隔符是 'dollar', 和 vue 提供的全局变量前缀冲突了。所以一页只能有一个全局变量保持正常。  
site = {{$site}}