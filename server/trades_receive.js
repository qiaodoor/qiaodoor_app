var tokenGenerator = Random.createWithSeeds(0);
var userTokens = {} ;

Meteor.publish('trades_queue',function(){
  return Trades.find({ createdBy : this.userId });
});

Meteor.methods({ 
  getToken:function(){
    var userId = this.userId;
    var token  = ''         ;
    if (userId) {
      var token = userId + ':' + tokenGenerator.id();
      userTokens[token] = userId ;
    }
    return token ;
  }
});

Meteor.startup(function () {
  collectionApi = new CollectionAPI({ authToken: function(token){
    return token && !!userTokens[token] ;
  }});

  collectionApi.addCollection(Trades,'trades' , {
    methods: ['POST'] , // ,'GET','PUT','DELETE'],
    before: {
      POST : function( trade ) {
        var self = this ;
        if (trade && trade.orderNo && self._requestAuthToken){
          var userId = userTokens[self._requestAuthToken];
          if (userId && !Trades.findOne({orderNo:trade.orderNo}) ){
            trade.createdBy = userId ;
            return true ;
          }
        }
        return false  ;
      }
    }
  });
  collectionApi.start();
});

