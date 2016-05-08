(function() {
  'use strict';

  angular
    .module('glass')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($state, auth) {
    var vm = this;
    //vm.creationDate = 1449374294108;
    vm.logout = auth.logout;
    vm.isLoggedIn = auth.isLoggedIn;
    vm.loggedInUserName = auth.loggedInUserName;
    vm.hasAdminPrivileges = auth.hasAdminPrivileges;
    vm.showAdmin = showAdmin;
    vm.showSearch = showSearch;
    vm.showAbout = showAbout;

    function showAdmin() {
      $state.transitionTo('main.admin');
    }
    function showSearch() {
      $state.transitionTo('main.search');
    }
    function showAbout() {
      $state.transitionTo('main.about');
    }

  }
    
})();