const express=require('express');
const ejs=require('ejs');
const bodyParser=require('body-parser');
const cookieSession=require('cookie-session');
const facebookStrategy=require('passport-facebook').Strategy;
const passport=require('passport');

//databse
const mongoose = require("mongoose");
const server=require("./server");

const userModel = require("./models");
const google_schema=require('./google_model');
const UserSchema=require('./models');	
const bus_names_Schema=require('./bus_names');
const { error } = require('console');
const GoogleModel = mongoose.model('google', google_schema);
const UserModel = mongoose.model('User', UserSchema);
const bus_names=mongoose.model('bus_name',bus_names_Schema);
const app=express()
require('./passport-setup');
app.use(express.static('stylesheet'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({extended:true}));

//http protocol

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
	async function run(){
		const newuser=new GoogleModel({email:`${req.user.email}`});
		await newuser.save();
	}
    run();

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





app.get('/auth/facebook',passport.authenticate('facebook',{scope:'email'}))
app.get('/facebook/callback',passport.authenticate('facebook',{successRedirect:"/profile",failureRedirect:'/error'}))

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

app.post("/dashboard",async(req,res)=>{
	user_email=req.body.email;
	user_password=req.body.password;
	const docs = await UserModel.find({email:user_email });
	auth_paasword=docs.map(doc => doc.password).sort()[0];
	if(user_password==auth_paasword){
		res.redirect('/dashboard');
	}else{
		res.redirect('/login')
	}
	  });







app.post("/add_user",(req,res)=>{    
    async function run(){
		const newuser=new UserModel(req.body);
		await newuser.save();
	}
    run();
    res.redirect('/dashboard');
});
// app.get("/dashboard",(req,res)=>{
// 	const result=bus_names.find();
// 	console.log(res);
//    res.render('dashboard')
// })

app.get('/dashboard', async(req, res)=> {    
	const result = await bus_names.find()	
	// const resss=result[0];
	 const {names,timings}=await result[0];
	
	
	res.render('dashboard',{busses:names,timing:timings});
	
});

app.get('/register',(req,res)=>{
	res.render('register')
})

app.listen(3000,()=>{
    console.log('sever connected!');
})