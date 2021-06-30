
'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var stockPropsSchema = Schema( {
   propIndex: String,
   share: Number,
   price: Number,
   itemId: ObjectId,
   cost: Number,
} );

module.exports = mongoose.model( 'StockProps', stockPropsSchema );
