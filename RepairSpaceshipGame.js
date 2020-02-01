import React, {Component} from 'react';

import Cockpit from './Cockpit';
import Engine from './Engine';
import NoseCone from './NoseCone';
import RepairedShip from './RepairedShip';
import ShipNeedsRepair from './ShipNeedsRepair';
import Ship from './Ship';

class RepairSpaceshipGame extends Component {
  state = {
    starshipState: {
      isRepaired: false,
      shipPosition: {x: -1, y: -0.3, z: 0.5},
      parts: {
        engine: {
          isRepaired: false,
          isPickedUp: false,
          position: {x: 0, y: 0, z: 0}, // this is the starting world position of the engine that needs to get to the
          // ship in order to repair it.
        },
        cockpit: {
          isRepaired: false,
          isPickedUp: false,
          position: {x: 0.01, y: 0, z: 0},
        },
        noseCone: {
          isRepaired: false,
          isPickedUp: false,
          position: {x: 0, y: 0.02, z: 0},
        },
      },
    },
  };

  isShipRepaired = () => {
    return this.state.starshipState.parts.engine.isRepaired;
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

  pickupSpaceshipPart = (part, pickedUp) => {
    this.setState(
      {
        starshipState: {
          ...this.state.starshipState,
          parts: {
            ...this.state.starshipState.parts,
            [part]: {
              ...this.state.starshipState.parts[part],
              isPickedUp: pickedUp,
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
    const {engine} = this.props;
    // console.log(engine);
    const {
      starshipState: {
        shipPosition,
        parts: {
          engine: {
            position: enginePosition,
            isRepaired: engineIsRepaired,
            isPickedUp: enginePickedUp,
          },
          noseCone: {
            position: noseConePosition,
            isRepaired: noseConeIsRepaired,
            isPickedUp: noseConePickedUp,
          },
          cockpit: {
            position: cockpitPosition,
            isRepaired: cockpitIsRepaired,
            isPickedUp: cockpitPickedUp,
          },
        },
      },
    } = this.state;

    const isShipRepaired = this.isShipRepaired();

    return (
      <>
        <Ship position={shipPosition} isShipRepaired={isShipRepaired} />
        <Engine
          position={enginePosition}
          isRepaired={engineIsRepaired}
          isPickedUp={enginePickedUp}
        />
        <NoseCone position={noseConePosition} />
        <Cockpit position={cockpitPosition} />
        <RepairedShip />
        <ShipNeedsRepair />
      </>
    );
  }
}

export default RepairSpaceshipGame;
