(function() {
  'use strict';

  angular
    .module('glass')
    .controller('AddStringCriterionDialogController', AddStringCriterionDialogController);

  /** @ngInject */
  function AddStringCriterionDialogController($mdDialog) {
    var vm = this;
    vm.cancel = cancel;
    vm.submit = submit;
        
    function cancel() {
      $mdDialog.cancel();
    }
    
    function submit() {
      $mdDialog.hide(vm.field);
    }
    
  }

})();