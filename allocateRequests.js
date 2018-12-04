var mongo = require('mongodb');
var url = 'mongodb://localhost:27017/mydb';
var fs = require('fs');
var assert = require('assert')

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
			addClientIdToSet(clientId);
			var newRequestHours = result[request].hours;
			if ((hours + newRequestHours) > 8) {
				butlerId = createNewButler(butlerId, newRequestHours, result);
				hours = 0;
			} else {
				if (hours == 0) {
					butlerId = createNewButler(butlerId, newRequestHours, result);
				} else {
					addTaskToExistingButler(newRequestHours, result);
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
		writeOutputToDisk(JSON.stringify(returnJSON));
		});
	db.close();
});

function addClientIdToSet(clientId) {
	assert(clientId != null && clientId > 0);
	setOfClientIds.add(clientId);
}

function writeOutputToDisk(jsonString) {
	assert(jsonString != null)
	fs.writeFile('./output.json', jsonString, function (err) {
		if (err) throw err;
		console.log('Output Saved!');
	  });
}

function addTaskToExistingButler(newRequestHours, result) {
	assert(newRequestHours > 0);
	console.log('adding to existing butler ' + newRequestHours);
	var index = returnJSON.butlers.length - 1;
	assert(index > -1);
	console.log(returnJSON.butlers[index]);
	var butlerRequests = returnJSON.butlers[index].requests;
	butlerRequests.push(result[request].requestId);
}

function createNewButler(butlerId, newRequestHours, result) {
	assert(newRequestHours > 0);
	butlerId = butlerId + 1;
	console.log('create butler ' + newRequestHours + ' ' + result[request].requestId);
	var butlerData = { "requests": [result[request].requestId] };
	returnJSON.butlers.push(butlerData);
	return butlerId;
}
