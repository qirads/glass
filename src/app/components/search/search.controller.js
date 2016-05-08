(function() {
  'use strict';

  angular
    .module('glass')
    .controller('SearchController', SearchController);

  /** @ngInject */
  function SearchController($window, PAGE_SIZE, moment, ServerSearch) {
    var vm = this;

    vm.criteria = [ 'demographics:verified '];
    vm.createNewSearch = createNewSearch;
    vm.getHeight = getHeight;
    
    var loadedPages = [];
    var numLoaded = 0;
    var numItems = 0;
    
    vm.results = {
      getLength: function() { return numLoaded + 1 },
      getItemAtIndex: function(index) {
        if (numItems && index < numItems) {
          var pageNumber = Math.floor(index / PAGE_SIZE);
          var page = loadedPages[pageNumber];
          if (page) {
            return page[index % PAGE_SIZE];
          } else if (page !== null) {
            fetchPage(pageNumber);
          }          
        }
      }
    };
    
    createNewSearch();
        
    function createNewSearch() {      
      loadedPages[0] = null;
      ServerSearch.save({ criteria: vm.criteria, pageSize: PAGE_SIZE }).$promise.then(function(search) {
        vm.currentSearchId = search._id;
        numItems = search.count;
        loadedPages[0] = search.results;
        numLoaded = search.results.length;
        formatEntries(search.results);
      });
    }
    
    function fetchPage(pageNumber) {
      loadedPages[pageNumber] = null;
      ServerSearch.get({
        id: vm.currentSearchId,
        pageNumber: pageNumber,
        pageSize: PAGE_SIZE
      }).$promise.then(function(search) {
        loadedPages[pageNumber] = search.results;
        numLoaded = numLoaded + search.results.length;
        formatEntries(search.results);
      });
    }
    
    function formatEntries(results) {
      angular.forEach(results, function(result) {
        var prettyStudyTimestamp = moment(result.timestamp).format('MMMM D, YYYY, h:mm a');
        result.entry = prettyStudyTimestamp + ': ' + result.description;
        result.entry += ' for ' + result.location + ' patient at ' + result.institution;
        if (result.reports) {
          var lastReport = result.reports.length - 1;
          var prettyLastReportedTimestamp = moment(result.reports[lastReport].timestamp).format('MMMM D, YYYY, h:mm a');
          result.entry += ', last reported at ' + prettyLastReportedTimestamp + '.';
        } else {
          result.entry += '.';
        }
      });      
    }
    
    function getHeight() {
      return { height: '' + ($window.innerHeight - 209) + 'px' };
    }
  }
    
})();