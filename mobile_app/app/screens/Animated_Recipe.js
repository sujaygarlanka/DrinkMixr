// Trying to create a way to specify a recipe by animating the filling of a cup. 

import React, {Component} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {Button, Text, Input, Block, Radio} from 'galio-framework';
import NfcManager, {NfcEvents} from 'react-native-nfc-manager';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import theme from '../constants/theme';
import Title from '../components/Title';
import Animated, {interpolate} from 'react-native-reanimated';
const {Value, event} = Animated;

class Recipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tag: null
    };
    this.translateY = new Value(0);
    this.onGestureEvent = event([
      {
        nativeEvent: {
          translationY: this.translateY,
        },
      },
    ]);
  }

  // componentDidMount() {
  //   NfcManager.start();
  //   NfcManager.setEventListener(NfcEvents.DiscoverTag, tag => {
  //     this.setState({tag: tag.ndefMessage[0].payload});
  //     // NfcManager.setAlertMessageIOS('I got your tag!');
  //     this.sendRecipe(tag.ndefMessage[0].payload);
  //     NfcManager.unregisterTagEvent().catch(() => 0);
  //   });
  // }

  // componentWillUnmount() {
  //   NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
  //   NfcManager.unregisterTagEvent().catch(() => 0);
  // }

  // onHandlerStateChange = event => {
  //   if (event.nativeEvent.oldState == State.ACTIVE) {
  //     Animated.timing(this.translateY, {
  //       toValue: 0,
  //       duration: 1000,
  //       useNativeDriver: true
  //     }).start();
  //   }
  // };

  render() {
    const scaleY = interpolate(this.translateY, {
      inputRange: [-1, 0],
      outputRange: [-1, 0],
    });

    return (
      <View style={{flex: 1}}>
        <Title title="Send Recipe" />
        <View style={styles.ingredients}>
          <View
            style={{
              flex: 1,
              justifyContent: 'space-evenly',
              paddingRight: 10,
              paddingLeft: 10
            }}>
            <View style={styles.ingredient}>
              <Radio initialValue={true} label="Lemonade" color="primary" onChange={() => console.log('bye')}/>
              <Text style={styles.ingredientAmount}>100</Text>
            </View>
            <View style={styles.ingredient}>
              <Radio label="Sprite" color="info" />
              <Text style={styles.ingredientAmount}>100</Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'space-evenly',
              paddingRight: 10,
              paddingLeft: 10
            }}>
            <View style={styles.ingredient}>
              <Radio label="Coke" color="error" />
              <Text style={styles.ingredientAmount}>100</Text>
            </View>
            <View style={styles.ingredient}>
              <Radio label="Rum" color="warning" />
              <Text style={styles.ingredientAmount}>100</Text>
            </View>
          </View>
        </View>
        <PanGestureHandler onGestureEvent={this.onGestureEvent}>
          <Animated.View style={[styles.cup]}>
            <Animated.View
              style={[
                styles.box,
                {
                  transform: [{scaleY}],
                },
              ]}
            />
          </Animated.View>
        </PanGestureHandler>
        <View style={styles.sendButton}>
          <Button
            color={theme.COLORS.PRIMARY}
            shadowColor={theme.COLORS.PRIMARY}
            round
            onPress={this.detectMachine}
          />
        </View>
      </View>
    );
  }

  // detectMachine = async () => {
  //   try {
  //     await NfcManager.registerTagEvent();
  //   } catch (ex) {
  //     console.warn('ex', ex);
  //     NfcManager.unregisterTagEvent().catch(() => 0);
  //   }
  // }

  // sendRecipe = async (tag) => {
  //   tagString = ""
  //   for (var i = 3; i < tag.length; i++) {
  //     tagString += String.fromCharCode(tag[i]);
  //   }
  //   if (tagString == 'drink_mixr') {
  //     console.warn('Recipe sent');
  //   }
  // }
}

export default Recipe;

const styles = StyleSheet.create({
  ingredients: {
    flex: 1,
    flexDirection: 'row',
  },
  ingredient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ingredientAmount: {
    color: theme.COLORS.MUTED,
  },
  box: {
    // flex: 2,
    height: 1,
    width: 100,
    backgroundColor: 'red',
    // justifyContent: 'flex-end',
    // alignItems: 'flex-end',
  },
  cup: {
    flex: 6,
    backgroundColor: 'white',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  sendButton: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
