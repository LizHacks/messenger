import * as React from 'react';
import getActiveConversation from '../selectors/get_active_conversation';
import { AppState } from '../reducers';
import { connect } from 'react-redux';
import { Section, Heading, Navbar, Columns, Button, Level, Hero} from 'react-bulma-components';
import {UserDetail, Conversation, MessageDetail } from '../types';

import { switch_chat, poll_messages, send_message, message_edited } from '../actions/conversations';
import { load_from_localstorage } from '../actions/me';
import {
  hide_new_thread_form,
  show_new_thread_form,
  create_new_thread,
  edit_new_thread_topic,
  edit_new_thread_members,
} from '../actions/threads';

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
const large = require('../../assets/repositive.png');

class Home extends React.PureComponent<any, any> {
  public componentDidMount = () => {
    setInterval(() => this.props.dispatch(poll_messages()), 1000);
    this.props.dispatch(load_from_localstorage());
  }
  public render = () => {
    return (
      <div>
        <Navbar className="is-fixed-top">
          <Navbar.Brand>
            <Navbar.Item>
              <img src={large} alt="Repositive" height="100%"/>
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
              threads={this.props.threads}
              hideNewThreadAction={() => this.props.dispatch(hide_new_thread_form())}
              showNewThreadAction={() => this.props.dispatch(show_new_thread_form())}
              createNewThreadAction={() => this.props.dispatch(create_new_thread(this.props.threads))}
              edit_thread_topic={
                {
                  editNewThreadTopic: (event: any) => this.props.dispatch(edit_new_thread_topic(event)),
                  value: this.props.threads.new_thread_topic,
                }
              }
              edit_thread_members={
                {
                  editNewThreadMembers: (event: any) => this.props.dispatch(edit_new_thread_members(event)),
                  value: this.props.threads.new_thread_members,
                }
              }
            />
          </Columns.Column>
          <Columns.Column className="is-three-quarters">
            {(this.props.active_conversation) ? (
              <ChatViewer
                conversation={this.props.active_conversation}
                currentMessageText={this.props.conversations.message_to_send}
                me={{user_id: this.props.user_id}as any}
                onSendMessage={() => this.props.dispatch(
                  send_message(this.props.active_conversation, {user_id: this.props.user_id}as any))}
                onMessageEdited={(event: any) => this.props.dispatch(message_edited(event))}
                isMessageSending={this.props.is_message_sending}
                isSendingError={this.props.is_message_send_error}
              />
            ) : (<Section>
                <Hero color="light">
                  <Hero.Body>
                    <Heading>You don't have any conversations.</Heading>
                    <Heading subtitle>
                      You can start a new conversation with the <strong>button on the left</strong>&nbsp;
                      or through Repositive CMP</Heading>
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
      threads: s.threads,
    }),
)(Home);
