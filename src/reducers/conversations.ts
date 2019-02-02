import { ConversationsState } from '.';

import {
  MESSAGE_EDITED,
  SWITCH_CHAT,
  SEND_MESSAGE_BEGIN,
  SEND_MESSAGE_FAILURE,
  SEND_MESSAGE_SUCCESS,
  POLL_MESSAGES,
  POLL_MESSAGES_SUCCESS,
} from '../actions/conversations';

export const defaultState: ConversationsState = {
    is_loading: false,
    is_message_sending: false,
    is_message_send_error: false,
    is_error: false,
    active_id: '',
    message_to_send: '',
    data: [],
};

export default function Conversations(state = defaultState, action = {} as any) {
  switch (action.type) {
    case SWITCH_CHAT:
      const { active_id } = action;
      return {
        ...state,
        active_id,
      };
    case SEND_MESSAGE_BEGIN:
      return {
        ...state,
        is_message_sending: true,
        is_message_send_error: false,
      };
    case SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        is_error: false,
        message_to_send: '',
      };
    case SEND_MESSAGE_FAILURE:
      return {
        ...state,
        is_message_sending: false,
        is_message_send_error: true,
        is_error: true,
      };
    case POLL_MESSAGES:
      return {
        ...state,
        is_message_sending: false,
      };
    case POLL_MESSAGES_SUCCESS:
      return {
        ...state,
        data: action.conversations,
      };
    case MESSAGE_EDITED:
      return {
        ...state,
        message_to_send: action.value,
      };
    default:
      return state;
  }
}
