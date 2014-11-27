
//Individual flash notification
Template.flashNotification.created = function () {
  // Get the ID of the messsage
  var id = this.data._id;
  Meteor.setTimeout(function () {
    // mark the flash as "seen" after 250 milliseconds
    flash.Flashes.update(id, {$set: {seen: true}});
  }, 250);
};


//All flash notifications
Template.flashes.flashes = function () {
  return flash.Flashes.find();
};

//All flash notifications
Template.successFlashes.flashes = function () {
  return flash.Flashes.find({type: 'success'});
};

//All flash notifications
Template.errorFlashes.flashes = function () {
	//Type is 'danger' to work with bootstrap by default
  return flash.Flashes.find({type: 'danger'});
};

//All flash notifications
Template.warningFlashes.flashes = function () {
  return flash.Flashes.find({type: 'warning'});
};

//All flash notifications
Template.infoFlashes.flashes = function () {
  return flash.Flashes.find({type: 'info'});
};