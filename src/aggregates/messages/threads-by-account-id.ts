import {Option, Some} from 'funfix';
import { EventStore, PgQuery, Aggregate, isEvent, Event } from '@repositive/event-store';
import {
  isThreadCreated,
  isThreadUpdated,
  ThreadCreated,
  ThreadUpdated,
} from '../../events';
import { Conversation } from '../../types';

export interface ThreadInformation {
  members: string[];
  topic: string;
  thread_id: string;
}

export interface AllThreadInformation {[key: string]: ThreadInformation; }

async function onThreadCreated(
  acc: Option<AllThreadInformation>,
  event: Event<ThreadCreated, any>,
): Promise<Option<AllThreadInformation>> {
  return Some({
    ...acc.getOrElse({}),
    [event.data.thread_id]: {
      members: event.data.members,
      topic: event.data.topic,
      thread_id: event.data.thread_id,
    },
  });
}

async function onThreadUpdated(
  acc: Option<AllThreadInformation>,
  event: Event<ThreadUpdated, any>,
): Promise<Option<AllThreadInformation>> {
  return Some({
    ...acc.getOrElse({}),
    [event.data.thread_id]: {
      members: event.data.members,
      topic: event.data.topic,
      thread_id: event.data.thread_id,
    },
  });
}

export function prepareThreadyByAccountId(
  store: EventStore<PgQuery>,
): Aggregate<[string], AllThreadInformation> {
  return store.createAggregate(
    'ThreadMeta',
    {
      text: `
      -- Threads by user id
      select * from events where data->>'members' @> $1
      `,
    },
    [
      [isEvent(isThreadCreated), onThreadCreated],
      [isEvent(isThreadUpdated), onThreadUpdated],
    ],
  );
}
