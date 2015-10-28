"use strict";

var Config = (function(c) {

    c.ES_HOST = 'http://search-test-uic55ujquckt6ra6ooebk3x4lq.us-east-1.es.amazonaws.com';
    c.ES_INDEX = 'social_rt_demo_sentiment';
    c.ES_DOCUMENT = 'tweet';

    c.IFRAME_SRC_TEMPLATE = "https://search-test-uic55ujquckt6ra6ooebk3x4lq.us-east-1.es.amazonaws.com/_plugin/kibana/#/visualize/create?embed&type=pie&indexPattern=social_rt_demo_sentiment&_g=(refreshInterval:(display:'5%20seconds',section:1,value:5000),time:(from:now-2y,mode:quick,to:now))&_a=(filters:!(),linked:!f,query:(query_string:(analyze_wildcard:!t,query:'###')),vis:(aggs:!((id:'1',params:(),schema:metric,type:count),(id:'2',params:(field:sentiment,order:desc,orderBy:'1',size:5),schema:segment,type:terms)),listeners:(),params:(addLegend:!t,addTooltip:!t,isDonut:!f,shareYAxis:!t),type:pie))";
    
    return c;
    
}(Config || {}));
