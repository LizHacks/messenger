import * as React from 'react';
import { Conversation, UserDetail } from '../types';

export default ({conversation, me}: {conversation: Conversation, me: UserDetail}) => {
  console.log({me});
  return (
    <span>{
      conversation.members
        .filter((member) => member.user_id !== me.user_id)
        .map((user) => user.name)
        .join(', ')
    }</span>);
};
