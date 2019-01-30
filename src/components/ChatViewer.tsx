import * as React from 'react';
import {
  Form,
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

export interface UserDetail {
  name: string;
  user_id: string;
  organisation_id: string;
  avatar_url?: string;
}

export interface MessageDetail {
  from: string; // user_id
  to: string; // user_id
  message: string;
  time: string; // datetime
}

export interface Conversation {
  me: UserDetail;
  topic: string;
  members: UserDetail[];
  messages: MessageDetail[];
}

const ChatMessage = ({message, is_me}: {message?: MessageDetail, is_me: boolean}) => (
  <Box>
    <Media>
       <Media.Item renderAs="figure" position="left">
          <Image renderAs="p" size={64} alt="64x64" src="http://bulma.io/images/placeholders/128x128.png" />
        </Media.Item>
        <Media.Item>
          <Content>
            <p>
              <strong>Berty McBertson</strong>
  {is_me ? <Tag style={{marginLeft: "15px"}} color="success">You</Tag> : ""}
            </p>
            <p>
              Message body goes here!
            </p>
          </Content>
        </Media.Item>
    </Media>
  </Box>
);
const ChatMessageEditor = ({message, is_me}: {message?: MessageDetail, is_me: boolean}) => (
  <Box>
    <Media>
        <Media.Item>
          <Content>
            <p>
              <strong>New Message</strong>
  {is_me ? <Tag style={{marginLeft: "15px"}} color="success">You</Tag> : ""}
            </p>
            <p>
              <Form.Textarea placeholder = "Write your message here..." />
            </p>
          </Content>
        <Level>
          <Level.Side>
          <Button>Send</Button>
          </Level.Side>
        </Level>
        </Media.Item>
    </Media>
  </Box>
);

// TODO: This need to accept some kind of user_chat object or something idk
export default ({conversation}: {conversation?: Conversation}) => (
  <Section className="is-marginless">
    <Hero color='none'>
      <Hero.Body>
        <Heading>Chat topic</Heading>
        <Heading subtitle>
          Conversation with <strong>Other Person</strong> from <strong>Other Person's Org</strong>
          <Tag color="primary" style={{marginLeft: "15px"}}>Vendor</Tag>
        </Heading>
        <Section>
          <ChatMessage is_me = {true}/>
          <ChatMessage is_me = {false}/>
          <ChatMessage is_me = {true}/>
          <ChatMessage is_me = {false}/>
          <ChatMessageEditor is_me = {false}/>
        </Section>
      </Hero.Body>
      <Hero.Footer>
        <p>Repositive is not responsible for any messages you recieve or send.</p>
        <p>More information about our <a href="http://repositive.io/terms-and-conditions">terms of service</a>.</p>
      </Hero.Footer>
    </Hero>
  </Section>
);
