(function() {
  'use strict';

  angular
    .module('glass')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main',
        data: {
          authenticate: true
        }
      })      
      .state('home.login', {
        template: '<glass-login flex></glass-login>'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
