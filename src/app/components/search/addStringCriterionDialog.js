(function() {
  'use strict';

  angular
    .module('glass')
    .controller('AddStringCriterionDialogController', AddStringCriterionDialogController);

  /** @ngInject */
  function AddStringCriterionDialogController($mdDialog, ServerStudy) {
    var vm = this;
    vm.cancel = cancel;
    vm.submit = submit;
    
    vm.options = ServerStudy.query({ distinct: vm.property }).$promise.then(function(list) {
      vm.options = filterCaseInsensitiveDuplicates(list);
    });
        
    function cancel() {
      $mdDialog.cancel();
    }
    
    function submit() {
      $mdDialog.hide(vm.field);
    }
    
    // http://stackoverflow.com/questions/26221730/prefer-uppercase-unique-when-doing-case-insensitive-sort-removing-duplicates-ins
    function filterCaseInsensitiveDuplicates(list) {
      var sortedList = list.sort(function(a, b) {
        return a.localeCompare(b, { sensitivity: 'base' });
      });
      var i = sortedList.length;
      var filteredList = (i >= 1 ? [sortedList[i - 1]] : []);
      while (i--) {
        if (filteredList[0].toLowerCase() != sortedList[i].toLowerCase()) {
          filteredList.unshift(sortedList[i]);
        }
      }
      return filteredList;
    }
    
  }

})();