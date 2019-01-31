import * as React from 'react';
import getActiveConversation from '../selectors/get_active_conversation';
import { AppState } from '../reducers';
import { connect } from 'react-redux';
import { Section, Heading, Navbar, Columns, Button, Level, Hero} from 'react-bulma-components';
import {UserDetail, Conversation, MessageDetail } from '../types';

import { switch_chat, poll_messages, send_message } from '../actions/conversations';
import { load_from_localstorage } from '../actions/me';

import ChatsList from '../components/ChatsList';
import ChatViewer from '../components/ChatViewer';

const example_user = {
  user_id: 'this-is-the-example-user',
  name: "Bobby Beans",
  organisation_id: "some-org-id",
  organisation: {
    organisation_id: "some-org-id",
  },
};
// import RepositiveLogo from '../../assets/repositive_logo.svg';
// tslint:disable-next-line
//const large = require('../../assets/repositive_logo.svg');
//              <img src={large} alt="Repositive" height="100%"/>

class Home extends React.PureComponent<any, any> {
  public componentDidMount = () => {
    console.log("POLLING!!");
    setInterval(() => this.props.dispatch(poll_messages()), 1000);
    this.props.dispatch(load_from_localstorage());
  }
  public render = () => {
    return (
      <div>
        <Navbar className="is-fixed-top">
          <Navbar.Brand>
            <Navbar.Item>
              <strong>Repositive</strong>
            </Navbar.Item>
            <Navbar.Item>
              <strong>Return to CMP</strong>
            </Navbar.Item>
          </Navbar.Brand>
        </Navbar>
        <Columns style={{marginTop: "30px"}}>
          <Columns.Column className="is-one-quarter">
            <ChatsList
              switchAction={(id: string) => this.props.dispatch(switch_chat(id))}
              conversations={this.props.conversations.data}
              active_id={(this.props.active_conversation || {}).conversation_id || ''}
            />
          </Columns.Column>
          <Columns.Column className="is-three-quarters">
            {(this.props.active_conversation) ? (
              <ChatViewer
                conversation={this.props.active_conversation}
                me={{user_id: this.props.user_id}as any}
                onSendMessage={() => this.props.dispatch(
                  send_message(this.props.active_conversation, {user_id: this.props.user_id}as any))}
                isMessageSending={this.props.is_message_sending}
                isSendingError={this.props.is_message_send_error}
              />
            ) : (<Section>
                <Hero color="danger">
                  <Hero.Body>
                    <Heading>You don't have any conversations.</Heading>
                    <Heading subtitle>Don't be so fucking quiet you nerd</Heading>
                  </Hero.Body>
                </Hero>
                </Section> )
            }
          </Columns.Column>
        </Columns>
      </div>
    );
  }
}

export default connect(
  (s: AppState) => (
    {
      conversations: s.conversations,
      active_conversation: getActiveConversation(s),
      user_id: s.me.user_id,
      is_message_sending: s.conversations.is_message_sending,
      is_message_send_error: s.conversations.is_message_send_error,
    }),
)(Home);
