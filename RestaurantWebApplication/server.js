//Declare constants
const pug = require('pug');
const fs = require("fs");
const express = require('express');

//Declare express
let app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Create variables to store restaurant data
let restaurantList = {};
let id = 0;

//send home pug file
app.get("/", function (request, response) {
    response.send(pug.renderFile("./views/home.pug"));
});

//send addrestaurant pug file
app.get("/addrestaurant", function (request, response) {
    response.send(pug.renderFile("./views/addrestaurant.pug"));
});

//route for restID
app.route("/restaurants/:restID").get(function (request, response) {
	if (restaurantList.hasOwnProperty(request.params.restID)) {
        let restaurant = restaurantList[request.params.restID];
        response.format({
            'application/json': () => {
                response.set('Content-Type', 'application/json');
                response.json(restaurant);
            },'text/html': () => {
                response.send(pug.renderFile("./views/restaurant.pug", { restaurant: restaurant }));
            },'default' : () => { response.status(406).send('Not acceptable'); }
        });
    }else{
        response.status(404).send('404 ERROR: Page does not exits');
    }
})
app.route("/restaurants/:restID").put(function (request, response) {
	let restaurant = request.body;

    restaurantList[restaurant.id].name = restaurant.name;
    response.sendStatus(200);
});

//route for restaurants
app.route("/restaurants").get(function (request, response) {
	response.format({
        'application/json': () => {
            response.set('Content-Type', 'application/json');
            response.json(restaurantList);
        },
        'text/html': () => {
            let selectedRestaurants = [];
            for (const id in restaurantList){
                selectedRestaurants.push(restaurantList[id].name);
            }
            response.set('Content-Type', 'text/html');
            response.send(pug.renderFile("./views/restaurants.pug", { restaurantList: restaurantList }));
        },
        'default' : () => { response.status(406).send('Not acceptable'); }
    });
})
app.route("/restaurants").post(function (request, response) {
    let restaurant = request.body;
    restaurant.id = id;
    restaurant.menu = {};
    restaurantList[id++] = restaurant;
    response.sendStatus(200);
});


fs.readdir("./restaurants", function (err, files) {
    if (err) {
        return console.log(err);
    }

    let counter = 0;

    while (true){
        if (!(counter < files.length)){
            break;
        }
        let restaurant = require("./restaurants/" + files[counter]);
        restaurantList[restaurant.id] = restaurant;
        
        if (!(restaurant.id <= id)){
            id = restaurant.id;
        }
        counter++;
    }
    
    id++;

    app.listen(3000, () => console.log(`Server listening at http://localhost:3000`));
});