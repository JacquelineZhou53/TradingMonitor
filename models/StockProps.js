
'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var stockPropsSchema = Schema( {
   propIndex: String,
   time_param: String,
   open: Number,
   high: Number,
   low: Number,
   close: Number,
   volume: Number,
   itemId: ObjectId,
} );

module.exports = mongoose.model( 'StockProps', stockPropsSchema );
