import {ARKit} from 'react-native-arkit';
import React, {Component} from 'react';

function distanceVector(v1, v2) {
  var dx = v1.x - v2.x;
  var dy = v1.y - v2.y;
  var dz = v1.z - v2.z;

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
class Engine extends Component {
  state = {
    frontOfCameraPosition: {x: 0, y: 0, z: 0},
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
                  'engine',
                  this.state.frontOfCameraPosition,
                );
                ARKit.sendDataToAllPeers({
                  type: 'userEvent',
                  payload: {
                    eventName: 'part_placed',
                    partName: 'engine',
                    position: this.state.frontOfCameraPosition,
                  },
                });
              } else {
                ARKit.sendDataToAllPeers({
                  type: 'userEvent',
                  payload: {
                    eventName: 'part_move',
                    partName: 'engine',
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
      <ARKit.Text
        transition={{duration: 0.3}}
        text="I am a broken engine"
        position={
          this.props.isPickedUp
            ? this.state.frontOfCameraPosition
            : this.props.position
        }
        font={{size: 0.04, depth: 0.03}}
        id={'engine'}
        material={{color: this.props.isRepaired ? 'green' : 'red'}}
        key={`engine-${this.props.isRepaired ? '-repaired' : '-notrepaired'}`}
      />
    );
  }
}

export default Engine;
