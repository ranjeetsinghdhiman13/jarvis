var expect = require('chai').expect;
var allocator = require('./allocateRequests.js');

describe('writes output to file', function() {
    it('writes string to a file', function() {
        allocator.writeOutputToDisk('test string', 'test');
    })
});