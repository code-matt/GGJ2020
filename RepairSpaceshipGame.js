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
          position: {x: 0, y: 0, z: 0}, // this is the starting world position of the engine that needs to get to the
          // ship in order to repair it.
        },
      },
    },
  };

  repairSpaceshipSection = part => {
    this.setState(
      {
        starshipState: {
          ...this.state.starshipState,
          parts: {
            ...this.state.starshipState.parts,
            [part]: {
              ...this.state.starshipState.parts[part],
              isRepaired: true,
            },
          },
        },
      },
      () => {
        console.log(this.state);
      },
    );
  };

  render() {
    const {
      starshipState: {
        shipPosition,
        parts: {
          engine: {position: enginePosition, isRepaired: engineIsRepaired},
        },
      },
    } = this.state;
    return (
      <>
        <Ship position={shipPosition} />
        <Engine position={enginePosition} isRepaired={engineIsRepaired} />
      </>
    );
  }
}

export default RepairSpaceshipGame;
