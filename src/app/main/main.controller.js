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
    this.loggedInUserName = auth.loggedInUserName;
    this.hasAdminPrivileges = auth.hasAdminPrivileges;
    this.showAdmin = showAdmin;
    this.showSearch = showSearch;

    function showAdmin() {
      $state.transitionTo('main.admin');      
    }
    function showSearch() {
      $state.transitionTo('main.search');      
    }

  }
    
})();