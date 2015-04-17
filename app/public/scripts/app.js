var app = angular.module('chart', ['indexCtrl']);

// workaround to manipulate $scope in tagTable control from searchBox
// var g= {};
// g.query = {};
// g.query.pert = {};
// g.query.pert.items = [];
// g.query.pert.idx = [];
// g.query.cell = {};
// g.query.cell.items = [];
// g.query.cell.idx = [];
var herald = {};


var indexCtrl = angular.module('indexCtrl',[]);
indexCtrl.controller('tagTable',['$scope',function($scope){
	// $scope.cells = g.query.cell

	$(herald).bind('query:change',function(e,query){
		$scope.perts = query.pert.items;
		$scope.cells = query.cell.items;
		//http://stackoverflow.com/questions/15294565/angular-is-it-possible-to-watch-a-global-variable-i-e-outside-a-scope
		//The issue here is probably that you're modifying myVar from outside of the Angular world. 
		//Angular doesn't run digest cycles/dirty checks all the time, only when things happen in an 
		//application that should trigger a digest, such as DOM events that Angular knows about. 
		//So even if myVar has changed, Angular sees no reason to start a new digest cycle, since 
		//nothing has happened (at least that Angular knows about).
		$scope.$digest();
	});

	$scope.removeCell = function(cell){
		var idx = _.findIndex($scope.cells,function(each){
			return each.idx == cell.idx;
		});
		$scope.cells.splice(idx,1);
		$(herald).trigger("cellTags:change",idx);
	}

	$scope.removePert = function(pert){
		var idx = _.findIndex($scope.perts,function(each){
			return each.idx == pert.idx;
		});
		$scope.perts.splice(idx,1);
		$(herald).trigger("pertTags:change",idx);
	}
	
}]);