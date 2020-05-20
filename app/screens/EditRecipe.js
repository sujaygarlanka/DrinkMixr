import React, {Component} from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import {Button, Text, Input, Slider, Icon} from 'galio-framework';
import NfcManager, {NfcEvents} from 'react-native-nfc-manager';
import theme from '../constants/theme';
import constants from '../constants/constants';
import Title from '../components/Title';
import Dialog from 'react-native-dialog';

const username = 'Sujay Garlanka';

class EditRecipe extends Component {
  constructor(props) {
    super(props);
    let recipeName = this.props.route.params.recipe.name;
    delete this.props.route.params.recipe.name;
    let recipe = this.props.route.params.recipe;
    let ingredients = this.props.route.params.ingredients;
    let shouldDisable = !Object.keys(recipe).every(ingredient => ingredients.includes(ingredient));
    console.log(shouldDisable)
    this.state = {
      recipeName,
      recipe,
      ingredients,
      maximumRecipeValue: 17,
      refreshing: false,
      shouldDisable,
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
  }

  componentWillUnmount() {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    NfcManager.unregisterTagEvent().catch(() => 0);
  }

  render() {
    let saveButtonColor = this.state.shouldDisable ? theme.COLORS.GREY : theme.COLORS.PRIMARY;
    return (
      <View style={{flex: 1}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Button
            shadowless
            style={styles.backButton}
            onPress={() => this.props.navigation.navigate('Recipes')}>
            <Icon
              size={theme.SIZES.BASE * 1.5}
              name="arrow-left"
              family="simple-line-icon"
              color={theme.COLORS.PRIMARY}
            />
          </Button>
          <Text h3 style={{fontWeight: '300', paddingLeft: '5%'}}>
            Edit Recipe
          </Text>
        </View>
        <View style={{flex: 4}}>{this.getSliderView()}</View>
        <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
          <Button
            color={saveButtonColor}
            shadowColor={saveButtonColor}
            round
            disabled={true}
            onPress={this.detectMachine}>
            Send
          </Button>
          <Button
            color={theme.COLORS.INFO}
            shadowColor={theme.COLORS.INFO}
            round
            onPress={this.saveRecipe}
            style={{marginTop: 15}}>
            Save
          </Button>
          <Button
            color={theme.COLORS.ERROR}
            shadowColor={theme.COLORS.ERROR}
            round
            onPress={this.deleteRecipe}
            style={{marginTop: 15}}>
            Delete
          </Button>
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
    Object.entries(this.state.recipe).map(([ingredient, value]) => {
      sliders.push(
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text h5 style={{fontWeight: '300', padding: 10}}>
            {ingredient}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 4, paddingLeft: 10}}>
              <Slider
                activeColor={colors[index]}
                maximumValue={this.maximumRecipeValue}
                value={value}
                step={0.1}
                thumbStyle={{borderColor: colors[index]}}
                onValueChange={value => {
                  let {recipe} = this.state;
                  recipe[ingredient] = Math.round(value * 100) / 100;
                  this.setState({recipe});
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
        </View>,
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

  saveRecipe = () => {
    let body = this.state.recipe;
    fetch(constants.API + '/recipes?user_name=' + username, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).catch(error => console.log(error));
  };

  sendRecipe = async tag => {
    tagString = '';
    for (var i = 3; i < tag.length; i++) {
      tagString += String.fromCharCode(tag[i]);
    }
    if (tagString == 'drink_mixr') {
      let body = {
        user_name: username,
        order: this.state.recipe,
      };
      fetch(API + '/order', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }).catch(error => console.log(error));
    }
  };
}

export default EditRecipe;

const styles = StyleSheet.create({
  backButton: {
    width: theme.SIZES.BASE,
    backgroundColor: 'transparent',
    elevation: 0,
  },
});
