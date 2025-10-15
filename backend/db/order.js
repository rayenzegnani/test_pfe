const mongoose = require('mongoose');
const ordrerSchema = new mongoose.Schema({
    date: Date,
    itemes: Array(any),
    status:Number
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;