var Trello = require('./build/lib/Trello.js'),
	Settings = require('./settings.json'),
	t = new Trello(settings.trello_key, settings.trello_token);

t.get("/1/members/me", {boards: 'all'}, function(err, data) {
  if (err) throw err;
  console.log(data);
});