/**
 * Created by Yangwook Ryoo on 1/29/16.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  render() {
    return <h1>Hi, {this.props.name}!</h1>;
  }
}

ReactDOM.render(
<App name="stranger"/>,
  document.querySelector('.react-root')
);
