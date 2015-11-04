var elasticsearch = require('elasticsearch');
var moment = require('moment');

var client = new elasticsearch.Client({
  host: 'search-test-uic55ujquckt6ra6ooebk3x4lq.us-east-1.es.amazonaws.com:80',
  log: 'trace'
});

var params = process.argv.slice(2);
var indexName = params[0];
var documentName = params[1];

client.deleteByQuery({
  index: indexName,
  type: documentName,
  body: {
    query: {
      match_all: {}
    }
  }
}, function (error, response) {
  console.log("Error deleting all docs in " + documentName + " : " + error);
});
