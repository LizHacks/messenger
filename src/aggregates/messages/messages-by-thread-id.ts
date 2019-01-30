// TODO: Get messages by thread ID
import { Aggregate, Event, isEvent, EventStore, PgQuery } from '@repositive/event-store';
import {
  isMessageSent,
  MessageSent,
} from '../../events';
import { Option, Some } from 'funfix';

async function onMessageSent(
  acc: Option<any[]>,
  event: Event<MessageSent, any>,
): Promise<Option<any[]>> {
  return Some([
    ...acc.getOrElse([]),
    {
      message: event.data.message_text,
      to: event.data.to,
      from: event.data.from,
    },
  ]);
}

export function prepareMessagesByThread(
  store: EventStore<PgQuery>,
): Aggregate<[string], any[]> {
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
