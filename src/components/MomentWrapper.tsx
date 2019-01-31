import * as moment from 'moment';
import * as React from 'react';

export default ({time}: {time: string}) => {

  const output = moment(time).fromNow();

  return (
    <span>{output}</span>
  );
};
