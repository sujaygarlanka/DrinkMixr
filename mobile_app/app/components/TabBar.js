// Not currently used. Trying to use it for blurred Tab Bar
// Use this code <Tab.Navigator tabBar={props => <TabBar {...props} />}> in App.js to include this custom tab bar

import React from 'react';
import {StyleSheet} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {BottomTabBar} from '@react-navigation/bottom-tabs';

export default function TabBar(props) {
  return (
    <BlurView
      style={styles.blurView}
      blurType="regular"
      blurAmount={10}
      reducedTransparencyFallbackColor="white">
      <BottomTabBar {...props} style={styles.bottomTabBar} />
    </BlurView>
  );
}

const styles = StyleSheet.create({
  blurView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 0
  },
  bottomTabBar: {
    backgroundColor: 'transparent',
    elevation: 0
  },
});
