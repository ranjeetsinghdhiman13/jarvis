var mongo = require('mongodb');
var url = 'mongodb://localhost:27017/mydb';

var returnValue = '{"butlers": [{"requests": []}],"spreadClientIds": []}';
var returnJSON = JSON.parse(returnValue);

mongo.connect(url, { useNewUrlParser: true }, function (err, db) {
	console.log(returnJSON);
	if (err) throw err;
	var dbObject = db.db('mydb');
	dbObject.collection('requests').find().toArray(function (err, result) {
		var hours = 0;
		var butlerId = 0;
		for (request in result) {
			var newRequestHours = result[request].hours;
			if ((hours + newRequestHours) > 8) {
				butlerId = butlerId + 1;
				console.log('create butler ' + newRequestHours + ' ' + result[request].requestId);
				var butlerData = { "_id": butlerId, "requests": [result[request].requestId] };
				returnJSON.butlers.push(butlerData);
			} else {
				var existingIndex = butlerId - 1;
				if (existingIndex == -1) {
					butlerId = butlerId + 1;
					console.log('create butler ' + newRequestHours + ' ' + result[request].requestId);
					var butlerData = { "_id": butlerId, "requests": [result[request].requestId] };
					returnJSON.butlers.push(butlerData);
				} else {
					console.log('adding to existing butler ' + newRequestHours);
					var index = returnJSON.butlers.length - 1;
					console.log(returnJSON.butlers[index]);
					var butlerRequests = returnJSON.butlers[index].requests;
					butlerRequests.push(result[request].requestId)
				}
			}
			hours = hours + newRequestHours;
			if (hours > 8)
				hours = 0;
		}
		console.log('======');
		console.log(returnJSON);
	});
	db.close();
});