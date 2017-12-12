# react_isomorph_practice
A practice of react isomorph (with redux and react-router v3).

## Introduction

一个集成了react、redux、react-router(v3)的同构SPA demo。server端实现了对不同路由页的同构渲染。

## Run

```
yarn install
```

to generate both client and server bundle files

```
yarn build
```

to start server

```
yarn watch
```

## 难点说明

整个实现的难点在于，作为一个SPA应用，并且各个路由又是异步加载的，如何在server端正确渲染带有数据的制定路由页。具体实现不多做赘述，查看代码可知。这里简单提下几个重要的点。

- server端使用react-router提供的`match`和`RouterContext`方法进行路由匹配及渲染(详情点此[https://github.com/ReactTraining/react-router/blob/v3/docs/guides/ServerRendering.md])；
- 在server端渲染时，使用异步路由中配置的getData方法来获取当前请求的由页所需的数据(参考来源点此[https://zhuanlan.zhihu.com/p/30580569])；
- 双端动态创建store和routes，以保证在双端异步加载router、reducer、saga时能与正确的store相关联(详见路由创建部分的代码，目的是在每次server端渲染时，能有一个独立的干净的store，而不会被多个请求共享)；
