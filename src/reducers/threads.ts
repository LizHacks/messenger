// thread menu reducer
//

import { ThreadsState } from '.';
import { SHOW_NEW_THREAD_FORM, HIDE_NEW_THREAD_FORM } from '../actions/threads';

const defaultState = {
  new_thread_editor_visible: false,
};

export default function threads(state = defaultState, action = {} as any) {
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
    default:
      return state;
  }
}
