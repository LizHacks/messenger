import test from 'ava';
import { stub } from 'sinon';
import { createEvent } from '@repositive/event-store';

import { prepareOrganisationById, Organisation } from '.';
import { OrganisationCreated, OrganisationUpdated } from '../../events';
import {
  organisation_id,
  getFakeStore
} from '../../test-helpers';

test('Gets an organisation', async t => {
  const readStub = stub()
    .withArgs(organisation_id)
    .returns([
      createEvent<OrganisationCreated>('organisations', 'OrganisationCreated', {
        organisation_id,
        organisation_type: 'pdx-consumer',
        name: 'Some Org',
        location: {} as any,
        contact_details: {} as any,
        working_practices: [],
        services_offered: [],
        accreditations: [],
        visible_accreditations: false,
        platform_name: 'stuph',
        logo: null,
        bio: null
      }),
      createEvent<OrganisationUpdated>('organisations', 'OrganisationUpdated', {
        organisation_id,
        organisation_type: 'pdx-consumer',
        name: 'Some Org 2: Armageddon',
        location: {
          country: 'Blastazia',
          city: 'Blasto',
          post_code: 'BL4 5T0',
          street_address: 'Blasto House, Blasto, Blast Blaster'
        },
        contact_details: {
          name: 'Bert',
          role: 'Bert',
          email: 'bert@bert.bert'
        } as any,
        working_practices: ['one'],
        services_offered: ['two'],
        accreditations: ['three'],
        visible_accreditations: true,
        platform_name: 'purple',
        logo: 'foo.com/bar.png',
        bio: 'I do da test'
      })
    ]);

  const store = await getFakeStore(readStub);
  const aggregate = prepareOrganisationById(store);

  const organisation = await aggregate(organisation_id);

  const expected: Organisation = {
    organisation_id,
    // DEPRECATED: Superceded by `organisation_id`
    id: organisation_id,
    organisation_type: 'pdx-consumer',
    type: 'pdx-consumer',
    name: 'Some Org 2: Armageddon',
    location: {
      country: 'Blastazia',
      city: 'Blasto',
      post_code: 'BL4 5T0',
      street_address: 'Blasto House, Blasto, Blast Blaster'
    },
    contact_details: {
      name: 'Bert',
      role: 'Bert',
      email: 'bert@bert.bert'
    },
    working_practices: ['one'],
    services_offered: ['two'],
    accreditations: ['three'],
    visible_accreditations: true,
    platform_name: 'purple',
    logo: 'foo.com/bar.png',
    bio: 'I do da test'
  };

  t.deepEqual(organisation.get(), expected);
});
