angular.module('ClinicCtrl', [])
    .controller('ClinicController', function ($scope, Clinic) {
		
		/***
		 * Variables
		 * ***/
		var paginationOn = ''; // trials or drugs or treatment 
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
		var trialsPageNo = 1;
		
		// drugs records variables
        $scope.pageNumber_d = 1;
        $scope.recordsPerPage_d = 10;
        $scope.maxSize_d = 3;
        $scope.RECORDS_d = [];
        $scope.TOTALCOUNT_d = 0;
		var drugPageNo = 1;
		
		/***
		 * Global search function
		 * ***/
		$scope.searchValue = '';
		
        function globalSearch(searchKeys) {
            Clinic.globalSearch(searchKeys)
                .then(function (res) {
                        if (res.status == 'success') {
							
							var flag_t = false;
							var flag_d = false;

							if($scope.drugs == true && $scope.clinical_trial == false) {
								// search will only work on drugs records
								flag_t = true;

								if(paginationOn == 'trials') {
									flag_t = false;
									flag_d = true;
								}
							}

							if($scope.drugs == false && $scope.clinical_trial == true) {
								flag_d = true;
								if(paginationOn == 'drugs') {
									flag_d = false;
									flag_t = true;
								}
							}
							
							// Clinical trials
							if(!flag_t) {
								$scope.RECORDS = res.trails;
								$scope.TOTALCOUNT = res.trailsCount;
								$scope.myvar = $scope.RECORDS.length > 0 ? true : false;
								$scope.pageBtns = $scope.TOTALCOUNT > $scope.recordsPerPage ? true : false;
							}
                            
                            // Drugs data
                            if(!flag_d) {
								$scope.RECORDS_d = res.drugs;
								$scope.TOTALCOUNT_d = res.drugsCount;
								$scope.myvar_d = $scope.RECORDS_d.length > 0 ? true : false;
								$scope.pageBtns_d = $scope.TOTALCOUNT_d > $scope.recordsPerPage_d ? true : false;
							}
							paginationOn = '';
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
					drugPageNo: drugPageNo,
					trialsPageNo: trialsPageNo,
					paginationOn:paginationOn
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
        $scope.pageChanged = function (pageNo) {
			trialsPageNo = pageNo;
			paginationOn = 'trials';
            $scope.search();
        }
        
        // drug records
        $scope.pageChanged_d = function (pageNo) {
			drugPageNo = pageNo;
			paginationOn = 'drugs';
            $scope.search();
        }

      

/******************************************************************************************************************/
        // function to start storing xml files in database 
        $scope.syncFiles = function () {
            // Send request to server and show search response
            Clinic.syncClinicRecords()
                .then(function (res) {
                        console.log(res);
                    },
                    function (err) {
                        console.log(err);
                    });
        }
        $scope.syncDrug = function () {
            // Send request to server and show search response
            Clinic.syncDrugsRecords()
                .then(function (res) {
                        console.log(res);
                    },
                    function (err) {
                        console.log(err);
                    });
        }
        $scope.syncTreatment = function () {
            // Send request to server and show search response
            Clinic.syncTreatmentRecords()
                .then(
					function (res) {
                        console.log(res);
                    },
                    function (err) {
                        console.log(err);
                    }
             );
        }

        $scope.CURL = function () {
            // Send request to server and show search response
            Clinic.CURL()
                .then(function (res) {
                        console.log(res);
                    },
                    function (err) {
                        console.log(err);
                    });
        }
    });
