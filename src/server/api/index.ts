import * as Koa from 'koa';
import * as mount from 'koa-mount';
import * as jwt from 'jsonwebtoken';
import { Option } from 'funfix';

const api = new Koa();

api.use(async (ctx: any, next: any) => {
  // Decode JWT tokens and stuff
  // Do we need to do anything else?
  // Possibly get the authorisation from the query string?
  const auth_token = Option.of(ctx.request.get("Authorization"));
  try {
    const verified = jwt.verify(auth_token.get().split(' ')[1], "super_secret_jam");
    ctx.state.auth = verified;
    await next();
  } catch (e) {
    ctx.throw(401, "UNAUTHORIZED");
  }
});

api.use(mount('/get-conversations', async (ctx: any) => {
  ctx.body = "get-conversations" + ctx.state.auth.name;
}));

export default api;
