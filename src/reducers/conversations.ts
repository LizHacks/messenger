import { ConversationsState } from '.';

import {SWITCH_CHAT } from '../actions/conversations';
import {SEND_MESSAGE_BEGIN } from '../actions/conversations';
import {SEND_MESSAGE_FAILURE } from '../actions/conversations';
import {SEND_MESSAGE_SUCCESS } from '../actions/conversations';
import {POLL_MESSAGES } from '../actions/conversations';
import {POLL_MESSAGES_SUCCESS } from '../actions/conversations';

const example_user = {
  user_id: "some-user-id",
  name: "Bobby Beans",
  organisation_id: "some-org-id",
};
const example_message = {
  from: example_user,
  time: "5 mintues ago",
  message: `This is an example message with a little bit of content and some other stuff
and it's multiline and some other shit as well there still more crap this should show how it
  works well with longer messages, regardless of their length and girth`,
  thread_id: "somethread",
};

const example_conversation_1 = {
  active: true,
  conversation_id: "somet_junk_some_uuid",
  topic: "Some conversation topic about models or cancer or something",
  members: [example_user, example_user],
  messages: [example_message, example_message],
};
const example_conversation_2 = {
  active: false,
  conversation_id: "some_other_uuid",
  topic: "Some conversation topic about models or cancer or something that shouldn't be shown right now",
  members: [example_user, example_user],
  messages: [example_message, example_message, example_message],
};

const conversations = [
  // TODO: Get this list from redux
] as any[];

export const defaultState: ConversationsState = {
    is_loading: false,
    is_message_sending: false,
    is_message_send_error: false,
    is_error: false,
    active_id: '',
    data: conversations,
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
    default:
      return state;
  }
}
