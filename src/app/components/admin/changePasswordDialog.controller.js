(function() {
  'use strict';

  angular
    .module('glass')
    .controller('ChangePasswordDialogController', ChangePasswordDialogController);

  /** @ngInject */
  function ChangePasswordDialogController($mdDialog, auth) {
    var vm = this;
    vm.cancel = cancel;
    vm.submit = submit;
        
    function cancel() {
      $mdDialog.cancel();
    }
    
    function submit() {
      auth.changePassword(vm.user._id, vm.password).then(function() {
        $mdDialog.hide();
      });
    }
    
  }

})();