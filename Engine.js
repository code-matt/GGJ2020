import {ARKit} from 'react-native-arkit';
import React, {Component} from 'react';

class Engine extends Component {
  render() {
    console.log('engine is repaired', this.props.isRepaired);
    if (this.props.isRepaired) {
      return (
        <ARKit.Text
          text="I am a engine"
          position={this.props.position}
          font={{size: 0.04, depth: 0.03}}
          id={'engine'}
          material={{color: 'green'}}
          key="1"
        />
      );
    } else {
      return (
        <ARKit.Text
          text="I am a engine"
          position={this.props.position}
          font={{size: 0.04, depth: 0.03}}
          id={'engine'}
          material={{color: 'red'}}
          key="2"
        />
      );
    }
  }
}

export default Engine;
