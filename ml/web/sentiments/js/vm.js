"use strict";

var vm = function() {
    
    var that = this;
    that.keyword = ko.observable('');
    that.searchResults = ko.observableArray();
    that.numOfHits = ko.observable(0);
};

vm.prototype.searchKeyword = function() {

    var that = this;
    var qs = Config.ES_HOST + '/' + Config.ES_INDEX + '/' + Config.ES_DOCUMENT + '/' + '_search?q=text:*' + that.keyword() + '*';
    $.getJSON(qs)
	.success(function(data){
	    that.searchResults([]);
	    that.numOfHits(data.hits.total);
	    var hits = data.hits.hits;
	    for(var i = 0; i <= hits.length; ++i) {
		if (hits[i]) {
		    that.searchResults.push(new tweet(hits[i]._source.username, hits[i]._source.text, hits[i]._source.sentiment));
		}
	    }
	    
	    // Refresh iframe
	    $('#iframe').attr('src', function ( i, val ) {
		var q = '*' + that.keyword() + '*';
		return Config.IFRAME_SRC_TEMPLATE.replace('###', "text:" + q);
	    });
	})
	.fail(function(err){
	    alert('Something went wrong: ' + err);
	});
};

function tweet(username, msg, sentiment) {
    this.username = ko.observable(username);
    this.msg = ko.observable(msg);
    this.sentiment = ko.observable(sentiment);
};
