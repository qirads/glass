/* global moment:false */
(function() {
  'use strict';

  angular
    .module('glass')
    .constant('backendURI', 'https://www.glass.org:9000')
    .constant('moment', moment);

})();
