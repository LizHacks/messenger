import * as React from 'react';
import { Menu } from 'react-bulma-components';

const ChatListItem = (title: string) => (
  <Menu.List.Item>
    {title}
  </Menu.List.Item>
);

export default (chat_names: string[]) => (
  <Menu>
    <Menu.List title="Conversations">
      {chat_names.map(ChatListItem)}
      // Somehow get the state and show a list of chats here
    </Menu.List>
  </Menu>
);
