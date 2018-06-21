angular.module('appRoutes',['ngRoute'])


.config(funciton($routeProvider,$locationProvider){

	$routeProvider

			.when('/',{
				templateUrl:'app/views/index.html',
				controller:'MainController',
				controllerAs:'main'
			})
			.when('/login',{
				templateUrl:'app/views/login.html'
				controller:'MainController',
				controllerAs:'login'
			})
			.when('/register',{
				templateUrl:'app/views/register.html'
				controller:'UserController',
				controllerAs:'user'
			});
			
			$locationProvider.html5Mode(true);
});