import {ARKit} from 'react-native-arkit';
import React, {Component} from 'react';

class Ship extends Component {
  render() {
    return (
      <ARKit.Model
        position={this.props.buildLocation}
        scale={0.15}
        model={{
          file: 'spaceship2.scnassets/shipRepaired.scn',
        }}
      />
    );
  }
}

export default Ship;
