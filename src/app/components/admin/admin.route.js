(function() {
  'use strict';

  angular
    .module('glass')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {

    $stateProvider
      .state("admin", {
        templateUrl: "app/components/admin/admin.route.html"
      });
      
  }

})();
