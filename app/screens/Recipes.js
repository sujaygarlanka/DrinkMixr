import React, {Component} from 'react';
import {connect} from 'react-redux';
import {StyleSheet, View, ScrollView, RefreshControl} from 'react-native';
import {FAB} from 'react-native-paper';
import {Button, Text, Icon, Block} from 'galio-framework';
import theme from '../constants/theme';
import Title from '../components/Title';
import {loadConfiguration, getRecipes} from '../actions/actions';

const BASE_SIZE = theme.SIZES.BASE;
const COLOR_WHITE = theme.COLORS.WHITE;
const COLOR_GREY = theme.COLORS.MUTED;

class Recipes extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <ScrollView>
        <Title title="Saved Recipes" />
        {this.getRecipesView()}
      </ScrollView>
    );
  }

  getRecipesView = () => {
    var recipes = [];
    this.props.recipes.map(recipe => {
      console.log(recipe)
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
              {this.displayRecipe(recipe)}
            </Text>
          </Block>
          <Button
            shadowless
            style={styles.right}
            onPress={() => {
              this.props.navigation.navigate('Edit Recipe', {
                recipe: recipe,
                ingredients: Object.keys(this.props.ingredients),
              });
            }}>
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

  displayRecipe = recipe => {
    var formattedRecipe = '';
    Object.entries(recipe).map(([ingredient, value]) => {
      if (ingredient != 'name') {
        formattedRecipe += `${ingredient}: ${value} oz, `;
      }
    });
    formattedRecipe = formattedRecipe.slice(0, -2);
    return formattedRecipe;
  };
}

function mapStateToProps(state) {
  return {
    ingredients: state.ingredients,
    recipes: state.recipes,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadConfiguration: () => dispatch(loadConfiguration()),
    getRecipes: () => dispatch(getRecipes()),
    set: data => dispatch({type: 'SET', data: data}),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Recipes);

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
