import React, {Component} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {Button, Text, Input, Block} from 'galio-framework';
import theme from '../constants/theme';
import Title from '../components/Title';
import SubTitle from '../components/SubTitle';

const API = 'https://stark-beach-45459.herokuapp.com';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      motors: {},
      ingredients: {}
    };
  }

  componentDidMount() {
    fetch(API + '/configuration')
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          ingredients: responseJson.ingredients,
          motors: responseJson.motors
        });
      })
      .catch(error => console.log(error)); //to catch the errors if any
  }

  render() {

    return (
      <View style={{flex: 1}}>
        <Title title="Settings" />
        <SubTitle title="Profile" />
        {/* <View style={{flex: 1, ju}}>
          <Image
            source={{
              uri: "https://image.flaticon.com/icons/svg/219/219986.svg",
            }}
            style={{width: 200, height: 200, borderRadius: 200 / 2}}
          />
        </View> */}
        <View style={{alignItems: 'center'}}>
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
        </View>
        <SubTitle title="Ingredients" />
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 3, alignItems: 'center', paddingLeft: 10}}>
            <Text>Ingredient</Text>
            <Input borderless placeholder="password"/>
            <Input placeholder="password" password/>
            <Input defaultValue="hello" placeholder="password" onChangeText={text => console.log(text)}/>
          </View>

          <View style={{flex: 1, alignItems: 'center'}}>
            <Text>Amount</Text>
            <Input placeholder="password" password/>
            <Input placeholder="password" password/>
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text>Motor</Text>
          </View>

          {/* <Button
            disabled
            round
            color={theme.COLORS.TRANSPARENT}
            style={styles.profileInfoFields}>
            <Text center color={theme.COLORS.MUTED}>
              Sujay Garlanka
            </Text>
          </Button> */}
          {/* <Button
            disabled
            round
            color={theme.COLORS.TRANSPARENT}
            style={styles.profileInfoFields}>
            <Text center color={theme.COLORS.MUTED}>
              sujay.garlanka@gmail.com
            </Text>
          </Button> */}
        </View>
        <View style={{backgroundColor: 'red'}}>
          <Button
            color={theme.COLORS.PRIMARY}
            shadowColor={theme.COLORS.PRIMARY}
            round
            onPress={() => console.log('Sign out')}>
            Sign Out
          </Button>
        </View>
      </View>
    );
  }
}

export default Settings;

const styles = StyleSheet.create({
  profileInfoFields: {
    borderColor: theme.COLORS.MUTED,
    marginVertical: 10,
  },
});
