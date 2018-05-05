var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var request = require("request");
var mongoose = require("mongoose");


mongoose.connect("mongodb://localhost/v1");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

var Campgrounds = mongoose.model("Campgrounds", campgroundSchema);

// Campgrounds.create(
// 	{ 
// 		name: "Salt Lake", 
// 		image:"https://cdn.pixabay.com/photo/2017/08/04/20/04/camping-2581242__340.jpg",
// 		description: "The Great Salt Lake, located in the northern part of the U.S. state of Utah, is the largest salt water lake in the Western Hemisphere,[1] and the eighth-largest terminal lake in the world.[2] In an average year the lake covers an area of around 1,700 square miles (4,400 km2),[2] but the lake's size fluctuates substantially due to its shallowness. For instance, in 1963 it reached its lowest recorded size at 950 square miles (2,460 km²), but in 1988 the surface area was at the historic high of 3,300 square miles (8,500 km2).[2] In terms of surface area, it is the largest lake in the United States that is not part of the Great Lakes region."
// 	}, { 
// 		name: "Mount Abu", 
// 		image:"https://cdn.pixabay.com/photo/2015/03/26/10/29/camping-691424__340.jpg",
// 		description: "Mount Abu (About this sound pronunciation (help·info)) is a popular hill station in the Aravalli Range in Sirohi district of Rajasthan state in western India, near the border with Gujarat. The mountain forms a distinct rocky plateau 22 km long by 9 km wide. The highest peak on the mountain is Guru Shikhar at 1,722 m (5,650 ft) above sea level. It is referred to as 'an oasis in the desert' as its heights are home to rivers, lakes, waterfalls and evergreen forests. The nearest train station is Abu Road railway station: 28 km away.[2]"
// 	}, function(err, campground){
// 		if (err) {
// 			console.log(err);
// 		} else{
// 			console.log("new campground added into the databse");
// 			console.log(campground);
// 		};
// 	})

// var campgrounds = [ 
// 		{ name: "Aravali Hill", image:"https://cdn.pixabay.com/photo/2017/10/28/23/18/indians-2898463__340.jpg"},
// 		{ name: "Salt Lake", image:"https://cdn.pixabay.com/photo/2017/08/04/20/04/camping-2581242__340.jpg"},
// 		{ name: "Mount Abu", image:"https://cdn.pixabay.com/photo/2015/03/26/10/29/camping-691424__340.jpg"},
// 		{ name: "Aravali Hill", image:"https://cdn.pixabay.com/photo/2017/10/28/23/18/indians-2898463__340.jpg"},
// 		{ name: "Salt Lake", image:"https://cdn.pixabay.com/photo/2017/08/04/20/04/camping-2581242__340.jpg"},
// 		{ name: "Mount Abu", image:"https://cdn.pixabay.com/photo/2015/03/26/10/29/camping-691424__340.jpg"},
// 		{ name: "Aravali Hill", image:"https://cdn.pixabay.com/photo/2017/10/28/23/18/indians-2898463__340.jpg"},
// 		{ name: "Salt Lake", image:"https://cdn.pixabay.com/photo/2017/08/04/20/04/camping-2581242__340.jpg"},
// 		{ name: "Mount Abu", image:"https://cdn.pixabay.com/photo/2015/03/26/10/29/camping-691424__340.jpg"},
// 		{ name: "Aravali Hill", image:"https://cdn.pixabay.com/photo/2017/10/28/23/18/indians-2898463__340.jpg"},
// 		{ name: "Salt Lake", image:"https://cdn.pixabay.com/photo/2017/08/04/20/04/camping-2581242__340.jpg"},
// 		{ name: "Mount Abu", image:"https://cdn.pixabay.com/photo/2015/03/26/10/29/camping-691424__340.jpg"}
// 	]

app.get("/", function(req, res){
	res.render("home");
})

app.get("/campgrounds", function(req, res){
	Campgrounds.find({}, function(err, camps){
		if (err) {
			console.log(err);
		} else{
			console.log("all the campgrounds:--");
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
			console.log("new Campground added");
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
	console.log("YelpCamp Basic Server has started");
});