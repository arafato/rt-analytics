var AWS = require('aws-sdk');
var async = require('async');

var ml = new AWS.MachineLearning({ region: 'eu-west-1'  });
var mlModelId = 'ml-BJ36JTjPiMt';
var predictEndpoint = 'https://realtime.machinelearning.eu-west-1.amazonaws.com';

exports.handler = function(event, context) {
    console.log("Starting batch processing of " + event.Records.length);

    var funcs = [];                                                    
    
    event.Records.forEach(function(record) {
	
	funcs.push(function(cb) {
	    processTweet(record, cb);
	});

	async.parallel(funcs, function(err, results) {
	    if (err) {
		console.log("Error: " + err);
		context.fail();
	    }

	    console.log("Successfully processed " + event.Records.length + " records.");
	    context.succeed();
	});
	
    }); // foreach
};


function processTweet(record, cb) {

    // Kinesis data is base64 encoded so decode here
    var payload = new Buffer(record.kinesis.data, 'base64').toString('utf8');
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
	console.log(payload);
    }
    
    if (tweet) {
	var params = {
	    MLModelId: mlModelId,
	    PredictEndpoint: predictEndpoint,
	    Record: {
		Sentence: tweet.text
	    }
	};
	ml.predict(params, function(err, data) {
	    if (err) {
		console.log(err);
		cb(err);
	    } else {
		console.log(data);
		console.log(tweet.text);
		cb();
	    }
	});
    }
    else {
	cb();
    }
}
