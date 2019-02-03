import { combineReducers } from 'redux';
import { Conversation, UserDetail } from '../types';

import auth from './auth';
import me from './me';
import conversations from './conversations';
import threads from './threads';

export default combineReducers({
  auth,
  me,
  conversations,
  threads,
});

export interface Session {
  me: UserDetail;
  auth_token: string;
}

export interface ConversationsState {
    is_loading: boolean;
    is_message_sending: boolean;
    is_message_send_error: boolean;
    is_error: boolean;
    active_id: string;
    message_to_send: string;
    data: Conversation[];
}

interface SessionState {
  session: Session;
}

export interface ThreadsState {
  new_thread_editor_visible: boolean;
  new_thread_topic: string;
  new_thread_members: string;
  create_new_thread_button_enabled: boolean;
}

export interface AppState {
  conversations: ConversationsState;
  session: SessionState;
  me: {user_id: string};
  threads: ThreadsState;
}
