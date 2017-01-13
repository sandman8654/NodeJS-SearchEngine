	/*
	 * Cron job function
	 * Functions to automate the sync of clinical trials
	 * 
	 * Api used to get clinical Trials
	 * https://clinicaltrials.gov/ct2/results?term=cancer&lup_s=lup_s&lup_e=lup_estudyxml=true
	 * 
	 * */
	var CronJob = require('cron')
	    .CronJob;
	var Record = require('../models/Record');
	var Synclog = require('../models/SyncLog');
	var mongoose = require('mongoose');
	var fs = require('fs'),
	    xml2js = require('xml2js');
	var async = require('async');
	var request = require('request');
	var exec = require('child_process')
	    .exec;
	var dataContent = require('../models/IdRecord');

	/*
	 * CRON JOB TO SYNC RECORDS IN LOCAL DATABASE
	 * 
	 *  
	 * Move 1000 files from main folder to sync folder
	 * then convert those xml files in json and save them in mongo db
	 * then again check go for another 1000 files 
	 * The process will go on until no files found
	 * 
	 * This cron will run Mon-Friday at 11:30 pm 
	 * */


	var syncClinicalTrials = new CronJob({
	    cronTime: '00 30 11 * * 1-5',
	    onTick: function () {

	        var fileLength = 0;
	        fs.readdir(__dirname + '/search_results', function (err, fileNames) {
	            if (fileNames) {
	                fileLength = fileNames.length;
	            }

	            async.whilst(
	                function () {
	                    return fileLength != 0;
	                },
	                function (callback) {
	                    // copy files from SEARCH_RESULT folder to XML folder.
	                    var cmd = "mv $(ls " + __dirname + "/search_results/* | head -n 1000) " + __dirname + "/xml";
	                    exec(cmd, function (error, stdout, stderr) {

	                        // read the directory and sync all files in local DB
	                        fs.readdir(__dirname + '/xml', function (err, fileNames) {
	                            if (err) throw err;

	                            // Async loop
	                            async.each(fileNames, function (file, callback) {
	                                fs.readFile(__dirname + '/xml/' + file, function (err, data) {
	                                    var parser = new xml2js.Parser();
	                                    parser.parseString(data, function (err, result) {
	                                        var record = new Record(result);
	                                        var id = (record.clinical_study.id_info) ? record.clinical_study.id_info[0].nct_id : 0;
	                                        Record.findOneAndRemove({
	                                            'clinical_study.id_info.nct_id': id
	                                        }, function (err) {
	                                            if (err) throw err;
	                                        });
	                                        record.save(function (err, response) {
	                                            if (err) throw err;
	                                        });
	                                    });
	                                    fs.unlink(__dirname + '/xml/' + file);
	                                    parser.reset();
	                                    callback();
	                                });
	                            }, function (err) {
	                                if (err) {
	                                    res.json(err);
	                                } else {
	                                    // On success
	                                    fs.readdir(__dirname + '/search_results', function (err, fileNames) {
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
	                    });
	                }
	            );
	        });

	    },
	    start: false,
	    timeZone: 'America/Los_Angeles'
	});

	/*
	 * fetch clinical trials
	 * 
	 * Runs every weekday (Monday through Friday)
	 * at 09:30:00 AM. It does not run on Saturday
	 * or Sunday.
	 */

	var fetchClinicTrials = new CronJob({
	    cronTime: '00 30 09 * * 1-5',
	    onTick: function () {
	        //Lets configure and request
	        Synclog.findOne({
	            title: 'clinicaltrials.gov/ct2/results'
	        }, function (err, ls_data) {
	            if (err) {
	                lup_s = '';
	            } else {
	                var lup_s = ls_data ? ls_data.lup_date : '';
	                if (lup_s) {
	                    var d = new Date(lup_s);
	                    var lup_s = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
	                }
	            }
	            var d = new Date();
	            var lup_e = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
	            request({
	                url: 'https://clinicaltrials.gov/ct2/results', //URL to hit
	                method: 'GET',
	                qs: {
	                    term: 'cancer',
	                    lup_s: lup_s,
	                    lup_e: lup_e,
	                    studyxml: true
	                },
	                encoding: null
	            }, function (error, response, body) {
	                if (error) {
	                    res.json({
	                        "status": 'failure'
	                    });
	                } else {
	                    fs.writeFile(__dirname + '/search_results.zip', body, function (err) {
	                        if (err) return console.log(err);
	                        if (fs.existsSync(__dirname + '/search_results')) {
	                            deleteFolderRecursive(__dirname + '/search_results');
	                        }
	                        var cmd = "unzip " + __dirname + '/search_results.zip' + " -d " + __dirname + "/search_results";
	                        exec(cmd, function (error, stdout, stderr) {
	                            fs.unlink(__dirname + '/search_results.zip');
	                            var data = {
	                                title: 'clinicaltrials.gov/ct2/results',
	                                lup_date: new Date()
	                            };
	                            Synclog.findOneAndUpdate({
	                                'title': 'clinicaltrials.gov/ct2/results'
	                            }, data, {
	                                upsert: true
	                            }, function (err, result) {
	                                res.json({
	                                    "status": response
	                                });
	                            });
	                        });
	                    });
	                }
	            });
	        });
	    },
	    start: false,
	    timeZone: 'America/Los_Angeles'
	});


	var deleteFolderRecursive = function (path) {
	    if (fs.existsSync(path)) {
	        fs.readdirSync(path)
	            .forEach(function (file, index) {
	                var curPath = path + "/" + file;
	                if (fs.lstatSync(curPath)
	                    .isDirectory()) {
	                    deleteFolderRecursive(curPath);
	                } else {
	                    fs.unlinkSync(curPath);
	                }
	            });
	        fs.rmdirSync(path);
	    }
	};

	/*********************************************************************************************************/
	
	var skip = 0;
	var cronCount = 0;
	var totalItemCount = 0;


	var syncContentRecords = new CronJob({
	    cronTime: '0 */1 * * * *',
	    onTick: function () {
	        var fileLength = 0;
	        console.log('SKIP------>' + skip);

	        dataContent.count(function (err, count) {
	            totalItemCount = count;
	        });

	        dataContent
	            .find()
	            .sort({
	                id: 1
	            })
	            .skip(skip)
	            .limit(10)
	            .select('id')
	            .exec(function (err, idArray) {
	                if (idArray) {
	                    fileLength = idArray.length;
	                }
	                console.log('fileLength------->' + fileLength);

	                async.whilst(
	                    function () {
	                        return fileLength > 0;
	                    },
	                    function (callback) {
	                        var contentId = idArray[fileLength - 1].id;
	                        request({
	                            url: 'https://api.digitalmedia.hhs.gov/api/v2/resources/media/' + contentId + '/syndicate.json?ignoreHiddenMedia=1',
	                            method: 'GET'
	                        }, function (error, response, body) {
	                            if (error) {
	                                console.log(error);
	                            } else {
	                                var data = JSON.parse(response.body);
	                                var updateData = {
	                                    content: data.results[0].content,
	                                    sourceUrl: data.results[0].sourceUrl,
	                                    mediaType: data.results[0].mediaType
	                                };

	                                dataContent.findOneAndUpdate({
	                                    'id': contentId
	                                }, updateData, function (err, response) {
	                                    console.log(contentId);
	                                    fileLength--;
	                                    callback(null, fileLength);
	                                });
	                            }
	                        });
	                    },
	                    function (err, n) {
	                        skip += 10;
	                        cronCount += 10;
	                        console.log('cron-count  ------> ' + cronCount);

	                        var data = {
	                            title: 'syncDataContentRecords',
	                            lup_date: new Date()
	                        };
	                        var synclog = new Synclog(data);
	                        synclog.save(function (err, result) {
	                            console.log('data synced successfully.');
	                        });
	                        if (cronCount >= totalItemCount) {
	                            console.log('Please stop cron job');
	                            skip = 0;
	                            cronCount = 0;
	                            syncContentRecords.stop();
	                        }
	                    }
	                );
	            });
	    },
	    start: false,
	    timeZone: 'America/Los_Angeles'
	});

	/********
	 * Start Cron jobs
	 * ******/

	//syncContentRecords.start();
	
	//syncClinicalTrials.start();
	//~ //syncClinicalTrials.start();

	//~ new CronJob('0 */1 * * * *', function () {
	    //~ console.log('You will see this message every one minute');
	//~ }, null, true, 'America/Los_Angeles');
