var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	bcrypt = require('bcrypt');

function findById(id, fn){
	User.findOne(id).exec(function(err, user){
		if(err){
			return fn(null, null);
		}else{
			return fn(null, user);
		}
	});
}

function findByUsername(u, fn){
	User.findOne({
		username: u
	}).exec(function (err, user){
		if(err){
			return fn(null, null);
		}else{
			return fn(null, user);
		}
	});
}

passport.serializeUser(function (user, done){
	done(null, {'id':user.id, 'username':user.username, 'role':user.role});
});

passport.deserializeUser(function (id, done){
	findById(id, function(err, user){
		done(err, user);
	});
});

passport.use(new LocalStrategy(
	function(username, password, done){
		process.nextTick(function(){
			findByUsername(username, function(err, user){
				if(err)
					return done(null, err);
				if(!user){
					return done(null, false, {
						message: 'Unknown User '+username
					});
				}
				bcrypt.compare(password, user.password, function(err, res){
					if(!res)
						return done(null, false, {
							message: 'Invalid Password'
						});
					var returnUser = {
						username: user.username,
						email: user.email,
						createdAt: user.createdAt,
						id: user.id,
						role: user.role
					};
					return done(null, returnUser, {
						message: 'Logged In Successfully'
					});
				});
			});
		});
	}
));