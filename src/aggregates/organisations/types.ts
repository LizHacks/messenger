import * as T from 'io-ts';
import { Uuid } from '../../utils/types';
import { nullable, seal } from '../../utils/io-ts-extra';

export const organisationType = T.union([
  T.literal('pdx-consumer'),
  T.literal('pdx-vendor'),
]);

export const organisationDetails =
  T.type({
    type: organisationType,
    name: T.string,
    platform_name: nullable(T.string),
    logo: nullable(T.string),
    location: seal(
      T.partial({
        country: nullable(T.string),
        city: nullable(T.string),
        post_code: nullable(T.string),
        street_address: nullable(T.string),
      }),
    ),
    contact_details: seal(
      T.partial({
        name: nullable(T.string),
        role: nullable(T.string),
        landline: nullable(T.string),
        mobile: nullable(T.string),
        email: nullable(T.string),
      }),
    ),
    bio: nullable(T.string),
    working_practices: T.array(T.string),
    services_offered: T.array(T.string),
    accreditations: T.array(T.string),
    visible_accreditations: T.boolean,
  })
;

export type OrganisationType = T.TypeOf<typeof organisationType>;

export type OrganisationDetails = T.TypeOf<typeof organisationDetails>;

export interface Organisation extends OrganisationDetails {
  organisation_type: OrganisationType;
  organisation_id: Uuid;
  // DEPRECATED: Superceded by `organisation_id`
  id: Uuid;
}

export interface Vendor extends Organisation {
  organisation_type: "pdx-vendor";
}

export const baseOrganisation = {
  name: "",
  platform_name: null,
  logo: null,
  location: {
    country: null,
    city: null,
    post_code: null,
    street_address: null,
  },
  contact_details: {
    name: null,
    role: null,
    landline: null,
    mobile: null,
    email: null,
  },
  bio: null,
  working_practices: [],
  services_offered: [],
  accreditations: [],
  visible_accreditations: false,
};
