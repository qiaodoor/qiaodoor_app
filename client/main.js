Meteor.startup(function(){
  Tracker.autorun(function(){
    if (Meteor.userId()){
      Meteor.call('getToken',function(err,token){
        Session.set('token',token);
      });
    }
  });
});
