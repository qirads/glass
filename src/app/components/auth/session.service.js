(function() {
  'use strict';

  angular
    .module('glass.auth')
    .factory('session', session);

  /** @ngInject */
  function session(ycr$StoredObject) {
    return new ycr$StoredObject('session');
  }
  
})();