(function() {
  'use strict';

  angular
    .module('glass')
    .controller('CreateUserDialogController', CreateUserDialogController);

  /** @ngInject */
  function CreateUserDialogController($mdDialog, ServerUser) {    
    this.domain = 'local';
    this.cancel = cancel;
    this.submit = submit;
        
    function cancel() {
      $mdDialog.cancel();
    }
    
    function submit() {
      var user = {
        userName: this.userName,
        domain: this.domain,
        isAdmin: this.isAdmin,
        activated: true
      };
      if (this.domain === 'local') {
        angular.extend(user, { password: this.password });
      }
      ServerUser.save(user).$promise.then(function() {
        $mdDialog.hide();
      });
    }
    
  }

})();