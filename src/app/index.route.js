(function() {
  'use strict';

  angular
    .module('glass')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main',
        data: { authenticate: true }
      })
      .state('main.login', {
        template: '<glass-login flex></glass-login>'
      })
      .state('main.admin', {
        templateUrl: 'app/components/admin/admin.html',
        controller: 'AdminController',
        controllerAs: 'admin',
        data: { authenticate: true }
      });

    $urlRouterProvider.otherwise('/');
  }

})();
