import test from 'ava';
import { prepareAccountById } from './account-by-id';
import { ProfileDetail } from '../../openapi';
import {
  cafebabe as user_id,
  cafed00d as avatar_id,
  nowIsh,
  nowIshPlus10Minutes,
  aggregateResultFromEvents,
} from '../../test-helpers';
import { AccountCreated, AccountUpdated, AvatarEdited, SuperAdminGranted, SuperAdminRevoked } from '../../events';
import {
  createEvent,
  createContext,
} from '@repositive/event-store';

test('Get created account by ID', async (t) => {
  const result = await aggregateResultFromEvents<ProfileDetail>(
    [
      createEvent<AccountCreated>(
        'accounts',
        'AccountCreated',
        {
          user_id,
          email: 'foo@bar.com',
          name: 'Foo Bar',
          password: 'encrypted garbage',
        },
        createContext({}, undefined, () => nowIsh),
      ),
    ],
    prepareAccountById,
    user_id,
  );

  const expected: ProfileDetail = {
    user_id,
    email: 'foo@bar.com',
    name: 'Foo Bar',
    is_super_admin: false,
    created_at: nowIsh,
    updated_at: nowIsh,
  };

  t.deepEqual(result, expected);

  // Extra check to ensure the password is never exposed
  t.falsy((result as any).password);
});

test('Updated account', async (t) => {
  const result = await aggregateResultFromEvents<ProfileDetail>(
    [
      createEvent<AccountCreated>(
        'accounts',
        'AccountCreated',
        {
          user_id,
          email: 'foo@bar.com',
          name: 'Foo Bar',
          password: 'encrypted garbage',
        },
        createContext({}, undefined, () => nowIsh),
      ),
      createEvent<AccountUpdated>(
        'accounts',
        'AccountUpdated',
        {
          user_id,
          name: 'Bar Baz',
          bio: 'Bio stuph',
          interests: ['shooting hoops', 'b-ball'],
          location: 'London',
          work_organisation: 'NFL is the basketball one right?',
          work_role: 'hoop polisher',
        },
        createContext({}, undefined, () => nowIshPlus10Minutes),
      ),
    ],
    prepareAccountById,
    user_id,
  );

  const expected: ProfileDetail = {
    user_id,
    email: 'foo@bar.com',
    name: 'Bar Baz',
    bio: 'Bio stuph',
    interests: ['shooting hoops', 'b-ball'],
    location: 'London',
    work_organisation: 'NFL is the basketball one right?',
    work_role: 'hoop polisher',
    is_super_admin: false,
    created_at: nowIsh,
    updated_at: nowIshPlus10Minutes,
  };

  t.deepEqual(result, expected);

  // Extra check to ensure the password is never exposed
  t.falsy((result as any).password);
});

test('Avatar edited', async (t) => {
  const result = await aggregateResultFromEvents<ProfileDetail>(
    [
      createEvent<AccountCreated>(
        'accounts',
        'AccountCreated',
        {
          user_id,
          email: 'foo@bar.com',
          name: 'Foo Bar',
          password: 'encrypted garbage',
        },
        createContext({}, undefined, () => nowIsh),
      ),
      createEvent<AvatarEdited>(
        'accounts',
        'AvatarEdited',
        {
          user_id,
          avatar_id,
          avatar: 'beans.jpeg',
        },
        createContext({}, undefined, () => nowIshPlus10Minutes),
      ),
    ],
    prepareAccountById,
    user_id,
  );

  const expected: ProfileDetail = {
    user_id,
    email: 'foo@bar.com',
    name: 'Foo Bar',
    avatar: 'beans.jpeg',
    is_super_admin: false,
    created_at: nowIsh,
    // Avatar updates don't count as profile updates
    updated_at: nowIsh,
  };

  t.deepEqual(result, expected);

  // Extra check to ensure the password is never exposed
  t.falsy((result as any).password);
});

test('Updated account with delta events', async (t) => {
  const result = await aggregateResultFromEvents<ProfileDetail>(
    [
      createEvent<AccountCreated>(
        'accounts',
        'AccountCreated',
        {
          user_id,
          email: 'foo@bar.com',
          name: 'Foo Bar',
          password: 'encrypted garbage',
        },
        createContext({}, undefined, () => nowIsh),
      ),
      createEvent<AccountUpdated>(
        'accounts',
        'AccountUpdated',
        {
          user_id,
          name: 'Bar Baz',
          bio: 'Bio stuph',
          interests: ['shooting hoops', 'b-ball'],
          location: 'London',
          work_organisation: 'NFL is the basketball one right?',
          work_role: 'hoop polisher',
        },
        createContext({}, undefined, () => nowIshPlus10Minutes),
      ),
      createEvent<AccountUpdated>(
        'accounts',
        'AccountUpdated',
        {
          user_id,
          location: 'Cologne',
          work_role: 'hoop straightener',
        },
        createContext({}, undefined, () => nowIshPlus10Minutes),
      ),
    ],
    prepareAccountById,
    user_id,
  );

  const expected: ProfileDetail = {
    user_id,
    email: 'foo@bar.com',
    name: 'Bar Baz',
    bio: 'Bio stuph',
    interests: ['shooting hoops', 'b-ball'],
    location: 'Cologne',
    work_organisation: 'NFL is the basketball one right?',
    work_role: 'hoop straightener',
    is_super_admin: false,
    created_at: nowIsh,
    updated_at: nowIshPlus10Minutes,
  };

  t.deepEqual(result, expected);

  // Extra check to ensure the password is never exposed
  t.falsy((result as any).password);
});

test('Grants super admin', async (t) => {
  const result = await aggregateResultFromEvents<ProfileDetail>(
    [
      createEvent<AccountCreated>(
        'accounts',
        'AccountCreated',
        {
          user_id,
          email: 'foo@bar.com',
          name: 'Foo Bar',
          password: 'encrypted garbage',
        },
        createContext({}, undefined, () => nowIsh),
      ),
      createEvent<SuperAdminGranted>(
        'accounts',
        'SuperAdminGranted',
        { user_id },
        createContext({}, undefined, () => nowIshPlus10Minutes),
      ),
    ],
    prepareAccountById,
    user_id,
  );

  const expected: ProfileDetail = {
    user_id,
    email: 'foo@bar.com',
    name: 'Foo Bar',
    is_super_admin: true,
    created_at: nowIsh,
    updated_at: nowIsh, // Super admin does not modify the update time of the profile
  };

  t.deepEqual(result, expected);

});

test('Revokes super admin', async (t) => {
  const result = await aggregateResultFromEvents<ProfileDetail>(
    [
      createEvent<AccountCreated>(
        'accounts',
        'AccountCreated',
        {
          user_id,
          email: 'foo@bar.com',
          name: 'Foo Bar',
          password: 'encrypted garbage',
        },
        createContext({}, undefined, () => nowIsh),
      ),
      createEvent<SuperAdminGranted>(
        'accounts',
        'SuperAdminGranted',
        { user_id },
        createContext({}, undefined, () => nowIsh),
      ),

      createEvent<SuperAdminRevoked>(
        'accounts',
        'SuperAdminRevoked',
        { user_id },
        createContext({}, undefined, () => nowIshPlus10Minutes),
      ),
    ],
    prepareAccountById,
    user_id,
  );

  const expected: ProfileDetail = {
    user_id,
    email: 'foo@bar.com',
    name: 'Foo Bar',
    is_super_admin: false,
    created_at: nowIsh,
    updated_at: nowIsh, // Super admin does not modify the update time of the profile
  };

  t.deepEqual(result, expected);

});
