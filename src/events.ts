import { EventData } from '@repositive/event-store';
import { Uuid } from './utils/types';
import { OrganisationType } from './aggregates/organisations';

export interface PasswordChanged extends EventData {
  type: 'accounts.PasswordChanged';
  event_type: 'PasswordChanged';
  event_namespace: 'accounts';
  user_id: AccountId;
  password: string;
}

export interface PasswordResetRequested extends EventData {
  type: 'accounts.PasswordResetRequested';
  event_type: 'PasswordResetRequested';
  event_namespace: 'accounts';
  email: string;
  user_id: AccountId;
}

export interface AvatarEdited extends EventData {
  type: 'accounts.AvatarEdited';
  event_type: 'AvatarEdited';
  event_namespace: 'accounts';
  user_id: AccountId;
  avatar: string;
  avatar_id: Uuid;
}

export interface AccountInviteToOrgAccepted extends EventData {
  type: 'organisations.AccountInviteToOrgAccepted';
  event_type: 'AccountInviteToOrgAccepted';
  event_namespace: 'organisations';
  user_id: AccountId;
  name: string;
  email: string;
  organisation_id: string;
  organisation_type: OrganisationType;
  membership_role: string;
  invite_token: string;
}

export interface AccountInviteToOrgRevoked extends EventData {
  type: 'organisations.AccountInviteToOrgRevoked';
  event_type: 'AccountInviteToOrgRevoked';
  event_namespace: 'organisations';
  user_id: AccountId;
  organisation_id: string;
  organisation_type: OrganisationType;
  invite_token: string;
}

export interface AccountInvitedToOrg extends EventData {
  type: 'organisations.AccountInvitedToOrg';
  event_type: 'AccountInvitedToOrg';
  event_namespace: 'organisations';
  name: string;
  email: string;
  membership_role: string;
  organisation_id: string;
  organisation_type: OrganisationType;
  invite_token: string;
  organisation_email?: string;
}

export interface MembershipEdited extends EventData {
  type: 'organisations.MembershipEdited';
  event_type: 'MembershipEdited';
  event_namespace: 'organisations';
  organisation_id: string;
  user_id: AccountId;
  membership_role: string;
}

export interface AccountOrganisationEmailUpdated extends EventData {
  type: 'organisations.AccountOrganisationEmailUpdated';
  event_type: 'AccountOrganisationEmailUpdated';
  event_namespace: 'organisations';
  organisation_email: string;
  invite_token: string;
  user_id: AccountId;
}

export interface UserLoggedIn extends EventData {
  type: 'accounts.UserLoggedIn';
  event_type: 'UserLoggedIn';
  event_namespace: 'accounts';
  user_id: AccountId;
}

export interface SuperAdminGranted extends EventData {
  type: 'accounts.SuperAdminGranted';
  event_type: 'SuperAdminGranted';
  event_namespace: 'accounts';
  user_id: AccountId;
}

export function isSuperAdminGranted(o: any): o is SuperAdminGranted {
  return o && o.type === 'accounts.SuperAdminGranted';
}

export interface SuperAdminRevoked extends EventData {
  type: 'accounts.SuperAdminRevoked';
  event_type: 'SuperAdminRevoked';
  event_namespace: 'accounts';
  user_id: AccountId;
}

export function isSuperAdminRevoked(o: any): o is SuperAdminRevoked {
  return o && o.type === 'accounts.SuperAdminRevoked';
}

export function isPasswordChanged(o: any): o is PasswordChanged {
  return o && o.type === 'accounts.PasswordChanged';
}

export function isAvatarEdited(o: any): o is AvatarEdited {
  return o && o.type === 'accounts.AvatarEdited';
}

export function isAccountInviteToOrgAccepted(o: any): o is AccountInviteToOrgAccepted {
  return o && o.type === 'organisations.AccountInviteToOrgAccepted';
}

export function isAccountInviteToOrgRevoked(o: any): o is AccountInviteToOrgRevoked {
  return o && o.type === 'organisations.AccountInviteToOrgRevoked';
}

export function isAccountInvitedToOrg(o: any): o is AccountInvitedToOrg {
  return o && o.type === 'organisations.AccountInvitedToOrg';
}

