(function() {
  'use strict';

  angular
    .module('glass')
    .config(config);

  /** @ngInject */
  function config($mdThemingProvider, $logProvider) {
    
    // Set theme
    $mdThemingProvider.theme('default')
      .primaryPalette('blue-grey')
      .accentPalette('deep-orange');
      
    // Enable log
    $logProvider.debugEnabled(true);
    
  }

})();
