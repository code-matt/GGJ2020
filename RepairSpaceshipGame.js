import React, {Component} from 'react';

import Ship from './Ship';
import Engine from './Engine';

class RepairSpaceshipGame extends Component {
  state = {
    starshipState: {
      isRepaired: false,
      shipPosition: {x: -1, y: -0.3, z: 0.5},
      parts: {
        engine: {
          isRepaired: false,
          isPickedUp: false,
          enginePosition: {x: 0, y: 0, z: 0}, // this is the starting world position of the engine that needs to get to the
          // ship in order to repair it.
        },
      },
    },
  };
  render() {
    const {engine} = this.props;
    console.log(engine);
    const {
      starshipState: {
        shipPosition,
        parts: {
          engine: {enginePosition},
        },
      },
    } = this.state;
    return (
      <>
        <Ship position={shipPosition} />
        <Engine position={engine} />
      </>
    );
  }
}

export default RepairSpaceshipGame;
