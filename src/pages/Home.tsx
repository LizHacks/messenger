import * as React from 'react';
import getActiveConversation from '../selectors/get_active_conversation';
import { AppState } from '../reducers';
import { connect } from 'react-redux';
import { Navbar, Columns, Button, Level, Hero} from 'react-bulma-components';
import {UserDetail, Conversation, MessageDetail } from '../types';

import { switch_chat } from '../actions/conversations';

import ChatsList from '../components/ChatsList';
import ChatViewer from '../components/ChatViewer';

const example_user = {
  user_id: "some-user-id",
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
              active_id={this.props.active_conversation.conversation_id}
            />
          </Columns.Column>
          <Columns.Column className="is-three-quarters">
            <ChatViewer conversation={this.props.active_conversation} me={example_user as any}/>
          </Columns.Column>
        </Columns>
      </div>
    );
  }
}

export default connect(
  (s: AppState) => ({conversations: s.conversations, active_conversation: getActiveConversation(s) }),
)(Home);
