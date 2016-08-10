'use strict';


var ClickHandler	= require('./controllers/clickHandler.server.js');
var bodyParser		= require('body-parser');
var cookieParser	= require('cookie-parser');



module.exports = function (app, passport) {

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} 
	}

	var objHandler = new ClickHandler();

	app.route('/pooling')
	.post(objHandler.pooling);
	
	app.route('/update')
	.post(objHandler.update);
	
	app.route('/')
		.get(objHandler.getPolls);
		

	app.route('/self')
		.get(isLoggedIn,objHandler.getMyPolls);
		
	
	
	app.route('/erase/:id')
	.get(isLoggedIn,objHandler.erasePoll);
	
	app.route('/login')
		.get(objHandler.getPolls);
		
	app.route('/pool/:id')
	.get(objHandler.getSelected);
	
	app.route('/new')
	.get(isLoggedIn,function(req,res){
		res.render('index',{username:req.user.twitter.displayName,nuevo:true});
		
	});
	app.route('/newpost')
	.post(isLoggedIn,objHandler.addPolls);
	
	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});

	app.route('/api/:id')
		.get( function (req, res) {
			res.json(req.user.twitter);
		});

	app.route('/auth/twitter')
		.get(passport.authenticate('twitter'));
		

	app.route('/auth/twitter/callback')
		.get(passport.authenticate('twitter', {
			successRedirect: '/'
		}));


	
};
