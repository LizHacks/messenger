export const SWITCH_CHAT = 'SWITCH_CHAT';
export const SEND_MESSAGE_BEGIN = 'SEND_MESSAGE_BEGIN';
export const SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS';
export const POLL_MESSAGES = 'POLL_MESSAGES';
export const POLL_MESSAGES_SUCCESS = 'POLL_MESSAGES_SUCCESS';
export const SEND_MESSAGE_FAILURE = 'SEND_MESSAGE_FAILURE';

export const MESSAGE_EDITED = 'MESSAGE_EDITED';

import { MessageDetail, Conversation, UserDetail } from '../types';
import fetch from 'node-fetch';

export function switch_chat(active_id: string) {
  // Switch the current chat to a different one.
  return {
    type: SWITCH_CHAT,
    active_id,
  };
}

const get_jwt = () => {
  return (JSON.parse(window
          .localStorage
          .getItem('ember_simple_auth-session')
          || '') as any).authenticated.token;
};

export function send_message(conversation: Conversation, me: UserDetail) {
  // Get a message out of the active conversation/message editor
  return (dispatch: any, getState: any) => {
    const message_text = getState().conversations.message_to_send;

    if (message_text.length === 0) {
      return {type: 'MESSAGE_SEND_CANCELLED'};
    }
    const message_payload = {
      message_text,
      from: me.user_id,
      thread_id: conversation.conversation_id,
    };
    dispatch({type: SEND_MESSAGE_BEGIN, message_payload});
    return fetch(
      "/api/send-message",
      {
        method: "POST",
        body: JSON.stringify(message_payload),
        headers: {
        // tslint:disable-next-line
          Authorization: `JWT ${get_jwt()}`, // Get something from localstorage?
          contentType: 'application/json',
      },
    },
    ).then((res) => res.json())
      .then(() => dispatch({type: SEND_MESSAGE_SUCCESS}))
      .catch(() => dispatch({type: SEND_MESSAGE_FAILURE}));
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
      "/api/get-conversations",
      {
        // TODO: Read the JWT from somewhere, rather than have it hardcoded
        // tslint:disable-next-line
        headers: {Authorization: `JWT ${get_jwt()}`},
      },
    ).then((res) => res.json())
      .then((conversations) => dispatch({type: POLL_MESSAGES_SUCCESS, conversations}));
  };
}

export function message_edited(event: any) {
  return {
    type: MESSAGE_EDITED,
    value: event.target.value,
  };
}
