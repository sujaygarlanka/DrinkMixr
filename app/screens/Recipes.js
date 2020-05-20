import React, {Component} from 'react';
import {StyleSheet, View, ScrollView, RefreshControl} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {FAB} from 'react-native-paper';
import {Button, Text, Icon, Block} from 'galio-framework';
import theme from '../constants/theme';
import constants from '../constants/constants';
import Title from '../components/Title';

const BASE_SIZE = theme.SIZES.BASE;
const COLOR_WHITE = theme.COLORS.WHITE;
const COLOR_GREY = theme.COLORS.MUTED; // '#D8DDE1';
const username = 'robot';

class Recipes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredients: [],
      recipes: [],
      refreshing: false,
    };
  }

  componentDidMount() {
    this.refreshPage();
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={{
          flex: 1,
        }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.refreshPage}
          />
        }>
        <Title title="Saved Recipes" />
        {/* cards */}
        {this.getRecipesView()}
      </ScrollView>
    );
  }

  getRecipesView = () => {
    var recipes = [];
    let stateRecipes = this.state.recipes;
    stateRecipes.map(recipe => {
      recipes.push(
        <Block
          row
          center
          card
          shadow
          space="between"
          style={styles.card}
          key={recipe.name}>
          <FAB style={styles.fab} small icon="cup" color={theme.COLORS.WHITE} />
          <Block flex>
            <Text size={BASE_SIZE * 1.125}>{recipe.name}</Text>
            <Text size={BASE_SIZE * 0.875} muted>
              {JSON.stringify(recipe)}
            </Text>
          </Block>
          <Button
            shadowless
            style={styles.right}
            onPress={() => this.props.navigation.navigate('Edit Recipe', {
              recipe: recipe,
              ingredients: this.state.ingredients
            })}>
            <Icon
              size={BASE_SIZE * 1.5}
              name="arrow-right"
              family="simple-line-icon"
              color={COLOR_GREY}
            />
          </Button>
        </Block>,
      );
    });
    return recipes;
  };

  refreshPage = () => {
    this.getConfigurationData();
    this.getRecipes();
  }

  getConfigurationData = async () => {
    this.setState({refreshing: true});
    fetch(constants.API + '/configuration')
      .then(response => response.json())
      .then(responseJson => {
        ingredients = [];
        Object.entries(responseJson.ingredients).map(([ingredient, value]) => {
          ingredients.push(ingredient)
        });
        this.setState({
          ingredients,
          refreshing: false,
        });
      })
      .catch(error => console.log(error)); //to catch the errors if any
  };

  getRecipes = async () => {
    this.setState({refreshing: true});
    fetch(constants.API + '/recipes?user_name=' + username)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          recipes: responseJson,
          refreshing: false,
        });
      })
      .catch(error => console.log(error)); //to catch the errors if any
  };

  stringifyRecipe = recipe => {
    var recipe = '';
  };
}

export default Recipes;

const styles = StyleSheet.create({
  card: {
    borderColor: 'transparent',
    marginHorizontal: BASE_SIZE,
    marginVertical: BASE_SIZE / 2,
    padding: BASE_SIZE,
    backgroundColor: COLOR_WHITE,
    shadowOpacity: 0.4,
  },
  right: {
    width: BASE_SIZE * 2,
    backgroundColor: 'transparent',
    elevation: 0,
  },
  fab: {
    backgroundColor: theme.COLORS.PRIMARY,
    margin: 10,
    right: 5,
  },
});
