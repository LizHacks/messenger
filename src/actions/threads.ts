import fetch from 'node-fetch';

import {switch_chat} from '../actions/conversations';

import { CreateThreadResponse, CreateThreadCmd } from '../server/api/operations/new_thread';

export const SHOW_NEW_THREAD_FORM = 'SHOW_NEW_THREAD_FORM';
export const HIDE_NEW_THREAD_FORM = 'HIDE_NEW_THREAD_FORM';

export const CREATE_NEW_THREAD_BEGIN = 'CREATE_NEW_THREAD_BEGIN';
export const CREATE_NEW_THREAD_SUCCESS = 'CREATE_NEW_THREAD_SUCCESS';
export const CREATE_NEW_THREAD_FAILURE = 'CREATE_NEW_THREAD_FAILURE';

export const EDIT_NEW_THREAD_TOPIC = 'EDIT_NEW_THREAD_TOPIC';
export const EDIT_NEW_THREAD_MEMBERS = 'EDIT_NEW_THREAD_MEMBERS';

export function show_new_thread_form() {
  return {type: SHOW_NEW_THREAD_FORM};
}

export function hide_new_thread_form() {
  return {type: HIDE_NEW_THREAD_FORM};
}

export function edit_new_thread_topic(event: any) {
  return {
    type: EDIT_NEW_THREAD_TOPIC,
    value: event.target.value,
  };
}

export function edit_new_thread_members(event: any) {
  return {
    type: EDIT_NEW_THREAD_MEMBERS,
    value: event.target.value,
  };
}

const get_jwt = () => {
  return (JSON.parse(window
          .localStorage
          .getItem('ember_simple_auth-session')
          || '') as any).authenticated.token;
};

export function create_new_thread(
  {
    new_thread_topic,
    new_thread_members,
  }: {
    new_thread_topic: string,
    new_thread_members: string,
  },
) {
  return (dispatch: any, getState: any) => {
    const api_paylaod: CreateThreadCmd = {
      topic: new_thread_topic,
      members: [new_thread_members],
    };
    dispatch({type: CREATE_NEW_THREAD_BEGIN});
    fetch(
      '/api/new-thread',
      {
        method: "POST",
        body: JSON.stringify(api_paylaod),
        headers: {
          Authorization: `JWT ${get_jwt()}`,
          contentType: 'application/json',
        },
      },
    )
      .then((res) => res.json())
      .then((response: CreateThreadResponse) => {
        if (response.ok) {
          dispatch({type: CREATE_NEW_THREAD_SUCCESS});
          dispatch(switch_chat(response.thread_id));
          dispatch(hide_new_thread_form());
        } else {
          dispatch({type: CREATE_NEW_THREAD_FAILURE});
        }
      }).catch(() => dispatch({type: CREATE_NEW_THREAD_FAILURE}));
  };
}
