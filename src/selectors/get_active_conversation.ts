import {createSelector} from 'reselect';
import { AppState } from '../reducers';
import { Conversation } from '../types';

const getActiveConversation = createSelector(
  (state: AppState) => state.conversations.active_id,
  (state: AppState) => state.conversations.data,
  (active_id: string, conversations: Conversation[]) =>
    conversations.find((c: Conversation) => c.conversation_id === active_id) || conversations[0],
);

export default getActiveConversation;
