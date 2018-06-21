angular.module('convoCtrl',['convoService','authService'])

  .controller('ConvoController',function(convo,socketio,Auth){

  	 var vm=this;

  	 Convo.all()
  	 		.success(function(data){
  	 			vm.msgs = data;
  	 		});

  	 vm.createMsg = function(){

  	 	vm.processing = true;

  	 	
  	 	vm.loggedIn = Auth.isLoggedIn();

	$rootScope.$on('$routeChangeStart', function() {

		vm.loggedIn = Auth.isLoggedIn();

		Auth.getUser()
			.then(function(data) {
				vm.userData = data.data;
			});
	});

  	 	Convo.create(vm.userData)
  	 	     .success(function(data){
  	 	     	vm.processing = false;
  	 	     });
  	 };

  	 socketio.on('convoCtrl',function(data){
  	 	vm.msgs.push(data);
  	 });

  });