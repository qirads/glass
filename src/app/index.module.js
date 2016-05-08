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
      'dibari.angular-ellipsis',
      'glass.auth',
      'glass.api'
    ]);

})();
