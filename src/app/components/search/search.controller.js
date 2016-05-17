(function() {
  'use strict';

  angular
    .module('glass')
    .controller('SearchController', SearchController);

  /** @ngInject */
  function SearchController($window, $mdDialog, PAGE_SIZE, INSTITUTIONS, moment, ServerSearch) {
    var vm = this;

    vm.criteria = [];
    vm.numResults = null;
    vm.elapsedSeconds = null;
    vm.createNewSearch = createNewSearch;
    vm.showResult = showResult;
    vm.menus = [{
        name: 'Study Status',
        items: [{
          name: 'Verified',
          action: function() { addChip('demographics:verified'); }
        }, {
          name: 'Unverified',
          action: function() { addChip('demographics:unverified'); }
        }]
      }, {
        name: 'Study Type'
      }, {
        name: 'Study Timing'
      }, {
        name: 'Patient Location',
        items: [{
          name: 'Institution',
          action: function() { openStringCriterionDialog('Institution', INSTITUTIONS, 'institution'); }
        }, {
          name: 'Unit',
          action: function() { openStringCriterionDialog('Unit', null, 'unit'); }
        }]
      }, {
        name: 'Report Timing'
      }
    ]
    
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
      loadedPages = [];
      numLoaded = 0;
      numItems = 0;
      loadedPages[0] = null;
      vm.status = null;
      var startTime = Date.now();
      ServerSearch.save({ criteria: vm.criteria, pageSize: PAGE_SIZE }).$promise.then(function(search) {
        vm.currentSearchId = search._id;
        numItems = search.count;
        vm.status = (numItems ? (numItems === 1 ? '1 result found after ' : numItems.toLocaleString() + ' results found in ') : 'No results found after ');
        vm.status += (Date.now() - startTime) / 1000 + ' seconds.';
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
        result.entry += ' for patient at ' + result.institution + ', unit ' + result.unit + ',';
        if (result.reports) {
          var lastReport = result.reports.length - 1;
          var prettyLastReportedTimestamp = moment(result.reports[lastReport].timestamp).format('MMMM D, YYYY, h:mm a');
          result.entry += ' last reported at ' + prettyLastReportedTimestamp + '.';
        } else {
          result.entry += '.';
        }
      });
    }
    
    function addChip(chip) {
      vm.criteria.push(chip);
      vm.createNewSearch();
    }
    
    function openStringCriterionDialog(title, options, chipPrefix) {
      $mdDialog.show({
        templateUrl: 'app/components/search/addStringCriterionDialog.template.html',
        hasBackdrop: false,
        locals: {
          title: title,
          options: options
        },
        controller: 'AddStringCriterionDialogController',
        controllerAs: 'vm',
        bindToController: true
      }).then(function(chipSuffix) {
        addChip(chipPrefix + ':' + chipSuffix)
      });      
    }
    
    function showResult(result) {
      $mdDialog.show({
        templateUrl: 'app/components/search/resultDialog.template.html',
        hasBackdrop: false,
        fullscreen: true,
        locals: {
          result: result
        },
        controller: 'ResultDialogController',
        controllerAs: 'vm',
        bindToController: true
      });      
    }

  }
    
})();