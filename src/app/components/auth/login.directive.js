(function() {
  'use strict';

  angular
    .module('glass.auth')
    .directive('glassLogin', glassLogin);

  /** @ngInject */
  function glassLogin() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/auth/login.template.html',
      controller: 'GlassLoginController',
      controllerAs: 'vm',
    };

    return directive;    

  }

})();