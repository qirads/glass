(function() {
  'use strict';

  angular
    .module('glass.auth')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope, $state, $timeout, auth, BACKEND_URI, Idle) {
    Idle.watch();  
  }

})();
