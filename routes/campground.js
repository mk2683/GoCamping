var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middlewares");

router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
           req.flash("error","Something went wrong!");
       } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds});
       }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
    	id: req.user._id,
    	username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
            req.flash("error","Something went wrong!");
        } else {
            req.flash("success","Campground successfully added");
            res.redirect("/campgrounds");
        }
    });
});


router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new");
});


router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
            req.flash("error","Something went wrong!");
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});


router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, found) {
		res.render("campgrounds/edit", {campground: found});
	})
})

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           req.flash("error","Something went wrong!");
           res.redirect("/campgrounds");
       } else {
           req.flash("success","Campground successfully updated");
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if (err) {
			console.log(err);
      req.flash("error","Something went wrong!");
			res.redirect("/campgrounds");
		} else {
      req.flash("success","Campground successfully deleted");
			res.redirect("/campgrounds");
		}
	})
})

module.exports = router;