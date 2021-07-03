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
const StockProps = require('../models/StockProps');



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
    //stockUni: list of individual stock indexes
      res.locals.stockps = await StockProps.find({itemId:req.user._id})
      res.render('stockInfoPage');
});

router.post('/',
  isLoggedIn,
  async (req, res, next) => {
        try{
          console.log("inside try")
          const index = req.body.index;
          alpha.data.intraday(String(index)).then(infor => {
            //console.log(JSON.stringify(data['Time Series (1min)']))
            const data = infor;
            const time = data['Meta Data']['3. Last Refreshed']
            const new_info = data['Time Series (1min)'][time]
            console.log(JSON.stringify(new_info))
            const stockprop = new StockProps({
              propIndex:index,
              time_param:String(time),
              open:parseFloat(new_info['1. open']),
              high:parseFloat(new_info['2. high']),
              low:parseFloat(new_info['3. low']),
              close:parseFloat(new_info['4. close']),
              volume:parseInt(new_info['5. volume']),
              itemId:req.user._id,
            })
            if (stockprop.open != null){
              stockprop.save();
            }
          });
         }catch(error){
          console.log("Had an error")
          next(error)
        }
      //res.render("todoVerification")
      res.redirect('/stockInfo')
});

router.get('/remove/:itemId',
  isLoggedIn,
  async (req, res, next) => {
      console.log("inside /stockInfo/remove/:itemId")
      await StockProps.remove({_id:req.params.itemId});
      res.redirect('/stockInfo')
});


module.exports = router;
