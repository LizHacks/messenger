import * as React from 'react';
import * as Koa from 'koa';
import * as ReactDOMServer from 'react-dom/server';
import * as mount from 'koa-mount';
import * as serve from 'koa-static';
import logger from './logger';
import { StaticRouter } from 'react-router';

import api from './api';

import App from '../App';
import Container from './Container';
import { createStore } from '../store';

export function init(app: any) {
  const store = createStore();

  app.use(mount('/api', api));
  app.use(mount('/assets', serve('./dist/assets')));

  app.use(async (ctx: any) => {
    ctx.body = ReactDOMServer.renderToString(
      <StaticRouter location={ctx.request.url} context={{}}>
        <Container>
          <App store={store} />
        </Container>
      </StaticRouter>,
    );
  });
}
