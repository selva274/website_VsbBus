const express=require('express');
const ejs=require('ejs');
const bodyParser=require('body-parser');
const cookieSession=require('cookie-session');
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


//google sign-IN
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



app.post("/dashboard",(req,res)=>{
    res.send("<h1 style='text-align:center'>Welcome to Our website</h1>")
})
app.get("/dashboard",(req,res)=>{
    res.send("<h1 style='text-align:center'>Welcome to Our website</h1>")
})


app.listen(3000,()=>{
    console.log('sever connected!');
})