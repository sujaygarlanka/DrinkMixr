import React, {Component} from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import {Button, Text, Input, Block, Radio, Slider} from 'galio-framework';
import NfcManager, {NfcEvents} from 'react-native-nfc-manager';
import theme from '../constants/theme';
import Title from '../components/Title';
import Dialog from "react-native-dialog";

const API = 'https://stark-beach-45459.herokuapp.com';

class Recipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredients: {},
      recipe: {},
    };
  }

  componentDidMount() {
    NfcManager.start();
    NfcManager.setEventListener(NfcEvents.DiscoverTag, tag => {
      this.setState({tag: tag.ndefMessage[0].payload});
      // NfcManager.setAlertMessageIOS('I got your tag!');
      this.sendRecipe(tag.ndefMessage[0].payload);
      NfcManager.unregisterTagEvent().catch(() => 0);
    });
    fetch(API + '/configuration')
      .then(response => response.json())
      .then(responseJson => {
        recipe = {};
        Object.entries(responseJson.ingredients).map(([ingredient, value]) => {
          recipe[ingredient] = 0;
        });
        this.setState({
          ingredients: responseJson.ingredients,
          recipe: recipe,
        });
      })
      .catch(error => console.log(error)); //to catch the errors if any
  }

  componentWillUnmount() {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    NfcManager.unregisterTagEvent().catch(() => 0);
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Title title="Send Recipe" />
        {/* <View style={{flex: 1, backgroundColor: 'red'}}></View> */}
        <View style={{flex: 4}}>{this.getSliderView()}</View>
        <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
          <Button
            color={theme.COLORS.PRIMARY}
            shadowColor={theme.COLORS.PRIMARY}
            round
            onPress={this.detectMachine}
          >Send</Button>
          <Button
            color={theme.COLORS.INFO}
            shadowColor={theme.COLORS.INFO}
            round
            onPress={this.saveRecipe}
            style={{marginTop: 15}}
          >Save</Button>
        </View>
      </View>
    );
  }

  getSliderView = () => {
    var index = 0;
    var sliders = [];
    const colors = [
      theme.COLORS.PRIMARY,
      theme.COLORS.INFO,
      theme.COLORS.ERROR,
      theme.COLORS.WARNING,
    ];
    Object.entries(this.state.ingredients).map(([ingredient, value]) => {
      sliders.push(
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text h5 style={{fontWeight: '300', padding: 10}}>
            {ingredient}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 4, paddingLeft: 10}}>
              <Slider
                activeColor={colors[index]}
                maximumValue={value.amount}
                value={0}
                step={0.1}
                thumbStyle = {{borderColor: colors[index]}}
                onValueChange={(value) => {
                  let {recipe} = this.state;
                  recipe[ingredient] = Math.round(value * 100) / 100;
                  this.setState({ recipe });
                }}
              />
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text>{this.state.recipe[ingredient]} oz</Text>
            </View>
          </View>
        </View>
      );
      index++;
    });
    return sliders;
  };

  detectMachine = async () => {
    try {
      await NfcManager.registerTagEvent();
    } catch (ex) {
      console.warn('ex', ex);
      NfcManager.unregisterTagEvent().catch(() => 0);
    }
  };

  saveRecipe = (username) => {
    let body = this.state.recipe;
    fetch(API + '/recipes?user_name=' + username, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .catch(error => console.log(error));
  };

  sendRecipe = async tag => {
    tagString = '';
    for (var i = 3; i < tag.length; i++) {
      tagString += String.fromCharCode(tag[i]);
    }
    if (tagString == 'drink_mixr') {
      let body = {
        user_name: 'Sujay Garlanka',
        order: this.state.recipe
      };
      fetch(API + '/order', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      .catch(error => console.log(error));
    }
  };
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
