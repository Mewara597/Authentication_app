const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

//HERE reqire is function which is used to include external modules in the file and proceed it to return the export object 

const app = express();

//passport config 
require('./config/passport')(passport);

//DB config
const db = require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db, {useNewUrlParser: true})
 .then(()=> console.log('MongoDB Connected...'))
 .catch(err => console.error(err));


//ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');


//bodyparser
app.use(express.urlencoded({extended:false}));

//Express Session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

  //Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());


//connect flash
app.use(flash());


//Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error_msg');

    next();
});


//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));



const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));