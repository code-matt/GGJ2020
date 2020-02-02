import React, {Component} from 'react';
import ARKit from 'react-native-arkit/ARKit';

function distanceVector(v1, v2) {
  var dx = v1.x - v2.x;
  var dy = v1.y - v2.y;
  var dz = v1.z - v2.z;

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
class Cockpit extends Component {
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
                  'cockpit',
                  this.state.frontOfCameraPosition,
                );
                ARKit.sendDataToAllPeers({
                  type: 'userEvent',
                  payload: {
                    eventName: 'part_placed',
                    partName: 'cockpit',
                    position: this.state.frontOfCameraPosition,
                  },
                });
              } else {
                ARKit.sendDataToAllPeers({
                  type: 'userEvent',
                  payload: {
                    eventName: 'part_move',
                    partName: 'cockpit',
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
    const {position} = this.props;

    return (
      <ARKit.Model
        id="cockpit"
        transition={{duration: 0.3}}
        position={
          this.props.isPickedUp ? this.state.frontOfCameraPosition : position
        }
        scale={0.01}
        model={{
          file: 'spaceship2.scnassets/shipCockpit.scn',
        }}
      />
    );
  }
}

export default Cockpit;
