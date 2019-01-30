import * as T from 'io-ts';

const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
export const uuid = T.refinement(T.string, (str) => uuidRegex.test(str), 'UUID');
export type Uuid = T.TypeOf<typeof uuid>;

const isoDateRegex = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)$/;
export const isoDate = T.refinement(T.string, (str) => isoDateRegex.test(str), 'ISO-8601');
export type IsoDate = T.TypeOf<typeof isoDate>;

export const orgType = T.union([T.literal('pdx-vendor'), T.literal('pdx-consumer')]);
