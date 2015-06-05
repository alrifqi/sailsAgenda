angular.module('agendaApp').controller('mainController', function ($scope, socket, serverUrl, $http){
	$scope.header = "Overview Agenda";
	$scope.message = "Overview Agenda";
	$scope.failed = [];
	$scope.completed = [];
	$scope.progress = [];
    $http.get(serverUrl.url+"/jobCommand",{params: {startPage:1, limitPage:1}}).
        success(function(data, status, headers, config){
            $scope.totalCommand = parseInt(data.total);
        });
    $http.get(serverUrl.url+"/agenda",{params: {startPage:1, limitPage:1}}).
        success(function(data, status, headers, config){
        	console.log(data[0].total);
        	$scope.job = parseInt(data[0].total);
        });
    $http.get(serverUrl.url+"/user",{params: {startPage:1, limitPage:1}}).
        success(function(data, status, headers, config){
            $scope.totalUser = parseInt(data.total);
        });
    //get on progress job
    $http.get(serverUrl.url+"/agenda",{params: {status:2}}).
        success(function(data, status, headers, config){
        	$scope.progress = data;
        });

    //get comleted job
	$http.get(serverUrl.url+"/agenda",{params: {status:1}}).
        success(function(data, status, headers, config){
        	$scope.completed = data;
        });    

    //get Failed Job
    $http.get(serverUrl.url+"/agenda",{params: {status:-1}}).
        success(function(data, status, headers, config){
        	$scope.failed = data;
        });

    socket.on('newCommand',function(message){
        var countCommand = parseInt($('.count-command').html());
        countCommand = countCommand + 1;
        $('count-command').html(countCommand);
    });
    socket.on('newUser',function(message){
        var countUser = parseInt($('.count-user').html());
        countUser= countUser + 1;
        $('count-user').html(countUser);
    });
    socket.on('newJob',function(message){
        var countJob = parseInt($('.count-job').html());
        countJob= countJob + 1;
        $('count-job').html(countJob);
    });

    socket.on('commandStartExec',function(message){
    	$scope.$apply(function(){
        	$scope.progress.splice(0, 0, message[0]);
        });
    });
    socket.on('commandFailedExec',function(message){
    	$scope.$apply(function(){
        	$scope.failed.splice(0, 0, message[0]);
        	for(var i=0;i<$scope.failed.length;i++){
    			if($scope.failed[i]['_id'] == message[0]._id){
    				$scope.failed.splice(i, 1);
    			}
    		}
        });
    });
    socket.on('commandSuccessExec',function(message){
    	$scope.$apply(function(){
    		for(var i=0;i<$scope.progress.length;i++){
    			if($scope.progress[i]['_id'] == message[0]._id){
    				$scope.progress.splice(i, 1);
    			}
    		}
        	$scope.completed.splice(0, 0, message[0]);
        });
    });
});

angular.module('agendaApp').controller('addController', function ($scope, $http, serverUrl){
	$scope.header = "Add New Agenda";
	$scope.message = "Content Add New Agenda";
	$scope.today = function(){
		$scope.dt = new Date();
	};

	$scope.today();
	$scope.clear = function(){
		$scope.dt = null;
	};

	$scope.open = function($event){
		$event.preventDefault();
		$event.stopPropagation();
		$scope.opened = true;
	};

	$scope.min = function($event){
		$event.preventDefault();
		$event.stopPropagation();
		$scope.opened = true;
	};
	$scope.clickCheck = function($val){
		if($val == 1){
			$scope.visible = true;
		}else{
			$scope.visible = false;
		}
		
	};
	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};

	$scope.hstep = 1;
	$scope.mstep = 1;

	$scope.format = 'dd-MMMM-yyyy';
	var d = new Date();
	d.setHours();
	d.setMinutes();
	$scope.job = {
		timeConfig: d
	};
	$http.get(serverUrl.url+"/JobCommand").success(function(data, status, headers, config){
		$scope.datas = data;
	});

	$scope.submit = function($job){
		var a = $job.timeConfig;

		$http.post(serverUrl.url+"/agenda",$job).
		success(function(data, status, headers, config){
			console.log('kirim sukses');
		});
	};
});

