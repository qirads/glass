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
        template: require('./main.html'),
        controller: 'MainController',
        controllerAs: 'main'
      })
      .state('main.login', {
        url: 'login',
        template: '<glass-login flex></glass-login>'
      })
      .state('main.admin', {
        url: 'admin',
        template: require('../components/admin/admin.html'),
        controller: 'AdminController',
        controllerAs: 'admin',
        data: { authenticate: true }
      })
      .state('main.search', {
        url: 'search',
        template: require('../components/search/search.html'),
        controller: 'SearchController',
        controllerAs: 'search',
        params: {
          criteria: []
        },
        data: { authenticate: true }
      })
      .state('main.history', {
        url: 'history',
        template: require('../components/history/history.html'),
        controller: 'HistoryController',
        controllerAs: 'history',
        data: { authenticate: true }
      })
      .state('main.about', {
        url: 'about',
        template: require('../components/about/about.html'),
        controller: 'AboutController',
        controllerAs: 'about',
        data: { authenticate: true }
      });
      
      $urlRouterProvider.when("/", "/search");
  }

})();
