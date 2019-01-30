import * as React from 'react';
import { Conversation } from '../types';
import { Level, Button, Section, Menu, Box, Heading } from 'react-bulma-components';

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
        {conversation.topic}
      </Menu.List.Item>
    </Heading>
);

// This should come from the state (somehow)
export default (
  {conversations, switchAction, active_id}:
  { conversations: Conversation[], active_id: string, switchAction: any}) => (
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
      <Level>
        <Level.Item>
          <Button fullwidth className="is-outlined is-primary" >New Chat</Button>
        </Level.Item>
      </Level>
    </Section>
  </Section>
);