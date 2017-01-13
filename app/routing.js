/**
* Routes all API requests to particular functions
* This file would be referenced by the 'app.js' file, as;
*/



var api_search_ctrl        =   require(__dirname + '/controller/search.controller');
var api_details_ctrl        =   require(__dirname + '/controller/details.controller');
var api_sync_ctrl        =   require(__dirname + '/controller/recordSync');

module.exports = function(app) {
	
    
    /* route for combined search */
    app.get('/product/search', api_search_ctrl.productSearch);  /* return all products (drugs and clinical trials)*/
    app.post('/product/details', api_details_ctrl.productDetails); /* returns product details */
    
    // just for back support
    app.get('/search/records', api_search_ctrl.productSearch);
    
    app.get('/search/global', api_search_ctrl.globalSearch);
    /* sync records api's */
    app.get('/trials/syncClinicalTrials', api_sync_ctrl.syncClinicalTrials);
    app.get('/trials/syncDrugsRecords', api_sync_ctrl.syncDrugsRecords);
    app.get('/trials/syncTreatmentRecords', api_sync_ctrl.syncTreatmentRecords);  
    
};
