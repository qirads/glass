(function() {
  'use strict';

  angular
    .module('glass.api')
    /** @ngInject */
    .factory('ServerUser', function($resource, BACKEND_URI) {
       return $resource(BACKEND_URI + '/api/v1/users/:id', null, {
         'update': { method: 'PATCH' }
        });
    })
    /** @ngInject */
    .factory('ServerSession', function($resource, BACKEND_URI) {
       return $resource(BACKEND_URI + '/api/v1/sessions/:id', null, {
         'update': { method: 'PATCH' }
        });
    })
    .factory('ServerSearch', function($resource, BACKEND_URI) {
       return $resource(BACKEND_URI + '/api/v1/searches/:id');
    })
    .factory('ServerStudy', function($resource, BACKEND_URI) {
       return $resource(BACKEND_URI + '/api/v1/studies/:id');
    });
  
})();