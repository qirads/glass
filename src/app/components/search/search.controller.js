(function() {
  'use strict';

  angular
    .module('glass')
    .controller('SearchController', SearchController);

  /** @ngInject */
  function SearchController($log, $stateParams, $mdDialog, $document, $mdToast, PAGE_SIZE, moment, ServerSearch) {
    var vm = this;

    vm.criteria = $stateParams.criteria;
    vm.showWarnings = false;
    vm.numResults = null;
    vm.elapsedSeconds = null;
    vm.createNewSearch = createNewSearch;
    vm.showResult = showResult;
    vm.menus = [{
        name: 'Study Status',
        items: [{
          id: 'demographicsVerified',
          name: 'Verified',
          action: function() { addChip('demographics:verified'); }
        }, {
          id: 'demographicsUnverified',
          name: 'Unverified',
          action: function() { addChip('demographics:unverified'); }
        }]
      }, {
        name: 'Study Type',
        items: [{
          id: 'studyModality',
          name: 'Modality',
          action: makeStringCriterionDialogOpener('Modality', 'modality', 'studyModality')
        }, {
          id: 'studyDescription',
          name: 'Study Description',
          action: makeStringCriterionDialogOpener('Study Description', 'description', 'studyDescription')
        }, {
          id: 'studyBodyPart',
          name: 'Body Part',
          action: makeStringCriterionDialogOpener('Body Part', 'bodyPart', 'studyBodyPart')
        }, {
          id: 'studySpecialty',
          name: 'Specialty',
          action: makeStringCriterionDialogOpener('Specialty', 'specialty', 'studySpecialty')
        }]
      }, {
        name: 'Study Timing',
        items: [{
          id: 'studyOn',
          name: 'On...',
          action: makeDateTimeCriterionDialogOpener('study', 'on', 'studyOn')
        }, {
          id: 'studyWithinLast',
          name: 'Within the Last...',
          action: makeDateTimeCriterionDialogOpener('study', 'within:last', 'studyWithinLast')
        }, {
          id: 'studyWithin',
          name: 'Within...of...',
          action: makeDateTimeCriterionDialogOpener('study', 'within', 'studyWithin')
        }, {
          id: 'studyBefore',
          name: 'Before...',
          action: makeDateTimeCriterionDialogOpener('study', 'before', 'studyBefore')
        }, {
          id: 'studyAfter',
          name: 'After...',
          action: makeDateTimeCriterionDialogOpener('study', 'after', 'studyAfter')
        }, {
          id: 'studyBetween',
          name: 'Between...',
          action: makeDateTimeCriterionDialogOpener('study', 'between', 'studyBetween')
        }]
      }, {
        name: 'Patient Location',
        items: [{
          id: 'patientInstitution',
          name: 'Institution',
          action: makeStringCriterionDialogOpener('Institution', 'institution', 'patientInstitution')
        }, {
          id: 'patientUnit',
          name: 'Unit',
          action: makeStringCriterionDialogOpener('Unit', 'unit', 'patientUnit')
        }]
      }, {
        name: 'Report Timing',
        items: [{
          id: 'reportOn',
          name: 'On...',
          action: makeDateTimeCriterionDialogOpener('report', 'on', 'reportOn')
        }, {
          id: 'reportWithinLast',
          name: 'Within the Last...',
          action: makeDateTimeCriterionDialogOpener('report', 'within:last', 'reportWithinLast')
        }, {
          id: 'reportWithin',
          name: 'Within...of...',
          action: makeDateTimeCriterionDialogOpener('report', 'within', 'reportWithin')
        }, {
          id: 'reportBefore',
          name: 'Before...',
          action: makeDateTimeCriterionDialogOpener('report', 'before', 'reportBefore')
        }, {
          id: 'reportAfter',
          name: 'After...',
          action: makeDateTimeCriterionDialogOpener('report', 'after', 'reportAfter')
        }, {
          id: 'reportBetween',
          name: 'Between...',
          action: makeDateTimeCriterionDialogOpener('report', 'between', 'reportBetween')
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
        vm.currentSearchId = search.id;
        numItems = search.count;
        vm.status = (numItems ? (numItems === 1 ? '1 result found after ' : numItems.toLocaleString() + ' results found in ') : 'No results found after ');
        vm.status += (Date.now() - startTime) / 1000 + ' seconds.';
        processWarnings(search.warnings);
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
      numLoaded += results.length;
      formatEntries(results);
    }
    
    function processWarnings(warnings) {
      var criteria = [];
      angular.forEach(warnings, function(warning) {
        criteria.push(vm.criteria[warning.index]);
      })
      if (criteria.length) {
        $mdToast.show({
          templateUrl: 'app/components/search/warningToast.template.html',
          position: "top left",
          locals: { warnings: criteria },
          controller: function() {},
          controllerAs: 'vm',
          bindToController: true
        });
      }      
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
    
    function makeDateTimeCriterionDialogOpener(object, method, parent) {
      return function() {
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
          openFrom: '#' + parent,
          closeTo: '#' + parent,
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
      };
    }
    
    function makeStringCriterionDialogOpener(title, property, parent) {
      return function() {
        $mdDialog.show({
          templateUrl: 'app/components/search/addStringCriterionDialog.template.html',
          hasBackdrop: false,
          openFrom: '#' + parent,
          closeTo: '#' + parent,
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
      };
    }
    
    function showResult($event, result) {
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