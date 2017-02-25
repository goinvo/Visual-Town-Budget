

config = {

	activeYears : ["2015", "2016", "2017", "2018"],

	dataSetList : [
		{ name : "Home", 	path : "home.json"},
		{ name: "Expenses", path : "expenses.json" },
		{ name: "Revenues", path : "revenues.json" },
		{ name: "Funds", 	path : "funds.json" }
	]
}



var app = angular.module('vbGuiApp', ['ui.bootstrap']);

app.controller('vbGuiCtrl', ['$scope', '$http', '$sce', '$rootScope', '$window', '$modal',
	function($scope, $http, $sce, $rootScope, $window, $modal){


		$scope.init = function(){
			$scope.config = config;
			$scope.selectedSet = config.dataSetList[0];
			$scope.loadDataSet();
		}


		// NETWORKING
		$scope.changeDataSet = function(set){
			$scope.selectedSet = set;
			$scope.loadDataSet();
		}

		$scope.loadDataSet = function(){
			$scope.callAPI();
		}

		$scope.saveDataSet = function(){
			$scope.callAPI($scope.dataSet);
		}

		$scope.callAPI = function(payLoad){
			var req = {
				url : 'saveJson.php',
				method : 'POST',
				data: {
					fileName : $scope.selectedSet.path
				} 
			}

			if(payLoad) req.data.newContents = angular.toJson(payLoad, true)

			$http(req).then(function successCallback(response) {
				$scope.dataSet = response.data;
			}, function errorCallback(response) {
				console.log("can't find data set")
			});	
		}


	
		// UI
		$scope.openItem = function(item){
			$scope.currentItem = item;

			$scope.subTotals = false;

			if(item.sub.length != 0){
				$scope.subTotals = {};
				for(var i = 0; i < item.sub.length; i++){
					var s = item.sub[i];
					for(var v = 0; v < s.values.length; v++){
						val = s.values[v];
						var year = val.year;
						var value = val.val;

						if(!(year in $scope.subTotals)) $scope.subTotals[year] = 0;
						$scope.subTotals[year] += parseFloat(value);
					}
				}

			}

		}
		
		$scope.deleteItem = function(item){
			searchAndDestroy($scope.dataSet, item.hash);
			$scope.currentItem = false;
		}

		$scope.addChild = function(item){
			var emptyCat = {
				descr : "",
				key : "New Category",
				src : "",
				sub : [],
				url : "",
				values : [],
				hash: createGUID(8)
			}
			for(var i = 0; i < config.activeYears.length; i++){
				emptyCat.values.push({
					year: config.activeYears[i],
					val : 0
				})
			}
			searchAndPush($scope.dataSet, item.hash, emptyCat);

			$scope.currentItem = item.sub[item.sub.length - 1];
		}

	
		// AND AWAY WE GO!!!
		$scope.init();
	}
]);

function searchAndDestroy(parent, targetHash){
	for(var i = 0; i < parent.sub.length; i++){
		var pointer = parent.sub[i];
		if(pointer.hash == targetHash) {
			parent.sub.splice(i, 1);
			return true;
		}	
		if(pointer.sub.length != 0){
			if(searchAndDestroy(pointer, targetHash)) return true;
		}
	}
}

function searchAndPush(parent, targetHash, emptyCat){

	// check if we're at the top level
	if(parent.hash == targetHash) {
		parent.sub.push(emptyCat);
		return true;
	}

	// else start recursively iterating
	for(var i = 0; i < parent.sub.length; i++){
		var pointer = parent.sub[i];
		if(pointer.hash == targetHash) {
			parent.sub[i].sub.push(emptyCat);
			return true;
		}	
		if(pointer.sub.length != 0){
			if(searchAndPush(pointer, targetHash, emptyCat)) return true;
		}
	}
}

function createGUID(l){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < l; i++ ) text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}