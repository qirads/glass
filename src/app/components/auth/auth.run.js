(function() {
  'use strict';

  angular
    .module('glass.auth')
    .run(runBlock);

  /** @ngInject */
  function runBlock(auth, Idle) {
    auth.init();
    Idle.watch();    
  }

})();
