var Twit = require('twit');
var AWS = require('aws-sdk');

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

    console.log(tweet);
    console.log('*****');
});
