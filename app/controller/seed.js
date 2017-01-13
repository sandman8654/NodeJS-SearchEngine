var Synclog = require('../models/SyncLog');
var mongoose = require('mongoose');
var async = require('async');
var request = require('request');
var dataContent = require('../models/IdRecord');

(function () {
	var data = {
		title: 'clinicaltrials.gov/ct2/results',
		lup_date: new Date()
	};
	Synclog.findOneAndUpdate({
		'title': 'clinicaltrials.gov/ct2/results'
	}, data, {
		upsert: true
	}, function (err, result) {
		console.log('log collection saved');
	});
})();
//~ 
//~ (function (){
	 //~ request({
			//~ url: 'https://api.digitalmedia.hhs.gov/api/v2/resources.json',
			//~ method: 'GET',
			//~ qs: {
				//~ q: 'cancer'
			//~ }
		//~ }, function (error, response, body) {
		//~ if (error) {
			//~ console.log(error);
		//~ } else {
			//~ finallyDone = function() {
				//~ console.log("Everything has saved");
			//~ }
			//~ var data = JSON.parse(response.body);
			//~ var dataArray = data.results[0].htmls.items;
			//~ console.log(dataArray);
			//~ var done = 0;
			//~ for (var ind = 0; ind <= dataArray.length; ind++) {
				//~ console.log(dataArray.length);
				//~ console.log(typeof dataArray[ind]);
				//~ if(typeof dataArray[ind] === undefined) {
					//~ // does not exist
					//~ done++;
					//~ if (done == dataArray.length) {
						//~ finallyDone();
					//~ }
					//~ continue;
				//~ }
				//~ 
				//~ var id = dataArray[ind].id;
				//~ var data = {
					//~ id: id,
					//~ name: dataArray[ind].name
				//~ }
				//~ 
				//~ dataContent.findOneAndUpdate({'id': id}, data, {upsert: true}, function(err, response) {
					//~ if (err)
					//~ res.send(err);
					//~ done++;
					//~ if (done == dataArray.length) {
						//~ finallyDone();
					//~ }
				//~ });
			//~ }
//~ 
			//~ 
		//~ }
	//~ });
//~ })();

/*
var skip = 0;
var cronCount = 0;
var totalItemCount = 0;

(function(){
	var fileLength = 0;
	console.log('SKIP------>'+skip);
	
	dataContent.count(function(err, count){
		totalItemCount = count;
	});
	
	dataContent
		.find()
		.sort({ id : 1})
		//.skip(69)
		//.limit(10)
		.select('id')
		.exec(function (err, idArray) {
			if (idArray) {
				fileLength = idArray.length;
			}
			console.log('fileLength------->'+fileLength);
			
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
								console.log('before parse');
								var data = JSON.parse(response.body);
								console.log('after parse');
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
					console.log('Task performed successfully.');
					//~ if(cronCount >= totalItemCount) {
						//~ console.log('Please stop cron job');
						//~ skip = 0;
						//~ cronCount = 0;
						//~ //syncContentRecords.stop();
					//~ }
				}
			);
		});
})();
* */
