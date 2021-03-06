(function() {
  'use strict';

  angular
    .module('glass')
    .controller('CreateUserDialogController', CreateUserDialogController);

  /** @ngInject */
  function CreateUserDialogController($mdDialog) {
    var vm = this;
    
    vm.domain = 'local';
    vm.cancel = cancel;
    vm.submit = submit;
        
    function cancel() {
      $mdDialog.cancel();
    }
    
    function submit() {
      var user = {
        userName: vm.userName,
        domain: vm.domain,
        isAdmin: vm.isAdmin,
        activated: true
      };
      if (vm.domain === 'local') {
        angular.extend(user, { password: vm.password });
      }
      $mdDialog.hide(user);
    }
    
  }

})();