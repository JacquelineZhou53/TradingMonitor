
'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var stockShareSchema = Schema( {
   stockIndex: String,
   time: String,
   share: Number,
   actionType: Number,
   price: Number,
   itemId: ObjectId,
} );

module.exports = mongoose.model( 'StockShare', stockShareSchema );
