(function() {
  'use strict';

  angular
    .module('glass.api')
    /** @ngInject */
    .factory('ServerUser', function($resource, backendURI) {
       return $resource(backendURI + '/api/v1/users/:id', null, {
         'update': { method: 'PATCH' }
        });
    })
    /** @ngInject */
    .factory('ServerSession', function($resource, backendURI) {
       return $resource(backendURI + '/api/v1/sessions/:id', null, {
         'update': { method: 'PATCH' }
        });
    });
  
})();