export default class Trello{

	constructor(apiKey, token){
    var TrelloAPI = require('node-trello');
		this.api = new TrelloAPI(apiKey, token);
	}

  get(url, options){
    return new Promise((resolve, reject) => {
      this.api.get(url, options, function(err, data) {
        if (err) throw err;
        resolve(data);
      });
    });
  }
}