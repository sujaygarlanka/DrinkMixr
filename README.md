# DrinkMixr
A friend and I built a drink mixing machine that can dispense up to 4 liquids with half an ounce accuracy in any combination. There are three parts to this project.

- [Drink Machine](#drink-machine)
- [Mobile App](#mobile-app)
- [API](#api)

## Drink Machine

A physical machine that is 3D printed and MDF cut and contains tubing and motors controlled by a Raspberry Pi. It runs embedded python code that can be found [here](https://github.com/sujaygarlanka/DrinkMixr-Raspberry-Pi).

Final Machine              |  3D Model
:-------------------------:|:-------------------------:
<img src="https://raw.githubusercontent.com/sujaygarlanka/DrinkMixr/master/media/machine.jpg" width="350px"/> |  <img style="display: inline" src="https://raw.githubusercontent.com/sujaygarlanka/DrinkMixr/master/media/machine-3D.png" width="350px"/>

## Mobile App

<img src="https://raw.githubusercontent.com/sujaygarlanka/DrinkMixr/master/media/app-demo.gif" width="250px"/>

A mobile built in React Native that allows you to customize, save and send recipes to the drink machine when you tap your phone to the machine. Code for the 
app can be found [here](https://github.com/sujaygarlanka/DrinkMixr).

## API

An API written in Python Flask running on a heroku server that accepts orders sent from the mobile app, queues them and sends them to the machine when it is ready to dispense. This API also handles the creation of users, tracking how much a user drinks, storing machine settings, etc. The API uses a MongoDB database to store all information.

### API Doc (Very Incomplete):

### Get order  
**GET /order**

**Response**
```
sujay-11.7:lemon_juice-1-32.4:apple_juice-0-44.2
```

### Send order 
**POST /order**

**Body**
```
{
	"user_name": "sujay",
	"priming": false,
	"order": {
		"lemon_juice": 5.5,
		"apple_juice": 5.8
	}
}
```

### Create user  
**POST /user**

**Body**
```
{
	"name": "sujay"
}
```
