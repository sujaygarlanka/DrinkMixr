import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'galio-framework';
import theme from '../constants/theme';

export default class Title extends Component {
  render() {
    return (
      <View style={styles.title}>
        <Text h3 style={{fontWeight: '300'}}>
          {this.props.title}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    width: '70%',
    paddingLeft: '5%',
    marginBottom: 15,
  },
});
