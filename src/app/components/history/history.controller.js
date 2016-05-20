(function() {
  'use strict';

  angular
    .module('glass')
    .controller('HistoryController', HistoryController);

  /** @ngInject */
  function HistoryController(moment, ServerSearch, auth) {
    var vm = this;
    
    vm.searches = ServerSearch.query({
      query: {
        userId: auth.loggedInUserId(),
        criteria: { $gt: [] }        
      }
    });
    vm.prettify = prettify;

    function prettify(timestamp) {
      return moment(timestamp).format('HH:mm on M/D/YYYY');
    }

  }
    
})();