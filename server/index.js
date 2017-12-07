import Koa from 'koa';
import Router from 'koa-better-router';
import staticServer from 'koa-static-server';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { match, RouterContext } from 'react-router'
import { Provider } from 'react-redux';

import { createAppRoutes, createAppStore } from '../dist_server/index.ssr';

const app = new Koa();
const router = Router().loadMethods();
const { renderToString } = ReactDOMServer;
const ROOT_PATH = path.resolve(__dirname, '../dist/');

router.get('*', async (ctx, next) => {
  // create a new store everytime for not sharing the same store among different users
  const store = createAppStore();
  const props = await new Promise((resolve) => {
    match({ routes: createAppRoutes(store), location: ctx.req.url }, (err, redirect, props) => {
      resolve(props);
    })
  });

  if (props) {
    try {
      const { getData } = props.routes[1];
      const $ = cheerio.load(fs.readFileSync(path.resolve(ROOT_PATH, 'index.html')));
      let initState = {}

      // get initState
      if (typeof getData === 'function') {
        await Promise.all(getData());
        initState = store.getState();
      }

      const appHtml = renderToString(
        <Provider store={ store }>
          <RouterContext {...props}/>
        </Provider>
      );
      $('#app').html(appHtml);
      $('head').append(`<script>window.SERVER_INIT_STATE=${JSON.stringify(initState)}</script>`);

      return ctx.body = $.html();
    } catch(e) {
      console.error(' ---- server render error !! ----');
      console.error(e);
    }
  }
  // other middles will still run without 'next()'
  // return next();
});

//router
app.use(router.middleware());

// determine to run staticServer or not
app.use(function (ctx, next) {
  if (ctx.body) {
    return true;
  }
  return next();
});

// static server
app.use(staticServer({
  rootDir: ROOT_PATH
}));

app.listen(1207, _ => {
  console.log('---- start server at: http://localhost:1207/ ----');
});
