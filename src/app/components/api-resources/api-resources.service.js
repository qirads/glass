(function() {
  'use strict';

  angular
    .module('glass')
    /** @ngInject */
    .factory('User', function($resource, backendURI) {
       return $resource(backendURI + '/api/v1/users/:id');
    })
    /** @ngInject */
    .factory('Session', function($resource, backendURI) {
       return $resource(backendURI + '/api/v1/sessions/:id');
    });
  
})();