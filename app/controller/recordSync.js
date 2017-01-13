	var Record = require('../models/Record');
	var ClinicalTrial = require('../models/ClinicalTrial');
	var Synclog = require('../models/SyncLog');
	var DrugRecord = require('../models/DrugRecord');
	var TreatmentRecord = require('../models/TreatmentRecord');
	var mongoose = require('mongoose');
	var fs = require('fs'),
	    xml2js = require('xml2js');
	var async = require('async');
	var request = require('request');
	var exec = require('child_process')
	    .exec;
	
	    exports.syncClinicalTrials =  function (req, res) {
	       var fileLength = 0;
	        fs.readdir(__dirname + '/sync/search_results', function (err, fileNames) {
	            if (fileNames) {
	                fileLength = fileNames.length;
	            }

	            async.whilst(
	                function () {
	                    return fileLength != 0;
	                },
	                function (callback) {
	                    // copy files from SEARCH_RESULT folder to XML folder.
	                    var cmd = "mv $(ls " + __dirname + "/sync/search_results/* | head -n 100) " + __dirname + "/sync/xml";
	                    exec(cmd, function (error, stdout, stderr) {

	                        // read the directory and sync all files in local DB
	                        fs.readdir(__dirname + '/sync/xml', function (err, fileNames) {
	                            if (err) throw err;

	                            // Async loop
	                            async.each(fileNames, function (file, callback) {
	                                fs.readFile(__dirname + '/sync/xml/' + file, function (err, data) {
	                                    var parser = new xml2js.Parser();
	                                    parser.parseString(data, function (err, result) {
	                                        var trial = new ClinicalTrial(result.CTGovProtocol);
	                                        var id = (trial.IDInfo) ? trial.IDInfo[0].NCTID : 0;
	                                        ClinicalTrial.findOneAndRemove({
	                                            'IDInfo.NCTID': id
	                                        }, function (err) {
	                                            if (err) throw err;
	                                        });
	                                        trial.save(function (err, response) {
	                                            if (err) throw err;
	                                        });
	                                    });
	                                    fs.unlink(__dirname + '/sync/xml/' + file);
	                                    parser.reset();
	                                    callback();
	                                });
	                            }, function (err) {
	                                if (err) {
	                                    res.json(err);
	                                } else {
	                                    // On success
	                                    fs.readdir(__dirname + '/sync/search_results', function (err, fileNames) {
	                                        fileLength = fileNames.length;
	                                        callback(null, fileLength);
	                                    });
	                                }
	                            });
	                        });
	                    });
	                },
	                function (err, n) {
	                    var data = {
	                        title: 'syncClinicRecords',
	                        lup_date: new Date()
	                    };
	                    var synclog = new Synclog(data);
	                    synclog.save(function (err, result) {
	                        console.log('data synced successfully.');
	                        res.json({'status':'success'});
	                    });
	                }
	            );
	        });
	    };
	    
	   exports.syncDrugsRecords = function (req, res) {
	       var fileLength = 0;
	        fs.readdir(__dirname + '/sync/drug_results', function (err, fileNames) {
	            if (fileNames) {
	                fileLength = fileNames.length;
	            }

	            async.whilst(
	                function () {
	                    return fileLength != 0;
	                },
	                function (callback) {
	                    // copy files from SEARCH_RESULT folder to XML folder.
	                    var cmd = "mv $(ls " + __dirname + "/sync/drug_results/* | head -n 100) " + __dirname + "/sync/drugs_xml";
	                    exec(cmd, function (error, stdout, stderr) {

	                        // read the directory and sync all files in local DB
	                        fs.readdir(__dirname + '/sync/drugs_xml', function (err, fileNames) {
	                            if (err) throw err;

	                            // Async loop
	                            async.each(fileNames, function (file, callback) {
	                                fs.readFile(__dirname + '/sync/drugs_xml/' + file, function (err, data) {
	                                    var parser = new xml2js.Parser();
	                                    parser.parseString(data, function (err, result) {
											
											//~ res.send({data:result});
											//~ return false;
											
	                                        var drug = new DrugRecord(result.DrugInformationSummary);
	                                        var id = (drug._a) ? drug._a.id : 0;
	                                        console.log(id);
	                                        DrugRecord.findOneAndRemove({
	                                            '_a.id': id
	                                        }, function (err) {
	                                            if (err) throw err;
	                                        });
	                                        drug.save(function (err, response) {
	                                            if (err) throw err;
	                                        });
	                                    });
	                                    
	                                    fs.unlink(__dirname + '/sync/drugs_xml/' + file);
	                                    parser.reset();
	                                    callback();
	                                });
	                            }, function (err) {
	                                if (err) {
	                                    res.json(err);
	                                } else {
	                                    // On success
	                                    fs.readdir(__dirname + '/sync/drug_results', function (err, fileNames) {
	                                        fileLength = fileNames.length;
	                                        callback(null, fileLength);
	                                    });
	                                }
	                            });
	                        });
	                    });
	                },
	                function (err, n) {
	                    var data = {
	                        title: 'syncDrugRecords',
	                        lup_date: new Date()
	                    };
	                    var synclog = new Synclog(data);
	                    synclog.save(function (err, result) {
	                        console.log('data synced successfully.');
	                        res.json({'status':'success'});
	                    });
	                }
	            );
	        });
	    };
	    
	    
	    exports.syncTreatmentRecords = function (req, res) {
	       var fileLength = 0;
	        fs.readdir(__dirname + '/sync/treatment_results', function (err, fileNames) {
	            if (fileNames) {
	                fileLength = fileNames.length;
	            }

	            async.whilst(
	                function () {
	                    return fileLength != 0;
	                },
	                function (callback) {
	                    // copy files from SEARCH_RESULT folder to XML folder.
	                    var cmd = "mv $(ls " + __dirname + "/sync/treatment_results/* | head -n 100) " + __dirname + "/sync/treatment_xml";
	                    exec(cmd, function (error, stdout, stderr) {

	                        // read the directory and sync all files in local DB
	                        fs.readdir(__dirname + '/sync/treatment_xml', function (err, fileNames) {
	                            if (err) throw err;

	                            // Async loop
	                            async.each(fileNames, function (file, callback) {
	                                fs.readFile(__dirname + '/sync/treatment_xml/' + file, function (err, data) {
	                                    var parser = new xml2js.Parser();
	                                    parser.parseString(data, function (err, result) {
											var dt = result.Summary;
	                                        var treatment = new TreatmentRecord(dt);
	                                        var id = (dt._a) ? dt._a.id : 0;
	                                        console.log(id);
	                                        TreatmentRecord.findOneAndRemove({
	                                            '_a.id': id
	                                        }, function (err) {
	                                            if (err) throw err;
	                                        });
	                                        
	                                        treatment.save(function (err, response) {
	                                            if (err) throw err;
	                                        });
	                                        
	                                    });
	                                    
	                                    fs.unlink(__dirname + '/sync/treatment_xml/' + file);
	                                    parser.reset();
	                                    callback();
	                                });
	                            }, function (err) {
	                                if (err) {
	                                    res.json(err);
	                                } else {
	                                    // On success
	                                    fs.readdir(__dirname + '/sync/treatment_results', function (err, fileNames) {
	                                        fileLength = fileNames.length;
	                                        callback(null, fileLength);
	                                    });
	                                }
	                            });
	                        });
	                    });
	                },
	                function (err, n) {
	                    var data = {
	                        title: 'syncTreatmentRecords',
	                        lup_date: new Date()
	                    };
	                    var synclog = new Synclog(data);
	                    synclog.save(function (err, result) {
	                        console.log('data synced successfully.');
	                        res.json({'status':'success'});
	                    });
	                }
	            );
	        });
	    };
	    
