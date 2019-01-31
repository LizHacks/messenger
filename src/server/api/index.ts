import * as Koa from 'koa';
import * as mount from 'koa-mount';
import * as parseBody from 'co-body';
import * as jwt from 'jsonwebtoken';
import * as config from 'config';
import { Right, Option } from 'funfix';
import logger from '../../utils/logger';
import { Pool } from 'pg';
import {
  createPgStoreAdapter,
  createPgCacheAdapter,
  createAQMPEmitterAdapter,
  EventStore,
  Event,
  EventData,
  EventContext,
} from '@repositive/event-store';
import {
  OrganisationCreated,
  OrganisationUpdated,
  AccountCreated,
  AccountUpdated,
  AvatarEdited,
} from '../../events';

// import handlers
import getConversationsHandler from './operations/get_conversations';
import sendMessage from './operations/send_message';
import newThread from './operations/new_thread';

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
  const emitter = createAQMPEmitterAdapter(config.get('iris'), logger);
  const storeAdapter = createPgStoreAdapter(pg_pool, logger);
  const cache = createPgCacheAdapter(pg_pool, logger);

  const store = new EventStore(storeAdapter, {emitter, cache, logger});

  async function saveEvent(event: Event<EventData, EventContext<any>>): Promise<any> {
    // Handle old-style accounts events
    const context = event.context || { time: (event as any).time, subject: {} };

    const evt = { ...event, context };

    logger.trace('saveEvent', { evt });

    return store.save(evt);
  }

  store.listen<OrganisationCreated>('organisations', 'OrganisationCreated', saveEvent);
  store.listen<OrganisationUpdated>('organisations', 'OrganisationUpdated', saveEvent);
  store.listen<AccountCreated>('accounts', 'AccountCreated', saveEvent);
  store.listen<AvatarEdited>('accounts', 'AvatarEdited', saveEvent);
  // For some reason this breaks the frontend
 //  store.listen<AccountUpdated>('accounts', 'AccountUpdated', saveEvent);

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
  ctx.request.body = await parseBody.json(ctx.req);
  await next();
});
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
    ctx.throw(401, "UNAUTHORIZED");
  }
});

api.use(mount('/get-conversations', getConversationsHandler));
api.use(mount('/send-message', sendMessage));
api.use(mount('/new-thread', newThread));

export default api;
