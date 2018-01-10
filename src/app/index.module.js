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
      'mdPickers',
      'validation.match',
      'dibari.angular-ellipsis',
      'diff-match-patch',
      'glass.universal',
      'glass.auth',
      'glass.api'
    ]);

})();
