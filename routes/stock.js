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
    //stocks: list of buy/sell operations
      res.locals.stocks = await StockShare.find({itemId:req.user._id})
      res.render('stockList');
});

router.post('/',
  isLoggedIn,
  async (req, res, next) => {
        try{
          console.log("inside try")
          const index = req.body.stockIndex;
          //const url = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY_EXTENDED&symbol="+index+"&interval=15min&slice=year1month1&apikey=3GNM04I3VG4LFS8O";
          const thisIndex = req.body.stockIndex;
          const thisAction = parseInt(req.body.actionType);
          const thisShare = parseInt(req.body.share);
          const thisPrice = parseFloat(req.body.price);
          const thisCompare = null;
          const stock = new StockShare({
              stockIndex:thisIndex,
              time:req.body.time,
              share:thisShare,
              actionType:thisAction,
              price:thisPrice,
              itemId: req.user._id,
              cost:thisAction*thisShare*thisPrice,
            })
          await stock.save();
         }catch(error){
          console.log("Had an error")
          next(error)
        }
      //res.render("todoVerification")
      res.redirect('/stock')
});

router.get('/remove/:itemId',
  isLoggedIn,
  async (req, res, next) => {
      console.log("inside /stock/remove/:itemId")
      await StockShare.remove({_id:req.params.itemId});
      res.redirect('/stock')
});


module.exports = router;
