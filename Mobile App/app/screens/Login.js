import React from 'react';
import {
  Alert,
  Dimensions,
  StyleSheet,
  View
} from 'react-native';
import {Block, Button, Icon} from 'galio-framework';
import theme from '../constants/theme';
import Title from '../components/Title';

const {width} = Dimensions.get('window');

const SOCIAL_ICON_SIZE = theme.SIZES.BASE * 1.5;
const SOCIAL_BTN_SIZE = theme.SIZES.BASE * 3;

class Login extends React.Component {
  state = {
    user: {},
  };

  render() {
    return (
      <Block flex style={styles.container}>
        <Title title="Login" />
        <Block flex={4} middle>
        </Block>
        <Block flex={2} middle>
            <Button
                round
                color={theme.COLORS.TRANSPARENT}
                shadowColor={theme.COLORS.MUTED}
                style={[styles.button, {borderColor: theme.COLORS.MUTED}]}
                onPress={() => console.log('Sign in google')}>
                <Icon
                size={SOCIAL_ICON_SIZE}
                name="google"
                family="font-awesome"
                color={theme.COLORS.MUTED}
                />
            </Button>
        </Block>
      </Block>
    );
  }
}

export default Login;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.WHITE
  },
  button: {
    marginVertical: 10,
    width: width * 0.89,
  },
});
