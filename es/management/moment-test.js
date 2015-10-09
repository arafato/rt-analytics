var moment = require('moment');

var m = moment(new Date('Thu Oct 08 20:11:36 +0000 2015'));

var d = m.format('YYYY/MM/DD HH:mm:ss');


console.log(d);
