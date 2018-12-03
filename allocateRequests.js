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
			if ((hours + result[request].hours) < 8) {
				console.log('create butler ' + result[request].hours + ' ' + result[request].requestId);
				var butlerData = { "_id": butlerId, "requests": [result[request].requestId] };
				returnJSON.butlers[0].requests.push(butlerData);
				butlerId = butlerId + 1;
			} else {
				var existingIndex = butlerId - 2;
				console.log('adding to existing butler ' + result[request].hours);
				for (index = 0, len = returnJSON.butlers.length; index < len; ++index) {
					console.log(returnJSON.butlers[index]);
					var butlerRequests = returnJSON.butlers[index].requests;
					var butlerData = function filterData(index) {
						return butlerRequests.filter(function (butlerRequests) { return butlerRequests._id == index })
					};
					console.log(butlerData(index));
					if (butlerData.length >= 1) {
						butlerData(index).push(result[request].requestId);
					}
				}
			}
			hours = hours + result[request].hours;
			if (hours > 8)
				hours = 0;
		}
		console.log('======');
		console.log(returnJSON);
	});
	db.close();
});