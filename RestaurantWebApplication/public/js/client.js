let restaurant = {};
let id = 0;


//Add a new restaurant to the menu
function addRestaurant() {
    let newList = {};

    if(document.getElementById("name").value == ''){
        alert("ERROR: Invalid input")
        return;
    }
    if (document.getElementById("minOrder").value == ''){
        alert("ERROR: Invalid input")
        return;
    }
    if (document.getElementById("feeDel").value == ''){
        alert("ERROR: Invalid input")
        return;
    }
    if (isNaN(document.getElementById("feeDel").value)){
        alert("ERROR: Invalid input")
        return;
    }
    if (isNaN(document.getElementById("minOrder").value)){
        alert("ERROR: Invalid input")
        return;
    }
    newList.name = document.getElementById("name").value;

    // newList.delivery_fee = parse(document.getElementById("feeDel").value).toFixed(2);
    // newList.min_order = parse(document.getElementById("minOrder").value).toFixed(2);

    newList.delivery_fee = parseFloat(document.getElementById("feeDel").value).toFixed(2);
    newList.min_order = parseFloat(document.getElementById("minOrder").value).toFixed(2);

	let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			alert("Restaurant Added!");
		}
		else if (this.readyState == 4 && this.status == 404) {
			alert("There was an error, please retry your request");
		}
	}

	req.open("POST", "http://localhost:3000/restaurants");
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(newList));
}

//Save the restaurants new items
function updateRestaurant() {
    if (document.getElementById("name").value == ''){
        alert("ERROR: Invalid input")
        return;
    }
    if (document.getElementById("minOrder").value == ''){
        alert("ERROR: Invalid input")
        return;
    }
    if (document.getElementById("feeDel").value == ''){
        alert("ERROR: Invalid input")
        return;
    }
    if (isNaN(document.getElementById("feeDel").value)){
        alert("ERROR: Invalid input")
        return;
    }
    if (isNaN(document.getElementById("minOrder").value)){
        alert("ERROR: Invalid input")
        return;
    }

    restaurant.name = document.getElementById("name").value;

    // restaurant.delivery_fee = parse(document.getElementById("feeDel").value);
    // restaurant.min_order = parse(document.getElementById("minOrder").value);

    restaurant.delivery_fee = parseFloat(document.getElementById("feeDel").value);
    restaurant.min_order = parseFloat(document.getElementById("minOrder").value);

	let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			alert("Saved!");
		}
		else if (this.readyState == 4 && this.status == 404){
			alert("UNKNOWN Error:");
		}
	}

	req.open("PUT", `http://localhost:3000/restaurants/${restaurant.id}`);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(restaurant));
}

//Add category to a restaurant menu 
function addCategory() {
    if (document.getElementById("categoryName").value == ''){
        alert("ERROR: Category name empty")
        return;
    }

    const category = document.getElementById("categoryName").value;
    restaurant.menu[category] = {};

    document.getElementById("left").innerHTML += `<a href="#${category}">${category}</a><br>`;
    document.getElementById("middle").innerHTML += `<b>${category}</b><a name="${category}"></a><br>`;

    // let select = document.getElementById("category-select");
    // let option = document.createElement('option');

    const select = document.getElementById("category-select");
    const option = document.createElement('option');

    option.value = category;
    option.text = category;
    select.add(option);

    alert("Category added");
}

//Add item to restaurant menu
function addItem(){
    if (document.getElementById("itemName").value == ''){
        alert("ERROR: Invalid item entry")
        return;
    }
    if (document.getElementById("itemDescription").value == ''){
        alert("ERROR: Invalid item entry")
        return;
    }
    if(isNaN(document.getElementById("itemPrice").value)){
        alert("ERROR: Invalid item entry")
        return;
    }

    const category = document.getElementById("category-select").value;
    restaurant.menu[category][id] = {};
    restaurant.menu[category][id].name = document.getElementById("itemName").value;

    // restaurant.menu[category][id].description = document.getElementById("itemDescription").valuesa;
    // restaurant.menu[category][id].price = parse(document.getElementById("itemPrice").value);

    restaurant.menu[category][id].description = document.getElementById("itemDescription").value;
    restaurant.menu[category][id].price = parseFloat(document.getElementById("itemPrice").value);
    id++;

    console.log(restaurant.menu[category]);
    console.log(restaurant.menu[category][id-1]);

    document.getElementById("middle").innerHTML = '';
	Object.keys(restaurant.menu).forEach(key =>{
		document.getElementById("middle").innerHTML += `<b>${key}</b><a name="${key}"></a><br>`;
		Object.keys(restaurant.menu[key]).forEach(id => {
			item = restaurant.menu[key][id];
			document.getElementById("middle").innerHTML += `${item.name} (\$${item.price})<br>`;
			document.getElementById("middle").innerHTML += item.description + "<br><br>";
		});
	});

    alert("Item added");
}



function init(){
    restaurant.id = parseFloat(document.getElementById("id").textContent);

	let req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if (this.readyState == 4 && this.status == 200){
            restaurant = JSON.parse(req.responseText);
            // let counter = 0;
            // while(true){
            //     if (counter < restaurant.size){
            //         break;
            //     }
            //     for (const item in restaurant.menu[category]){
            //         id = item;
            //     }
            //     counter++;
            // }
            for (const category in restaurant.menu){
                for (const item in restaurant.menu[category]){
                    id = item;
                }
            }
            id++;
		}
    }

	req.open("GET", `http://localhost:3000/restaurants/${restaurant.id}`, true);
	req.setRequestHeader("Content-Type", "application/json");
	req.send();
}