/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  SafeAreaView,
  Button,
  Vibration,
} from 'react-native';

import RepairSpaceshipGame from './RepairSpaceshipGame';

import {ARKit} from 'react-native-arkit';

import Dialog from 'react-native-dialog';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameStarted: false,
      isHost: false,
      connectedPeers: [],
      hostGameName: null,
      showHostGameDialog: false,
      joinGameName: null,
      showJoinGameDialog: false,
    };
  }

  startHosting = () => {
    this.setState(
      {
        gameStarted: true,
      },
      () => {
        ARKit.startBrowsingForPeers(this.state.hostGameName);
        Vibration.vibrate(300);
        this.setState({
          isHost: true,
        });
      },
    );
  };

  joinGame = () => {
    this.setState(
      {
        gameStarted: true,
      },
      () => {
        ARKit.advertiseReadyToJoinSession(this.state.joinGameName);
        Vibration.vibrate(300);
      },
    );
  };

  renderHostGameDialog = () => {
    return (
      <Dialog.Container visible={this.state.showHostGameDialog}>
        <Dialog.Title>Host New Game</Dialog.Title>
        <Dialog.Description>
          Enter a name for the game. Remember it so your friends can join!
        </Dialog.Description>
        <Dialog.Input
          style={{
            color: 'black',
          }}
          onChangeText={text => {
            this.setState({
              hostGameName: text,
            });
          }}
        />
        <Dialog.Button
          label="Cancel"
          onPress={() => {
            this.setState({
              hostGameName: null,
              showHostGameDialog: false,
            });
          }}
        />
        <Dialog.Button
          // disabled={this.state.hostGameName === ''}
          label="Ok"
          onPress={() => {
            this.setState(
              {
                showHostGameDialog: false,
              },
              () => {
                this.startHosting();
              },
            );
          }}
        />
      </Dialog.Container>
    );
  };

  renderJoinGameDialog = () => {
    return (
      <Dialog.Container visible={this.state.showJoinGameDialog}>
        <Dialog.Title>Join New Game</Dialog.Title>
        <Dialog.Description>
          Enter the name of a game to join.
        </Dialog.Description>
        <Dialog.Input
          style={{
            color: 'black',
          }}
          onChangeText={text => {
            this.setState({
              joinGameName: text,
            });
          }}
        />
        <Dialog.Button
          label="Cancel"
          onPress={() => {
            this.setState({
              joinGameName: null,
              showJoinGameDialog: false,
            });
          }}
        />
        <Dialog.Button
          // disabled={this.state.joinGameName && this.state.joinGameName !== ''}
          label="Ok"
          onPress={() => {
            this.setState(
              {
                showJoinGameDialog: false,
              },
              () => {
                this.joinGame();
              },
            );
          }}
        />
      </Dialog.Container>
    );
  };

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
        <Button
          title="Host New Game"
          style={{fontSize: 24, fontWeight: '600'}}
          onPress={() => {
            this.setState({
              showHostGameDialog: true,
            });
            console.log('host game');
          }}
        />
        <Button
          title="Join Existing Game"
          style={{fontSize: 24, fontWeight: '600'}}
          onPress={() => {
            this.setState({
              showJoinGameDialog: true,
            });
            console.log('join game');
          }}
        />
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

  renderGame = () => {};

  render() {
    return (
      <>
        {!this.state.gameStarted && this.renderMainMenu()}
        {this.renderHostGameDialog()}
        {this.renderJoinGameDialog()}
        <View
          style={{flex: 1, position: 'relative'}}
          onTouchEnd={e => {
            console.log('touched');
            this.touchXStart = e.nativeEvent.pageX;
            this.handlePress(e);
          }}>
          <ARKit
            style={{flex: 1}}
            planeDetection={ARKit.ARPlaneDetection.Horizontal}
            lightEstimationEnabled
            onARKitError={console.log} // if arkit could not be initialized (e.g. missing permissions), you will get notified here
            onMultipeerJsonDataReceived={event => {
              Vibration.vibrate(300);
              let {data} = event.nativeEvent;
              console.log(data);
            }}
            onPeerConnected={event => {
              Vibration.vibrate(1000);
              console.warn(
                `${event.nativeEvent.peer.id} - connected to multipeer`,
              );
              if (this.state.isHost) {
                let peersCopy = this.state.connectedPeers;
                peersCopy.push(event.nativeEvent.peer.id);
                this.setState(
                  {
                    peers: peersCopy,
                  },
                  () => {
                    if (this.state.isHost) {
                      ARKit.sendWorldmapData();
                    }
                  },
                );
              } else {
                const PATTERN = [1000, 2000, 1000, 2000, 1000, 2000, 1000];
                Vibration.vibrate(PATTERN);
                this.setState({
                  hostId: event.nativeEvent.peer.id,
                });
              }
            }}
            onPeerDisconnected={event => {
              Vibration.vibrate(1000);
              console.warn(
                `${event.nativeEvent.peer.id} - disconnected from multipeer`,
              );

              let peersCopy = this.state.connectedPeers;

              let peerIdx = peersCopy.findIndex(
                peerUUID => peerUUID === event.nativeEvent.peer.id,
              );
              peersCopy.splice(peerIdx, 1);
              this.setState({
                peers: peersCopy,
              });
            }}
            onPeerConnecting={event => {
              Vibration.vibrate(1000);
              console.warn(
                `${event.nativeEvent.peer.id} - is connecting to multipeer`,
              );
            }}>
            {this.state.gameStarted && <RepairSpaceshipGame />}
          </ARKit>
        </View>
      </>
    );
  }
}

export default App;
