var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var Poll = Schema({
  _creator : { type: Number, ref: 'Person' },
  title    : String,
  options: [{ 
    title: String, 
    vote:  Number,
     }],
  idPoller: [{id:String}]
  
});

module.exports =mongoose.model('Poll', Poll);