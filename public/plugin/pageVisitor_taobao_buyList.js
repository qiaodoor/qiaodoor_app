/**
 * The content script would be executed when given web page refreshed e.g.: the visited http://www.taobao.com url changed 
 */

var theToken = '' ;
if (typeof token !== 'undefined') {
  theToken = token;
}

(function initialize( ){
    var tradesUrl  = 'http://www.qiaodoor.com/collectionapi/trades' ;
    var trades     = [] ;
    var taobaoUser = (jQuery.find('.menu-hd a')[0] || {}).innerText || '' ;
    var timestamp  = new Date() ;
    
    // STEP 1: define the pageVisitor function
    function visitThisPage(oidx){
        var trade = {
    	    items : []
    	} ;
    	var jobj           = jQuery(this) ;
    	trade.dealtime     = (jobj.find('.dealtime')[0]||{}).title || '' ;
    	trade.orderNo      = ((jobj.find('.summary .number em')[0]||{}).innerText || '' ).match( /[0-9|.]*/ig).join('') ;
    	trade.shopName     = (jobj.find('.shopname')[0]||{}).title || '' ;
    	trade.wangwang     = jQuery(jobj.find('.ww-light')[0]).attr('data-nick') || '' ;
    	trade.shopUrl      = (jobj.find('.shopname')[0]||{}).href || '' ;
    	trade.realPrice    = ((jobj.find('.order-bd td.amount em.real-price')[0]  || {}).innerText || '' ).match( /[0-9|.]*/ig).join('') ;
    	trade.shipFee      = ((jobj.find('.order-bd td.amount i.special-num')[0] || {innerText:'0'} ).innerText || '').match( /[0-9|.]*/ig).join('') ;
    	
    	jobj.find('.order-bd').each(function(iidx){
    		var baobei = jQuery(this);
    		trade.items.push({
    		    img          : (baobei.find('.baobei img')[0]||{}).src || ''  
    		  , name         : (baobei.find('.baobei-name a')[0]||{}).innerText || ''  
    		  , url          : (baobei.find('.baobei-name a')[0]||{}).href || '' 
    		  , orignPrice   : ((baobei.find('.price .origin-price')[0] || baobei.find('td.price i.special-num')[0] || {} ).innerText || '' ).match( /[0-9|.]*/ig).join('') 
    		  , realPrice    : ((baobei.find('td.price i.special-num')[0]||{}).innerText || '' ).match( /[0-9|.]*/ig).join('')
    		  , quantity     : ((baobei.find('.quantity')[0]||{}).title || '' ).match( /[0-9|.]*/ig).join('')
    		});
    	}); 
    	
    	trades.push(trade);
    }
    
    // STEP 2: visit page through pagination
    function process(html) {
    	
    	var hobj = jQuery(html);

    	// STEP 1: process current page 
    	hobj.find('.bought-table tbody').each(visitThisPage); 	
    	if (trades.length > 0 ) {
          for(var idx=0; idx < trades.length; idx ++){
            jQuery.ajax({
                  type : "POST"
                , url  : tradesUrl
                , async: false
                , data : JSON.stringify(trades[idx])
                , beforeSend : function(xml) {
                    xml.setRequestHeader("X-Auth-Token" , theToken );
                }
                , success : function(str,status){
                    console.log(str);
                }
                , error : function(xml) {
                    console.warn(xml.responseText);
                }
            });
          }
    	  trades = [] ;	
    	}
    	
        // STEP 2: do pagenation
        var nextPageUrl = (hobj.find('.paging-next')[0]||{}).href ;
        if (nextPageUrl) {
    	    jQuery.ajax({
                  type : "GET"
    		, url  : nextPageUrl 
    		, async: true
    		, success : function(str,status){
    		    process(str);
    		} 
    		, error : function(xml) {
    		    console.warn(xml.responseText);
    		}
    	    });      
    	} else {
    	    console.log('finished:pageVisitor_taobao_buyList:' + ((new Date() - timestamp)/1000) + ' seconds' );	
    	}
    }
    
    process(document.body.innerHTML); 
    
})( );
