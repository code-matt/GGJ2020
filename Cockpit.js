import React, {Component} from 'react';
import ARKit from 'react-native-arkit/ARKit';

class Cockpit extends Component {
  state = {};
  render() {
    const {cockPitPosition} = this.props;

    return (
      <ARKit.Model
        position={cockPitPosition}
        scale={0.01}
        model={{
          file: 'spaceship.scnassets/shipCockpit.scn',
        }}
      />
    );
  }
}

export default Cockpit;
