var express = require('express'), app = express();
bodyParser = require('body-parser'),
mongoose = require('mongoose'), passport = require('passport'),
LocalStrategy = require('passport-local'),
methodOverride = require('method-override'),
User = require('./models/user'),
Sweepstake = require('./models/sweepstakes'),
flash = require('connect-flash');

app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
mongoose.connect('mongodb://localhost/world_cup');

//==========================
//  PASSPORT CONFIGURATION
//==========================

app.use(require('express-session')({secret: 'World Cup!', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware, makes current user available on every route
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;

  if (req.user) { Sweepstake.find({'creator.username': req.user.username}, function(err, foundSweep) { res.locals.mySweepstakes = foundSweep; }); }
  else {res.locals.mySweepstakes = '';}

  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next(); // how often to declare this?
});

//==========================
//      AUTH ROUTES
//==========================

app.get('/register', function(req, res) {
  res.render('register');
});

app.post('/register', function(req, res) {
  // var email = req.body.email;
  var newUser = {username: req.body.username};
  // saves newCampground object in the db
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      req.flash(err.message);
      res.redirect('back');
    } else {
      passport.authenticate('local')(req, res, function() {
        req.flash(
            'success',
            'Welcome to the World Cup Sweepstake ' + req.user.username + '!');
        res.redirect('sweepstakes/new');
      });
    }
  })
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post(
    '/login', passport.authenticate('local', {
      successRedirect: '/sweepstakes',
      successFlash: true,
      failureRedirect: '/login',
      failureFlash: true
    }),
    function(req, res) {
      // empty
    });

app.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'Logged Out Successfully!')
  res.redirect('/');
});

//==========================
//      RESTful ROUTES
//==========================

// LANDING PAGE
app.get('/', function(req, res) { res.render('landing'); });

// INDEX ROUTE
app.get('/sweepstakes', isLoggedIn, function(req, res) {
  // console.log(req.user.id)
  Sweepstake.find(
      {'creator.username': req.user.username}, function(err, foundSweep) {
        if (err) {
          req.flash('error', 'Something Went Wrong!');
          res.redirect('back');
        } else {
          res.render('home', {sweepstake: foundSweep});
        }
      })
});

// NEW ROUTE
app.get('/sweepstakes/new', isLoggedIn, function(req, res) { res.render('new'); });

// CREATE ROUTE
app.post('/sweepstakes', isLoggedIn, function(req, res) {
  // get user input from form and saves as an object
  var name = req.body.name;
  var players = JSON.parse(req.body.players);
  var creator = {id: req.user._id, username: req.user.username};
  var newSweepstake = {name: name, creator: creator, players: players};

  // saves sweepstake object in the db
  Sweepstake.create(newSweepstake, function(err, newlyCreated) {
    if (err) {
      req.flash('error', 'Something Went Wrong!');
      res.redirect('back');
    } else {
      // redirect back to sweepstakes page(redirect defaults as get request)
      res.redirect('/sweepstakes');
    }
  })
});

// SHOW ROUTE
app.get('/sweepstakes/:id', isLoggedIn, function(req, res) {
  Sweepstake.findById(req.params.id, function(err, foundSweep) {
    if (err) {
      req.flash('error', 'Something Went Wrong!');
      res.redirect('back');
    } else {
      res.render('show', {sweepstake: foundSweep});
    }
  });
});

//==========================
//      MIDDLEWARE
//==========================

// middleware function to check if user logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // got to the next middleware
  }
  req.flash('error', 'Cannot do that without being logged in!');
  res.redirect('/login');
};

app.listen(3000, function() { console.log('App running on port 3000'); });