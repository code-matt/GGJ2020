import {ARKit} from 'react-native-arkit';
import React, {Component} from 'react';

function distanceVector(v1, v2) {
  var dx = v1.x - v2.x;
  var dy = v1.y - v2.y;
  var dz = v1.z - v2.z;

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
class Fin extends Component {
  state = {
    frontOfCameraPosition: {x: 0, y: 0, z: 1},
  };
  componentDidUpdate(prevProps, prevState) {
    if (this.props.isPickedUp !== prevProps.isPickedUp) {
      if (this.props.isPickedUp) {
        this.intervalId = setInterval(async () => {
          let frontOfCameraPosition = await ARKit.getFrontOfCamera();
          this.setState(
            {
              frontOfCameraPosition: {
                x: frontOfCameraPosition.x,
                y: frontOfCameraPosition.y,
                z: frontOfCameraPosition.z,
              },
            },
            () => {
              if (
                distanceVector(
                  this.state.frontOfCameraPosition,
                  this.props.shipPosition,
                ) < 0.05
              ) {
                this.props.placeSpaceshipObject(
                  'fin',
                  this.state.frontOfCameraPosition,
                );
                ARKit.sendDataToAllPeers({
                  type: 'userEvent',
                  payload: {
                    eventName: 'part_placed',
                    partName: 'fin',
                    position: this.state.frontOfCameraPosition,
                  },
                });
              } else {
                ARKit.sendDataToAllPeers({
                  type: 'userEvent',
                  payload: {
                    eventName: 'part_move',
                    partName: 'fin',
                    position: frontOfCameraPosition,
                  },
                });
              }
            },
          );
        }, 100);
      } else {
        clearInterval(this.intervalId);
      }
    }
  }

  render() {
    return (
      <ARKit.Model
        scale={0.15}
        model={{
          file: 'spaceship2.scnassets/shipFin.scn',
        }}
        transition={{duration: 0.3}}
        position={
          this.props.isPickedUp
            ? this.state.frontOfCameraPosition
            : this.props.position
        }
        id={'fin'}
        key={`fin-${this.props.isRepaired ? '-repaired' : '-notrepaired'}`}
      />
    );
  }
}

export default Fin;
