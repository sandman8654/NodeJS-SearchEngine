angular.module('SearchService', [])
    .factory('Search', ['$http', function ($http) {
     
		return {
			globalSearch: globalSearch,
			viewDetails: viewDetails
		};
		
		function globalSearch (data) {
			return	$http({
					url: '/product/search', 
					method: "GET",
					params: data
				})
				.then(getDataComplete)
				.catch(getDataFailed);
		}
		
		function viewDetails (data) {
			return	$http({
					url: '/product/details', 
					method: "POST",
					params: data
				})
				.then(getDataComplete)
				.catch(getDataFailed);
		}
		
		function getDataComplete(response) {
			return response.data;
		}

		function getDataFailed(error) {
			return error.data;
		}
}]);
