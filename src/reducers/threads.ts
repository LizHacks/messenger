// thread menu reducer
//

import { ThreadsState } from '.';
import {
  SHOW_NEW_THREAD_FORM,
  HIDE_NEW_THREAD_FORM,
  EDIT_NEW_THREAD_TOPIC,
  EDIT_NEW_THREAD_MEMBERS,
  CREATE_NEW_THREAD_BEGIN,
  CREATE_NEW_THREAD_SUCCESS,
} from '../actions/threads';

const defaultState = {
  new_thread_editor_visible: false,
  new_thread_topic: '',
  new_thread_members: '',
  create_new_thread_button_enabled: false,
};

export default function threads(state = defaultState, action = {} as any) {
  const is_valid_input = (st: any) => st.new_thread_topic.length > 0
    && st.new_thread_members.length > 0;
  switch (action.type) {
    case SHOW_NEW_THREAD_FORM:
      return {
        ...state,
        new_thread_editor_visible: true,
      };
    case HIDE_NEW_THREAD_FORM:
      return {
        ...state,
        new_thread_editor_visible: false,
      };
    case EDIT_NEW_THREAD_TOPIC:
      return {
        ...state,
        new_thread_topic: action.value,
        create_new_thread_button_enabled: is_valid_input(state),
      };
    case EDIT_NEW_THREAD_MEMBERS:
      return {
        ...state,
        new_thread_members: action.value,
        create_new_thread_button_enabled: is_valid_input(state),
      };
    case CREATE_NEW_THREAD_SUCCESS:
      return {
        ...state,
        new_thread_topic: '',
        new_thread_members: '',
        create_new_thread_button_enabled: false,
      };
    default:
      return state;
  }
}
