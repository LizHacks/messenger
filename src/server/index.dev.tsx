import { addHook } from 'pirates';

// Convert image file imports into empty strings
addHook(
  (code: string, filename: string) => '',
  { exts: [ '.jpg', '.jpeg', '.png', '.gif', '.png' ], matcher: () => true },
);

import * as Koa from 'koa';
import * as webpack from 'webpack';
import * as devMiddleware from 'webpack-dev-middleware';
import * as koaWebpack from 'koa-webpack';
import * as Webpack from 'webpack';

import logger from './logger';
import { init } from './app';

const app = new Koa();

const webpackConfig = require('../../webpack.config.js');

const compiler = Webpack(webpackConfig);

const port = parseInt(process.env.PORT || '7175', 10);

koaWebpack({
  compiler,
  devMiddleware: {
    serverSideRender: true,
    publicPath: '/assets/',
  },
  hotClient: {
    port: port + 1
  }
}).then((middleware: any) => {
  app.use(middleware);

  init(app);

  logger.info('serverStarted', { port });

  app.listen(port);
});
