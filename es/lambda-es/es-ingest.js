var elasticsearch = require('elasticsearch');
var moment = require('moment');
var async = require('async');

var client = new elasticsearch.Client({
  host: 'search-test-uic55ujquckt6ra6ooebk3x4lq.us-east-1.es.amazonaws.com:80',
  log: 'error'
});

exports.handler = function(event, context) {
    console.log("Starting batch processing of " + event.Records.length);
    var funcs = [];                                                    
    
    event.Records.forEach(function(record) {

	funcs.push(function(cb) {
	    processTweet(record, cb);
	});

    }); // foreach


    async.parallel(funcs, function(err, results) {
	if (err) {
	    console.log("Error: " + err);
	    context.fail();
	}

	console.log("Successfully processed " + event.Records.length + " records.");
	context.succeed();	
    });
};

function processTweet(record, cb) {

    // Kinesis data is base64 encoded so decode here
    var payload = new Buffer(record.kinesis.data, 'base64').toString('ascii');
    // console.log("Payload: " + payload);
    
    payload = payload.replace(/\\n/g, "\\n")  
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f");
    // remove non-printable and other non-valid JSON chars
    payload = payload.replace(/[\u0000-\u0019]+/g,""); 
    
    try {
    	var tweet = JSON.parse(payload);
    } catch(e) {
    	console.log("Error in JSON: " + e);
    }
    
    if (tweet) {

	client.index({
    	    index: 'social_rt_demo',
    	    type: 'tweet',
    	    // id: tweet.id,
    	    body: {
    		text: tweet.text,
    		username: tweet.username,
		location: { lat: tweet.coordinateX, lon: tweet.coordinateY },
    		// coordinateX: tweet.coordinateX,
    		// coordinateY: tweet.coordinateY,
    		createdAt: tweet.createdAt
    	    }
    	}, function (error, response) {
    	    if (error) {
		console.log(response);
		cb(error);
	    } else {
		cb();
	    }
    	});
    }
    else {
	cb();
    }
}
