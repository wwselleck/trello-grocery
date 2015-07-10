'use strict';

require('babel/register');
var Trello = require('./src/lib/Trello.js');
var Settings = require('./settings.json');
var Board = require('./src/lib/Board.js');
var async = require('async');
var _ = require('lodash');

function main() {
	var t = new Trello(Settings.trello_key, Settings.trello_token);
	var groceryBoard = null;

	t.get('/1/member/me', { boards: 'all' }).then(function (me) {
		for (var i = 0; i < me.boards.length; i++) {
			if (me.boards[i].name === Settings.grocery_board) {
				return t.get('/1/boards/' + me.boards[i].id, { lists: 'all' }).then(function (board) {
					groceryBoard = new Board(board.id, board.name);
					return board.lists;
				});
			}
		}
	}).then(function (lists) {
		var promises = {};

		for (var i = 0; i < lists.length; i++) {
			(function (i) {
				var list = lists[i];
				if (list.name === Settings.have_list) {
					promises.haveList = function (cb) {
						t.get('/1/lists/' + list.id, { cards: 'all' }).then(function (data) {
							groceryBoard.haveLists.push(new List(list.id, list.name));
							cb(null, data);
						});
					};
				} else if (list.name === Settings.recipe_list) {
					promises.recipeList = function (cb) {
						t.get('/1/lists/' + list.id, { cards: 'all' }).then(function (data) {
							cb(null, data);
						});
					};
				}
			})(i);
		}
		return new Promise(function (resolve, reject) {
			async.parallel(promises, function (error, results) {
				resolve(results);
			});
		});
	}).then(function (lists) {
		_.each(lists, function (list) {
			_.each(list.cards, function (card) {
				console.log(card);
			});
		});
	});
}

if (require.main === module) {
	main();
}
