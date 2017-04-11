"use strict"

class recipe {
	constructor(title, ingredients, thumbnail, href) {
		this.title = title;
		this.ingredients = ingredients;
		this.thumbnail = thumbnail;
		this.href = href;
	}

	toTableRow() {
		var row = document.createElement('tr');
		var td = document.createElement('td');

		var img = document.createElement('img')
		img.src = this.thumbnail;

		let title = document.createElement('h3');
		title.innerHTML = this.title;

		let a = document.createElement('a');
		a.href = this.href;
		a.appendChild(title);

		td.appendChild(img);

		td.appendChild(a);

		row.appendChild(td);

		return row;
	}

	toPanel() {
		var col = document.createElement('div');
		col.className = 'col-sm-4';


		var panel = document.createElement('div');
		panel.className = 'panel panel-primary'

		var panelHeading = document.createElement('div');
		panelHeading.className = 'panel-heading';
		panelHeading.innerHTML = this.title;

		var panelBody = document.createElement('div');
		panelBody.className = 'panel-body';
		panelBody.id = "col";

		var a = document.createElement('a');
		a.href = this.href;

		var img = document.createElement('img');
		if (!this.thumbnail) {
			// img.src = 'default.png';
			let waitfor = searchImage(this.title);
			waitfor.done(function(){
				if (!waitfor.thumbnail) {
					img.src = 'default.png';
				} else {
					img.src = waitfor.thumbnail;
				}
			})
			img.className = "defaultImg";
		} else {
			img.src = this.thumbnail;
			img.className = "preview";
		}

		a.appendChild(img);
		panelBody.appendChild(a);

		panel.appendChild(panelHeading);
		panel.appendChild(panelBody);

		col.appendChild(panel);

		return col;
	}
}

class recipeDB {
	constructor() {
		this.allRecipes = [];
	}

	getData() {
		return this.allRecipes;
	}

	clearData() {
		this.allRecipes = [];
	}

	addRecipes(i, q, p) {
		let self = this;

		let dfd  = new $.Deferred();
		$.ajax({
			//url: `http://localhost:5000/api/getpuppy?i=${i}&q=${q}&p=${p}`,
			url: `http://localhost:5000/api/getpuppy?i=${i}&q=${q}`,
			method: 'GET'
		}).done(function(data) {
			let d = JSON.parse(data);
			console.log(d);
			for (let r of d.results) {
				let newRecipe = new recipe(r.title, r.ingredients, r.thumbnail, r.href);
				self.allRecipes.push(newRecipe);
			}
			dfd.resolve();	
		});

		return dfd;
	}
}

class recipeController {
	constructor() {
		this.rdb = new recipeDB();
	}

	redrawTable() {
		var table = document.getElementById("recipetable");
		table.innerHTML = "";
		for (let r of this.rdb.getData()) {
			table.appendChild(r.toPanel());
			}
	}

	doSearch() {
		let self = this;
		let i = document.getElementById("ingredientinput").value;
		let q = document.getElementById("searchinput").value;
		self.rdb.clearData();
		let waitfor = self.rdb.addRecipes(i, q, '1');
		waitfor.done(function() { self.redrawTable(); });
	}

	clickSearch(name) {
		let self = this;
		self.rdb.clearData();
		let waitfor = self.rdb.addRecipes('', name, '1');
		waitfor.done(function() { self.redrawTable(); });

	}
	clearTable() {
		document.getElementById("recipetable").innerHTML = "";
	}

}

function searchImage(q) {
	var result;
	var params = {
	    // Request parameters
	    "count": "1",
	    "offset": "0",
	    "mkt": "en-us",
	    "safeSearch": "Moderate",
	};
	params["q"] = q;
	
	let dfd  = new $.Deferred();
	$.ajax({
	    url: "http://localhost:5000/api/getimages?",
	    data: params,
	    method: 'GET'
	}).done(function(data) {
		result = JSON.parse(data);
		var thbObj = result.value[0];
		var s = thbObj.thumbnailUrl;
		//console.log(thbObj.thumbnailUrl);
		dfd.thumbnail = s;
		console.log(s);
		dfd.resolve();
	});

	return dfd;	
}

var rc = new recipeController();