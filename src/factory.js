var historyBookmarksDB = null;

angular.module('dictionary_factory', [])

.factory('Test_factory', function($q, $http, $rootScope) {

	return {

		historyBookmarksDBinit: function() {
			window.plugins.sqlDB.copy("historyBookmarksDB", function() {
				historyBookmarksDB = $cordovaSQLite.openDB("historyBookmarksDB");
			}, function(error) {
				if (error && error.code == 516) {
					console.log('You already have copied Database, opening from there', error);
					historyBookmarksDB = $cordovaSQLite.openDB("historyBookmarksDB");
					console.log("opened historyBookmarksDB");
				} else {
					return error;
				}
			});
		},
		destroyBookmarkHistoryService: function() {
			if (!historyBookmarkDatabase) {
				console.error('Cannot destroy uninitialised DB.')
			}

			var success = function() {
				console.log('historyBookmarksDB successfully removed');
			};

			var error = function(error) {
				console.error('Error removing historyBookmarksDB - ', error);
			};

			window.plugins.sqlDB.remove('historyBookmarksDB', success, error);
		},

		getAllHistory: function() {
			var query = "SELECT * FROM HISTORY";
			var allHistory = $cordovaSQLite.execute(historyBookmarksDB, query).then(function(res) {
				if (res.rows.length > 0) {
					var arr_result = [];
					for (var i = 0; i < res.rows.length; i++) {
						console.log(res.rows.item(i));
						arr_result.push({
							_id: res.rows.item(i).word_id,
							word_name: res.rows.item(i).word_name,
							article: res.rows.item(i).article
						});
					}
				}
				return arr_result;
				//console.log(arr_result);
			});
			return allHistory;
		},

		addToHistory: function(word) {
			var id = word.word_id;
			var word_name = word.word;
			var date = new Date().getTime() / 1000;
			var query = "INSERT INTO HISTORY (word_id, word_name, date) VALUES (?,?,?)";
			$cordovaSQLite.execute(historyBookmarksDB, query, [id, word_name, date]).then(function(res) {
					console.log('saved to database');
				},
				function(err) {
					console.error(err);
				});
		},

		removeHistoryItem: function(word) {
			console.log('removing selected history items', word);

			var id = word.word_id;
			console.log(id);
			var query = "DELETE FROM HISTORY WHERE word_id= (?)";
			console.log(query);
			$cordovaSQLite.execute(historyBookmarksDB, query, [id]).then(function(res) {
					console.log('Removed Word from History database');
				},
				function(err) {
					console.error('error when removing word from DB', err);
				});

			return true;
		},

		removeAllHistoryItems: function() {
			console.log('removing ALL history items');
			var query = "DELETE  FROM HISTORY";
			$cordovaSQLite.execute(historyBookmarksDB, query, []).then(function(res) {
					console.log('Removed ALL history from History database');
				},
				function(err) {
					console.error('error when removing all history from HISTORY Table', err);
				});

			return true;
		},

		checkIfHistoryExits: function(wordId) {
			var query = "SELECT * FROM HISTORY where word_id (?)";
			$cordovaSQLite.execute(historyBookmarksDB, query, [wordId]).then(function(res) {
					console.log('GOT selected History details in check if history exists');
					if (res.rows.length > 0) {
						var arr_result = [];
						if (res.rows.item[0].word_id === word_id) {
							return true;
						} else {
							return false;
						}
					}
				},
				function(err) {
					console.error('error when fetching selected History Item from History Table', err);
				});
		},

		getAllBookmarks: function() {
			var query = "SELECT * FROM BOOKMARKS";
			var allBookmarks = $cordovaSQLite.execute(historyBookmarksDB, query, []).then(function(res) {
				if (res.rows.length > 0) {
					var arr_result = [];
					for (var i = 0; i < res.rows.length; i++) {
						arr_result.push({
							_id: res.rows.item(i).word_id,
							word_name: res.rows.item(i).word_name,
						});
					}
				}
				return arr_result;
				console.log(arr_result);
			});
			return allBookmarks
		},

		checkIfBookmarkExits: function(wordId) {
			var query = "SELECT * FROM BOOKMARKS where word_id (?)";
			$cordovaSQLite.execute(historyBookmarksDB, query, [wordId]).then(function(res) {
					console.log('GOT selected bookmark details in check if bookmark exists');
					if (res.rows.length > 0) {
						var arr_result = [];
						if (res.rows.item[0].word_id === word_id) {
							return true;
						} else {
							return false;
						}
					}
				},
				function(err) {
					console.error('error when fetching selected bookmark Item from BOOKMARKS Table', err);
				});
		},

		addOrUpdateBookmarks: function(word) {
			var id = word._id;
			var word_name = word.word_name;
			var word_mean = word.means;
			// epoch time
			var date = new Date().getTime() / 1000;
			var query = "INSERT INTO BOOKMARKS (word_id, word_name, date) VALUES (?,?,?,?)";
			$cordovaSQLite.execute(historyBookmarksDB, query, [id, word_name, date]).then(function(res) {
					console.log('Saved to Database');
					return res;
				},
				function(err) {
					console.error(err);
				});
		},

		removeBookmarkItem: function(word) {
			console.log('removing selected bookmark item');
			var id = word.word_id;
			var query = "DELETE FROM BOOKMARKS WHERE ID (?)";
			$cordovaSQLite.execute(historyBookmarksDB, query, [id]).then(function(res) {
					console.log('Removed Word from History database');
					return true;
				},
				function(err) {
					console.error('error when removing  bookmark word from DB', err);
				});

			return true;
		},

		removeAllBookmarkItems: function() {
			console.log('removing ALL Bookmark items');
			var query = "DELETE * FROM BOOKMARKS";
			$cordovaSQLite.execute(historyBookmarksDB, query, []).then(function(res) {
					console.log('Removed ALL Bookmark from BOOKMARKS database');
				},
				function(err) {
					console.error('error when removing all bookmark from BOOKMARKS Table', err);
				});
			return true;
		},
	}
});