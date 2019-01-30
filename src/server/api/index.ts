import * as Koa from 'koa';
import * as mount from 'koa-mount';
import * as jwt from 'jsonwebtoken';
import * as config from 'config';
import { Right, Option } from 'funfix';
import { Pool } from 'pg';
import {
  createPgStoreAdapter,
  createPgCacheAdapter,
  createAQMPEmitterAdapter,
  EventStore,
} from '@repositive/event-store';
import {
  OrganisationCreated,
  OrganisationUpdated,
  AccountCreated,
  AccountUpdated,
} from '../../events';

// import handlers
import getConversationsHandler from './operations/get_conversations';

// import aggreates
import { prepareThreadyByAccountId } from '../../aggregates/messages/threads-by-account-id';
import { prepareMessagesByThread } from '../../aggregates/messages/messages-by-thread-id';
import { prepareAccountById } from '../../aggregates/accounts/account-by-id';

const api = new Koa();

// TODO: Aggregates not any!
export interface InternalState {
  store: EventStore<any>;
  aggregates: {
    OrganisationById: any,
    ThreadyByUserId: any,
    AccountById: any,
    MessagesByThread: any,
  };
}

const init = (): InternalState => {
  // create an eventstore
  // subscribe to some shit
  // return a 'state' object to pass around?
  const pg_pool = new Pool(config.get('postgres'));
  const emitter = createAQMPEmitterAdapter(config.get('iris'), console);
  const storeAdapter = createPgStoreAdapter(pg_pool, console);
  const cache = createPgCacheAdapter(pg_pool, console);

  const store = new EventStore(storeAdapter, {emitter, cache, logger: console});

  const store_event = async (ev: any) => Right(undefined);

  store.listen<OrganisationCreated>('organisations', 'OrganisationCreated', store_event);
  store.listen<OrganisationUpdated>('organisations', 'OrganisationUpdated', store_event);
  store.listen<AccountCreated>('accounts', 'AccountCreated', store_event);
  store.listen<AccountUpdated>('accounts', 'AccountUpdated', store_event);

  const OrganisationById = () => undefined;

  const ThreadyByUserId = prepareThreadyByAccountId(store);
  const AccountById = prepareAccountById(store);
  const MessagesByThread = prepareMessagesByThread(store);

  return {
    store,
    aggregates: {
      OrganisationById,
      ThreadyByUserId,
      AccountById,
      MessagesByThread,
    },
  };
};

const global_state: InternalState = init();

// Inject global state to each request
api.use(async (ctx: any, next: any) => {
  ctx.state.global = global_state;
  await next();
});

// Verify the user's authentication
api.use(async (ctx: any, next: any) => {
  const auth_token = Option.of(ctx.request.get("Authorization"));
  try {
    const verified = jwt.verify(auth_token.get().split(' ')[1], "super_secret_jam");
    ctx.state.auth = verified;
    await next();
  } catch (e) {
    console.log(e);
    ctx.throw(401, "UNAUTHORIZED numberwang");
  }
});

api.use(mount('/get-conversations', getConversationsHandler));

api.use(mount('/send-message', async (ctx: any) => {
  // TODO: Use io-ts to validate the type of the payload for this endpoint
  ctx.body = "send-message" + ctx.state.auth.name;
}));

export default api;
