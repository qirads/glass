(function() {
  'use strict';

  angular
    .module('glass')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
  }

})();
