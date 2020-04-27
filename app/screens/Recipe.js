import React, {Component} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {Button, Text, Input, Block} from 'galio-framework';
import theme from '../constants/theme';
import Title from '../components/Title';

class Recipe extends Component {
  render() {
    return (
      <Block flex>
        <Title title="Send Recipe" />
      </Block>
    );
  }
}

export default Recipe;

const styles = StyleSheet.create({

});
