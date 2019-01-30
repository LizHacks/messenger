import * as T from 'io-ts';
import { PartialType, InterfaceType, Type } from 'io-ts';

export const NonEmptyArray =
  <Z> (t: Type<Z>, name = 'Non Empty Array') => T.refinement(T.array(t), (elem) => elem.length > 0, name);

const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
export const uuid = T.refinement(T.string, (str) => uuidRegex.test(str), 'UUID');

const isoDateRegex = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)$/;
export const isoDate = T.refinement(T.string, (str) => isoDateRegex.test(str), 'ISO-8601');

export function nullable<Z>(t: Type<Z>) {
  return T.union([t, T.null], `${t.name} | null`);
}

// The sealed type does not allow extra properties
export function seal(t: PartialType<any> | InterfaceType<any>) {
  return T.refinement(
    t,
    (p) => Object.keys(p).reduce((acc, k) => acc && t.props[k], true),
    `Sealed (${t.name})`,
  );
}
