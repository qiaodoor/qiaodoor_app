Package.describe({
  summary: "autolink"
});

Package.on_use(function (api, where) {
  api.add_files("autolink.js", ['client','server']);
});
