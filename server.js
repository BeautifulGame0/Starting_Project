var express =require('express');

var passport = require('passport');
var GoogleStrategy = require('passport-google-auth').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var FbStrategy = require('passport-facebook').Strategy;



passport.use(new GoogleStrategy({
    clientId: '952710897371-3c27v7k0u8b544v9e9arap3m0dibcvbn.apps.googleusercontent.com',
    clientSecret: 'Ogi4aiPl2OBsf70Dh6XP_Bre',
    callbackURL: 'http://localhost:8080/auth/google/callback'
  },function(accessToken, refreshToken, profile, done) {
    // User.findOrCreate(..., function (err, user) {
     
    // });
     done(null, profile);
  }
));
  passport.use(new TwitterStrategy({
    consumerKey: 'EnGhBPdj6gXeh9bBDMoP8yXdV',
    consumerSecret: 'IMQOlaSjrPn7RKDzYrQvdpLo0xPCbFoc4Zd0GLkETio0ASglbk',
    callbackURL: "http://127.0.0.1:8090/auth/twitter/callback"
  },function(accessToken, refreshToken, profile, done) {
    // User.findOrCreate(..., function (err, user) {
     
    // });
     done(null, profile);
  }
));
passport.use(new FbStrategy({
    clientID: '1371987272917210',
    clientSecret: 'e747e3fab0aa434ac8a2558df0a4aee3',
    callbackURL: 'http://localhost:8080/login/facebook/return',
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  function(accessToken, refreshToken, profile, done) {
    // User.findOrCreate(..., function (err, user) {
     
    // });
     done(null, profile);
  }
));

var app = express();

    
    app = express();


     app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

    app.get('/',
  function(req, res) {
    res.render('login');
  });

app.get('/login',
  function(req, res){
    res.render('login');
  });

app.get('/logout',
  function(req, res){
  	req.session.destroy();
  	console.log("logout");
    res.render('login');
  });

app.get('/login/google', passport.authenticate('google'));

app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect to your app. 
        res.redirect('/profile');
    }
);

app.get('/login/facebook',
  passport.authenticate('facebook', { scope: 'email'}));

app.get('/login/facebook/return', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {

  	//console.log("user name"+profile.id);
  	//console.log("username0"+ user.username);
    res.redirect('/profile');
  });



app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    console.log("username-----"+req.user.displayName);
    console.log("user ID-----"+req.user.id);
    console.log("user Mail-----"+req.user.emails[0].value);
dbCon(req.user.id,req.user.displayName,req.user.emails[0].value);
    res.render('profile', { user: req.user });
  });
app.listen(8080);


function dbCon( id,  displayName,  emails)
{
var mysql = require('mysql');  
var con = mysql.createConnection({  
  host: "localhost",  
  user: "root",  
  password: "root"  ,
  database: "bhups_start"  
});  
	con.connect(function(err) {  
	if (err) throw err;  
	console.log("username-----"+id);
    console.log("user ID-----"+displayName);
    console.log("user Mail-----"+emails); 
	con.query("Insert into veg_login_details (ID,Name,Email_id) values(?,?,?)",[id,displayName, emails], function (err, result) {  
	if (err) throw err;  
	console.log("Database created");  
	});  
	}); 


}