(function() {
  'use strict';

  angular
    .module('glass')
    .controller('ChangePasswordDialogController', ChangePasswordDialogController);

  /** @ngInject */
  function ChangePasswordDialogController($mdDialog) {
    var vm = this;
    vm.cancel = cancel;
    vm.submit = submit;
        
    function cancel() {
      $mdDialog.cancel();
    }
    
    function submit() {
      $mdDialog.hide(vm.password);
    }
    
  }

})();