(function() {
  'use strict';

  angular
    .module('glass')
    .controller('SearchController', SearchController);

  /** @ngInject */
  function SearchController($stateParams, $mdDialog, PAGE_SIZE, moment, ServerSearch) {
    var vm = this;

    vm.criteria = $stateParams.criteria;
    vm.showWarnings = false;
    vm.numResults = null;
    vm.warnings = [];
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
        name: 'Study Type',
        items: [{
          name: 'Modality',
          action: function() { openStringCriterionDialog('Modality', 'modality'); }
        }, {
          name: 'Study Description',
          action: function() { openStringCriterionDialog('Study Description', 'description'); }
        }, {
          name: 'Body Part',
          action: function() { openStringCriterionDialog('Body Part', 'bodyPart'); }
        }, {
          name: 'Specialty',
          action: function() { openStringCriterionDialog('Specialty', 'specialty'); }
        }]
      }, {
        name: 'Study Timing',
        items: [{
          name: 'On...',
          action: function() { openDateTimeCriterionDialog('study', 'on'); }
        }, {
          name: 'Within the Last...',
          action: function() { openDateTimeCriterionDialog('study', 'within:last'); }
        }, {
          name: 'Within...of...',
          action: function() { openDateTimeCriterionDialog('study', 'within'); }
        }, {
          name: 'Before...',
          action: function() { openDateTimeCriterionDialog('study', 'before'); }
        }, {
          name: 'After...',
          action: function() { openDateTimeCriterionDialog('study', 'after'); }
        }, {
          name: 'Between...',
          action: function() { openDateTimeCriterionDialog('study', 'between'); }
        }]
      }, {
        name: 'Patient Location',
        items: [{
          name: 'Institution',
          action: function() { openStringCriterionDialog('Institution', 'institution'); }
        }, {
          name: 'Unit',
          action: function() { openStringCriterionDialog('Unit', 'unit'); }
        }]
      }, {
        name: 'Report Timing',
        items: [{
          name: 'On...',
          action: function() { openDateTimeCriterionDialog('report', 'on'); }
        }, {
          name: 'Within the Last...',
          action: function() { openDateTimeCriterionDialog('report', 'within:last'); }
        }, {
          name: 'Within...of...',
          action: function() { openDateTimeCriterionDialog('report', 'within'); }
        }, {
          name: 'Before...',
          action: function() { openDateTimeCriterionDialog('report', 'before'); }
        }, {
          name: 'After...',
          action: function() { openDateTimeCriterionDialog('report', 'after'); }
        }, {
          name: 'Between...',
          action: function() { openDateTimeCriterionDialog('report', 'between'); }
        }]
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
        vm.warnings = [];
        angular.forEach(search.warnings, function(warning) {
          vm.warnings.push(vm.criteria[warning.index]);
        })
        storePage(0, search.results);
      });
    }
    
    function fetchPage(pageNumber) {
      loadedPages[pageNumber] = null;
      ServerSearch.get({
        id: vm.currentSearchId,
        pageNumber: pageNumber,
        pageSize: PAGE_SIZE
      }).$promise.then(function(search) {
        storePage(pageNumber, search.results);
      });
    }
    
    function storePage(pageNumber, results) {
      loadedPages[pageNumber] = results;
      numLoaded = results.length;
      formatEntries(results);      
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
    
    function openDateTimeCriterionDialog(object, method) {
      var criterionName;
      switch (method) {
        case 'on': criterionName = 'On'; break;
        case 'within:last': criterionName = 'WithinLast'; break;
        case 'within': criterionName = 'Within'; break;
        case 'before': criterionName = 'Before'; break;
        case 'after': criterionName = 'After'; break;
        case 'between': criterionName = 'Between'; break;
      }
      $mdDialog.show({
        templateUrl: 'app/components/search/add' + criterionName + 'CriterionDialog.template.html',
        hasBackdrop: false,
        locals: {
          object: object,
          method: method
        },
        controller: 'AddDateTimeCriterionDialogController',
        controllerAs: 'vm',
        bindToController: true
      }).then(function(chip) {
        addChip(chip);
      });            
    }
    
    function openStringCriterionDialog(title, property) {
      $mdDialog.show({
        templateUrl: 'app/components/search/addStringCriterionDialog.template.html',
        hasBackdrop: false,
        locals: {
          title: title,
          property: property
        },
        controller: 'AddStringCriterionDialogController',
        controllerAs: 'vm',
        bindToController: true
      }).then(function(selection) {
        addChip(property + ':' + selection);
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