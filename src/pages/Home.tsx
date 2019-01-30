import * as React from 'react';
import { Navbar, Columns, Button, Level, Hero} from 'react-bulma-components';

import ChatsList from '../components/ChatsList';
import ChatViewer from '../components/ChatViewer';

// import RepositiveLogo from '../../assets/repositive_logo.svg';
const large = require('../../assets/repositive_logo.svg');

export default class Home extends React.PureComponent<any, any> {
  public render() {
    return (
      <div>
        <Navbar size="small" className="is-marginless">
          <Navbar.Brand>
            <Navbar.Item>
              <img src={large} alt="Repositive" height="100%"/>
            </Navbar.Item>
            <Navbar.Item>
              <strong>Return to CMP</strong>
            </Navbar.Item>
          </Navbar.Brand>
        </Navbar>
        <Columns>
          <Columns.Column className="is-one-quarter">
            <ChatsList chat_names = {
              ['Bobby Beans', 'Richard Head', 'Steve Warr']
            }/>
          </Columns.Column>
          <Columns.Column>
            <ChatViewer />
          </Columns.Column>
        </Columns>
      </div>
    );
  }
}
