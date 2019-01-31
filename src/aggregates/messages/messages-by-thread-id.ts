// TODO: Get messages by thread ID
import { Aggregate, Event, isEvent, EventStore, PgQuery } from '@repositive/event-store';
import {
  isMessageSent,
  MessageSent,
} from '../../events';
import { Option, Some } from 'funfix';

export interface Message {
  thread_id: string;
  message: string;
  from: string;
  time: string;
}

async function onMessageSent(
  acc: Option<Message[]>,
  event: Event<MessageSent, any>,
): Promise<Option<Message[]>> {
  return Some([
    ...acc.getOrElse([]),
    {
      thread_id: event.data.thread_id,
      message: event.data.message_text,
      from: event.data.from,
      time: event.context.time,
    },
  ]);
}

export function prepareMessagesByThread(
  store: EventStore<PgQuery>,
): Aggregate<[string], Message[]> {
  return store.createAggregate(
    'MessagesInThread',
    {
      text: `
        -- messages by thread_id
        select * from events where data->>'thread_id' = $1
      `,
    },
    [
      [isEvent(isMessageSent), onMessageSent],
    ],
  );
}
