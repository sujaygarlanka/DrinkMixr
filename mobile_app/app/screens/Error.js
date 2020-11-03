import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  StatusBar
} from 'react-native';
import {connect} from 'react-redux';
import {Button, Icon} from 'galio-framework';
import {BlurView} from '@react-native-community/blur';
import theme from '../constants/theme';
import Title from '../components/Title';

class Error extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar hidden={true} />
        <BlurView
          style={styles.absolute}
          blurType="light"
          blurAmount={40}
          reducedTransparencyFallbackColor="white"
        />
        <View style={{alignItems: 'flex-end', paddingRight: 10}}>
          <Button
            shadowless
            style={styles.closeButton}
            onPress={() => {
              this.props.set({error: null});
              this.props.navigation.goBack();
            }}
            >
            <Icon
              size={theme.SIZES.BASE * 3.0}
              name="close"
              family="evil-icons"
              color={theme.COLORS.PRIMARY}
            />
          </Button>
        </View>
        <Title title="Error" />
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            padding: '10%',
            backgroundColor: 'transparent',
          }}>
          {this.getBeautifulError()}
        </View>
      </View>
    );
  }

  getBeautifulError = () => {
    let displayLines = [];
    if (this.props.error != null) {
      let linesOfText = this.props.error.split('\n');
      linesOfText.forEach(function(line, index) {
        displayLines.push(<Text style={styles.errorText}>{line}</Text>);
      });
    }
    return displayLines;
  };
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
)(Error);

const styles = StyleSheet.create({
  closeButton: {
    width: 47,
    backgroundColor: 'transparent',
  },
  errorText: {
    color: theme.COLORS.MUTED,
    fontWeight: '300',
    fontSize: 20,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
