import React, {Component} from 'react';
import ARKit from 'react-native-arkit/ARKit';

class RepairedShip extends Component {
  state = {};
  render() {
    return (
      <ARKit.Model
        position={{x: 0.01, y: 0.01, z: 0}}
        scale={0.2}
        eulerAngles={{x: -deg2rad(90), y: 0, z: 0}}
        model={{
          file: 'spaceship2.scnassets/shipRepaired.scn',
        }}
      />
    );
  }
}

export default RepairedShip;

function deg2rad(degrees) {
  return (degrees * Math.PI) / 180;
}
