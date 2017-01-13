angular.module('DetailsCtrl', [])
    .controller('DetailsController', function ($scope, getProductDetails, $state) {
	
	if(!getProductDetails){
		$state.go('products');
	}
       console.log(getProductDetails);
    });
