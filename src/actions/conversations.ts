export const SWITCH_CHAT = 'SWITCH_CHAT';
export const SEND_MESSAGE_BEGIN = 'SEND_MESSAGE_BEGIN';
export const SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS';
export const POLL_MESSAGES = 'POLL_MESSAGES';
export const POLL_MESSAGES_SUCCESS = 'POLL_MESSAGES_SUCCESS';

import { MessageDetail } from '../types';
import fetch from 'node-fetch';

export function switch_chat(active_id: string) {
  // Switch the current chat to a different one.
  return {
    type: SWITCH_CHAT,
    active_id,
  };
}

export function send_message(message: MessageDetail) {
  // Start the process of sending a message
  return (dispatch: any, getState: any) => {
    return {
      type: SEND_MESSAGE_BEGIN,
      message,
    };
  };
}

export function message_sent_action(ok: boolean) {
  return {
    type: SEND_MESSAGE_SUCCESS,
    ok,
  };
}

export function poll_messages() {
  return (dispatch: any, getState: any) => {
    dispatch({type: POLL_MESSAGES});
    return fetch(
      "/messages/get-conversations",
      {
        headers: {Authorisation: `JWT ${getState().session.auth_token}`},
      },
    ).then((res) => res.json())
      .then((conversations) => dispatch({type: POLL_MESSAGES_SUCCESS, conversations}));
  };
}
