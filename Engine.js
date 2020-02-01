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
                this.props.placeSpaceshipObject('engine');
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
    // console.log('engine is repaired', this.props.isRepaired);
    if (this.props.isRepaired) {
      return (
        <ARKit.Text
          text="I am a engine"
          position={this.props.position}
          font={{size: 0.04, depth: 0.03}}
          id={'engine'}
          material={{color: 'green'}}
          key="1"
        />
      );
    } else {
      return (
        <ARKit.Text
          transition={{duration: 0.3}}
          text="I am a broken engine"
          position={
            this.props.isPickedUp
              ? this.state.frontOfCameraPosition
              : this.props.position
          }
          eulerAngles={this.state.linkedCamEulerAngles}
          // rotation={this.state.linkedCamEulerAngles}
          font={{size: 0.04, depth: 0.03}}
          id={'engine'}
          material={{color: 'red'}}
          key="2"
        />
      );
    }
  }
}

export default Engine;
