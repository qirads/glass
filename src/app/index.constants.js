/* global moment:false */
(function() {
  'use strict';

  angular
    .module('glass')
    .constant('BACKEND_URI', 'https://www.glass.org:9000')
    .constant('moment', moment);

})();
