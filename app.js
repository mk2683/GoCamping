var express     = require("express");
var app         = express();
var bodyParser  = require("body-parser");
var mongoose    = require("mongoose");
var flash       = require("connect-flash");
var passport    = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Campground  = require("./models/campground");
var Comment     = require("./models/comment");
var User        = require("./models/user");
var seedDB      = require("./seed/seed");

var indexRoute  = require("./routes/index")
var campgroundRoute = require("./routes/campground")
var commentRoute = require("./routes/comment")

var port = process.env.PORT || 8080;
var url = process.env.MONGOLAB_URI || "mongodb://localhost/GoCamping";

mongoose.connect(url, { useMongoClient: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seedDB();

app.use(require("express-session")({
	secret: "My Secret Key",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
   	res.locals.success = req.flash("success");
	next();
})

app.use("/", indexRoute);
app.use("/campgrounds", campgroundRoute);
app.use("/campgrounds/:id/comments", commentRoute);

app.listen(port, function(req, res){
  console.log(`GoCamping Server has started on port ${port}!!`);
});