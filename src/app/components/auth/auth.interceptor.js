(function() {
  'use strict';

  angular
    .module('glass.auth')
    .factory('authInterceptor', authInterceptor);

  /** @ngInject */
  function authInterceptor(backendURI, session) {
    return {
      request: request
    };
    
    function request(config) {
      if (config.url.substring(0, backendURI.length) == backendURI && session.token ) {
        config.headers.Authorization = 'Bearer ' + session.token;
      }
      return config;
    }
    
  }
  
})();