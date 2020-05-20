/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import theme from './constants/theme';
import Login from './screens/Login';
import Recipe from './screens/Recipe';
import SavedRecipes from './screens/SavedRecipes';
import Settings from './screens/Settings';

const Tab = createBottomTabNavigator();
const Auth = createStackNavigator();

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
            <MaterialCommunityIcons name="format-list-bulleted" color={color} size={size} />
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
        <Auth.Navigator
          screenOptions={{
            headerTitle: '',
            headerStyle: {
              backgroundColor: theme.COLORS.WHITE,
              shadowColor: theme.COLORS.TRANSPARENT,
              shadowRadius: 0,
              shadowOffset: {
                  height: 0,
              }
            },
            headerTitleStyle: {
              fontWeight: 'normal',
            },
          }}>
          {true ? (
            <Auth.Screen name="Drink Mixr" component={App}/>
          ) : (
            <Auth.Screen name="Login" component={Login} options = {{
              // When logging out, a pop animation feels intuitive
              // You can remove this if you want the default 'push' animation
              animationTypeForReplace: 'pop',
            }}/>
          )}
        </Auth.Navigator>
      </NavigationContainer>
    );
  }
}

export default DrinkMixr;