angular.module('agendaApp').controller('userManagementController', function ($scope, $http, serverUrl){
	$scope.header = "User Management";
	$scope.message = "User Management";
	// $scope.itemsByPage = 1;
	$http.get(serverUrl.url+"/user",{params: {startPage:1, limitPage: 10}}).
		success(function(data, status, headers, config){
			$scope.data = data.data;
			$scope.totalItems = parseInt(data.total);
			$scope.itemsPerPage = parseInt(10);
		});
	$scope.pageChanged = function(){
		$http.get(serverUrl.url+"/user",{params: {startPage:$scope.currentPage, limitPage: 10}}).
		success(function(data, status, headers, config){
			$scope.data = data;
			$scope.totalItems = parseInt(data.total);
			$scope.itemsPerPage = parseInt(10);
		});
	}

	// $http.get("http://192.168.10.162:1337/user").success(function(data, status, headers, config){
	// 	$scope.datas = data;		
	// });
});

angular.module('agendaApp').controller('addUserController', function ($scope, $http, serverUrl){
	$scope.header = "Add User";
	$scope.message = "Add User";
	$scope.submit = function($job){
		$http.post(serverUrl.url+"/user",$job).
			success(function(data, status, headers, config){
				console.log('kirim sukses');
			});
		};
});

angular.module('agendaApp').controller('addJobCommandController', function ($scope, $http, serverUrl){
	$scope.header = "Add Job Command";
	$scope.message = "Add Job Command";
	$scope.commandShow = 'false';
	$scope.fileShow = 'false';
	$scope.clickCheck = function($inp){
		if($inp == '1'){
			$scope.commandShow = 'true';
			$scope.fileShow = 'false';
		}else{
			$scope.commandShow = 'false';
			$scope.fileShow = 'true'
		}
	};
	$scope.submit = function($job){
		var fd = new FormData();
		if($job.fileCommand){
			fd.append('file',$job.fileCommand);
			$http.post(serverUrl.url+'/jobCommand/uploadFile',fd, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			}).success(function(data){
				$job.filename = data.filename;
				console.log('success');
			}).error(function(){
				console.log('error');
			});
		}
		
		$http.post(serverUrl.url+"/jobCommand",$job).
			success(function(data, status, headers, config){
				console.log('kirim sukses');
			});
		};
});

angular.module('agendaApp').controller('jobCommandController', function ($scope, $http, serverUrl){
	$scope.header = "Job Command Management";
	$scope.currentPage = 1;
	$http.get(serverUrl.url+"/jobCommand",{params: {startPage:1, limitPage: 10}}).
		success(function(data, status, headers, config){
			$scope.data = data;
			$scope.totalItems = parseInt(data.total);
			$scope.itemsPerPage = parseInt(10);
		});
	$scope.pageChanged = function(){
		$http.get(serverUrl.url+"/jobCommand",{params: {startPage:$scope.currentPage, limitPage: 10}}).
		success(function(data, status, headers, config){
			$scope.data = data;
			$scope.totalItems = parseInt(data.total);
			$scope.itemsPerPage = parseInt(10);
		});
	}
});

angular.module('agendaApp').controller('agendaManagement', function ($scope, $http, serverUrl){
	$scope.header = "Job Schedule Management";
	$scope.currentPage = 1;
	$http.get(serverUrl.url+"/agenda",{params: {startPage:1, limitPage: 10}}).
		success(function(data, status, headers, config){
			console.log(data);
			$scope.data = data;
			$scope.totalItems = parseInt(data.total);
			$scope.itemsPerPage = parseInt(10);
		});
	$scope.pageChanged = function(){
		$http.get(serverUrl.url+"/agenda",{params: {startPage:$scope.currentPage, limitPage: 10}}).
		success(function(data, status, headers, config){
			$scope.data = data;
			$scope.totalItems = parseInt(data.total);
			$scope.itemsPerPage = parseInt(10);
		});
	}
});

angular.module('agendaApp').controller('userEdit',function ($scope, $http, $routeParams, serverUrl){
	console.log($routeParams.idUser);
	$http.get(serverUrl.url+"/user",{params: {id:$routeParams.idUser}}).
		success(function(data, status, headers, config){
			$scope.job = data[0];
			$scope.job.password = '';
		});
	$scope.submit = function($job){
		$http.put(serverUrl.url+"/user/"+$job.id,$job).
			success(function(data, status, headers, config){
				console.log('kirim sukses');
			});
		};
});
angular.module('agendaApp').controller('jobCommandView',function ($scope, $http, $routeParams, serverUrl) {
    console.log($routeParams.idCommand);
    $http.get(serverUrl.url+"/jobCommand", {params: {id: $routeParams.idCommand}}).
        success(function (data, status, headers, config) {
            $scope.job = data[0];
        });
    $scope.submit = function ($job) {
        $http.put(serverUrl.url+"/user/" + $job.id, $job).
            success(function (data, status, headers, config) {
                console.log('kirim sukses');
            });
    };
});
