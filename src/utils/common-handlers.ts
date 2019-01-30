import * as T from 'io-ts';
import * as R from 'ramda';
import logger from './logger';
import { reporter } from 'io-ts-reporters';
import { Left } from 'funfix';
import { BasicPayload, Result } from './common-types';

export const isUserOrg = R.curry(function <O> (
  payload: BasicPayload,
  propertyPath: string[],
  collection: O[],
): Promise<O[]> {
  const allUserOrg = R.all(
    ((obj) => R.path(propertyPath, obj) === payload.accessAttributes.subject.organisation_id),
    collection);
  if (allUserOrg) {
    return Promise.resolve(collection);
  } else {
    return Promise.reject(new Error('user does not have access to all the required resources'));
  }
});

export const filterByUserOrg = R.curry(function <O> (
  payload: BasicPayload,
  propertyPath: string[],
  collection: O[],
): Promise<O[]> {
  const filteredCollection = R.filter(
    ((obj) => R.path(propertyPath, obj) === payload.accessAttributes.subject.organisation_id),
    collection);
  return Promise.resolve(filteredCollection);
});

export const validatePayload = <O>(typeRTM: T.Type<O>) => (payload: O): Promise<O> => {
  logger.debug('validating payload');
  return typeRTM.decode(payload)
    .map((validPayload) => Promise.resolve(validPayload))
    .getOrElseL((err) => {
      const reports = reporter(Left(err) as any);
      return Promise.reject(new Error(reports[0]));
    });
};

export function responseWrapper<O>(collection: O[]): Promise<Result<O>> {
  return Promise.resolve({ result: collection });
}
