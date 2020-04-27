import React, {Component} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {Button, Text, Input, Block} from 'galio-framework';
import theme from '../constants/theme';
import Title from '../components/Title';

class Profile extends Component {
//   shouldComponentUpdate(nextProps, nextState) {
//     return nextProps.user != null;
//   }

  render() {
    return (
      <Block flex>
        <Title title="Profile" />
        <Block flex center>
          <Image
            source={{
              uri: "https://image.flaticon.com/icons/svg/219/219986.svg",
            }}
            style={{width: 200, height: 200, borderRadius: 200 / 2}}
          />
        </Block>
        <Block flex center middle>
          <Button
            disabled
            round
            color={theme.COLORS.TRANSPARENT}
            style={styles.profileInfoFields}>
            <Text center color={theme.COLORS.MUTED}>
              Sujay Garlanka
            </Text>
          </Button>
          <Button
            disabled
            round
            color={theme.COLORS.TRANSPARENT}
            style={styles.profileInfoFields}>
            <Text center color={theme.COLORS.MUTED}>
              sujay.garlanka@gmail.com
            </Text>
          </Button>
        </Block>
        <Block flex center middle>
          <Button
            color={theme.COLORS.PRIMARY}
            shadowColor={theme.COLORS.PRIMARY}
            round
            onPress={() => console.log("Sign out")}>
            Sign Out
          </Button>
        </Block>
      </Block>
    );
  }
}

export default Profile;

const styles = StyleSheet.create({
  profileInfoFields: {
    borderColor: theme.COLORS.MUTED,
    marginVertical: 10,
  },
});
