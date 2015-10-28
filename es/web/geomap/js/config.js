"use strict";

var Config = (function(c) {

    c.ES_HOST = 'http://search-test-uic55ujquckt6ra6ooebk3x4lq.us-east-1.es.amazonaws.com';
    c.ES_INDEX = 'social_rt_demo';
    c.ES_DOCUMENT = 'tweet';

    c.IFRAME_SRC_TEMPLATE = "https://search-test-uic55ujquckt6ra6ooebk3x4lq.us-east-1.es.amazonaws.com/_plugin/kibana/#/visualize/create?embed&type=tile_map&indexPattern=social_rt_demo&_g=(refreshInterval:(display:Off,section:0,value:0),time:(from:now%2Fy,mode:quick,to:now%2Fy))&_a=(filters:!(),linked:!f,query:(query_string:(analyze_wildcard:!t,query:'###')),vis:(aggs:!((id:'1',params:(),schema:metric,type:count),(id:'2',params:(field:location,precision:3),schema:segment,type:geohash_grid)),listeners:(),params:(isDesaturated:!t,mapType:'Scaled%20Circle%20Markers'),type:tile_map))";
    
    return c;
    
}(Config || {}));
