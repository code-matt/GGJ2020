import {ARKit} from 'react-native-arkit';
import React, {Component} from 'react';

class Engine extends Component {
  state = {
    linkedCamPos: {x: 0, y: 0, z: 0},
    linkedCamEulerAngles: {x: 0, y: 0, z: 0},
    linkedCamRotation: {x: 0, y: 0, z: 0},
  };
  componentDidUpdate(prevProps, prevState) {
    if (this.props.isPickedUp !== prevProps.isPickedUp) {
      if (this.props.isPickedUp) {
        this.intervalId = setInterval(async () => {
          let camInfo = await ARKit.getCamera();
          // console.log({camInfo});
          this.setState({
            linkedCamPos: {
              x: camInfo.position.x,
              y: camInfo.position.y,
              z: camInfo.position.z - 0.3,
            },
            linkedCamRotation: camInfo.rotation,
            linkedCamEulerAngles: camInfo.eulerAngles,
          });
        }, 50);
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
          text="I am a broken engine"
          position={
            this.props.isPickedUp
              ? this.state.linkedCamPos
              : this.props.position
          }
          eulerAngles={this.state.linkedCamEulerAngles}
          rotation={this.state.linkedCamEulerAngles}
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
