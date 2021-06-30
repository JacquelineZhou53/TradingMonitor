/*
  stock Router
*/
const express = require('express');
const router = express.Router();
const {StringStream} = require("scramjet");
const request = require("request");
const axios = require("axios");
const https = require("https");
const fs = require('fs');
const fetch = require("fetch");
const download = require("download");
const alpha = require('alphavantage')({  key: '3GNM04I3VG4LFS8O'});

const StockShare = require('../models/StockShare');
const StockShare = require('../models/StockProps');

/*
this is a very simple server which maintains a key/value
store using an object where the keys and values are lists of strings

*/

isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

// get the value associated to the key
router.get('/',
  isLoggedIn,
  async (req, res, next) => {
      res.locals.stocks = await StockShare.find({itemId:req.user._id})
      res.locals.stocks = await StockProps.find({itemId:req.user._id})
      res.render('stockEarnings');
});

/* add the value in the body to the list associated to the key */
/*
router.post('/',
  isLoggedIn,
  async (req, res, next) => {
      const stock = new StockShare(
        {stockIndex:req.body.stockIndex,
         time: req.body.time,
         share:req.body.share,
         actionType:req.body.actionType,
         sellPrice:req.body.sellPrice,
         buyPrice:req.body.buyPrice,
         aveCost:req.body.aveCost,
         itemId: req.user._id,
        })
      await stock.save();
      //res.render("todoVerification")
      res.redirect('/stock')
});

const {StringStream} = require("scramjet");
const request = require("request");

// replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key
request.get("https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY_EXTENDED&symbol=IBM&interval=15min&slice=year1month1&apikey=3GNM04I3VG4LFS8O")
    .pipe(new StringStream())
    .CSVParse()                                   // parse CSV output into row objects
    .consume(object => console.log("Row:", object))
    .then(() => console.log("success"));
*/

router.post('/',
  isLoggedIn,
  async (req, res, next) => {
        try{
          console.log("inside try")
          const index = req.body.stockIndex;
          //const url = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY_EXTENDED&symbol="+index+"&interval=15min&slice=year1month1&apikey=3GNM04I3VG4LFS8O";

          await alpha.data.intraday(String(index)).then(data => {
            const intradayData = data;
          });
          await alpha.data.daily(String(index)).then(data => {
            const dailyData = data;
          });
          await stock.save();
        } catch(error){
          console.log("Had an error")
          next(error)
        }
      //res.render("todoVerification")
      res.redirect('/stockDisplay')
});

router.get('/remove/:itemId',
  isLoggedIn,
  async (req, res, next) => {
      console.log("inside /stock/remove/:itemId")
      await StockShare.remove({_id:req.params.itemId});
      res.redirect('/stockDisplay')
});


module.exports = router;
