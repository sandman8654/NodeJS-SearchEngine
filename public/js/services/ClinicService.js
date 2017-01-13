angular.module('ClinicService', [])
    .factory('Clinic', ['$http', '$q', function ($http, $q) {

        return {
			globalSearch: function (data) {
                var q = $q.defer();
                 $http({
						url: '/search/global', 
						method: "GET",
						params: data
					})
                    .success(function (response) {
                        q.resolve(response);
                    })
                    .error(function (data, status, headers, config) {
                        q.reject(data);
                    });
                return q.promise;
            },
            searchClinicRecords: function (data) {
                var q = $q.defer();
                $http.post('/search/trials', data)
                    .success(function (response) {
                        q.resolve(response);
                    })
                    .error(function (data, status, headers, config) {
                        q.reject(data);
                    });
                return q.promise;
            },
            searchDrugsRecords: function (data) {
                var q = $q.defer();
                $http.post('/search/drugs', data)
                    .success(function (response) {
                        q.resolve(response);
                    })
                    .error(function (data, status, headers, config) {
                        q.reject(data);
                    });
                return q.promise;
            },
            searchTreatmentRecords: function (data) {
                var q = $q.defer();
                $http.post('/search/treatment', data)
                    .success(function (response) {
                        q.resolve(response);
                    })
                    .error(function (data, status, headers, config) {
                        q.reject(data);
                    });
                return q.promise;
            },
            syncClinicRecords: function () {
                var q = $q.defer();
                $http.get('/trials/syncClinicalTrials')
                    .success(function (response) {
                        q.resolve(response);
                    })
                    .error(function (data, status, headers, config) {
                        q.reject(data);
                    });
                return q.promise;
            },
            syncDrugsRecords: function () {
                var q = $q.defer();
                $http.get('/trials/syncDrugsRecords')
                    .success(function (response) {
                        q.resolve(response);
                    })
                    .error(function (data, status, headers, config) {
                        q.reject(data);
                    });
                return q.promise;
            },
            syncTreatmentRecords: function () {
                var q = $q.defer();
                $http.get('/trials/syncTreatmentRecords')
                    .success(function (response) {
                        q.resolve(response);
                    })
                    .error(function (data, status, headers, config) {
                        q.reject(data);
                    });
                return q.promise;
            }
        };

}]);
