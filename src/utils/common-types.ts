import * as T from 'io-ts';
import { uuid } from '../utils/io-ts-extra';

export interface Result<R> {
  result: R[];
}

const basicPayload = T.interface({
  accessAttributes: T.interface({
    subject: T.interface({
      organisation_id: uuid,
    }),
  }),
});

export type BasicPayload = T.TypeOf<typeof basicPayload>;
