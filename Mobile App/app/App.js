/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {StatusBar} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from './constants/theme';
import Error from './screens/Error';
import Recipe from './screens/Recipe';
import SavedRecipes from './screens/SavedRecipes';
import Settings from './screens/Settings';

const Tab = createBottomTabNavigator();
const ErrorStack = createStackNavigator();

const reactNavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.COLORS.WHITE,
  },
};

function App() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Recipe"
        component={Recipe}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="cup" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Saved Recipes"
        component={SavedRecipes}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="format-list-bulleted"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({color, size}) => (
            <SimpleLineIcons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

class DrinkMixr extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <NavigationContainer theme={reactNavigationTheme}>
        <StatusBar barStyle="dark-content"/>
        <ErrorStack.Navigator
          screenOptions={{
            headerTitle: '',
            headerStyle: {
              backgroundColor: theme.COLORS.WHITE,
              shadowColor: theme.COLORS.TRANSPARENT,
              shadowRadius: 0,
              shadowOffset: {
                height: 0,
              },
              height: 50,
            },
            headerTitleStyle: {
              fontWeight: 'normal',
            },
            headerLeft: null,
          }}
          mode="modal">
          <ErrorStack.Screen name="Drink Mixr" component={App} />
          <ErrorStack.Screen
            name="Error"
            component={Error}
            options={{
              // When logging out, a pop animation feels intuitive
              // You can remove this if you want the default 'push' animation
              // animationTypeForReplace: 'push',
              headerShown: false,
              cardStyle: {backgroundColor: 'transparent'},
            }}
          />
        </ErrorStack.Navigator>
      </NavigationContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    error: state.error,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    set: data => dispatch({type: 'SET', data: data}),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DrinkMixr);
