(function() {
  'use strict';

  angular
    .module('glass.auth')
    .config(config);

  /** @ngInject */
  function config($httpProvider, TitleProvider, IdleProvider, KeepaliveProvider) {

    // Add interceptor
    $httpProvider.interceptors.push('authInterceptor');
              
    // configure Idle settings
    IdleProvider.idle(10 * 60); // in seconds
    IdleProvider.timeout(0); // in seconds
    KeepaliveProvider.interval(1 * 60); // in seconds
    TitleProvider.enabled(false); // enabled by default
    
  }

})();
