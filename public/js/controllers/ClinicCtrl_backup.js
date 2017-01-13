angular.module('ClinicCtrl', [])
    .controller('ClinicController', function ($scope, Clinic) {

        $scope.clinical_trial = false;
        $scope.drugs = false;
        $scope.treatment = false;

        /******************************************************************************************/
        // Searching that deals with clinical trials
        $scope.pageNumber = 1;
        $scope.recordsPerPage = 10;
        $scope.maxSize = 3;
        $scope.RECORDS = [];
        $scope.TOTALCOUNT = 0;


        $scope.searchKeys = {
            pageNumber: $scope.pageNumber,
            recordsPerPage: $scope.recordsPerPage,
            search: ''
        };

        function searchRecords() {
            Clinic.searchClinicRecords($scope.searchKeys)
                .then(function (res) {
                        if (res.status == 'success') {
                            $scope.RECORDS = res.records;
                            $scope.TOTALCOUNT = res.count;
                            $scope.myvar = $scope.RECORDS.length > 0 ? true : false;
                            $scope.pageBtns = $scope.TOTALCOUNT > $scope.recordsPerPage ? true : false;
                        }
                    },
                    function (err) {
                        console.log(err);
                    });
        }
        
        function globalSearch(searchKeys) {
            Clinic.globalSearch(searchKeys)
                .then(function (res) {
                        if (res.status == 'success') {
							// for clinical trials
                            $scope.RECORDS = res.trails;
                            $scope.TOTALCOUNT = res.trailsCount;
                            $scope.myvar = $scope.RECORDS.length > 0 ? true : false;
                            $scope.pageBtns = $scope.TOTALCOUNT > $scope.recordsPerPage ? true : false;
                            // for drugs data
                            $scope.RECORDS_d = res.drugs;
                            $scope.TOTALCOUNT_d = res.drugsCount;
                            $scope.myvar_d = $scope.RECORDS_d.length > 0 ? true : false;
                            $scope.pageBtns_d = $scope.TOTALCOUNT_d > $scope.recordsPerPage_d ? true : false;
                        }
                    },
                    function (err) {
                        console.log(err);
                    });
        }

        searchRecords();

        $scope.pageChanged = function (pageNo) {
            $scope.searchKeys.pageNumber = pageNo;
            searchRecords();
        }

        // Function to deal with search api
        $scope.search = function () {
				var s_data = {
					recordsPerPage : $scope.recordsPerPage,
					search : $scope.searchKeys.search,
					drugFlag : $scope.drugs,
					trialFlag : $scope.clinical_trial
				};
				
				globalSearch(s_data);
			
                //~ if ($scope.drugs) {
                    //~ searchRecords_d();
                //~ }
                
                //~ if ($scope.treatment) {
                    //~ searchRecords_t();
                //~ }

                //~ if ($scope.clinical_trial) {
                    //~ searchRecords();
                //~ }

                //~ if (!$scope.drugs && !$scope.clinical_trial && !$scope.treatment) {
                    //~ searchRecords();
                    //~ searchRecords_d();
                   //~ // searchRecords_t();
                //~ }
            }
        /******************************************************************************************/

        // Searching that deals with drugs records
        $scope.pageNumber_d = 1;
        $scope.recordsPerPage_d = 10;
        $scope.maxSize_d = 3;
        $scope.RECORDS_d = [];
        $scope.TOTALCOUNT_d = 0;


        $scope.searchKeys_d = {
            pageNumber: $scope.pageNumber_d,
            recordsPerPage: $scope.recordsPerPage_d,
            search: ''
        };

        function searchRecords_d() {
            $scope.searchKeys_d.search = $scope.searchKeys.search;
            Clinic.searchDrugsRecords($scope.searchKeys_d)
                .then(function (res) {
                        if (res.status == 'success') {
                            $scope.RECORDS_d = res.records;
                            $scope.TOTALCOUNT_d = res.count;
                            $scope.myvar_d = $scope.RECORDS_d.length > 0 ? true : false;
                            $scope.pageBtns_d = $scope.TOTALCOUNT_d > $scope.recordsPerPage_d ? true : false;
                        }
                    },
                    function (err) {
                        console.log(err);
                    });
        }

        searchRecords_d();

        $scope.pageChanged_d = function (pageNo) {
            console.log(pageNo);
            $scope.searchKeys_d.pageNumber = pageNo;
            searchRecords_d();
        }

	/******************************************************************************************/

        // Searching that deals with Treatment records
        //~ $scope.pageNumber_t = 1;
        //~ $scope.recordsPerPage_t = 10;
        //~ $scope.maxSize_t = 3;
        //~ $scope.RECORDS_t = [];
        //~ $scope.TOTALCOUNT_t = 0;
//~ 
//~ 
        //~ $scope.searchKeys_t = {
            //~ pageNumber: $scope.pageNumber_t,
            //~ recordsPerPage: $scope.recordsPerPage_t,
            //~ search: ''
        //~ };
//~ 
        //~ function searchRecords_t() {
            //~ $scope.searchKeys_t.search = $scope.searchKeys.search;
            //~ Clinic.searchTreatmentRecords($scope.searchKeys_t)
                //~ .then(function (res) {
                        //~ if (res.status == 'success') {
                            //~ $scope.RECORDS_t = res.records;
                            //~ $scope.TOTALCOUNT_t = res.count;
                            //~ $scope.myvar_t = $scope.RECORDS_t.length > 0 ? true : false;
                            //~ $scope.pageBtns_t = $scope.TOTALCOUNT_t > $scope.recordsPerPage_t ? true : false;
                        //~ }
                    //~ },
                    //~ function (err) {
                        //~ console.log(err);
                    //~ });
        //~ }
//~ 
        //~ searchRecords_t();
//~ 
        //~ $scope.pageChanged_t = function (pageNo) {
            //~ console.log(pageNo);
            //~ $scope.searchKeys_t.pageNumber = pageNo;
            //~ searchRecords_t();
        //~ }

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
