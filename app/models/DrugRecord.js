// grab the mongoose module

var mongoose = require('mongoose');
Schema = mongoose.Schema ;

// Define the ProtocolDetail schema


var glossarySchema = new mongoose.Schema({
	_: String
});

var glossaryTermSchema = new mongoose.Schema({
	_: String,
	GlossaryTermRef:[{
		_: String
	}]
});

var termSchema = new mongoose.Schema({
	Title: String,
		Para:[glossaryTermSchema],
		ItemizedList:[{
		  	ListItem:[{
				Strong:[{
					_: String,
					GlossaryTermRef:[{
						_: String
					}]
				}]
			}]
		}]
});

var listSchema = new mongoose.Schema({
	_ : String,
	Strong: [{
		GlossaryTermRef:[{
			_: String
		}]
	}],
	GlossaryTermRef: [{
		_: String,
		_a: {
			href: String
		}
	}]
});

var drugSchema = new mongoose.Schema({
	recordType:{type: String, default: 'drugs'},
	scores:{type: Number, default: 200},
	_a:{
		id: String
	},
	DrugInfoMetaData:[{
		DrugInfoType: String,
		DrugInfoAudience: String,
		DrugInfoDescription: String,
		DrugInfoURL: [{
			_: String,
			_a:{
				xref: String
			}
		}],
		FDAApproved: String,
		TerminologyLink:[{
			_ : String,
			_a : {
				ref: String
			}
		}],
		GlossaryLink:[{
			_ : String,
			_a : {
				ref: String
			}
		}],
		USBrandNames:[{
			USBrandName: Array
		}],
		PronunciationInfo:[{
			TermPronunciation: String
		}]
	}],
	DrugInfoTitle: String,
	DrugInfoDisclaimer:[{
		Para:[{
			_: String
		}]
	}],
	DateFirstPublished : String,
	DateLastModified : String,
	Section:[{},{
		Title: String,
		Para:[glossaryTermSchema],
		ItemizedList:[{
		  	ListItem:[{
				Strong:[{
					_: String,
					GlossaryTermRef:[{
						_: String
					}]
				}]
			}]
		}]
	}]
});


// module.exports allows us to pass this to other files when it is called
module.exports =  mongoose.model('DrugRecord', drugSchema);
