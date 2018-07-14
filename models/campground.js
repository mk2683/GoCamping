var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

var Campgrounds = mongoose.model("Campgrounds", campgroundSchema);

module.exports = Campgrounds;