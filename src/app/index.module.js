(function() {
  'use strict';

  angular
    .module('glass', [
      'ngAnimate',
      'ngCookies',
      'ngSanitize',
      'ngMessages',
      'ngResource',
      'ngAria',
      'ngMaterial',
      'ui.router',
      'validation.match',
      'glass.auth',
      'glass.api'
    ]);

})();
