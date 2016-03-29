(function() {
  'use strict';

  angular
    .module('glass.auth')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {

    $stateProvider
      .state("login", {
        templateUrl: "app/components/auth/login.route.html"
      });
      
  }

})();
