// grab the mongoose module

var mongoose = require('mongoose');
Schema = mongoose.Schema ;

// module.exports allows us to pass this to other files when it is called

var thingSchema = new Schema({}, { strict: false });
module.exports =  mongoose.model('TreatmentRecord', thingSchema);


//~ // Define the ProtocolDetail schema
//~ 
//~ var citationSchema = new mongoose.Schema({
	//~ _: String,
	//~ ExternalRef: [{
		//~ _a:{
			//~ xref: String
		//~ }
	//~ }]
//~ });
//~ var citation2Schema = new mongoose.Schema({
	//~ _: String
//~ });
//~ 
//~ var treatmentSchema = new mongoose.Schema({
	//~ _a:{
		//~ id: String
	//~ },
	//~ SummaryMetaData:[{
		//~ SummaryType: String,
		//~ SummaryAudience: String,
		//~ SummaryLanguage: String,
		//~ SummaryDescription: String,
		//~ SummaryURL:[{
			//~ _:String,
			//~ _a:{
			 //~ xref: String
			//~ }
		//~ }],
		//~ SummaryEditorialBoard:[{
			//~ _: String
		//~ }],
		//~ MainTopics:[{
			//~ TermRef:[{
				//~ _ : String
			//~ }]
		//~ }],
		//~ SummaryKeyWords:[{
			//~ SummaryKeyWord: Array
		//~ }]
	//~ }],
	//~ SummaryTitle: String,
	//~ AltTitle: [{
		//~ _ : String
	//~ }],
	//~ SummarySection:[{
		//~ Title: String,
		//~ SummarySection:[{
		//~ 
			//~ Title: String,
			//~ Para:[{
			  //~ _:String
			//~ }],
			//~ ItemizedList:[{
				//~ ListItem: Array
			//~ }]
		//~ },{
			//~ Title: String,
			//~ Para:[{
			  //~ _:String
			//~ },{
				//~ _: String,
				//~ 
			//~ }]
		//~ },{
			//~ Title: String,
			//~ Para:[{
			  //~ _:String
			//~ }],
			//~ ItemizedList:[{
				//~ ListItem: Array
			//~ }]
		//~ }],
		//~ Para:[{
			//~ _ : String
		//~ }],
		//~ ReferenceSection:[{
			//~ Citation:[citationSchema]
		//~ }]	
	//~ },{
		//~ SectMetaData: [{
			//~ SpecificDiagnosis:[{
				//~ _: String
			//~ }],
			//~ SectionType: String
		//~ }],
		//~ Title: String,
		//~ Para:[{
			//~ _ : String
		//~ }],
		//~ SummarySection:[{
			//~ Para:[{},{
				//~ _: String
			//~ }],
			//~ ItemizedList:[{
			//~ }]
		//~ },{
			//~ Title: String,
			//~ Para: [{
				//~ _: String
			//~ },{
				//~ _: String
			//~ },{
				//~ _:String
			//~ }]
		//~ }],
		//~ ReferenceSection:[{
			//~ Citation:[citation2Schema]
		//~ }]
	//~ },{
		//~ SectMetaData:[{
			//~ SpecificDiagnosis:[{
				//~ _: String
			//~ }],
			//~ SectionType: String
		//~ }],
		//~ Title: String,
		//~ Para:[{
			//~ _:String
		//~ },{
			//~ _:String
		//~ },{
			//~ _:String
		//~ }],
		//~ SummarySection:[{
			//~ Para:[{},{
				//~ _: String
			//~ },{
				//~ Note:[{
					//~ _:String
				//~ }]
			//~ },{
				//~ _: String
			//~ },{
				//~ _:String
			//~ }],
			//~ ItemizedList:[{
				//~ ListItem:String
			//~ }]
		//~ },{
			//~ Para:[{
				//~ _: String
			//~ },{
				//~ _:String
			//~ }],
			//~ ItemizedList:[{
				//~ ListItem:[{
					//~ _:String
				//~ },{
					//~ _:String
				//~ },{
					//~ _:String
				//~ },{
					//~ _:String
				//~ }]
			//~ }]
		//~ }],
		//~ ReferenceSection:[{
			//~ Citation:[citation2Schema]
		//~ }]
	//~ },{
		//~ SectMetaData:[{
			//~ SpecificDiagnosis:[{
				//~ _: String
			//~ },{
				//~ _: String
			//~ }],
			//~ SectionType: String
		//~ }],
		//~ Title:String,
		//~ Para: [{},{
			//~ _: String
		//~ },{
			//~ _: String
		//~ },{
			//~ _:String
		//~ },{
			//~ _:String
		//~ }]
	//~ }]
//~ });
//2689









