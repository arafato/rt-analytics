var Twit = require('twit');
var AWS = require('aws-sdk');
var moment = require('moment');

var kinesis = new AWS.Kinesis({region: 'us-east-1'});

var T = new Twit({
    consumer_key:         'WZG7HSPlcUXiD7jQKkY7AKLR5'
  , consumer_secret:      'AifpgpCkix6sciTeWsLBP2ihknhdHwSibPgRDqB09llWk9q1Ki'
  , access_token:         '901901162-nxw480uTXLZkGvW6A99eGwpz7j9aR3a4JGs0mU0e'
  , access_token_secret:  'cwUIyJnKs5pmC1rjpifXPdf9ERBG1VGCHKbh6QLTi33fx'
});

var stream = T.stream('statuses/filter', { locations: ['-180', '-90', '180', '90'] });
var i = 0;

var tweetBuffer = [];

stream.on('tweet', function (tweet) {

    tweetBuffer.push(
	{
	    id: tweet.id,
	    username: tweet.user.screen_name,
	    text: tweet.text,
	    coordinates: (tweet.coordinates !== null) ? tweet.coordinates.coordinates : tweet.place.bounding_box.coordinates[0][0],
	    createdAt: moment(new Date(tweet.created_at)).format('YYYY-MM-DD')
	}
    );
    
    if (i === 50) {
	sendRecords(tweetBuffer);
	tweetBuffer = [];
	i = 0;
    }
    else {
	++i;
    }
});


function sendRecords(tweets) {

    var records = createRecords(tweets);

    var params = {
	Records: records,
	StreamName: 'twitter-rt-demo'
    };
    kinesis.putRecords(params, function(err, data) {
    	if (err) {
    	    console.log(err, err.stack);
    	}
    	else{
    	    console.log("Success: " + data);
    	}
    });
}

function createRecords(tweets) {

    var records = [];

    for(var i = 0; i < tweets.length; ++i) {

	var item = {
	    Data: JSON.stringify(tweets[i]),
	    PartitionKey: tweets[i].id
	};
	
	records.push(item);
    }

    return records;
}
