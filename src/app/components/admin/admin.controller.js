(function() {
  'use strict';

  angular
    .module('glass')
    .controller('AdminController', AdminController);

  /** @ngInject */
  function AdminController($mdDialog, $state, moment, ServerUser, ServerSession, auth) {

    var vm = this;
    
    vm.loggedInUserId = auth.loggedInUserId;
    vm.refreshUsers = refreshUsers;
    vm.showCreateUserDialog = showCreateUserDialog;
    vm.toggleActivation = toggleActivation;
    vm.deleteUser = deleteUser;
    vm.showChangePasswordDialog = showChangePasswordDialog;
    vm.refreshSessions = refreshSessions;
    
    function refreshUsers() {
      vm.users = ServerUser.query();
    }

    function showCreateUserDialog() {
      $mdDialog.show({
        templateUrl: 'app/components/admin/createUserDialog.template.html',
        hasBackdrop: false,
        controller: 'CreateUserDialogController',
        controllerAs: 'vm',
        bindToController: true
      }).then(function(user) {
        ServerUser.save(user).$promise.then(function() {
          vm.refreshUsers();
        });
      });
    }
        
    function toggleActivation(user) {
      ServerUser.update( { id: user.id }, { activated: !user.activated } );
    }

    function deleteUser(user) {
      ServerUser.remove( { id: user.id } ).$promise.then(function() {
        vm.refreshUsers();
      });
    }
    
    function showChangePasswordDialog(user) {
      $mdDialog.show({
        templateUrl: 'app/components/admin/changePasswordDialog.template.html',
        hasBackdrop: false,
        controller: 'ChangePasswordDialogController',
        controllerAs: 'vm',
        bindToController: true
      }).then(function(password) {
        auth.changePassword(user.id, password)
      });
    }
        
    function refreshSessions() {
      vm.sessions = ServerSession.query({
        populate: 'userId',
        query: {
          state: 'open',
          lastRefreshedAt: { "$gte": moment().subtract(5, 'm') }
        }
      });
    }
    
  }

})();