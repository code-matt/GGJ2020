import React, {Component} from 'react';
import {Vibration} from 'react-native';
import Cockpit from './Cockpit';
import Engine from './Engine';
import Nosecone from './NoseCone';
import RepairedShip from './RepairedShip';
import Fin from './Fin';
import Wing from './Wing';
import Door from './Door';
import ShipNeedsRepair from './ShipNeedsRepair';
import Ship from './Ship';
import {ARKit} from 'react-native-arkit';

import assembledShipData from './assmbledShipData';

function distanceVector(v1, v2) {
  var dx = v1.x - v2.x;
  var dy = v1.y - v2.y;
  var dz = v1.z - v2.z;

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
class RepairSpaceshipGame extends Component {
  constructor(props) {
    super(props);
    this.partRefs = {};
    this.state = {
      buildLocation: null,
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
            position: {x: 0.7, y: 0, z: 1},
          },
          // nosecone: {
          //   isRepaired: false,
          //   isPickedUp: false,
          //   position: {x: -0.5, y: 0.02, z: 0.5},
          // },
          fin: {
            isRepaired: false,
            isPickedUp: false,
            position: {x: -0.5, y: 0.02, z: 0.5},
          },
          wing: {
            isRepaired: false,
            isPickedUp: false,
            position: {x: 1.5, y: 0.02, z: -0.5},
          },
          ship: {
            isRepaired: false,
            isPickedUp: false,
            position: {x: -0.8, y: -0.3, z: 1.2},
          },
          door: {
            isRepaired: false,
            isPickedUp: false,
            position: {x: -0.8, y: -0.3, z: 1.2},
          },
        },
      },
    };
  }

  componentDidMount() {
    this.checkCompletionInterval = setInterval(() => {
      assembledShipData.forEach(part => {
        const offsetVector = {
          x: this.props.buildLocation.x + part.validOffset.x,
          y: this.props.buildLocation.y + part.validOffset.y,
          z: this.props.buildLocation.z + part.validOffset.z,
        };
        if (
          distanceVector(
            offsetVector,
            this.state.starshipState.parts[part.name].position,
          ) < 0.5
        ) {
          this.repairSpaceshipSection(part.name);
        }
      });
    }, 500);
  }

  componentWillMount() {
    clearInterval(this.checkCompletionInterval);
  }

  isPartPickedUp = part => {
    if (!this.state.starshipState.parts[part].isPickedUp) {
      return false;
    }
    return {
      position: this.state.starshipState.parts[part].position,
    };
  };

  isShipRepaired = () => {
    let repaired =
      this.state.starshipState.parts.engine.isRepaired &&
      this.state.starshipState.parts.cockpit.isRepaired &&
      this.state.starshipState.parts.fin.isRepaired &&
      this.state.starshipState.parts.wing.isRepaired &&
      this.state.starshipState.parts.door.isRepaired;
    return repaired;
  };

  placeSpaceshipObject = (part, position) => {
    this.setState(
      {
        starshipState: {
          ...this.state.starshipState,
          parts: {
            ...this.state.starshipState.parts,
            [part]: {
              ...this.state.starshipState.parts[part],
              isPickedUp: false,
              isRepaired: true,
              position,
            },
          },
        },
      },
      () => {
        console.log(this.state);
      },
    );
  };

  moveSpaceshipPart = (part, position) => {
    this.setState(
      {
        starshipState: {
          ...this.state.starshipState,
          parts: {
            ...this.state.starshipState.parts,
            [part]: {
              ...this.state.starshipState.parts[part],
              position,
            },
          },
        },
      },
      () => {
        console.log(this.state);
      },
    );
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
        if (this.isShipRepaired()) {
          Vibration.vibrate(500);
          Vibration.vibrate(500);
          Vibration.vibrate(500);
          this.props.endGame(true);
        }
      },
    );
  };

  renderDebugOffsets = () => {
    let keys = Object.keys(this.state.starshipState.parts);
    return keys.map(partName => {
      if (partName === 'ship') {
        return null;
      }
      let assembledDataIdx = assembledShipData.findIndex(
        d => d.name === partName,
      );
      const offsetVector = {
        x:
          this.props.buildLocation.x +
          assembledShipData[assembledDataIdx].validOffset.x,
        y:
          this.props.buildLocation.y +
          assembledShipData[assembledDataIdx].validOffset.y,
        z:
          this.props.buildLocation.z +
          assembledShipData[assembledDataIdx].validOffset.z,
      };
      return (
        <ARKit.Box
          position={offsetVector}
          shape={{width: 0.1, height: 0.1, length: 0.1, chamfer: 0.01}}
          material={{
            color: assembledShipData[assembledDataIdx].debugBoxColor,
          }}
        />
      );
    });
  };

  pickupSpaceshipPart = (part, pickedUp, position) => {
    this.setState(
      {
        starshipState: {
          ...this.state.starshipState,
          parts: {
            ...this.state.starshipState.parts,
            [part]: {
              ...this.state.starshipState.parts[part],
              isPickedUp: pickedUp,
              position: !pickedUp
                ? this.partRefs[part].state.frontOfCameraPosition
                : this.state.starshipState.parts[part].position,
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
    const {
      starshipState: {
        shipPosition,
        parts: {
          engine: {
            position: enginePosition,
            isRepaired: engineIsRepaired,
            isPickedUp: enginePickedUp,
          },
          // nosecone: {
          //   position: noseconePosition,
          //   isRepaired: noseconeIsRepaired,
          //   isPickedUp: noseconePickedUp,
          // },
          cockpit: {
            position: cockpitPosition,
            isRepaired: cockpitIsRepaired,
            isPickedUp: cockpitPickedUp,
          },
          wing: {
            position: wingPosition,
            isRepaired: wingIsRepaired,
            isPickedUp: wingPickedUp,
          },
          fin: {
            position: finPosition,
            isRepaired: finIsRepaired,
            isPickedUp: finPickedUp,
          },
          door: {
            position: doorPosition,
            isRepaired: doorIsRepaired,
            isPickedUp: doorPickedUp,
          },
          ship: {
            position: brokenShipPosition,
            isRepaired: brokenShipIsRepaired,
            isPickedUp: brokenShipPickedUp,
          },
        },
      },
    } = this.state;

    const isShipRepaired = this.isShipRepaired();

    return (
      <>
        <Ship
          buildLocation={{
            x: this.props.buildLocation.x + 0.2,
            y: this.props.buildLocation.y + 1,
            z: this.props.buildLocation.z - 1.5,
          }}
          isShipRepaired={isShipRepaired}
        />
        <Engine
          ref={node => (this.partRefs.engine = node)}
          placeSpaceshipObject={this.placeSpaceshipObject}
          position={enginePosition}
          isRepaired={engineIsRepaired}
          isPickedUp={enginePickedUp}
          shipPosition={shipPosition}
        />
        {/* <Nosecone
          ref={node => (this.partRefs.nosecone = node)}
          placeSpaceshipObject={this.placeSpaceshipObject}
          position={noseconePosition}
          isRepaired={noseconeIsRepaired}
          isPickedUp={noseconePickedUp}
          shipPosition={shipPosition}
        /> */}
        <Cockpit
          ref={node => (this.partRefs.cockpit = node)}
          placeSpaceshipObject={this.placeSpaceshipObject}
          position={cockpitPosition}
          isRepaired={cockpitIsRepaired}
          isPickedUp={cockpitPickedUp}
          shipPosition={shipPosition}
        />
        <Door
          ref={node => (this.partRefs.door = node)}
          placeSpaceshipObject={this.placeSpaceshipObject}
          position={doorPosition}
          isRepaired={doorIsRepaired}
          isPickedUp={doorPickedUp}
          shipPosition={shipPosition}
        />
        <Fin
          ref={node => (this.partRefs.fin = node)}
          placeSpaceshipObject={this.placeSpaceshipObject}
          position={finPosition}
          isRepaired={finIsRepaired}
          isPickedUp={finPickedUp}
          shipPosition={shipPosition}
        />
        <Wing
          ref={node => (this.partRefs.wing = node)}
          placeSpaceshipObject={this.placeSpaceshipObject}
          position={wingPosition}
          isRepaired={wingIsRepaired}
          isPickedUp={wingPickedUp}
          shipPosition={shipPosition}
        />
        {/* <RepairedShip /> */}
        <ShipNeedsRepair
          buildLocation={{
            x: this.props.buildLocation.x,
            y: this.props.buildLocation.y + 1,
            z: this.props.buildLocation.z,
          }}
          placeSpaceshipObject={this.placeSpaceshipObject}
          position={brokenShipPosition}
          isRepaired={brokenShipIsRepaired}
          isPickedUp={brokenShipPickedUp}
          shipPosition={shipPosition}
        />
        {this.renderDebugOffsets()}
      </>
    );
  }
}

export default RepairSpaceshipGame;
