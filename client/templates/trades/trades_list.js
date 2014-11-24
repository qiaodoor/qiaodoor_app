Template.tradesList.helpers({
  trades: function(){
    return Trades.find({});
  },
  token : function(){
    return Session.get('token');
  }
});

