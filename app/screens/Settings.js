import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {Button, Text, Input, Block} from 'galio-framework';
import theme from '../constants/theme';
import constants from '../constants/constants';
import Title from '../components/Title';
import SubTitle from '../components/SubTitle';

const username = "Sujay Garlanka";
const email = "sujay.garlanka@gmail.com";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      motors: {},
      ingredients: {},
      refreshing: false,
    };
  }

  componentDidMount() {
    this.getConfigurationData();
  }

  render() {
    return (
      <ScrollView
        // contentContainerStyle={{
        //   flex: 1,
        // }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.getConfigurationData}
          />
        }>
        <View style={{flex: 1}}>
          <Title title="Settings" />
          <SubTitle title="Profile" />
          {/* <View style={{flex: 1}}>
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
                {username}
              </Text>
            </Button>
            <Button
              disabled
              round
              color={theme.COLORS.TRANSPARENT}
              style={styles.profileInfoFields}>
              <Text center color={theme.COLORS.MUTED}>
                {email}
              </Text>
            </Button>
          </View>
          <SubTitle title="Ingredients" />
          {this.getIngredientsView()}
          <SubTitle title="Motors" />
          {this.getMotorsView()}
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Button
              color={theme.COLORS.PRIMARY}
              shadowColor={theme.COLORS.PRIMARY}
              round
              loading={this.state.refreshing}
              onPress={() => this.saveConfigurationData()}>
              Save
            </Button>
          </View>
        </View>
      </ScrollView>
    );
  }

  getIngredientsView = () => {
    var ingredients = [];
    ingredients.push(
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 2, paddingLeft: '5%'}}>
          <Text>Ingredient</Text>
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text>Amount (oz)</Text>
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text>Motor</Text>
        </View>
      </View>,
    );
    Object.entries(this.state.ingredients).map(([ingredient, value]) => {
      ingredients.push(
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 2, paddingLeft: '1%'}}>
            <Input
              borderless
              defaultValue={ingredient}
              onEndEditing={e =>
                this.updateIngredients(
                  ingredient,
                  e.nativeEvent.text,
                  null,
                  null,
                )
              }
            />
          </View>
          <View style={{flex: 1}}>
            <Input
              borderless
              keyboardType="numeric"
              textAlign={'center'}
              defaultValue={String(value.amount)}
              onEndEditing={e =>
                this.updateIngredients(
                  ingredient,
                  null,
                  e.nativeEvent.text,
                  null,
                )
              }
            />
          </View>
          <View style={{flex: 1}}>
            <Input
              borderless
              textAlign={'center'}
              defaultValue={value.motor}
              onEndEditing={e =>
                this.updateIngredients(
                  ingredient,
                  null,
                  null,
                  e.nativeEvent.text,
                )
              }
            />
          </View>
        </View>,
      );
    });
    return ingredients;
  };

  getMotorsView = () => {
    var motors = [];
    motors.push(
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 2, paddingLeft: '5%'}}>
          <Text>Motor Name</Text>
        </View>
        <View style={{flex: 2, alignItems: 'center'}}>
          <Text>Dispense Rate (s/oz)</Text>
        </View>
      </View>,
    );
    Object.entries(this.state.motors).map(([motor, value]) => {
      motors.push(
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 2, paddingLeft: '1%'}}>
            <Input
              borderless
              defaultValue={motor}
              onEndEditing={e => this.updateMotors(motor, e.nativeEvent.text)}
            />
          </View>
          <View style={{flex: 2}}>
            <Input
              borderless
              keyboardType="numeric"
              textAlign={'center'}
              defaultValue={String(value)}
              onEndEditing={e => this.updateMotors(motor, e.nativeEvent.text)}
            />
          </View>
        </View>,
      );
    });
    return motors;
  };

  getConfigurationData = () => {
    this.setState({refreshing: true});
    fetch(constants.API + '/configuration')
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          ingredients: responseJson.ingredients,
          motors: responseJson.motors,
          refreshing: false,
        });
      })
      .catch(error => console.log(error)); //to catch the errors if any
  };

  saveConfigurationData = async () => {
    this.setState({refreshing: true});
    try {
      await fetch(constants.API + '/ingredients', {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.state.ingredients),
      });
      await fetch(constants.API + '/motors', {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.state.motors),
      });
    } catch (e) {
      console.log(e);
    }
    this.setState({refreshing: false});
  };

  updateIngredients = (ingredient, name, amount, motor) => {
    var ingredients = this.state.ingredients;
    if (amount) {
      ingredients[ingredient].amount = parseFloat(amount);
    }
    if (motor) {
      console.log(motor);
      ingredients[ingredient].motor = motor;
    }
    if (name) {
      console.log(name);
      ingredients[name] = ingredients[ingredient];
      delete ingredients[ingredient];
    }
    this.setState({ingredients});
  };

  updateMotors = (motor, time) => {
    var motors = this.state.motors;
    motors[motor] = parseFloat(time);
    this.setState({motors});
  };
}

export default Settings;

const styles = StyleSheet.create({
  profileInfoFields: {
    borderColor: theme.COLORS.MUTED,
    marginVertical: 10,
  },
});
