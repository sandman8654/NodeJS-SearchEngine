angular.module('SearchCtrl', [])
    .controller('SearchController', function ($scope, Search, $state) {
		/***
		 * Variables
		 * ***/
		// check-box flags
        $scope.clinical_trial = false;
        $scope.drugs = false;
        $scope.treatment = false;

        // clinical trials variables
        $scope.pageNumber = 1;
        $scope.recordsPerPage = 10;
        $scope.maxSize = 3;
        $scope.RECORDS = [];
        $scope.TOTALCOUNT = 0;
		var pageNo = 1;
		
		/***
		 * Global search function
		 * ***/
		$scope.searchValue = '';
		
        function globalSearch(searchKeys) {
            Search.globalSearch(searchKeys)
                .then(function (res) {
                        if (res.status == 'success') {
							// Clinical trials
							$scope.RECORDS = res.records;
							$scope.TOTALCOUNT = res.totalCount;
							$scope.myvar = $scope.RECORDS.length > 0 ? true : false;
							$scope.pageBtns = $scope.TOTALCOUNT > $scope.recordsPerPage ? true : false;
                        }
                    },
                    function (err) {
                        console.log(err);
                    });
        }
       
		/***
		 * Function called on search button click
		 * ***/
        $scope.search = function () {
				var s_data = {
					recordsPerPage : $scope.recordsPerPage,
					search : $scope.searchValue,
					drugFlag : $scope.drugs,
					trialFlag : $scope.clinical_trial,
					pageNo: pageNo
				};
				globalSearch(s_data);
            };
         
         
         /***
          * Call function
          * ***/
          
         $scope.search();
         
        /***
         * 
         * Pagination functions
         * 
         * ***/
    
        // clinical Trials
        $scope.pageChanged = function (page) {
			pageNo = page;
            $scope.search();
        }
        
        // View Details of products
        
        $scope.viewDetails = function (p_id, p_type) {
			 var data = {
				p_id: p_id,
				p_type: p_type 
			 };
			 //~ $state.go('productsDetails',{p_type:p_type,p_id:p_id});
			 Search.viewDetails(data)
			  .then(function(res){
				 console.log(res);
			  });
		}
        
    });
