var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var request = require("request");
var mongoose = require("mongoose");
var Campgrounds = require("./models/campground.js")


mongoose.connect("mongodb://localhost/GoCamping");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");


app.get("/", function(req, res){
	res.render("home");
})

app.get("/campgrounds", function(req, res){
	Campgrounds.find({}, function(err, camps){
		if (err) {
			console.log(err);
		} else{
			res.render("campground", {campgrounds: camps});
		};
	})

});

app.post("/campgrounds", function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = {name: name, image: image, description: desc};
	Campgrounds.create(newCampground, function(err, newCamps){
		if (err) {
			console.log(err)
		} else{
			res.redirect("/campgrounds");
		};
	})
});

app.get("/campgrounds/new", function(req, res){
	res.render("new");
});

app.get("/campgrounds/:id", function(req, res){
	Campgrounds.findById(req.params.id, function(err, found){
		if (err) {
			console.log(err);
		} else{
			res.render("show", {campground: found});
		};
	});
});

app.listen(8080, function(req, res){
	console.log("GoCamping Server has started on port 8080!!");
});