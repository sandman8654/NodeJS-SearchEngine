// grab the mongoose module

var mongoose = require('mongoose');
Schema = mongoose.Schema ;

// module.exports allows us to pass this to other files when it is called

var dataContentSchema = new Schema({
	id: String,
	name: String,
	sourceUrl: String,
	content: String,
	mediaType: String
});
module.exports =  mongoose.model('dataContent', dataContentSchema);
