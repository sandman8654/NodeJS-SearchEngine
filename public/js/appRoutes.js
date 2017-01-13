angular.module('appRoutes', [])
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise('/');
 
        $stateProvider
            .state('products', {
                url: '/',
                templateUrl: 'views/mixedSearch.html',
                controller: 'SearchController'
            })
            .state('productsDetails', {
                url: '/details/:p_type/:p_id',
                templateUrl: 'views/details.html',
                controller: 'DetailsController',
                resolve: {
					getProductDetails: function($stateParams, Search, $state) {
						var p_id = $stateParams.p_id;
						var p_type = $stateParams.p_type;
						
						if(!p_id || !p_type) {
							return;
						}
						 var data = {
							p_id: p_id,
							p_type: p_type 
						 };
						return  Search.viewDetails(data);
						
					}
				}
            })
            .state('global', {
                url: '/global',
                templateUrl: 'views/home.html',
                controller: 'ClinicController'
            });
        $locationProvider.html5Mode(true);
    });
