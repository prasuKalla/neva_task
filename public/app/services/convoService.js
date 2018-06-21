angular.module('convoService', [])


.factory('convo', function($http) {


	var convoFactory = {};


	convoFactory.all = function() {
		return $http.get('/api/');
	}

	convoFactory.create = function(userData) {
		return $http.post('/api/', userData);
	}

	return convoFactory;


})

.factory('socketio', function($rootScope) {

	var socket = io.connect();
	return {

		on: function(eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		},

		emit: function(eventName, data, callback) {
			socket.emit(eventName, data, function() {
				var args = arguments;
				$rootScope.apply(function() {
					if(callback) {
						callback.apply(socket, args);
					}
				});
			});
		}

	};

});