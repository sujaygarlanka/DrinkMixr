import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Recipes from './Recipes';
import EditRecipe from './EditRecipe';

const Stack = createStackNavigator();

export default class SavedRecipes extends Component {
  render() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Recipes" component={Recipes} />
        <Stack.Screen name="Edit Recipe" component={EditRecipe} />
      </Stack.Navigator>
    );
  }
}
