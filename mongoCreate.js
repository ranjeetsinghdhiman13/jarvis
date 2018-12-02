var mongo = require('mongodb');
var url = 'mongodb://localhost:27017/mydb';

const exampleRequests = [
    {
        clientId: 1,
        requestId: 'abc',
        hours: 6
    },
    {
        clientId: 2,
        requestId: 'ghi',
        hours: 1
    },
    {
        clientId: 1,
        requestId: 'def',
        hours: 4
    },
    {
        clientId: 1,
        requestId: 'zzz',
        hours: 2
    }
]

mongo.connect(url, {useNewUrlParser: true}, function(err, db) {
	if (err) throw err;
	var dbObject = db.db('mydb');
	dbObject.collection('requests').insertMany(exampleRequests, function(err, res) {
		if (err) throw err;
		console.log('Number of records inserted ' + res.insertedCount);
		db.close();
	});
});