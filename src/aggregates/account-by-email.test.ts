import test from 'ava';
import { prepareAccountByEmail } from './account-by-email';
import {
  cafebabe as user_id,
  nowIsh,
  aggregateResultFromEvents,
} from '../../test-helpers';
import { AccountCreated } from '../../events';
import {
  createEvent,
  createContext,
} from '@repositive/event-store';

test('Account by email address', async (t) => {
  const email = 'foo@bar.com';

  const result = await aggregateResultFromEvents<string>(
    [
      createEvent<AccountCreated>(
        'accounts',
        'AccountCreated',
        {
          user_id,
          email,
          name: 'Foo Bar',
          password: 'encrypted garbage',
        },
        createContext({}, undefined, () => nowIsh),
      ),
    ],
    prepareAccountByEmail,
    user_id,
  );

  t.deepEqual(result, user_id);
});
