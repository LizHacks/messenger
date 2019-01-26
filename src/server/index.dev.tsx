import * as React from 'react';
import * as Koa from 'koa';
import * as ReactDOMServer from 'react-dom/server';
import * as assets from 'koa-static-cache';
import * as webpack from 'webpack';
import * as devMiddleware from 'webpack-dev-middleware';
import * as koaWebpack from 'koa-webpack';
import logger from './logger';
import * as Webpack from 'webpack';
import { StaticRouter } from 'react-router';

const webpackConfig = require('../../webpack.config.js');

import app from './app';
import App from '../App';
import Container from './Container';
import { createStore } from '../store';

const compiler = Webpack(webpackConfig);

const store = createStore();

const port = process.env.PORT || 7175;

koaWebpack({
  compiler,
  devMiddleware: {
    serverSideRender: true,
    publicPath: '/assets/'
  }
}).then((middleware: any) => {
  app.use(middleware);

  logger.info('serverStarted', { port });

  app.listen(port);
});
