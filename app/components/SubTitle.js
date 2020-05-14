import React, { Component } from 'react';
import {
    View,
    StyleSheet
  } from 'react-native';
import {Block, Text} from 'galio-framework';

export default class Title extends Component {
    render (){
        return (
            <View style={styles.title}>
                <Text h4 style={{fontWeight: '300'}}>{this.props.title}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  title: {
    alignItems: 'flex-start',
    width: '60%',
    paddingLeft: '5%',
    marginBottom: 15
  }
});