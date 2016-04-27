(function() {
  'use strict';

  angular
    .module('glass')
    .controller('AdminController', AdminController);

  /** @ngInject */
  function AdminController($mdDialog, $state, moment, ServerUser, ServerSession, auth) {

    var vm = this;
    
    this.loggedInUserId = auth.loggedInUserId;
    this.refreshUsers = refreshUsers;
    this.showCreateUserDialog = showCreateUserDialog;
    this.toggleActivation = toggleActivation;
    this.deleteUser = deleteUser;
    this.showChangePasswordDialog = showChangePasswordDialog;
    this.refreshSessions = refreshSessions;
    
    function refreshUsers() {
      this.users = ServerUser.query();
    }

    function showCreateUserDialog() {
      $mdDialog.show({
        templateUrl: 'app/components/admin/createUserDialog.template.html',
        hasBackdrop: false,
        controller: 'CreateUserDialogController',
        controllerAs: 'vm',
        bindToController: true
      }).then(function() {
        vm.refreshUsers();
      });;
    }
        
    function toggleActivation(user) {
      ServerUser.update( { id: user._id }, { activated: !user.activated } );
    }

    function deleteUser(user) {
      ServerUser.remove( { id: user._id } ).$promise.then(function() {
        vm.refreshUsers();
      });
    }
    
    function showChangePasswordDialog(user) {
      $mdDialog.show({
        templateUrl: 'app/components/admin/changePasswordDialog.template.html',
        hasBackdrop: false,
        locals: { user: user },
        controller: 'ChangePasswordDialogController',
        controllerAs: 'vm',
        bindToController: true
      });
    }
        
    function refreshSessions() {
      this.sessions = ServerSession.query({
        populate: 'userId',
        query: {
          state: 'open',
          lastRefreshedAt: { "$gte": moment().subtract(5, 'm') }
        }
      });
    }
    
  }

})();