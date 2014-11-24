Trades = new Mongo.Collection('trades');

Trades.allow({
  insert : function(userId,post) { return Meteor.userId(); }
});
