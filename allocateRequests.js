var mongo = require('mongodb');
var url = 'mongodb://localhost:27017/mydb';
var fs = require('fs');
var assert = require('assert');
var allocateHelper = require('./allocateHelper.js');

mongo.connect(url, { useNewUrlParser: true }, function (err, db) {
	console.log(allocateHelper.getReturnJSONObject());
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
		for (let clientId of allocateHelper.getClientIdsSet()) {
			allocateHelper.getReturnJSONObject().spreadClientIds.push(clientId);
		}
		console.log(allocateHelper.getReturnJSONObject());
		allocateHelper.writeOutputToDisk(JSON.stringify(allocateHelper.getReturnJSONObject()), './output.json');
		});
	db.close();
});
