# DrinkMixr
- Mobile app and other related materials for the drink mixing machine.
- Embedded system code can be found here: https://github.com/sujaygarlanka/DrinkMixr-Raspberry-Pi

## API Doc (Incomplete):

### GET /order
Gets order  
Response:
```
sujay-11.7:lemon_juice-1-32.4:apple_juice-0-44.2
```

### POST /order
Sends order  
Body:
```
{
	"user_name": "sujay",
	“priming”: false,
	"order": {
		"lemon_juice": 5.5,
		"apple_juice": 5.8
	}
}
```

### POST /user
Creates user  
Body:  
```
{
	"name": "sujay"
}
```
