import * as React from 'react';
import { UserDetail } from '../types';

import { Button, Heading, Box, Form } from 'react-bulma-components';

export default ({
  me,
  hideNewThreadAction,
  createNewThreadAction,
}: {
  me?: UserDetail,
  hideNewThreadAction: any,
  createNewThreadAction?: any,
}) => {
  return (
    <Box>
      <Heading subtitle size={5}>Add a new chat</Heading>
      <Form.Field>
        <Form.Label>
          Topic
        </Form.Label>
        <Form.Control>
          <Form.Input placeholder="Conversation topic"/>
        </Form.Control>
      </Form.Field>
      <Form.Field>
        <Form.Label>
          Participants
        </Form.Label>
        <Form.Control>
          <Form.Input placeholder="Type some names"/>
        </Form.Control>
      </Form.Field>
      <Form.Field kind="group">
        <Form.Control>
          <Button className='is-primary' onClick={createNewThreadAction}>New Topic</Button>
        </Form.Control>
        <Form.Control>
          <Button className='is-danger is-outlined' onClick={hideNewThreadAction}>Cancel</Button>
        </Form.Control>
      </Form.Field>
    </Box>
  );
};
