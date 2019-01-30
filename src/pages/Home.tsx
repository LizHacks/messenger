import * as React from 'react';
import { Columns, Button} from 'react-bulma-components';
import ChatsList from '../components/ChatsList';

export default class Home extends React.PureComponent<any, any> {
  public render() {
    return (
      <div>
        <Columns>
          <Columns.Column>
            <p>Something</p>
            <Button>Some button</Button>
            <ChatsList { chat_names: ['a', 'b']}/>

          </Columns.Column>
          <Columns.Column>
            <p className="bd-notification is-info"> Something</p>

          </Columns.Column>
        </Columns>
      </div>
    );
  }
}
