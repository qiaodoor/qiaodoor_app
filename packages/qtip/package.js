Package.describe({
  summary: "jQuery qtip"
});

Package.on_use(function (api, where) {
  api.use('jquery', 'client');
  api.add_files("jquery.qtip-1.0.0-rc3.js", "client");
});
