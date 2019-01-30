import * as R from 'ramda';
import { Option, Some } from 'funfix';
import { EventStore, PgQuery, Aggregate, isEvent, Event } from '@repositive/event-store';

import { isOrganisationCreated, OrganisationCreated } from '../../events';

export * from './types';

export async function onOrganisationCreated(
  acc: Option<string[]>,
  event: Event<OrganisationCreated, any>
): Promise<Option<string[]>> {
  const { organisation_id } = event.data;

  const current: string[] = acc.getOrElse([]);

  return Some(R.uniq(current.concat([ organisation_id ])));
}

export function prepareOrganisations(
  store: EventStore<PgQuery>
): Aggregate<[], string[]> {
  return store.createAggregate(
    'Organisations[]',
    {
      text: `select * from events where data->>'organisation_id' is not null`
    },
    [[isEvent(isOrganisationCreated), onOrganisationCreated]]
  );
}
