var User = require('../models/user');

var config = require('../../config');

var secretKey = config.secretKey;

var jsonwebtoken = require('jsonwebtoken');

function createToken(user) {

	var token = jsonwebtoken.sign({
		id: user._id,
		email: user.email
	}, secretKey, {
		expiresIn: 1440
	});


	return token;

}

module.exports = function(app, express, io) {


	var api = express.Router();

	

	api.post('/register', function(req, res) {
		
		var user = new User({
			
			email: req.body.email,
			password: req.body.password
		});
		var token = createToken(user);
		
		user.save(function(err) {
			if(err) {
				res.send(err);
				return;
			}

			res.json({ 
				success: true,
				message: 'User has been created!',
				token: token
			});
		});
	});


	api.get('/users', function(req, res) {

		User.find({}, function(err, users) {
			if(err) {
				res.send(err);
				return;
			}

			res.json(users);

		});
	});

	api.post('/login', function(req, res) {

		User.findOne({ 
			email: req.body.email
		}).select('email password').exec(function(err, user) {

			if(err) throw err;

			if(!user) {

				res.send({ message: "User doenst exist"});
			} else if(user){ 

				var validPassword = user.comparePassword(req.body.password);

				if(!validPassword) {
					res.send({ message: "Invalid Password"});
				} else {

					///// token
					var token = createToken(user);

					res.json({
						success: true,
						message: "Successfuly login!",
						token: token
					});
				}
			}
		});
	});

	api.use(function(req, res, next) {


		console.log("Somebody just came to our app!");

		var token = req.body.token || req.param('token') || req.headers['x-access-token'];

		// check if token exist
		if(token) {

			jsonwebtoken.verify(token, secretKey, function(err, decoded) {

				if(err) {
					res.status(403).send({ success: false, message: "Failed to authenticate user"});

				} else {

					
					req.decoded = decoded;
					next();
				}
			});
		} else {
			res.status(403).send({ success: false, message: "No Token Provided"});
		}

	});

	
	api.route('/')

		.post(function(req, res, userData) {

			var convo = new Convo({
				userId: req.decoded.id,
				emailId: userData.email,
				dateTime: Date.now;
			});

			convo.save(function(err, newConvo) {
				if(err) {
					res.send(err);
					return
				}
				io.emit('convo', newConvo)
				res.json({message: "New convo Created!"});
			});
		})


		.get('/', function(req, res) {
		
		Convo.find({}, function(err,convos) {
			if(err) {
				res.send(err);
				return;
			}
			res.json(convos);
		});



		api.get('/me', function(req, res) {
			res.send(req.decoded);
		});

	return api;
}
