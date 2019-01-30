import { Response } from 'node-fetch';
import { RPCError } from './errors';

export function parseAndHandleErrors(response: Response) {
  if (response.ok) {
    return response.json();
  } else {
    return Promise.reject(response.json()
      .then((err: any) =>  new RPCError(err))
      .catch((err: any) => {
        return new RPCError(err && err.message);
      }));
  }
}
