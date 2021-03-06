(function() {
  'use strict';

  angular
    .module('glass.auth')
    .factory('authInterceptor', authInterceptor);

  /** @ngInject */
  function authInterceptor($injector, $q, BACKEND_URI) {

    var auth;
    
    return {
      request: request,
      responseError: responseError
    };
    
    function request(config) {
      auth = auth || $injector.get('auth');
      if (config.url.substr(0, BACKEND_URI.length) === BACKEND_URI && auth.isLoggedIn()) {
        config = auth.addAuthHeader(config);
      }
      return config;
    }
    
    function responseError(rejection) {
      auth = auth || $injector.get('auth');
      if (
        rejection.status === 401 &&
        rejection.config.url.substr(0, BACKEND_URI.length) === BACKEND_URI &&
        (rejection.config.url.substr(BACKEND_URI.length, '/sessions'.length) !== '/sessions' ||
         rejection.config.method !== 'POST')
      ) {
        auth.reset();
      }
      return $q.reject(rejection);
    }
        
  }
  
})();