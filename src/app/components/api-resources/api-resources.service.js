(function() {
  'use strict';

  angular
    .module('glass')
    /** @ngInject */
    .factory('User', function($resource) {
       return $resource('/api/v1/users/:id');
    })
    /** @ngInject */
    .factory('Session', function($resource) {
       return $resource('/api/v1/session/:id');
    });
  
})();