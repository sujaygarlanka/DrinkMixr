import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  RefreshControl,
  TextInput,
} from 'react-native';
import {connect} from 'react-redux';
import {Button, Text, Icon} from 'galio-framework';
import theme from '../constants/theme';
import constants from '../constants/constants';
import Title from '../components/Title';
import SubTitle from '../components/SubTitle';
import {loadConfiguration, saveSettings} from '../actions/actions';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      motors: {},
      ingredients: {},
      tubes: {},
      isLoading: false,
    };
  }

  componentDidMount() {
    this.updateStateFromProps();
  }

  componentDidUpdate(prevProps) {
    if (prevProps != this.props) {
      this.updateStateFromProps();
    }
  }

  render() {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.isLoading}
            onRefresh={this.loadSettings}
          />
        }>
        <View style={{flex: 1}}>
          <Title title="Settings" />
          <SubTitle title="Profile" />
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {/* <Image
            source={{
              uri: "https://img.favpng.com/16/17/19/computer-icons-icon-design-clip-art-user-vector-graphics-png-favpng-4jFsADXTjLh9DsgEyVL9z7AMm.jpg",
            }}
            style={{width: 200, height: 200, borderRadius: 200 / 2}}
          /> */}
            <Icon
              size={theme.SIZES.BASE * 7}
              name="user"
              family="antDesign"
              color={theme.COLORS.INFO}
            />
          </View>
          <View style={{alignItems: 'center'}}>
            <Button
              disabled
              round
              color={theme.COLORS.TRANSPARENT}
              style={styles.profileInfoFields}>
              <Text center color={theme.COLORS.MUTED}>
                {constants.USERNAME}
              </Text>
            </Button>
            <Button
              disabled
              round
              color={theme.COLORS.TRANSPARENT}
              style={styles.profileInfoFields}>
              <Text center color={theme.COLORS.MUTED}>
                {constants.EMAIL}
              </Text>
            </Button>
          </View>
          <SubTitle title="Ingredients" />
          {this.getIngredientsView()}
          <SubTitle title="Motors" />
          {this.getMotorsView()}
          <SubTitle title="Tubes" />
          {this.getTubesView()}
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 20,
              paddingBottom: 20,
            }}>
            <Button
              color={theme.COLORS.INFO}
              shadowColor={theme.COLORS.INFO}
              round
              loading={this.state.isLoading}
              onPress={async () => {
                this.setState({isLoading: true});
                await this.props.saveSettings(
                  this.state.ingredients,
                  this.state.motors,
                  this.state.tubes,
                );
                await this.props.loadConfiguration();
                this.setState({isLoading: false});
              }}>
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
        <View style={styles.tableLeftCell}>
          <Text>Motor</Text>
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text>Ingredient</Text>
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text>Amount (oz)</Text>
        </View>
      </View>,
    );
    Object.entries(this.state.ingredients).map(([ingredient, value]) => {
      ingredients.push(
        <View style={styles.tableRow}>
          <View style={styles.tableLeftCell}>
            <TextInput
              style={styles.tableInputCell}
              defaultValue={value.motor}
              editable={false}
            />
          </View>
          <View style={{flex: 2}}>
            <TextInput
              style={styles.tableInputCell}
              textAlign="center"
              defaultValue={ingredient}
              onEndEditing={async e =>
                this.updateIngredients(ingredient, e.nativeEvent.text, null)
              }
            />
          </View>
          <View style={{flex: 1}}>
            <TextInput
              style={styles.tableInputCell}
              keyboardType="numeric"
              textAlign="center"
              defaultValue={String(value.amount)}
              onEndEditing={e =>
                this.updateIngredients(ingredient, null, e.nativeEvent.text)
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
        <View style={styles.tableLeftCell}>
          <Text>Motor Name</Text>
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text>Dispense Rate (s/oz)</Text>
        </View>
      </View>,
    );
    Object.entries(this.state.motors).map(([motor, value]) => {
      motors.push(
        <View style={styles.tableRow}>
          <View style={styles.tableLeftCell}>
            <TextInput
              style={styles.tableInputCell}
              defaultValue={motor}
              editable={false}
            />
          </View>
          <View style={{flex: 1}}>
            <TextInput
              style={styles.tableInputCell}
              keyboardType="numeric"
              textAlign="center"
              defaultValue={String(value)}
              onEndEditing={e => this.updateMotors(motor, e.nativeEvent.text)}
            />
          </View>
        </View>,
      );
    });
    return motors;
  };

  getTubesView = () => {
    var tubes = [];
    tubes.push(
      <View style={{flexDirection: 'row'}}>
        <View style={styles.tableLeftCell}>
          <Text>Tube for Motor</Text>
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text>Volume (oz)</Text>
        </View>
      </View>,
    );
    Object.entries(this.state.tubes).map(([motor, value]) => {
      tubes.push(
        <View style={styles.tableRow}>
          <View style={styles.tableLeftCell}>
            <TextInput
              style={styles.tableInputCell}
              defaultValue={motor}
              editable={false}
            />
          </View>
          <View style={{flex: 1}}>
            <TextInput
              style={styles.tableInputCell}
              keyboardType="numeric"
              textAlign="center"
              defaultValue={String(value)}
              onEndEditing={e => this.updateTubes(motor, e.nativeEvent.text)}
            />
          </View>
        </View>,
      );
    });
    return tubes;
  };

  updateStateFromProps = () => {
    let ingredientsCopy = JSON.parse(JSON.stringify(this.props.ingredients));
    let motorsCopy = JSON.parse(JSON.stringify(this.props.motors));
    let tubesCopy = JSON.parse(JSON.stringify(this.props.tubes));
    this.setState({
      ingredients: ingredientsCopy,
      motors: motorsCopy,
      tubes: tubesCopy,
    });
  };

  loadSettings = async () => {
    this.setState({isLoading: true});
    let response = await this.props.loadConfiguration();
    response = JSON.parse(JSON.stringify(response));
    this.setState({
      isLoading: false,
      ingredients: response.ingredients,
      motors: response.motors,
      tubes: response.tubes,
    });
  };

  updateIngredients = (ingredient, name, amount) => {
    let ingredients = this.state.ingredients;
    if (amount) {
      ingredients[ingredient].amount = parseFloat(amount);
    }
    if (name && name != ingredient) {
      ingredients[name] = ingredients[ingredient];
      delete ingredients[ingredient];
    }
    this.setState({ingredients});
  };

  updateMotors = (motor, time) => {
    let motors = this.state.motors;
    motors[motor] = parseFloat(time);
    this.setState({motors});
  };

  updateTubes = (motor, length) => {
    let tubes = this.state.tubes;
    tubes[motor] = parseFloat(length);
    this.setState({tubes});
  };
}

function mapStateToProps(state) {
  return {
    ingredients: state.ingredients,
    motors: state.motors,
    tubes: state.tubes,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadConfiguration: () => dispatch(loadConfiguration()),
    saveSettings: (ingredients, motors, tubes) =>
      dispatch(saveSettings(ingredients, motors, tubes)),
    set: data => dispatch({type: 'SET', data: data}),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Settings);

const styles = StyleSheet.create({
  profileInfoFields: {
    borderColor: theme.COLORS.MUTED,
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
    height: 50,
  },
  tableLeftCell: {
    flex: 1,
    paddingLeft: '5.5%',
  },
  tableInputCell: {
    flex: 1,
    color: theme.COLORS.GREY,
  },
});
