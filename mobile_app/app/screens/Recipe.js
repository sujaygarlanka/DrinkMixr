import React, {Component} from 'react';
import {StyleSheet, View, ScrollView, RefreshControl} from 'react-native';
import {connect} from 'react-redux';
import Slider from '@react-native-community/slider';
import {Button, Text} from 'galio-framework';
import NfcManager, {NfcEvents} from 'react-native-nfc-manager';
import Dialog from 'react-native-dialog';
import theme from '../constants/theme';
import constants from '../constants/constants';
import Title from '../components/Title';
import {loadConfiguration, sendRecipe, saveRecipe, getRecipes} from '../actions/actions';

class Recipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipe: {},
      showDialog: false,
      isLoading: false,
      recipeName: null,
      priming: false,
    };
  }

  // Whenever error prop updates from any screen, show error page
  componentDidUpdate(prevProps) {
    if (this.props.error != null) {
      this.props.navigation.navigate('Error');
    }
    if (JSON.stringify(Object.keys(prevProps.ingredients)) != JSON.stringify(Object.keys(this.props.ingredients))) {
      this.setUpRecipeData(false);
    }
  }

  async componentDidMount() {
    NfcManager.start();
    NfcManager.setEventListener(NfcEvents.DiscoverTag, tag => {
      // NfcManager.setAlertMessageIOS('I got your tag!');
      if (this.state.priming) {
        this.props.sendRecipe(
          tag.ndefMessage[0].payload,
          this.getPrimingRecipe(),
          this.state.priming,
        );
      } else {
        this.props.sendRecipe(
          tag.ndefMessage[0].payload,
          this.state.recipe,
          this.state.priming,
        );
      }
      this.setState({priming: false});

      NfcManager.unregisterTagEvent().catch(() => 0);
    });
    this.setUpRecipeData(true);
  }

  componentWillUnmount() {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    NfcManager.unregisterTagEvent().catch(() => 0);
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={{
          flex: 1,
        }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isLoading}
            onRefresh={this.refreshPage}
          />
        }>
        <Dialog.Container visible={this.state.showDialog}>
          <Dialog.Title>Recipe Name</Dialog.Title>
          <Dialog.Input
            style={{color: 'black'}}
            onChangeText={text => this.setState({recipeName: text})}
          />
          <Dialog.Button
            label="Cancel"
            onPress={() => this.setState({showDialog: false, recipeName: null})}
          />
          <Dialog.Button
            label="Save"
            onPress={async () => {
              this.setState({showDialog: false, isLoading: true});
              let recipe = Object.assign(
                {name: this.state.recipeName},
                this.state.recipe,
              );
              await this.props.saveRecipe(recipe);
              this.setState({isLoading: false});
            }}
          />
        </Dialog.Container>
        <View style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingRight: '5%',
              marginTop: 15,
            }}>
            <Title title="Send Recipe" />
            <Button
              onlyIcon
              icon="droplet"
              iconFamily="feather"
              iconSize={25}
              color={theme.COLORS.PRIMARY}
              shadowColor={theme.COLORS.PRIMARY}
              iconColor="#fff"
              style={{width: 60, height: 40}}
              onPress={() => this.detectMachine(true)}
            />
          </View>
          <View style={{flex: 4}}>{this.getSliderView()}</View>
          <View
            style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
            <Button
              color={theme.COLORS.PRIMARY}
              shadowColor={theme.COLORS.PRIMARY}
              round
              onPress={() => this.detectMachine(false)}
              text="Send">
              Send
            </Button>
            <Button
              color={theme.COLORS.INFO}
              shadowColor={theme.COLORS.INFO}
              round
              onPress={() => this.setState({showDialog: true})}
              style={{marginTop: 15}}
              text="Save">
              Save
            </Button>
          </View>
        </View>
      </ScrollView>
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
    Object.entries(this.props.ingredients).map(([ingredient, value]) => {
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
                value={0}
                step={0.1}
                style={{color: colors[index], borderRadius: 500}}
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

  refreshPage = () => {
    this.setState({recipeName: null});
    this.setUpRecipeData(true);
  };

  setUpRecipeData = async (loadFromAPI) => {
    this.setState({isLoading: true});
    let ingredients = null;
    if (loadFromAPI == true) {
      let response = await this.props.loadConfiguration();
      ingredients = response.ingredients;
      await this.props.getRecipes();
    }
    else {
      ingredients = JSON.parse(JSON.stringify(this.props.ingredients));
    }
    let recipe = {};
    Object.entries(ingredients).map(([ingredient, value]) => {
      recipe[ingredient] = 0;
    });
    this.setState({
      recipe: recipe,
      isLoading: false,
    });
  };

  getPrimingRecipe = () => {
    let primeRecipe = {};
    Object.entries(this.props.ingredients).map(([ingredient, value]) => {
      primeRecipe[ingredient] = this.props.tubes[value.motor];
    });
    return primeRecipe;
  };

  detectMachine = async priming => {
    await this.setState({priming});
    try {
      await NfcManager.registerTagEvent();
    } catch (ex) {
      console.warn('ex', ex);
      NfcManager.unregisterTagEvent().catch(() => 0);
    }
    // To test sending recipes
    // if (this.state.priming) {
    //   this.props.sendRecipe(
    //     'drink_mixr',
    //     this.getPrimingRecipe(),
    //     this.state.priming,
    //   );
    // } else {
    //   this.props.sendRecipe(
    //     'drink_mixr',
    //     this.state.recipe,
    //     this.state.priming,
    //   );
    // }
    // await this.setState({priming: false});
  };
}

function mapStateToProps(state) {
  return {
    ingredients: state.ingredients,
    motors: state.motors,
    tubes: state.tubes,
    error: state.error
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadConfiguration: () => dispatch(loadConfiguration()),
    sendRecipe: (tag, recipe, priming) =>
      dispatch(sendRecipe(tag, recipe, priming)),
    saveRecipe: recipe => dispatch(saveRecipe(recipe)),
    getRecipes: () => dispatch(getRecipes()),
    set: data => dispatch({type: 'SET', data: data}),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Recipe);

const styles = StyleSheet.create({
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '70%',
    justifyContent: 'space-between',
    paddingLeft: '5%',
    paddingRight: '5%',
    marginBottom: 15,
  },
});
