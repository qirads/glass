(function() {
  'use strict';

  angular
    .module('glass')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($state, auth) {
    //this.creationDate = 1449374294108;
    this.logout = auth.logout;
    this.isLoggedIn = auth.isLoggedIn;
    this.hasAdminPrivileges = auth.hasAdminPrivileges;
    this.showAdmin = showAdmin;

    function showAdmin() {
      $state.transitionTo('main.admin');      
    }

  }
    
})();