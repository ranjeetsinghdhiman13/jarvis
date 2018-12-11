var fs = require('fs');
var assert = require('assert');
var setOfClientIds = new Set();
var returnValue = '{"butlers": [{"requests": []}],"spreadClientIds": []}';
var returnJSON = JSON.parse(returnValue);

var allocateHelper = {

    getClientIdsSet:function() {
        return setOfClientIds;
    },
    getReturnJSONObject: function () {
        return returnJSON;
    },
    addClientIdToSet: function (clientId) {
        assert(clientId != null && clientId > 0);
        setOfClientIds.add(clientId);
    },
    
    writeOutputToDisk: function (jsonString, filename) {
        assert(jsonString != null)
        fs.writeFile(filename, jsonString, function (err) {
            if (err) throw err;
            console.log('Output  from helper file!');
          });
    },

    addTaskToExistingButler: function (newRequestHours, result) {
        assert(newRequestHours > 0);
        console.log('adding to existing butler ' + newRequestHours);
        var index = returnJSON.butlers.length - 1;
        assert(index > -1);
        console.log(returnJSON.butlers[index]);
        var butlerRequests = returnJSON.butlers[index].requests;
        butlerRequests.push(result[request].requestId);
    },
    
    createNewButler: function (butlerId, newRequestHours, result) {
        assert(newRequestHours > 0);
        butlerId = butlerId + 1;
        console.log('create butler ' + newRequestHours + ' ' + result[request].requestId);
        var butlerData = { "requests": [result[request].requestId] };
        returnJSON.butlers.push(butlerData);
        return butlerId;
    }

};

module.exports = allocateHelper;