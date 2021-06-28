/*
  todoAjax.js -- Router for the ToDoList
  used in Ajax calls from the client
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
  async (req, res, next) => {
      res.locals.stocks = await StockShare.find({itemId:req.user._id})
      res.render('stockClient')
});

// get the value associated to the key
router.get('/stocks',
  async (req, res, next) => {
      let stocks = await StockShare.find({itemId:req.user._id})
      res.json(stocks)
});

/* add the value in the body to the list associated to the key */
router.post('/',
  async (req, res, next) => {
      console.log(`req.body=${JSON.stringify(req.body)}`)
      const stock = new StockShare(
        {stockIndex:req.body.stockIndex,
         time: req.body.time,
         share:req.body.share,
         actionType:req.body.actionType,
         price:req.body.price,
         itemId: req.user._id,
        })
      let newStock = await stock.save();
      res.json(newStock)
});

router.get('/testing', (req,res) => res.json(['it','works']))

router.post('/remove',
  async (req, res, next) => {
    try {
      let itemId = req.body.itemId
      console.log("inside /stock/remove/:itemId")
      let result = await StockShare.remove({_id:itemId});
      res.json(result)
    }catch(e){
      next(e)
    }
});



module.exports = router;
