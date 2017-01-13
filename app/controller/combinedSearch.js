	var Record = require('../models/Record');
	var ClinicalTrial = require('../models/ClinicalTrial');
	var Synclog = require('../models/SyncLog');
	var DrugRecord = require('../models/DrugRecord');
	var dataContent = require('../models/IdRecord');
	var TreatmentRecord = require('../models/TreatmentRecord');
	var mongoose = require('mongoose');
	var fs = require('fs'),
	    xml2js = require('xml2js');
	var async = require('async');
	var request = require('request');
	var exec = require('child_process')
	    .exec;


	/***
	 * 
	 * Search api that deals 
	 * with search and pagination
	 * of clinical records and
	 * drugs data. 
	 * 
	 * parameters accepted by the 
	 * api are as follows:--
	 * 
	 * ---------------------------------------------------------------------------------------------------------
	 *   Parameters                Possible values                 Comment
	 * ---------------------------------------------------------------------------------------------------------
	 * 
		drugFlag : false            true or false                  defines search is 
																   only working on drugs
		---------------------------------------------------------------------------------------------------------
		trialFlag : false 			true or false 				   defines search is only
																   working on clinical trials
	    ---------------------------------------------------------------------------------------------------------
		drugPageNo : 1    			for pagination 
		---------------------------------------------------------------------------------------------------------
		trialsPageNo : 1 			for pagination
		----------------------------------------------------------------------------------------------------------
		recordsPerPage : 10 		total records to return
		----------------------------------------------------------------------------------------------------------
		search : "" 				search string
		----------------------------------------------------------------------------------------------------------
	 * 
	 * ***/


	exports.combinedSearch = function (req, res) {
	        // search variable
	        var searchData = req.query.search == '' ? '' : req.query.search;
	        var re = new RegExp(searchData, 'i');

	        // pagination variables
	        var recordsPerPage = parseInt(req.query.recordsPerPage);

	        var trialSkip = parseInt(req.query.pageNo) - 1;
	        trialSkip = trialSkip * recordsPerPage;

	        var drugSkip = parseInt(req.query.drugPageNo) - 1;
	        drugSkip = drugSkip * recordsPerPage;

	        var drugFlag = req.query.drugFlag;
	        var trialFlag = req.query.trialFlag;

	        var flag_t = false;
	        var flag_d = false;
	        if (drugFlag == 'true' && trialFlag == 'false') {
	            // search will only work on drugs records
	            flag_t = true;
	            recordsPerPage = recordsPerPage * 2;
	        }

	        if (drugFlag == 'false' && trialFlag == 'true') {
	            // search will only work on trials records
	            flag_d = true;
	            recordsPerPage = recordsPerPage * 2;
	        }


	        /***
	         * 
	         * 
	         * Trials = 300
	         * drug = 200
	         * Inactive/Complete trials = 250
	         * Estimated completion date in future get  = 350
	         * FDA approved drugs get = 220
	         * Drugs updated within the past week gets = 320
	         * 
	         * ***/



	        async.parallel({
	            trails: function (callback) {
	                if (flag_t) {
	                    setTimeout(function () {
	                        callback(null, []);
	                    }, 20);
	                } else {
	                    ClinicalTrial.find()
	                        .or([{
	                            'OfficialTitle': {
	                                $regex: re
	                            }
							}, {
	                            'Eligibility.Diagnosis.SpecificDiagnosis': {
	                                $elemMatch: {
	                                    _: re
	                                }
	                            }
							}])
	                        .limit(recordsPerPage)
	                        .skip(trialSkip)
	                        .select('_id OfficialTitle IDInfo BriefSummary recordType Sponsors.LeadSponsor Sponsors.Collaborator._')
	                        .exec(function (err, trials) {
	                            callback(err, trials);
	                        });
	                }
	            },
	            trailsCount: function (callback) {
	                if (flag_t) {
	                    setTimeout(function () {
	                        callback(null, 0);
	                    }, 20);
	                } else {
	                    ClinicalTrial.count()
	                        .or([{
	                            'OfficialTitle': {
	                                $regex: re
	                            }
									}, {
	                            'Eligibility.Diagnosis.SpecificDiagnosis': {
	                                $elemMatch: {
	                                    _: re
	                                }
	                            }
									}])
	                        .exec(function (err, trailsCount) {
	                            callback(err, trailsCount);
	                        });
	                }
	            },
	            drugs: function (callback) {
	                if (flag_d) {
	                    setTimeout(function () {
	                        callback(null, []);
	                    }, 20);
	                } else {
	                    DrugRecord.find()
	                        .or([
	                            {
	                                'DrugInfoTitle': {
	                                    $regex: re
	                                }
					}, {
	                                'DrugInfoMetaData.USBrandNames.USBrandName': {
	                                    $regex: re
	                                }
					}, {
	                                'Section': {
	                                    $elemMatch: {
	                                        Title: re
	                                    }
	                                }
					},
	                            {
	                                'Section.Para.GlossaryTermRef': {
	                                    $elemMatch: {
	                                        _: re
	                                    }
	                                }

					},
	                            {
	                                'Section.ItemizedList.ListItem.GlossaryTermRef': {
	                                    $elemMatch: {
	                                        _: re
	                                    }
	                                }

					},
	                            {
	                                'Section.ItemizedList.ListItem': {
	                                    $elemMatch: {
	                                        _: re
	                                    }
	                                }

					},
	                            {
	                                'Section.ItemizedList.ListItem.Strong.GlossaryTermRef': {
	                                    $elemMatch: {
	                                        _: re
	                                    }
	                                }

					}

				 ])
	                        .limit(recordsPerPage)
	                        .skip(drugSkip)
	                        .select('_id DrugInfoTitle DrugInfoMetaData recordType')
	                        .exec(function (err, drugs) {
	                            callback(err, drugs);
	                        });
	                }
	            },
	            drugsCount: function (callback) {
	                if (flag_d) {
	                    setTimeout(function () {
	                        callback(null, 0);
	                    }, 20);
	                } else {
	                    DrugRecord.count()
	                        .or([
	                            {
	                                'DrugInfoTitle': {
	                                    $regex: re
	                                }
					}, {
	                                'DrugInfoMetaData.USBrandNames.USBrandName': {
	                                    $regex: re
	                                }
					}, {
	                                'Section': {
	                                    $elemMatch: {
	                                        Title: re
	                                    }
	                                }
					},
	                            {
	                                'Section.Para.GlossaryTermRef': {
	                                    $elemMatch: {
	                                        _: re
	                                    }
	                                }

					},
	                            {
	                                'Section.ItemizedList.ListItem.GlossaryTermRef': {
	                                    $elemMatch: {
	                                        _: re
	                                    }
	                                }

					},
	                            {
	                                'Section.ItemizedList.ListItem': {
	                                    $elemMatch: {
	                                        _: re
	                                    }
	                                }

					},
	                            {
	                                'Section.ItemizedList.ListItem.Strong.GlossaryTermRef': {
	                                    $elemMatch: {
	                                        _: re
	                                    }
	                                }

					}

				 ])
	                        .exec(function (err, drugsCount) {
	                            callback(err, drugsCount)
	                        });
	                }
	            },
	        }, function (err, result) {
	            var totalCount = parseInt(result.trailsCount) + parseInt(result.drugsCount);
	            var records = result.trails.concat(result.drugs);
	            records = shuffle(records);
	            var data = {
	                records: records,
	                totalCount: totalCount,
	                status: 'success'
	            }
	            res.json(data);
	        });
	};


	// shuffling array // 
	function shuffle(array) {
	    var currentIndex = array.length,
	        temporaryValue, randomIndex;

	    // While there remain elements to shuffle...
	    while (0 !== currentIndex) {

	        // Pick a remaining element...
	        randomIndex = Math.floor(Math.random() * currentIndex);
	        currentIndex -= 1;

	        // And swap it with the current element.
	        temporaryValue = array[currentIndex];
	        array[currentIndex] = array[randomIndex];
	        array[randomIndex] = temporaryValue;
	    }

	    return array;
	}
