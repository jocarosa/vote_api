var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Person = new Schema({
    _id: Number,
    username: String,
    displayName: String
    });

module.exports = mongoose.model('Person', Person);