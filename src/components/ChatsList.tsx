import * as React from 'react';
import { Conversation } from '../types';
import { Level, Button, Section, Menu, Box, Heading } from 'react-bulma-components';

import NewThread from './NewThread';
import { ThreadsState } from '../reducers';

export interface ChatListing {
  name: string;
  topic: string;
  is_repositive: boolean;
}

const ChatListItem = (
  {conversation, is_active, switchAction}:
  {conversation: Conversation, is_active: boolean, switchAction: any}) => (
    <Heading subtitle>
      <Menu.List.Item
        active = {is_active}
        onClick={() => switchAction(conversation.conversation_id)}
      >
        {conversation.topic || ''}
      </Menu.List.Item>
    </Heading>
);

// This should come from the state (somehow)
export default (
  {
    conversations,
    switchAction,
    active_id,
    threads,
    showNewThreadAction,
    hideNewThreadAction,
    createNewThreadAction,
    edit_thread_topic,
    edit_thread_members,
  }:
  {
    conversations: Conversation[],
    active_id: string,
    switchAction: any,
    threads: ThreadsState,
    showNewThreadAction: any,
    hideNewThreadAction: any,
    createNewThreadAction: any,
    edit_thread_topic: any,
    edit_thread_members: any,
  },
  ) => (
  <Section>
    <Menu>
      <Menu.List title="Conversations">
        {conversations.map(
          (conversation: Conversation) =>
            <ChatListItem switchAction={switchAction}
              conversation={conversation}
              is_active={active_id === conversation.conversation_id}
            />,
        )}
    {/* Somehow get the state and show a list of chats here*/}
      </Menu.List>
    </Menu>
    <Section>
    { !threads.new_thread_editor_visible ?
      (
        <Level>
          <Level.Item>
            <Button fullwidth
              className="is-outlined is-primary"
              onClick={showNewThreadAction}
            >New Chat</Button>
          </Level.Item>
        </Level>
      ) : (
        <NewThread
          hideNewThreadAction={hideNewThreadAction}
          createNewThreadAction={createNewThreadAction}
          edit_thread_topic={edit_thread_topic}
          edit_thread_members={edit_thread_members}
          isButtonEnabled={threads.create_new_thread_button_enabled}
        />
      )
    }
    </Section>
  </Section>
);