export function isMembershipEdited(o: any): o is MembershipEdited {
  return o && o.type === 'organisations.MembershipEdited';
}

export function isAccountOrganisationEmailUpdated(o: any): o is AccountOrganisationEmailUpdated {
  return o && o.type === 'organisations.AccountOrganisationEmailUpdated';
}

export function isUserLoggedIn(o: any): o is UserLoggedIn {
  return o && o.type === 'accounts.UserLoggedIn';
}

export function hasInviteToken(
  o: any,
): o is AccountInvitedToOrg |
  AccountInviteToOrgAccepted |
  AccountInviteToOrgRevoked |
  AccountOrganisationEmailUpdated {
  return o && (
    isAccountInvitedToOrg(o) ||
    isAccountInviteToOrgAccepted(o) ||
    isAccountInviteToOrgRevoked(o) ||
    isAccountOrganisationEmailUpdated(o));
}

export interface AccountCreated extends EventData {
  type: 'accounts.AccountCreated';
  event_type: 'AccountCreated';
  event_namespace: 'accounts';
  name: string;
  email: string;
  user_id: string;
  password: string;
}

export interface AccountUpdated extends EventData {
  type: 'accounts.AccountUpdated';
  event_type: 'AccountUpdated';
  event_namespace: 'accounts';
  user_id: string;
  name?: string;
  bio?: string;
  interests?: string[];
  location?: string;
  work_organisation?: string;
  work_role?: string;
}

interface OrganisationCommon {
  organisation_id: Uuid;
  organisation_type: OrganisationType;
  name: string;
  platform_name: string | null;
  logo: string | null;
  location: {
    country: string | null;
    city: string | null;
    post_code: string | null;
    street_address: string | null;
  };
  contact_details: {
    name: string | null;
    role: string | null;
    landline: string | null;
    mobile: string | null;
    email: string | null;
  };
  bio: string | null;
  working_practices: string[];
  services_offered: string[];
  accreditations: string[];
  visible_accreditations: boolean;
}

export interface OrganisationCreated extends EventData, OrganisationCommon {
  type: 'organisations.OrganisationCreated';
  event_type: 'OrganisationCreated';
  event_namespace: 'organisations';
}

export interface OrganisationUpdated extends EventData, OrganisationCommon {
  type: 'organisations.OrganisationUpdated';
  event_type: 'OrganisationUpdated';
  event_namespace: 'organisations';
}

export type AccountId = Uuid;
export type ThreadId = Uuid;

export interface ThreadCreated  extends EventData {
  type: 'messaging.ThreadCreated';
  event_namespace: 'messaging';
  members: AccountId[];
  topic: string;
  thread_id: ThreadId;
}

export interface ThreadUpdated extends EventData {
  type: 'messaging.ThreadUpdated';
  event_type: 'ThreadUpdated';
  event_namespace: 'messaging';
  members: AccountId[];
  thread_id: ThreadId;
  topic: string;
}

export interface MessageSent extends EventData {
  type: 'messaging.MessageSent';
  event_type: 'MessageSent';
  event_namespace: 'messaging';
  from: AccountId;
  thread_id: ThreadId;
  message_text: string;
}

export function isThreadCreated(o: any): o is ThreadCreated {
  return o && o.type === 'messaging.ThreadCreated';
}
export function isThreadUpdated(o: any): o is ThreadUpdated {
  return o && o.type === 'messaging.ThreadUpdated';
}
export function isMessageSent(o: any): o is MessageSent {
  return o && o.type === 'messaging.MessageSent';
}

export function isAccountCreated(o: any): o is AccountCreated {
  return o && o.type === 'accounts.AccountCreated';
}
export function isAccountUpdated(o: any): o is AccountUpdated {
  return o && o.type === 'accounts.AccountUpdated';
}

export function isOrganisationCreated(o: any): o is OrganisationCreated {
  return o && o.type === 'organisations.OrganisationCreated';
}
export function isOrganisationUpdated(o: any): o is OrganisationUpdated {
  return o && o.type === 'organisations.OrganisationUpdated';
}
