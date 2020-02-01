import {ARKit} from 'react-native-arkit';
import React, {Component} from 'react';

class Engine extends Component {
  render() {
    return (
      <ARKit.Text
        text="I am a engine"
        position={this.props.position}
        font={{size: 0.04, depth: 0.03}}
        id={'engine'}
      />
    );
  }
}

export default Engine;
