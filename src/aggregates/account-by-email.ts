import { Option, Some } from 'funfix';
import {
  EventStore,
  PgQuery,
  Aggregate,
  isEvent,
  Event,
  EventContext,
} from '@repositive/event-store';
import {
  isAccountCreated,
  AccountCreated,
} from '../../events';
import { AccountId } from '..';

const onAccountCreated = async (
  _acc: Option<AccountId>,
  event: Event<AccountCreated, EventContext<any>>,
): Promise<Option<AccountId>> => {
  const { user_id } = event.data;

  return Some(user_id);
};

export function prepareAccountByEmail(
  store: EventStore<PgQuery>,
): Aggregate<[string], AccountId> {
  return store.createAggregate(
    'AccountByEmail',
    {
      text: `select * from events where data->>'email' = $1`,
    },
    [
      [isEvent(isAccountCreated), onAccountCreated],
    ],
  );
}
