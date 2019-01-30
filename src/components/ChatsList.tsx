import * as React from 'react';
import { Level, Button, Section, Menu, Box, Heading } from 'react-bulma-components';

export interface ChatListing {
  name: string;
  topic: string;
}

const ChatListItem = ({title}: {title: string}) => (
    <Heading subtitle>
      <Menu.List.Item >
        {title}
      </Menu.List.Item>
    </Heading>
);

export default ({chat_names}: { chat_names: string[]}) => (
  <Section>
    <Menu width>
      <Menu.List title="Conversations">
        {chat_names.map((name: string) => <ChatListItem title={name} />)}
    {/* Somehow get the state and show a list of chats here*/}
      </Menu.List>
    </Menu>
    <Section>
      <Level>
        <Level.Item>
          <Button fullwidth className="is-primary" >New Chat</Button>
        </Level.Item>
      </Level>
    </Section>
  </Section>
);
