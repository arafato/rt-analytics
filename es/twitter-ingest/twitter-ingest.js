var Twit = require('twit');
var AWS = require('aws-sdk');
var moment = require('moment');
var config = require('./config.js');

var kinesis = new AWS.Kinesis({region: 'us-east-1'});

var T = new Twit({
  consumer_key:         config.consumerKey,
  consumer_secret:      config.consumerSecret,
  access_token:         config.accessToken,
  access_token_secret:  config.accessTokenSecret
});

var stream = T.stream('statuses/filter', { locations: ['-180', '-90', '180', '90'], language: 'en' });

var tweetBuffer = [];

stream.on('tweet', function (tweet) {

  var coordinates = (tweet.coordinates !== null) ? tweet.coordinates.coordinates : tweet.place.bounding_box.coordinates[0][0];

  tweetBuffer.push(
    {
      id: tweet.id,
      username: tweet.user.screen_name,
      text: tweet.text,
      coordinateX: coordinates[1],
      coordinateY: coordinates[0],
      createdAt: moment(new Date(tweet.created_at)).format('YYYY-MM-DD')
    }
  );

  if (tweetBuffer.length === 50) {
    sendRecords(tweetBuffer);
    tweetBuffer.length = 0;
  }
});


function sendRecords(tweets) {

  var records = createRecords(tweets);

  var params = {
    Records: records,
    StreamName: config.streamName
  };

  kinesis.putRecords(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    }
    else{
      console.log("Successfully send " + records.length + " records to " + config.streamName);
    }
  });
}

function createRecords(tweets) {

  var records = [];

  for(var i = 0; i < tweets.length; ++i) {

    var item = {
      Data: JSON.stringify(tweets[i]),
      PartitionKey: tweets[i].id.toString()
    };

    records.push(item);
  }

  return records;
}
