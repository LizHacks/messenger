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

import app from './app';

const port = process.env.PORT || 7175;

logger.info('serverStarted', { port });

app.listen(port);
