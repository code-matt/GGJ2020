/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {View, Text, Dimensions, SafeAreaView, Button} from 'react-native';

import {ARKit} from 'react-native-arkit';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameStarted: false,
      isHost: false,
      connectedPeers: [],
      starshipState: {
        isRepaired: false,
        parts: {
          engine: {
            isRepaired: false,
            enginePosition: {x: 0, y: 0, z: 0}, // this is the starting world position of the engine that needs to get to the
            // ship in order to repair it.
          },
        },
      },
    };
  }

  renderMainMenu = () => {
    return (
      <SafeAreaView
        style={{
          position: 'absolute',
          flex: 1,
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          zIndex: 2,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{color: '#fff', fontSize: 32}}>REPAIR IT</Text>
        <Button title="Join Game" style={{ fontSize: 24, fontWeight: '600' }} onPress={() => { console.log('host game') }} />
        <Button title="Start Game" style={{ fontSize: 24, fontWeight: '600' }} onPress={() => { console.log('join game') }} />
      </SafeAreaView>
    );
  };

  handlePress = async e => {
    let hits = await ARKit.hitTestPlanes(
      {
        x: e.nativeEvent.pageX,
        y: e.nativeEvent.pageY,
      },
      1,
    );

    console.log(hits);
  };
  render() {
    return (
      <>
        {!this.state.gameStarted && this.renderMainMenu()}
        <View
          style={{flex: 1, position: 'relative'}}
          onTouchEnd={e => {
            console.log('touched');
            this.touchXStart = e.nativeEvent.pageX;
            this.handlePress(e);
          }}>
          <ARKit
            style={{flex: 1}}
            // debug
            planeDetection={ARKit.ARPlaneDetection.Horizontal}
            lightEstimationEnabled
            onARKitError={console.log} // if arkit could not be initialized (e.g. missing permissions), you will get notified here
          />
        </View>
      </>
    );
  }
}

export default App;
