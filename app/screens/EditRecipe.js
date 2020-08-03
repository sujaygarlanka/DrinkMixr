import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {Button, Text, Icon} from 'galio-framework';
import Slider from '@react-native-community/slider';
import NfcManager, {NfcEvents} from 'react-native-nfc-manager';
import theme from '../constants/theme';
import constants from '../constants/constants';
import {sendRecipe, saveRecipe, deleteRecipe} from '../actions/actions';

class EditRecipe extends Component {
  constructor(props) {
    super(props);
    let recipeName = this.props.route.params.recipe.name;
    let recipe = JSON.parse(JSON.stringify(this.props.route.params.recipe));
    delete recipe.name;
    let ingredients = this.props.route.params.ingredients;
    let shouldDisable = !Object.keys(recipe).every(ingredient =>
      ingredients.includes(ingredient),
    );
    this.state = {
      recipeName,
      recipe,
      ingredients,
      isLoading: false,
      shouldDisable,
    };
  }

  componentDidMount() {
    NfcManager.start();
    NfcManager.setEventListener(NfcEvents.DiscoverTag, tag => {
      // NfcManager.setAlertMessageIOS('I got your tag!');
      this.props.sendRecipe(tag.ndefMessage[0].payload, this.state.recipe, false);
      NfcManager.unregisterTagEvent().catch(() => 0);
    });
  }

  componentWillUnmount() {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    NfcManager.unregisterTagEvent().catch(() => 0);
  }

  render() {
    let sendButtonColor = this.state.shouldDisable
      ? theme.COLORS.GREY
      : theme.COLORS.PRIMARY;
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
          <Text h3 style={{fontWeight: '300', paddingLeft: '0%'}}>
            Edit Recipe
          </Text>
        </View>
        <View style={{flex: 4}}>{this.getSliderView()}</View>
        <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
          <Button
            color={sendButtonColor}
            shadowColor={sendButtonColor}
            round
            disabled={this.state.shouldDisable}
            onPress={this.detectMachine}>
            Send
          </Button>
          <Button
            color={theme.COLORS.INFO}
            shadowColor={theme.COLORS.INFO}
            round
            loading={this.state.isLoading}
            onPress={async () => {
              this.setState({isLoading: true});
              let recipe = Object.assign(
                {name: this.state.recipeName},
                this.state.recipe,
              );
              await this.props.saveRecipe(recipe);
              this.setState({isLoading: false});
              this.props.navigation.navigate('Recipes');
            }}
            style={{marginTop: 15}}>
            Save
          </Button>
          <Button
            color={theme.COLORS.ERROR}
            shadowColor={theme.COLORS.ERROR}
            round
            onPress={async () => {
              await this.props.deleteRecipe(this.state.recipeName);
              this.props.navigation.navigate('Recipes');
            }}
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
                minimumTrackTintColor={colors[index]}
                maximumValue={constants.MAXIMUM_DISPENSE_AMOUNT}
                value={value}
                step={0.1}
                // thumbStyle={{borderColor: colors[index]}}
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
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    sendRecipe: (tag, recipe, priming) => dispatch(sendRecipe(tag, recipe, priming)),
    saveRecipe: recipe => dispatch(saveRecipe(recipe)),
    deleteRecipe: recipeName => dispatch(deleteRecipe(recipeName)),
    set: data => dispatch({type: 'SET', data: data}),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditRecipe);

const styles = StyleSheet.create({
  backButton: {
    width: '10%',
    backgroundColor: 'transparent',
    elevation: 0,
    alignItems: 'flex-start',
  },
});
