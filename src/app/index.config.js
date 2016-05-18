(function() {
  'use strict';

  angular
    .module('glass')
    .config(config);

  /** @ngInject */
  function config($mdThemingProvider, $logProvider, authProvider) {

    // Set theme
    $mdThemingProvider.theme('default')
      .primaryPalette('blue-grey')
      .accentPalette('deep-orange');
      
    // Enable log
    $logProvider.debugEnabled(true);

    // Pass in routes
    authProvider.entryState('main.search')
      .loginState('main.login');
  }

})();
