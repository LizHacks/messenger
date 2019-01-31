import { combineReducers } from 'redux';
import { Conversation, UserDetail } from '../types';

import auth from './auth';
import me from './me';
import conversations from './conversations';

export default combineReducers({
  auth,
  me,
  conversations,
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
    data: Conversation[];
}

interface SessionState {
  session: Session;

}

export interface AppState {
  conversations: ConversationsState;
  session: SessionState;
  me: {user_id: string};
}
