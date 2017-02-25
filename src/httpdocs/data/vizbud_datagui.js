

config = {

	activeYears : ["2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018"],

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
				console.log($scope.dataSet)
			}, function errorCallback(response) {
				console.log("can't find data set")
			});	
		}


	
		// UI
		$scope.openItem = function(item){
			$scope.currentItem = item;
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