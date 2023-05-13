const express=require('express');
const ejs=require('ejs');
const bodyParser=require('body-parser');
const cookieSession=require('cookie-session');
const facebookStrategy=require('passport-facebook').Strategy;
const passport=require('passport')

const app=express()
require('./passport-setup');
app.use(express.static('stylesheet'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({extended:true}))

app.get("/",(req,res)=>{
    res.render('login')
})


//google sign-IN////////////////////////////////////////////////////////////////////////////////////////////
app.use(cookieSession({
	name: 'google-auth-session',
	keys: ['key1', 'key2']
}));
app.use(passport.initialize());
app.use(passport.session());


// Auth
app.get('/google' , passport.authenticate('google', { scope:
	[ 'profile', 'email' ]
}));

// Auth Callback
app.get( '/google/callback',
	passport.authenticate( 'google', {
		
		failureRedirect: '/failure'}),function (req,res) {
			res.redirect("/success")
		}
);

// Success
app.get('/success' , (req , res) => {
	res.redirect("/dashboard")
});

// failure
app.get('/failure' , (req , res) => {
	res.send("<h1>404 Error</h1>");
})

//////////////////////////////////////////////////////////////////////////////////////////////////////
////////////facebook sign-IN///////////////////////////////////////////////////////////
passport.use(new facebookStrategy({
    clientID:"1429071757631314",
    clientSecret:"2d652ff2bbfbe26779ba8216ab9fa4fb",
    callbackURL:"https://successful-frog-gilet.cyclic.app/facebook/callback",
    profileFields:['id','displayName','name','gender','picture.type(large)','email']
},function(token,refresh_token,profile,done){
console.log(profile);
return done(null,profile)
}))


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }else{
        res.redirect('/')
    }
}





app.get('https://successful-frog-gilet.cyclic.app/auth/facebook',passport.authenticate('facebook',{scope:'email'}))
app.get('https://successful-frog-gilet.cyclic.app/facebook/callback',passport.authenticate('facebook',{successRedirect:"/profile",failureRedirect:'/error'}))

app.get("/profile",isLoggedIn,(req,res)=>{
    res.redirect('/dashboard');
});
app.get("/error",(req,res)=>{
    res.send('<h1>error to login</h1>')
})



passport.serializeUser(function(user,done){
    done(null,user);
})
passport.deserializeUser(function(id,done){
   
    return done(null,id);
})





////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post("/dashboard",(req,res)=>{
    res.send("<h1 style='text-align:center'>Welcome to Our website</h1>")
})
app.get("/dashboard",(req,res)=>{
    res.send("<h1 style='text-align:center'>Welcome to Our website</h1>")
})


app.listen(3000,()=>{
    console.log('sever connected!');
})