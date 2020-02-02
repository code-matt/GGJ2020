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
var Sound = require('react-native-sound');
Sound.setCategory('Playback');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      waitingForPlayers: false,
      gameStarted: false,
      isHost: false,
      connectedPeers: [],
      hostGameName: null,
      showHostGameDialog: false,
      joinGameName: null,
      showJoinGameDialog: false,
      engineLocation: {x: 0, y: 0, z: 0},
    };
  }

  startHosting = () => {
    this.setState(
      {
        waitingForPlayers: true,
        // gameStarted: true,
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
          disabled={!this.state.hostGameName}
          style={{
            color: this.state.hostGameName ? 'blue' : 'grey',
          }}
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
          disabled={!this.state.joinGameName}
          style={{
            color: this.state.joinGameName ? 'blue' : 'grey',
          }}
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

            var whoosh = new Sound(
              'buttonpress.wav',
              Sound.MAIN_BUNDLE,
              error => {
                if (error) {
                  console.log('failed to load the sound', error);
                  return;
                }
                // loaded successfully
                console.log(
                  'duration in seconds: ' +
                    whoosh.getDuration() +
                    'number of channels: ' +
                    whoosh.getNumberOfChannels(),
                );

                // Play the sound with an onEnd callback
                whoosh.play(success => {
                  if (success) {
                    console.log('successfully finished playing');
                  } else {
                    console.log('playback failed due to audio decoding errors');
                  }
                });
              },
            );

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
    let pageX = Number(e.nativeEvent.pageX);
    let pageY = Number(e.nativeEvent.pageY);
    let hits = await ARKit.hitTestSceneObjects({
      x: pageX,
      y: pageY,
    });
    let id = hits.results && hits.results.length && hits.results[0].id;
    if (id) {
      console.log('object hit!', hits.results[0]);
      const {position} = hits.results[0];
      console.log({position});
      // debugger
      switch (id) {
        case 'engine':
        case 'cockpit':
        case 'nosecone':
          let pickedUp = this.game.isPartPickedUp(id);
          if (pickedUp) {
            this.game.pickupSpaceshipPart(id, false, pickedUp.position);
            Vibration.vibrate(500);
          } else {
            this.game.pickupSpaceshipPart(id, true);
            Vibration.vibrate(500);
          }
          break;
        case 'ship':
          Vibration.vibrate(500);
          break;
        default:
          break;
      }
    } else {
      hits = await ARKit.hitTestPlanes(
        {
          x: pageX,
          y: pageY,
        },
        1,
      );
      if (hits.results && hits.results.length) {
        console.log('surface hit!', hits.results[0]);
      } else {
      }
    }

    console.log(hits);
  };

  renderWaitingForPlayers = () => {
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
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 30,
              color: 'white',
            }}>
            Waiting for players to join.
          </Text>
        </View>
        <Text
          style={{
            fontSize: 24,
            color: 'white',
          }}>
          Connected players:{' '}
          <Text
            style={{
              fontSize: 30,
              color: 'white',
              fontWeight: '600',
            }}>
            {this.state.connectedPeers.length}
          </Text>
        </Text>
        <View
          style={{
            marginTop: 80,
          }}>
          <Button
            onPress={() => {
              this.setState({
                waitingForPlayers: false,
                gameStarted: true,
              });
            }}
            title={'Start Game'}
          />
        </View>
      </SafeAreaView>
    );
  };

  render() {
    return (
      <>
        {!this.state.gameStarted &&
          !this.state.waitingForPlayers &&
          this.renderMainMenu()}
        {this.state.waitingForPlayers && this.renderWaitingForPlayers()}
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
              let {data} = event.nativeEvent;
              console.log(data);
              if (data.type === 'userEvent') {
                switch (data.payload.eventName) {
                  case 'part_move':
                    this.game.moveSpaceshipPart(
                      data.payload.partName,
                      data.payload.position,
                    );
                    break;
                  case 'part_placed':
                    this.game.placeSpaceshipObject(
                      data.payload.partName,
                      data.payload.position,
                    );
                    break;
                  default:
                    break;
                }
              }
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
            {/* {this.state.objectPosition && this.renderObject()} */}
            {this.state.gameStarted && (
              <RepairSpaceshipGame ref={node => (this.game = node)} />
            )}
          </ARKit>
        </View>
      </>
    );
  }
}

export default App;
