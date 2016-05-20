(function() {
  'use strict';

  angular
    .module('glass')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('main', {
        abstract: true,
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .state('main.login', {
        url: 'login',
        template: '<glass-login flex></glass-login>'
      })
      .state('main.admin', {
        url: 'admin',
        templateUrl: 'app/components/admin/admin.html',
        controller: 'AdminController',
        controllerAs: 'admin',
        data: { authenticate: true }
      })
      .state('main.search', {
        url: 'search',
        templateUrl: 'app/components/search/search.html',
        controller: 'SearchController',
        controllerAs: 'search',
        params: {
          criteria: []
        },
        data: { authenticate: true }
      })
      .state('main.history', {
        url: 'history',
        templateUrl: 'app/components/history/history.html',
        controller: 'HistoryController',
        controllerAs: 'history',
        data: { authenticate: true }
      })
      .state('main.about', {
        url: 'about',
        templateUrl: 'app/components/about/about.html',
        controller: 'AboutController',
        controllerAs: 'about',
        data: { authenticate: true }
      });
      
      $urlRouterProvider.when("/", "/search");
  }

})();
