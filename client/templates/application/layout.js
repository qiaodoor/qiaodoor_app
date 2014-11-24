Template.header.helpers({
  pageTitle: function() {
    return Session.get('pageTitle') || 'Qiao Door' ;
  } ,
  audioLetEnabled: function() {
    return Meteor.isCordova ;
  }
});

Template.header.events({
  'click .audiolet': function(e) {
    e.preventDefault();
    
    AudioLet.wavPlay('0E07|2|290|26|68|41|011111111221111111111111133331',48000,2,1000,function(response){
      alert('response:' + response );
    },function(errMsg){
      alert(errMsg);
    });
  }
});
