// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var fs = require("fs");
var db = require('./model/db');
var jwt = require('jsonwebtoken'); //web token system
var config = require('./config');
var passwordHash = require('password-hash');
//mongoose.connect('mongodb://node:node@novus.modulusmongo.net:27017/Iganiq8o'); // connect to our database
//mongoose.connect('mongodb://localhost/vbd'); // connect to our database
//mongo db username: santhosh, pwd : santhosh@123
/* 
	command to create mongo db user
	db.createUser({user:"santhosh", pwd:"santhosh@123", roles:[{role:"root", db:"admin"}]})
*/
mongoose.connect('mongodb://santu:Santhosh.1a32@ds017205.mlab.com:17205/vbd'); // connect to our database
//mongoose old version 3.6.13

app.set('superSecret', config.secret); // secret variable

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var Users = require('./model/users');

var port = process.env.PORT || 3000;

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();  // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:3000/
router.get('/', function(req, res){
	res.json({message: 'Hooray..! welcome to our api'});
});

// more routes for our API will happen here
/*router.get('/listUsers', function (req, res) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       console.log( data );
       res.end( data );
   });
});*/
router.route('/users')
	//create users
	.post(function(req, res){
		var user = new Users();
		user.userName = req.body.userName;
		user.password = passwordHash.generate(req.body.password);
		//var hashedPassword = passwordHash.generate(user.password);
		//console.log(hashedPassword);


		//create user and check for errors
		user.save(function(err){
			if(err)
				res.send(err);
			res.json({message: 'User Created Successfully'});
		});
	})

	//get users
	.get(function(req, res){
		Users.find(function(err, users){
			if(err)
				res.send(err);
			res.json(users);
		});
	});

// Authenticate user using json web token (JWT)
// route to authenticate a user (POST http://localhost:3000/api/authenticate)
router.post('/authenticate', function(req, res) {

  // find the user
  Users.findOne({
    userName: req.body.userName
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      /*if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, app.get('superSecret'), {
   //       expiresInMinutes: 1440 // expires in 24 hours
   			expiresIn : '1440M'
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }*/  
      console.log(passwordHash.verify(req.body.password, user.password));
      if(passwordHash.verify(req.body.password, user.password)) {
      	// if user is found and password is right
        // create a token
        var token = jwt.sign(user, app.get('superSecret'), {
   //       expiresInMinutes: 1440 // expires in 24 hours
   			expiresIn : '1440M'
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }
      else{
      	res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      }

    }

  });
});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log("Magic happens on port " +port);