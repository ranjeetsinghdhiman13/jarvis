var mongo = require('mongodb');
var url = 'mongodb://localhost:27017/mydb';
var fs = require('fs');
var assert = require('assert');
var allocateHelper = require('./allocateHelper.js');

var returnValue = '{"butlers": [{"requests": []}],"spreadClientIds": []}';
var returnJSON = JSON.parse(returnValue);
var setOfClientIds = new Set();

mongo.connect(url, { useNewUrlParser: true }, function (err, db) {
	console.log(returnJSON);
	if (err) throw err;
	var dbObject = db.db('mydb');
	dbObject.collection('requests').find().toArray(function (err, result) {
		var hours = 0;
		var butlerId = 0;
		for (request in result) {
			var clientId = result[request].clientId;
			allocateHelper.addClientIdToSet(clientId);
			var newRequestHours = result[request].hours;
			if ((hours + newRequestHours) > 8) {
				butlerId = allocateHelper.createNewButler(butlerId, newRequestHours, result);
				hours = 0;
			} else {
				if (hours == 0) {
					butlerId = allocateHelper.createNewButler(butlerId, newRequestHours, result);
				} else {
					allocateHelper.addTaskToExistingButler(newRequestHours, result);
				}
			}
			hours = hours + newRequestHours;
			if (hours > 8)
				hours = 0;
		}
		console.log('======');
		for (let clientId of setOfClientIds) {
			returnJSON.spreadClientIds.push(clientId);
		}
		console.log(returnJSON);
		allocateHelper.writeOutputToDisk(JSON.stringify(returnJSON), './output.json');
		});
	db.close();
});
