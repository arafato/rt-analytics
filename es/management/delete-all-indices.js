var elasticsearch = require('elasticsearch');
var moment = require('moment');

var client = new elasticsearch.Client({
  host: 'search-test-uic55ujquckt6ra6ooebk3x4lq.us-east-1.es.amazonaws.com:80',
  log: 'trace'
});


client.indices.delete({index:'*'});

// client.create({
//   index: 'social',
//   type: 'tweet',
//   id: '2',
//   body: {
//       text: 'dldlksd foobar bla blubber',
//       user: 'aws',
//       coordinates:[12.1212, 34.34343],
//       createdAt: moment(new Date('Thu Oct 08 20:11:36 +0000 2015')).format('YYYY-MM-DD')
//   }
// }, function (error, response) {
//     console.log(error);
//     console.log(response);
// });
