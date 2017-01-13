var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var syncLogSchema = new Schema({
  title:  String,
  lup_date: Date
});

// module.exports allows us to pass this to other files when it is called
module.exports =  mongoose.model('Synclog', syncLogSchema);
