import {get} from 'config';
import {sign  as _sign, SignOptions, verify as _verify, VerifyOptions} from 'jsonwebtoken';

export const signToken = function(value: object, options: SignOptions = {}): Promise<string> {
  return new Promise<string>((pass, reject) => {
    _sign(value, get<string>('jwt.secret'), options, (err, token: string) => {
      if (err) {
        reject(err);
      } else {
        pass(token);
      }
    });
  });
};

export const decodeToken = function(token: string, options: VerifyOptions = {}): Promise<object> {
  return new Promise<object>((pass, reject) => {
    _verify(token, get<string>('jwt.secret'), options, (err: Error, decoded: object) => {
      if (err) {
        reject(err);
      } else {
        pass(decoded);
      }
    });
  });
};

interface InviteTokenParams {
  token: string;
  organisation_id: string;
  name: string;
  email: string;
}

export async function createInviteToken(params: InviteTokenParams): Promise<string> {
  return await signToken(params);
}

interface GuestAccessTokenParams {
  organisation_id: string;
  guest_id: string;
  email: string;
}

export async function createGuestAccessToken(params: GuestAccessTokenParams): Promise<string> {
  return await signToken(params);
}
