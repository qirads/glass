(function() {
  'use strict';

  angular
    .module('glass.auth')
    .factory('authInterceptor', authInterceptor);

  /** @ngInject */
  function authInterceptor($injector, $q, backendURI) {

    var auth;
    
    return {
      request: request,
      responseError: responseError
    };
    
    function request(config) {
      auth = auth || $injector.get('auth');
      if (config.url.substr(0, backendURI.length) === backendURI && auth.isLoggedIn()) {
        config = auth.addAuthHeader(config);
      }
      return config;
    }

    function responseError(rejection) {
      auth = auth || $injector.get('auth');
      if (
        rejection.config.url.substr(0, backendURI.length) === backendURI &&
        rejection.status === 401 &&
        rejection.config.url.substr(backendURI.length + 1, '/login'.length) != 'login'
      ) {
        auth.reset();
      }
      return $q.reject(rejection);
    }
        
  }
  
})();