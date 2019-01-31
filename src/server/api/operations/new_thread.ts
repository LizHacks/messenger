import { Option } from 'funfix';
import * as T from 'io-ts';
import { createEvent } from '@repositive/event-store';
import { v4 } from 'uuid';

import { Conversation, MessageDetail } from '../../../types';
import { ThreadCreated } from '../../../events';
import { InternalState } from '../.';
import { Message } from '../../../aggregates/messages/messages-by-thread-id';

const payloadRuntime = T.type({
  topic: T.string,
  members: T.array(T.string),
});

export type CreateThreadCmd = T.TypeOf<typeof payloadRuntime>;

export default async (ctx: any) => {
  try {
    await payloadRuntime.decode(ctx.request.body)
      .map(async (payload) => {
        ctx.body = await create_thread(ctx.request.body, ctx.state);
      }).getOrElseL(() => ctx.throw(400, "INVALID PAYLOAD"));
  } catch (e) {
    ctx.throw(500, "INTERNAL ERROR");
  }
};

const create_thread = async (
  payload: CreateThreadCmd,
  {global: state, auth}: {global: InternalState, auth: any},
) => {
  console.log("topic", payload);

  const event_payload = {
    topic: payload.topic,
    members: [auth.user_id, ...payload.members],
    thread_id: v4(),
  };

  await state.store.save(
    createEvent<ThreadCreated>(
      'messaging',
      'ThreadCreated',
      event_payload,
    ),
  );

  return JSON.stringify({ok: true});
};
