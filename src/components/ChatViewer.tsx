import * as React from 'react';
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
import { UserDetail, MessageDetail, Conversation } from '../types';

const ChatMessage = ({message, is_me}: {message: MessageDetail, is_me: boolean}) => (
  <Box>
    <Media>
       <Media.Item renderAs="figure" position="left" className="is-hidden-mobile">
          <img height="64" width="64" alt="64x64" src="http://bulma.io/images/placeholders/128x128.png" />
        </Media.Item>
        <Media.Item>
          <Content>
            <p>
              <strong>{message.from.name}</strong> - {message.time}
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
const ChatMessageEditor = () => (
  <Box>
    <Media>
        <Media.Item>
          <Content>
            <p>
              New Message to <strong>Bobby Beans</strong>
            </p>
            <p>
              <Form.Textarea placeholder = "Write your message here..." />
            </p>
          </Content>
        <Level>
          <Level.Side>
          <Button className="is-primary">Send</Button>
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
export default ({conversation, me}: {conversation: Conversation, me: UserDetail}) => (
  <Section className="is-marginless">
    <Hero color='none'>
      <Hero.Body>
        <Heading>{conversation.topic || "New Conversation"}</Heading>
        <Heading subtitle>
          Conversation with <strong>Other Person</strong> from <strong>Other Person's Org</strong>
          <Tag color="primary" style={{marginLeft: "15px"}}>Vendor</Tag>
        </Heading>
        <Container>
          <RenderMessages conversation={conversation} me={me}/>
        </Container>
        <Container style={{marginTop: "15px"}}>
          <ChatMessageEditor />
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
