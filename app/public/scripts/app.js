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
	
}])
.controller('legendCenter',['$scope',function($scope){
	$scope.centerMap = {
		"LINCS Transcriptomics":{
			fullName:"LINCS Center for Transcriptomics",
			url:"http://www.lincscloud.org/",
			logo:"css/img/Broad_T.png",
			initial:'T',
			color:"#0B609A"
		},
		"LINCS PCCSE":{
			fullName:"LINCS Proteomic Characterization Center for Signaling and Epigenetics",
			url:"http://www.lincsproject.org/centers/data-and-signature-generating-centers/broad-prx/",
			logo:"css/img/Broad_P.png",
			initial:'P',
			color:"#0B609A"
		},
		"HMS LINCS":{
			fullName:"HMS LINCS",
			url:"http://lincs.hms.harvard.edu/",
			logo:"css/img/HMS_H.png",
			initial:'H',
			color:"#C90016"
		},
		"DTOXS":{
			fullName:"DToxS",
			url:"http://research.mssm.edu/pst/DToxS/index.htm",
			logo:"css/img/DTOXS_D.png",
			initial:'D',
			// color:"#D80B8C"
			color:"#00AEEF"
		},
		"MEP LINCS":{
			fullName:"MEP LINCS",
			url:"http://www.lincsproject.org/centers/data-and-signature-generating-centers/oregon-u/",
			logo:"css/img/MEP_M.png",
			initial:'M',
			color:"#66cc33"
		},
		"NeuroLINCS":{
			fullName:"NeuroLINCS",
			url:"http://www.lincsproject.org/centers/data-and-signature-generating-centers/neurolincs/",
			logo:"css/img/NeuroLINCS_N.png",
			initial:'N',
			color:"#ffd200"
		}
	};
	$scope.centers = [  "DTOXS","HMS LINCS",  "MEP LINCS", "NeuroLINCS","LINCS PCCSE","LINCS Transcriptomics"];
}]);