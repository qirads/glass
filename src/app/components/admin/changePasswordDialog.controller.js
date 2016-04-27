(function() {
  'use strict';

  angular
    .module('glass')
    .controller('ChangePasswordDialogController', ChangePasswordDialogController);

  /** @ngInject */
  function ChangePasswordDialogController($mdDialog, auth) {
    this.cancel = cancel;
    this.submit = submit;
        
    function cancel() {
      $mdDialog.cancel();
    }
    
    function submit() {
      auth.changePassword(this.user._id, this.password).then(function() {
        $mdDialog.hide();
      });
    }
    
  }

})();