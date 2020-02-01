import {ARKit} from 'react-native-arkit';
import React, {Component} from 'react';

class Ship extends Component {
  render() {
    return (
      <ARKit.Text
        text="I am a broken ship"
        position={this.props.position}
        font={{size: 0.05, depth: 0.05}}
        id={'ship'}
        material={{
          color: this.props.isShipRepaired ? 'purple' : 'red',
        }}
        key={`ship-${this.props.isShipRepaired ? '-repaired' : '-notrepaired'}`}
      />
    );
  }
}

export default Ship;
