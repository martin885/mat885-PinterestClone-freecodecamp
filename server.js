const express =require('express');
const path=require('path');
const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser');
const session=require('express-session');
const mongoose=require('mongoose');
const passport=require('passport');
const MongoStore=require('connect-mongo')(session);


require('dotenv').config();
const port=Number(process.env.PORT || 8080);

const flash=require('express-flash');

 const app=express();

mongoose.connect(process.env.MONGOURI||'mongodb://localhost/pinterest');



const user=require('./controllers/user');
const images=require('./controllers/images');
const users=require('./controllers/users');

require('./config/passport');

app.use('/static',express.static(path.join(__dirname,'public')));
app.set('view engine','pug'); 
 app.use(bodyParser.urlencoded({extended:true}));
 app.use(bodyParser.json());


//  app.use(express.static('public'));
app.use(cookieParser());
app.use(session({
    secret:'tutorial',
    resave:true,
    saveUninitialized:true,
    store:new MongoStore({mongooseConnection:mongoose.connection})
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());




app.use(user);
app.use('/images',images);
app.use('/users',users);


app.listen(port,function(){
    console.log('Listen on port '+ port);
});