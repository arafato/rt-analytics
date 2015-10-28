var elasticsearch = require('elasticsearch');
var AWS = require('aws-sdk');
var async = require('async');

var esClient = new elasticsearch.Client({
  host: 'search-test-uic55ujquckt6ra6ooebk3x4lq.us-east-1.es.amazonaws.com:80',
  log: 'error'
});
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
		esClient.index({
    		    index: 'social_rt_demo_sentiment',
    		    type: 'tweet',
    	            body: {
    			text: tweet.text,
    			username: tweet.username,
			location: { lat: tweet.coordinateX, lon: tweet.coordinateY },
    			createdAt: tweet.createdAt,
			sentiment: (data.Prediction.predictedLabel === '1') ? true : false
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
	});
    }
    else { // if (tweet)
	cb();
    }
}
