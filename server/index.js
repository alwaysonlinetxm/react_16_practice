const Koa = require("koa");
const app = new Koa();
const router = require('koa-better-router')().loadMethods();
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
// const Promise = require("bluebird");
const serve = require('koa-static-server');
// const readFileAsync = Promise.promisify(fs.readFile);
const RES_PATH = path.resolve(__dirname, '../dist/');
// const axios = require("axios");

//////////////////////////////////////////////////////

// const React = require("react");
import React from 'react';
const ReactDOMServer = require("react-dom/server");
const { renderToString } = ReactDOMServer;


const reactRouter = require('react-router');
import { createAppRoutes, createAppStore } from '../dist_server/index.ssr';
import { Provider } from 'react-redux';

const { match, RouterContext } = reactRouter;


/**
 * 读取HTML模版，返回cheerio实例
 * @param path
 * @return {Promise.<*>}
 */
 function loadHTMLTemplate(path) {
    try {
        let content = fs.readFileSync(path);
        return cheerio.load(content);

    } catch (e) {
        console.error(e);
        return false;
    }
}

router.get('*', async (ctx, next) => {
  // create a new store everytime for not sharing the same store among different users
  const store = createAppStore();
  const props = await new Promise((resolve) => {
    match({ routes: createAppRoutes(store), location: ctx.req.url }, (err, redirect, props) => {
      resolve(props);
    })
  });

  // console.log(props);

  if (props) {
    const { getData } = props.routes[1];
    const $ = loadHTMLTemplate(path.resolve(RES_PATH, 'index.html'));
    let initState = {}

    // get initState
    if (typeof getData === 'function') {
      await Promise.all(getData());
      initState = store.getState();
    }

    console.log('-----', initState)

    const appHtml = renderToString(
      <Provider store={ store }>
        <RouterContext {...props}/>
      </Provider>
    );
    $('#app').html(appHtml);
    $('head').append(`<script>window.SERVER_INIT_STATE=${JSON.stringify(initState)}</script>`);

    return ctx.body = $.html();
  }
});

//router
app.use(router.middleware());

//router
app.use(function (ctx, next) {

    //如果路由中间件已经有数据了，无需再走静态文件中间件了
    if (ctx.body) {
        return true;
    }

    return next();
});

app.use(serve({rootDir: RES_PATH}));

app.listen(8088, _ => {
    console.log('server started... http://localhost:8088/')
});
