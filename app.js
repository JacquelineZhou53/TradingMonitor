const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const layouts = require("express-ejs-layouts");
const jsonToTable = require('json-to-table');
const alpha = require('alphavantage')({  key: '3GNM04I3VG4LFS8O'});
//const auth = require('./config/auth.js');



const mongoose = require( 'mongoose' );
//mongoose.connect( `mongodb+srv://${auth.atlasAuth.username}:${auth.atlasAuth.password}@cluster0-yjamu.mongodb.net/authdemo?retryWrites=true&w=majority`);
mongoose.connect( 'mongodb+srv://JacquelineZhou53:JacquelineZhou53@cluster0.umfnn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
//const mongoDB_URI = process.env.MONGODB_URI
//mongoose.connect(mongoDB_URI)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected!!!")
});

const User = require('./models/User');

const authRouter = require('./routes/authentication');
const isLoggedIn = authRouter.isLoggedIn
const loggingRouter = require('./routes/logging');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const stockRouter = require('./routes/stock');
const stockInfoRouter = require('./routes/stockInfo');




const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(layouts);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(authRouter)
app.use(loggingRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/stock',stockRouter);
app.use('/stockInfo',stockInfoRouter);

const myLogger = (req,res,next) => {
  console.log('inside a route!')
  next()
}

app.get('/testing',
  myLogger,
  isLoggedIn,
  (req,res) => {  res.render('testing')
})

app.get('/testing2',(req,res) => {
  res.render('testing2')
})
/*
app.post('/stockInfoPage', (req, res) => {
        alpha.data.intraday(String(req.body.reqIndex)).then(data => {
          console.log(JSON.stringify(data))
          res.locals.data = data;
        });
        res.render('showStockInfo')
})
*/
app.use('/data',(req,res) => {
  res.json([{a:1,b:2},{a:5,b:3}]);
})

app.get("/test",async (req,res,next) => {
  try{
    const u = await User.find({})
    console.log("found u "+u)
  }catch(e){
    next(e)
  }

})

app.get("/apikey", async (req,res,next) => {
  res.render('apikey')
})


const APIKey = require('./models/APIKey')

app.post("/apikey",
  isLoggedIn,
  async (req,res,next) => {
    const domainName = req.body.domainName
    const apikey = req.body.apikey
    const apikeydoc = new APIKey({
      userId:req.user._id,
      domainName:domainName,
      apikey:apikey
    })
    const result = await apikeydoc.save()
    console.log('result=')
    console.dir(result)
    res.redirect('/apikeys')
})

app.get('/apikeys', isLoggedIn,
  async (req,res,next) => {
    res.locals.apikeys = await APIKey.find({userId:req.user._id})
    console.log('apikeys='+JSON.stringify(res.locals.apikeys.length))
    res.render('apikeys')
  })

app.get('/allapikeys', isLoggedIn,
    async (req,res,next) => {
      res.locals.apikeys = await APIKey.find({})
      console.log('apikeys='+JSON.stringify(res.locals.apikeys.length))
      res.render('apikeys')
    })

app.get('/apikeys/last/:N', isLoggedIn,
    async (req,res,next) => {
      const N = parseInt(req.params.N)
      const apikeys = await APIKey.find({})
      res.locals.apikeys = apikeys.slice(0,N)
      console.log('apikeys='+JSON.stringify(res.locals.apikeys.length))
      res.render('apikeys')
    })

app.get('/apikeys/:domainName', isLoggedIn,
    async (req,res,next) => {
      res.locals.apikeys = await APIKey.find({domainName:req.params.domainName})
      console.log('apikeys='+JSON.stringify(res.locals.apikeys.length))
      res.render('apikeys')
    })

app.get('/apikeyremove/:apikey_id', isLoggedIn,
  async (req,res,next) => {

    const apikey_id = req.params.apikey_id
    console.log(`id=${apikey_id}`)
    await APIKey.deleteOne({_id:apikey_id})
    res.redirect('/apikeys')

  })

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
