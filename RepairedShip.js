import React, {Component} from 'react';
import ARKit from 'react-native-arkit/ARKit';

class RepairedShip extends Component {
  state = {};
  render() {
    return (
      <ARKit.Model
        position={{x: 0.01, y: 0.01, z: 0}}
        scale={0.01}
        model={{
          file: 'spaceship.scnassets/shipRepaired.scn',
        }}
      />
    );
  }
}

export default RepairedShip;
