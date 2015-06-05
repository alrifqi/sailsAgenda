var agendaApp = angular.module('agendaApp',['ngRoute','ui.bootstrap','smartTable.column','file-model']);

agendaApp.config(['$httpProvider', function($httpProvider){
		$httpProvider.defaults.useXDomain = true;
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
	}
]);

agendaApp.factory('serverUrl',function(){
        return{
                url: 'http://localhost:1337'
        }
});
agendaApp.factory('socket', function (){
        var socket = io.connect('http://localhost:1337');
        // var socket = io.connect('http://10.25.123.90:1337');

        return socket;
});
agendaApp.filter('range', function(){
	return function(input, total){
		total = parseInt(total);
		for(var i = 1;i<=total; i++)
			input.push(i);
		return input;
	}
});
agendaApp.config(function($routeProvider){
	$routeProvider.
	when('/',{
		templateUrl: '/views/main.html',
		controller: 'mainController'
	}).
	when('/add',{
		templateUrl: '/views/add.html',
		controller: 'addController'
	}).
	when('/userManagement',{
		templateUrl: '/views/userManagement.html',
		controller: 'userManagementController'
	}).
	when('/addUser',{
		templateUrl: '/views/addUser.html',
		controller: 'addUserController'
	}).
	when('/addJobCommand',{
		templateUrl: '/views/addJobCommand.html',
		controller: 'addJobCommandController'
	}).
	when('/jobCommand',{
		templateUrl: '/views/jobCommandManagement.html',
		controller: 'jobCommandController'
	}).
	when('/agendaManagement',{
		templateUrl: '/views/agendaManagement.html',
		controller: 'agendaManagement'
	}).
	when('/userManagement/edit/:idUser',{
		templateUrl: '/views/userEdit.html',
		controller: 'userEdit'
	}).
    when('/jobCommand/view/:idCommand',{
            templateUrl: '/views/jobCommandView.html',
            controller: 'jobCommandView'
        })
	;
});
