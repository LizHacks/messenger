import { Option, Some } from 'funfix';
import { EventStore, PgQuery, Aggregate, isEvent, Event } from '@repositive/event-store';
import {
  isOrganisationCreated,
  OrganisationCreated,
  isOrganisationUpdated,
  OrganisationUpdated
} from '../../events';
import { Organisation } from './types';

export * from './types';

async function onOrganisationCreated(
  _acc: Option<Organisation>,
  event: Event<OrganisationCreated, any>
): Promise<Option<Organisation>> {
  const {
    organisation_id,
    name,
    platform_name,
    logo,
    location,
    contact_details,
    visible_accreditations,
    working_practices,
    services_offered,
    accreditations,
    organisation_type,
    bio
  } = event.data;

  return Some({
    organisation_id,
    organisation_type,
    type: organisation_type,
    name,
    platform_name,
    logo,
    location,
    contact_details,
    visible_accreditations,
    working_practices,
    services_offered,
    accreditations,
    bio,
    // DEPRECATED: Superceded by `organisation_id`
    id: organisation_id
  });
}

async function onOrganisationUpdated(
  acc: Option<Organisation>,
  event: Event<OrganisationUpdated, any>
): Promise<Option<Organisation>> {
  const {
    name,
    platform_name,
    logo,
    location,
    contact_details,
    visible_accreditations,
    working_practices,
    services_offered,
    accreditations,
    organisation_type,
    bio
  } = event.data;

  const updated: Organisation = {
    ...acc.get(),
    name,
    platform_name,
    logo,
    location,
    contact_details,
    visible_accreditations,
    working_practices,
    services_offered,
    accreditations,
    organisation_type,
    type: organisation_type,
    bio
  };

  return Some(updated)
}

export function prepareOrganisationById(
  store: EventStore<PgQuery>,
): Aggregate<[string], Organisation> {
  return store.createAggregate(
    'Organisation',
    {
      text: `
      -- Organisation by ID
      select * from events where data->>'organisation_id' = $1`
    },
    [
      [isEvent(isOrganisationCreated), onOrganisationCreated],
      [isEvent(isOrganisationUpdated), onOrganisationUpdated]
    ]
  );
}
