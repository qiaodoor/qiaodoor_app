// flashes provides an api for temporary flash messages stored in a
// client only collecion
var flash = flash || {};

(function (argument) {
  // Client only collection
  flash.Flashes = new Meteor.Collection(null);

  // create given a message and optional type creates a Flash message.
  flash.create = function (message, type) {
    type = (typeof type === 'undefined') ? 'error' : type;
    // Store errors in the 'Errors' local collection
    flash.Flashes.insert({message: message, type: type, seen: false, show: true});
  };

  // error is a helper function for creating error messages
  flash.error = function (message) {
    // Using the "danger" type for bootstrap compatability
    return flash.create(message, 'danger');
  };

  // success is a helper function for creating success messages
  flash.success = function (message) {
    return flash.create(message, 'success');
  };

  // info is a helper function for creating info messages
  flash.info = function (message) {
    return flash.create(message, 'info');
  };

  // warning is a helper function for creating warning messages
  flash.warning = function(message) {
    return flash.create(message, 'warning');
  };

  // flashCount is a helper function for getting count of flash messages
  // Two params passed in params object:
  // options.seen [true, false]
  // options.type [success, error, warning, info]
  flash.flashCount = function(options) {
    var defaults = {
      seen: '',
      type: ''
    };
    var options = $.extend({}, defaults, options);
    if (options.type === 'error')
      options.type = 'danger';

    if (options.seen === '' && options.type === '')
      return flash.Flashes.find().count();
    else if (options.type === '')
      return flash.Flashes.find({seen: options.seen}).count();
    else if (options.seen === '')
      return flash.Flash.find({type: options.type});
    else
      return flash.Flash.find({seen: options.seen, type: options.type});
  };

  flash.getFlashes = function(options) {
    var defaults = {
      type: ''
    };
    var options = $.extend({}, defaults, options);

    if (options.type === '')
      return flash.Flashes.find();
    else
      return flash.Flashes.find({type: options.type});
  };

  // clear hides viewed message
  flash.clear = function () {
    flash.Flashes.update({seen: true}, {$set: {show: false}}, {multi: true});
  };
})();