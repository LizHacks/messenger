import * as React from 'react';
import classNames from 'classnames';
import {
  Form,
  Container,
  Level,
  Button,
  Box,
  Content,
  Media,
  Image,
  Hero,
  Heading,
  Section,
  Tag,
} from 'react-bulma-components';
import MomentWrapper from './MomentWrapper';
import OtherPeopleInThread from './OtherPeopleInThread';
import { UserDetail, MessageDetail, Conversation } from '../types';

// tslint:disable-next-line
const defaultAvatar = require('../../assets/default-pic.png');

const ChatMessage = ({message, is_me}: {message: MessageDetail, is_me: boolean}) => (
  <Box>
    <Media>
       <div className="is-hidden-mobile media-left">
          <img
            height="45"
            width="45"
            style={{margin: "0px", borderRadius: "100%"}}
            alt="64x64"
            src={message.from.avatar || defaultAvatar}
          />
        </div>
        <Media.Item className="media-content">
          <Content>
            <p>
              <strong>{message.from.name}</strong> - <MomentWrapper time={message.time}/>
  {is_me ? <Tag style={{marginLeft: "15px"}} color="success">You</Tag> : ""}
            </p>
            <p>
              {message.message}
            </p>
          </Content>
        </Media.Item>
    </Media>
  </Box>
);
const ChatMessageEditor = (
  {
    conversation,
    me,
    onSendMessage,
    onMessageEdited,
    isMessageSending,
    isSendingError,
    currentMessageText,
  }:
  {
    conversation: Conversation,
    currentMessageText: string,
    me: UserDetail,
    onSendMessage: any,
    onMessageEdited: any,
    isMessageSending: boolean,
    isSendingError: boolean,
  },
) => (
  <Box>
    <Media>
        <Media.Item>
          <Content>
            <p>
              New message to <strong><OtherPeopleInThread conversation={conversation} me={me} /></strong>
            </p>
            <p>
              <Form.Textarea
                name="message_input"
                className={classNames({'is-loading': isMessageSending})}
                disabled={isSendingError || isMessageSending}
                onChange={onMessageEdited}
                value={currentMessageText}
              />
            </p>
          </Content>
        <Level>
          <Level.Side>
          <Button
            className={classNames(
              {'is-primary': !isSendingError},
              {'is-loading': isMessageSending},
              {'is-danger' : isSendingError},
            )}
            onClick={onSendMessage}>
              {isSendingError ? "Could not send message, click to retry" : "Send message" }
            </Button>
          </Level.Side>
        </Level>
        </Media.Item>
    </Media>
  </Box>
);

const RenderMessages = ({conversation, me}: {conversation: Conversation, me: UserDetail}) => {
  return (
    <div>
      {conversation.messages.map((message: MessageDetail) => {
        return (<ChatMessage message = {message} is_me = {message.from.user_id === me.user_id}/>);
      })}
    </div>
  );
};

// TODO: This need to accept some kind of user_chat object or something idk
export default (
  {
    conversation,
    me,
    onSendMessage,
    onMessageEdited,
    currentMessageText,
    isMessageSending,
    isSendingError,
  }:
  {
    conversation: Conversation,
    me: UserDetail,
    onSendMessage: any,
    onMessageEdited: any,
    isMessageSending: boolean,
    currentMessageText: string,
    isSendingError: boolean,
  },
) => (
  <Section className="is-marginless">
    <Hero color='light'>
      <Hero.Body>
        <Heading>{conversation.topic || "New Conversation"}</Heading>
        <Heading subtitle>
          Conversation with&nbsp;
          <strong>
            <OtherPeopleInThread conversation= {conversation} me={me}/>
          </strong>.
        </Heading>
        <Container>
          <RenderMessages conversation={conversation} me={me}/>
        </Container>
        <Container style={{marginTop: "15px"}}>
          <ChatMessageEditor
            conversation={conversation}
            me={me}
            onSendMessage={onSendMessage}
            onMessageEdited={onMessageEdited}
            isMessageSending={isMessageSending}
            isSendingError={isSendingError}
            currentMessageText={currentMessageText}
          />
        </Container>
      </Hero.Body>
      <Hero.Footer>
        <Section>
          <p>Repositive is not responsible for any messages you recieve or send.</p>
          <p>For more information, have a look at our&nbsp;
            <a href="http://repositive.io/terms-and-conditions">terms of service</a>.</p>
        </Section>
      </Hero.Footer>
    </Hero>
  </Section>
);
