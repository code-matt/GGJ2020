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

import {ARKit, withProjectedPosition} from 'react-native-arkit';

import Dialog from 'react-native-dialog';
import CountDown from 'react-native-countdown-component';
var Sound = require('react-native-sound');
Sound.setCategory('Playback');

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class App extends Component {
  constructor(props) {
    super(props);
    console.disableYellowBox = true;
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
      placementCursorPosition: {x: 0, y: 0, z: 0},
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.setBuildLocation && this.state.setBuildLocation) {
      this.buildPositionInterval = setInterval(async () => {
        const hits = await ARKit.hitTestPlanes(
          {
            x: Number(width / 2),
            y: Number(height / 2),
          },
          1,
        );
        // console.log(hits.results);
        if (hits.results && hits.results.length && hits.results[0]) {
          this.setState(
            {
              placementCursorPosition: hits.results[0].position,
            },
            () => console.log(this.state),
          );
        }
      }, 100);
    }
    if (prevState.setBuildLocation && !this.state.setBuildLocation) {
      clearInterval(this.buildPositionInterval);
    }
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

  handleBuildLocationPress = () => {
        /**
    |--------------------------------------------------
    | NEXT: if setCursorPosition then fire off multipeer event to start game with buildPosition!
    |--------------------------------------------------
    */
   if (this.state.setBuildLocation) {
    this.setState({
      waitingForPlayers: false,
      setBuildLocation: false,
      gameStarted: true,
    });
    return;
  }
  }

  renderWaitingForPlayers = () => {
    return (
      <SafeAreaView
        style={{
          position: 'absolute',
          flex: 1,
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          zIndex: 6,
          // justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 30,
            paddingTop: 80,
            flex: 1,
          }}>
          <Text
            style={{
              fontSize: 18,
              color: 'white',
              textAlign: 'center',
              paddingHorizontal: 30,
            }}>
            Map as much as your game play environment as possible to share with
            your fellow players when you start! When you press start, look at an
            interesting area together.
          </Text>
        </View>
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
            marginBottom: 100,
          }}>
          <Button
            onPress={() => {
              this.setState({
                waitingForPlayers: false,
                gameStarted: false,
                setBuildLocation: true,
              });
            }}
            title={'Start Game'}
          />
        </View>
      </SafeAreaView>
    );
  };

  renderGameTimer = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: 40,
          right: 40,
          width: Dimensions.get('window').width,
          height: 100,
          flex: 1,
          zIndex: 3,
        }}>
        <View style={{justifyContent: 'flex-end', flexDirection: 'row'}}>
          <CountDown
            until={60}
            onFinish={() => {
              this.onGameOverLose();
            }}
            onPress={() => {}}
            size={20}
            timeToShow={['S']}
            running={this.state.gameStarted}
          />
        </View>
      </View>
    );
  };

  onGameOverLose = () => {
    this.setState({
      gameOver: true,
      gameLost: true,
    });
  };

  renderGameOver = () => {};

  renderSetBuildLocation = () => {
    return (
      <SafeAreaView
        onTouchEnd={this.handleBuildLocationPress}
        style={{
          position: 'absolute',
          flex: 1,
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          zIndex: 6,
          // justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 30,
            paddingTop: 80,
            flex: 1,
          }}>
          <Text
            style={{
              fontSize: 20,
              color: 'white',
              textAlign: 'center',
              paddingHorizontal: 30,
            }}>
            Select an area with a few meters of open space to build your
            starship in.
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 30,
            paddingTop: 50,
            flex: 1,
          }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: '600',
              color: 'white',
              textAlign: 'center',
              paddingHorizontal: 30,
            }}>
              Tap the screen to set Starship Build Location
          </Text>
        </View>
      </SafeAreaView>
    );
  };

  render() {
    return (
      <>
        {this.state.gameOver && this.renderGameOver()}
        <View
          pointerEvents={'box-none'}
          style={{
            position: 'absolute',
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            flex: 1,
            zIndex: 4,
          }}>
          {this.state.setBuildLocation && this.renderSetBuildLocation()}
          {!this.state.setBuildLocation &&
            !this.state.gameStarted &&
            !this.state.waitingForPlayers &&
            this.renderMainMenu()}
          {this.state.waitingForPlayers && this.renderWaitingForPlayers()}
          {this.renderHostGameDialog()}
          {this.renderJoinGameDialog()}
          {(this.state.waitingForPlayers || this.state.gameStarted) &&
            this.renderGameTimer()}
        </View>
        <View
          style={{flex: 1, position: 'relative'}}
          onTouchEnd={e => {
            console.log('touched');
            this.touchXStart = e.nativeEvent.pageX;
            this.handlePress(e);
          }}>
          <ARKit
            debug={this.state.waitingForPlayers}
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
              <RepairSpaceshipGame
                gameStarted={this.state.gameStarted}
                ref={node => (this.game = node)}
              />
            )}
            {this.state.setBuildLocation && (
              <ARKit.Plane
                shape={{
                  width: 0.2,
                  height: 0.2,
                }}
                position={this.state.placementCursorPosition}
                eulerAngles={{x: Math.PI / 2, y: 0, z: 0}}
                transition={{duration: 0.3}}
              />
            )}
          </ARKit>
        </View>
      </>
    );
  }
}

export default App;
