import React, {Component} from 'react';
import ARKit from 'react-native-arkit/ARKit';

class ShipNeedsRepair extends Component {
  state = {};
  render() {
    return (
      <ARKit.Model
        position={{x: -1.01, y: -0.01, z: 0}}
        scale={0.01}
        model={{
          file: 'spaceship.scnassets/shipNeedsRepair.scn',
        }}
      />
    );
  }
}

export default ShipNeedsRepair;
