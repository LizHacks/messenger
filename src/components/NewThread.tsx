import * as React from 'react';
import { UserDetail } from '../types';

import { Button, Heading, Box, Form } from 'react-bulma-components';

export default ({
  me,
  isButtonEnabled,
  hideNewThreadAction,
  createNewThreadAction,
  edit_thread_topic: {
    editNewThreadTopic,
    value: topic_value,
  },
  edit_thread_members: {
    editNewThreadMembers,
    value: members_value,
  },
}: {
  me?: UserDetail,
  isButtonEnabled: boolean,
  hideNewThreadAction: any,
  createNewThreadAction: any,
  edit_thread_topic: {
    editNewThreadTopic: any,
    value: string,
  },
  edit_thread_members: {
    editNewThreadMembers: any,
    value: string,
  },
}) => {
  return (
    <Box>
      <Heading subtitle size={5}>Add a new chat</Heading>
      <Form.Field>
        <Form.Label>
          Topic
        </Form.Label>
        <Form.Control>
          <Form.Input placeholder="Conversation topic" onChange={editNewThreadTopic} value={topic_value}/>
        </Form.Control>
      </Form.Field>
      <Form.Field>
        <Form.Label>
          Participants
        </Form.Label>
        <Form.Control>
          <Form.Input placeholder="Type some names" onChange={editNewThreadMembers} value={members_value}/>
        </Form.Control>
      </Form.Field>
      <Form.Field kind="group">
        <Form.Control>
          <Button className='is-primary' disabled={!isButtonEnabled} onClick={createNewThreadAction}>New Topic</Button>
        </Form.Control>
        <Form.Control>
          <Button className='is-danger is-outlined' onClick={hideNewThreadAction}>Cancel</Button>
        </Form.Control>
      </Form.Field>
    </Box>
  );
};
