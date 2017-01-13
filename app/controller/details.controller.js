	var Record = require('../models/Record');
	var ClinicalTrial = require('../models/ClinicalTrial');
	var Synclog = require('../models/SyncLog');
	var DrugRecord = require('../models/DrugRecord');
	var mongoose = require('mongoose');
	var async = require('async');
	var request = require('request');
	var exec = require('child_process')
	    .exec;
	
	
	exports.productDetails = function(req, res) {
		var p_id = req.query.p_id;
		var p_type = req.query.p_type;
		
		if(!p_id  || !p_type) {
			res.json(
				{
					status:'error',
					message:'Please provide valid parameters.'
				}
			);
		}
	
	   if(p_type == 'clinicalTrials') {
		  ClinicalTrial.find({_id : p_id})
			.select('_id OfficialTitle IDInfo BriefSummary recordType Sponsors.LeadSponsor Sponsors.Collaborator._ CurrentProtocolStatus ProtocolPhase VerificationDate CTEntryCriteria DetailedDescription CTGovDisclaimer StartDate Eligibility.Gender Eligibility.HighAge Eligibility.AgeText  Eligibility.LowAge VerificationDate ProtocolDetail.StudyType LastChangedDate')
			.exec(function (err, trial) {
				res.send(
					{
						status:'success',
						data: trial[0]
					}
				);
			}); 
	   } else if(p_type == 'drugs') {
		   DrugRecord.find({ _id: p_id})
			.select('_id DrugInfoTitle DrugInfoMetaData recordType DateFirstPublished DateLastModified LastChangedDate DrugInfoDisclaimer.Para._')
			.exec(function (err, drug) {
				if(drug) {
					res.send(
						{
							status:'success',
							data: drug[0]
						}
					);
				} else {
					 res.json(
					{
						status:'error',
						message:'Please provide valid parameters.'
					}
			);
				}
			});
	   } else {
		   res.json(
				{
					status:'error',
					message:'Please provide valid parameters.'
				}
			);
	   }
	}
	
