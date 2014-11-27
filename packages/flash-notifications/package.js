Package.describe({
  summary: 'Flash Notifications for Meteor'
});

Package.on_use(function (api) {
  api.use('templating', 'client');
  api.use('handlebars', 'client');
  api.use('minimongo', 'client');
  api.use('mongo-livedata', 'client');
  api.use('jquery', 'client');

  api.add_files('lib/flash.js', 'client');
  api.add_files('templates/flashes.html', 'client');
  api.add_files('templates/flashes.js', 'client');


  // for backward compat before Meteor linker changes
  if (typeof api.export !== 'undefined') {
    api.export('flash', 'client');
  }
});
