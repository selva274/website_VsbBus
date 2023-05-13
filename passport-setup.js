const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;




passport.use(new GoogleStrategy({
	clientID:"516180371370-7ia2tppunnolnd137ra5afktmq3s9951.apps.googleusercontent.com", // Your Credentials here.
	clientSecret:"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", // Your Credentials here.
	callbackURL:"https://successful-frog-gilet.cyclic.app/google/callback",
	passReqToCallback:true
},
function(request, accessToken, refreshToken, profile, done) {
	// console.log(profile)
	return done(null, profile);
}
));
passport.serializeUser(function(user , done){
	done(null , user);
})
passport.deserializeUser(function(user, done){
	
	done(null, user);
});