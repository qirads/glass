(function() {
  'use strict';

  angular
    .module('glass')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {
    
    $log.debug('runBlock end');
    
  }

})();
