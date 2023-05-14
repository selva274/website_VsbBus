const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;




passport.use(new GoogleStrategy({
	clientID:"516180371370-1li454tcudhg1m573mnsjl77h48i4uov.apps.googleusercontent.com", // Your Credentials here.
	clientSecret:"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", // Your Credentials here.
	callbackURL:"https://zany-jade-duck-hem.cyclic.app/google/callback",
	passReqToCallback:true
},
function(request, accessToken, refreshToken, profile, done) {
	//console.log(profile)
	return done(null, profile);
}
));
passport.serializeUser(function(user , done){
	done(null , user);
})
passport.deserializeUser(function(user, done){
	
	done(null, user);
});