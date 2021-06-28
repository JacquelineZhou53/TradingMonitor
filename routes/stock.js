/*
  stock Router
*/
const express = require('express');
const router = express.Router();
const StockShare = require('../models/StockShare')


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
      res.render('stockList');
});

/* add the value in the body to the list associated to the key */
router.post('/',
  isLoggedIn,
  async (req, res, next) => {
      const stock = new StockShare(
        {stockIndex:req.body.stockIndex,
         time: req.body.time,
         share:req.body.share,
         actionType:req.body.actionType,
         price:req.body.price,
         itemId: req.user._id,
        })
      await stock.save();
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
