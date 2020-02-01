import React, {Component} from 'react';
import ARKit from 'react-native-arkit/ARKit';

class NoseCone extends Component {
  state = {};
  render() {
    const {noseCone} = this.props;
    return (
      <ARKit.Model
        position={noseCone}
        scale={0.01}
        model={{
          file: 'spaceship.scnassets/shipNosecone.scn',
        }}
      />
    );
  }
}

export default NoseCone;
