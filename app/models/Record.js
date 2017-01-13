// grab the mongoose module

var mongoose = require('mongoose');
Schema = mongoose.Schema ;


// define the schema
var recordSchema = new mongoose.Schema({
	clinical_study:{
		//"$":[{rank:  String}],
		required_header: [{
			download_date: String,
			link_text: String,
			url: String
		}],
		id_info: [{
			org_study_id: String,
			secondary_id: String,
			nct_id: String
		}],
		start_date: String,
		sponsors: [{
			lead_sponsor: [{
				agency: String,
				agency_class: String
			}]
		}],
		brief_title: String,
		official_title: String,
		source: String,
		oversight_info: [{
			authority: String
		}],
		brief_summary: [{textblock: String}],
		overall_status: String,
		phase: String,
		study_type: String,
		study_design: String,
		condition: String,
		intervention: [{
			intervention_type: String,
			intervention_name: String
		}],
		eligibility: [{
			criteria: [{textblock: String}],
			gender: String,
			minimum_age: String,
			maximum_age: String,
			healthy_volunteers: String
		}],
		location: [{
			facility: [{
				name: String,
				address: [{
					city: String,
					state: String,
					zip: String,
					country: String,
				}]
			}]
		}],
		location_countries: [{
			country: String
		}],
		verification_date: Date,
		lastchanged_date: Date,
		firstreceived_date: Date,
		keyword: Array,
		has_expanded_access: Boolean,
		condition_browse: [{
			mesh_term: String
		}]
	}
});

// module.exports allows us to pass this to other files when it is called
module.exports =  mongoose.model('Record', recordSchema);
