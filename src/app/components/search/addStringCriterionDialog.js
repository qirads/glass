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
    
    vm.options = ServerStudy.query({ distinct: vm.property });
    
    function cancel() {
      $mdDialog.cancel();
    }
    
    function submit() {
      $mdDialog.hide(vm.field);
    }
        
  }

})();