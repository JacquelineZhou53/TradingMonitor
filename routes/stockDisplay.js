/*
  stock Router
*/
const express = require('express');
const router = express.Router();
const {StringStream} = require("scramjet");
const request = require("request");
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
/*
          const indexList = [];
          const shareList = [];
          const costList = [];
          const stockCount = 0;
          StockShare.forEach(stock => {
              for (const i = 0; i < indexList.length; i++){
                    if (indexList.length == 0){
                          indexList.push(stock.stockIndex);
                          shareList.push(parseInt(stock.share)*parseInt(stock.actionType));
                          costList.push(stock.cost);
                    } else{
                          const flag = false;
                          for (let i = 0; i < indexList.length; i++){
                            if (indexList[i] == stock.stockIndex){
                              shareList[i] = shareList[i] + parseInt(stock.share)*parseInt(stock.actionType);
                              costList[i] = costList[i] + parseInt(stock.cost)
                              flag = true;
                              break;
                            }
                          } if (flag == false){
                            indexList.push(stock.stockIndex);
                            shareList.push(parseInt(stock.share)*parseInt(stock.actionType));
                            costList.push(stock.cost);
                          }
                     }
                  }
              })

              for (const i = 0; i < indexList.length; i++){
                      await alpha.data.daily(String(indexList[i])).then(data => {
                        const dailyData = data;
                      });
                      const newDate = new Date();
                      if ((StockProps.find({propIndex:indexList[i]})) != null){
                        StockProps.find({propIndex:indexList[i]}).totalShare = parseInt(shareList[i]);
                        StockProps.find({propIndex:indexList[i]}).totalCost = parseInt(costList[i]);
                        StockProps.find({propIndex:indexList[i]}).dailyData = dailyData;
                      } else{
                        const stockUni = new StockProps({
                          propIndex:String(indexList[i]),
                          totalShare:parseInt(shareList[i]),
                          itemId:req.user._id,
                          totalCost:parseInt(costList[i]),
                          dailyData:dailyData,
                        })
                        await stockUni.save();
                      }
              }
          */
// get the value associated to the key
router.get('/',
  isLoggedIn,
  async (req, res, next) => {
    //stocks: list of buy/sell operations
      res.locals.stocks = await StockShare.find({itemId:req.user._id})
    //stockUni: list of individual stock indexes
      res.locals.stockUnis = await StockProps.find({itemId:req.user._id})
      res.render('stockEarnings');
});

router.post('/',
  isLoggedIn,
  async (req, res, next) => {
        try{
          console.log("inside try")
          //const url = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY_EXTENDED&symbol="+index+"&interval=15min&slice=year1month1&apikey=3GNM04I3VG4LFS8O";

          const indexList = [];
          const shareList = [];
          const costList = [];
          const stockCount = 0;
          StockShare.forEach(stock => {
            for (const i = 0; i < indexList.length; i++){
              if (indexList.length == 0){
                indexList.push(stock.stockIndex);
                shareList.push(parseInt(stock.share)*parseInt(stock.actionType));
                costList.push(stock.cost);
              } else{
                const flag = false;
                for (let i = 0; i < indexList.length; i++){
                  if (indexList[i] == stock.stockIndex){
                    shareList[i] = shareList[i] + parseInt(stock.share)*parseInt(stock.actionType);
                    costList[i] = costList[i] + parseInt(stock.cost)
                    flag = true;
                    break;
                  }
                } if (flag == false){
                  indexList.push(stock.stockIndex);
                  shareList.push(parseInt(stock.share)*parseInt(stock.actionType));
                  costList.push(stock.cost);
                }
              }
            }
          })

          for (const i = 0; i < indexList.length; i++){
            await alpha.data.daily(String(indexList[i])).then(data => {
              const dailyData = data;
            });
            const newDate = new Date();
            const stockUni = new StockProps({
              propIndex:String(indexList[i]),
              totalShare:parseInt(shareList[i]),
              itemId:req.user._id,
              totalCost:parseInt(costList[i]),
              dailyData:dailyData,
            })
            await stockUni.save();
          }
        } catch(error){
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
