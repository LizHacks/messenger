import test from 'ava';
import { stub } from 'sinon';
import { createEvent } from '@repositive/event-store';

import { prepareOrganisations } from '.';
import { OrganisationCreated } from '../../events';
import {
  organisation_id,
  cafed00d as vendor_organisation_id,
  getFakeStore
} from '../../test-helpers';

test('Gets only vendors', async t => {
  const readStub = stub()
    .withArgs(organisation_id)
    .returns([
      createEvent<OrganisationCreated>('organisations', 'OrganisationCreated', {
        organisation_id: vendor_organisation_id,
        organisation_type: 'pdx-vendor',
        name: 'Some Other Org',
        location: {} as any,
        contact_details: {} as any,
        working_practices: [],
        services_offered: [],
        accreditations: [],
        visible_accreditations: false,
        platform_name: 'stuph',
        logo: null,
        bio: null,
      })
    ]);

  const store = await getFakeStore(readStub);
  const aggregate = prepareOrganisations(store);

  const organisations = await aggregate();

  t.deepEqual(organisations.get(), [vendor_organisation_id]);
});
