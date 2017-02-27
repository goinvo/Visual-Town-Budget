

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

		window.$scope = $scope;

		$scope.init = function(){
			$scope.config = config;
			$scope.selectedSet = config.dataSetList[0];
			$scope.loadDataSet();
			$scope.view = 'multi';
		}


		// NETWORKING
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

			$scope.openHash = false;
			if(payLoad) {
				if($scope.currentItem) $scope.openHash = $scope.currentItem.hash;
				req.data.newContents = angular.toJson(payLoad, true)
			}

			$http(req).then(function successCallback(response) {
				$scope.reset();
				$scope.dataSet = response.data;

				$scope.catHash = [];
				$scope.catHash.push({
					hash : $scope.dataSet.hash,
					key : $scope.dataSet.key
				});
				if($scope.dataSet.sub.length != 0){
					buildCatHash($scope.dataSet, '');
					if($scope.openHash){
						var p = getTreePointer($scope.openHash);
						$scope.openItem(p.pointer);
					} 
				}

			}, function errorCallback(response) {
				console.log("can't find data set")
			});
		}

		$scope.reset = function(){
			$scope.catHash = [];
			$scope.currentItem = false;
			$scope.treePosition = false;
			$scope.currentParentHash = false;
		}


		// UI
		$scope.openItem = function(item){
			$scope.currentItem = item;

			$scope.subTotals = false;

			if(item.hash != $scope.dataSet.hash){
				$scope.treePosition = getTreePointer(item.hash);
				$scope.currentParentHash = $scope.treePosition.parent.hash;
			}

			$scope.calculateSubs();
		}

		$scope.changeView = function(){
			if($scope.view == 'single') $scope.view = 'multi';
			else $scope.view = 'single';
		}

		$scope.calculateSubs = function(){

			var item = $scope.currentItem;
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
			$scope.treePosition.parent.sub.splice($scope.treePosition.pIndex, 1);
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

			$scope.treePosition.pointer.sub.push(emptyCat);

			$scope.currentItem = item.sub[item.sub.length - 1];
		}

		$scope.changeParent = function(){
			var newParentHash = document.getElementById('parentSelector').value;

			var newParent = getTreePointer(newParentHash);
			var newCat = angular.copy($scope.currentItem);

			$scope.deleteItem($scope.currentItem);
			
			newCat.hash = createGUID(8);

			var t= newParent.pointer.sub;
			t.push(newCat);
			buildCatHash($scope.dataSet, '');

			var newCat = t[t.length - 1];

			$scope.openItem(newCat);
		}

	

		// AND AWAY WE GO!!!
		$scope.init();
	}
]);



function getTreePointer(hash){
	for(var i = 0; i < $scope.catHash.length; i++){
		var p = $scope.catHash[i];
		if(p.hash == hash) return p;
	}
}

function buildCatHash(parent, indent){
	indent += '--';

	for(var i = 0; i < parent.sub.length; i++){
		var pointer = parent.sub[i];

		$scope.catHash.push({
			key 	: indent + ' ' + pointer.key,
			hash 	: pointer.hash,
			parent  : parent,
			pIndex 	: i,
			pointer : pointer
		});

		if(pointer.sub.length != 0){
			buildCatHash(pointer, indent);
		}
	}
}



function createGUID(l){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < l; i++ ) text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
