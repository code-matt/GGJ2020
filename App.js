/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {View} from 'react-native';

import {ARKit} from 'react-native-arkit';

class App extends Component {
  state = {};

  handlePress = async (e) => {
    let hits = await ARKit.hitTestPlanes(
      {
        x: e.nativeEvent.pageX,
        y: e.nativeEvent.pageY,
      },
      1,
    );

    console.log(hits)
  }
  render() {
    return (
      <View
        style={{flex: 1, position: 'relative'}}
        onTouchEnd={e => {
          console.log('touched');
          this.touchXStart = e.nativeEvent.pageX;
          this.handlePress(e);
        }}>
        <ARKit
          style={{flex: 1}}
          debug
          planeDetection={ARKit.ARPlaneDetection.Horizontal}
          lightEstimationEnabled
          onARKitError={console.log} // if arkit could not be initialized (e.g. missing permissions), you will get notified here
        />
      </View>
    );
  }
}

export default App;
