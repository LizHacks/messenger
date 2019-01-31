import { Option } from 'funfix';
import * as T from 'io-ts';
import { createEvent } from '@repositive/event-store';

import { Conversation, MessageDetail } from '../../../types';
import { MessageSent } from '../../../events';
import { InternalState } from '../.';
import { Message } from '../../../aggregates/messages/messages-by-thread-id';

const payloadRunntime = T.interface({
});

export default async (ctx: any) => {
  // TODO: Be a lot stricter with types!!
  try {
    ctx.body = await send_message(ctx.request.body, ctx.state.auth.user_id, ctx.state.global);
  } catch (e) {
    ctx.throw(500, "INTERNAL ERROR");
  }
};

const send_message = async (payload: any, user_id: string, state: InternalState) => {
  // Validate the incoming payload...
  console.log(payload);

  const event_payload = {
    from: user_id,
    thread_id: payload.thread_id,
    message_text: payload.message_text,
  };

  await state.store.save(
    createEvent<MessageSent>(
      'messaging',
      'MessageSent',
      payload,
    ),
  );

  return JSON.stringify({ok: true});
};

//  from: AccountId;
//  thread_id: ThreadId;
//  message_text: string;
