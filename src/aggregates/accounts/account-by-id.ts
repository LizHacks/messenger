import { Option, Some } from 'funfix';
import * as R from 'ramda';
import {
  EventStore,
  PgQuery,
  Aggregate,
  isEvent,
  Event,
  EventContext,
} from '@repositive/event-store';
import { AccountId } from './types';
import {
  isAccountCreated,
  isAccountUpdated,
  isAvatarEdited,
  isAccountInviteToOrgAccepted,
  isSuperAdminGranted,
  isSuperAdminRevoked,
  SuperAdminGranted,
  SuperAdminRevoked,
  AccountCreated,
  AvatarEdited,
  AccountUpdated,
  AccountInviteToOrgAccepted,
} from '../../events';

const onAccountCreated = async (
  _acc: Option<any>,
  event: Event<AccountCreated, EventContext<any>>,
): Promise<Option<any>> => {
  const { name, email, user_id } = event.data;
  const { time: created_at } = event.context;

  return Some({
    name,
    email,
    user_id,
    is_super_admin: false,
    created_at,
    updated_at: created_at,
  });
};

// AccountUpdated is only a delta, so some fields can be undefined. This handler needs some magic
// to only add defined values to the reduction.
const onAccountUpdated = async (
  acc: Option<any>,
  event: Event<AccountUpdated, EventContext<any>>,
): Promise<Option<any>> => {
  const {
    name,
    bio,
    interests,
    location,
    work_organisation,
    work_role,
  } = event.data;
  const { time: updated_at } = event.context;

  const fields = {
    name,
    bio,
    interests,
    location,
    work_organisation,
    work_role,
  };

  // Remove undefined values
  const populatedFields = (Object as any).entries(fields)
    .filter(([key, value]: [string, any]) => !R.isNil(value))
    .reduce((a: any, [key, value]: [string, any]) => {
      return {
        ...a,
        [key]: value,
      };
    }, {});

  console.log({onAccountUpdated: acc});

  return Some({
    ...acc.get(),
    ...populatedFields,
    updated_at,
  });
};

const onAvatarEdited = async (
  acc: Option<any>,
  event: Event<AvatarEdited, EventContext<any>>,
): Promise<Option<any>> => {
  const { avatar } = event.data;

  return Some({
    ...acc.get(),
    avatar,
  });
};

const onAccountInviteToOrgAccepted = async (
  acc: Option<any>,
  event: Event<AccountInviteToOrgAccepted, EventContext<any>>,
): Promise<Option<any>> => {
  const { organisation_id, organisation_type } = event.data;

  return acc.map((profile) => {
    return {
      ...profile,
      organisation_id,
      organisation_type,
    };
  });
};

const onSuperAdminGranted = async (
  acc: Option<any>,
  _event: Event<SuperAdminGranted, EventContext<any>>,
): Promise<Option<any>> => {
  return acc.map((profile) => {
    return {
      ...profile,
      is_super_admin: true,
    };
  });
};

const onSuperAdminRevoked = async (
  acc: Option<any>,
  _event: Event<SuperAdminRevoked, EventContext<any>>,
): Promise<Option<any>> => {
  return acc.map((profile) => {
    return {
      ...profile,
      is_super_admin: false,
    };
  });
};

export function prepareAccountById(
  store: EventStore<PgQuery>,
): Aggregate<[AccountId], any> {
  return store.createAggregate(
    'AccountById',
    {
      text: `select * from events where data->>'user_id' = $1`,
    },
    [
      [isEvent(isAccountCreated), onAccountCreated],
      [isEvent(isAccountUpdated), onAccountUpdated],
      [isEvent(isAvatarEdited), onAvatarEdited],
      [isEvent(isAccountInviteToOrgAccepted), onAccountInviteToOrgAccepted],
      [isEvent(isSuperAdminGranted), onSuperAdminGranted],
      [isEvent(isSuperAdminRevoked), onSuperAdminRevoked],
    ],
  );
}
