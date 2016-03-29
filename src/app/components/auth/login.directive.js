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
      controller: LoginController,
      controllerAs: 'vm'
    };

    return directive;
    
    /** @ngInject */
    function LoginController(auth) {
      var vm = this;
      
      vm.responsePending = false;
      vm.login = login;
      
      function login(credentials) {
        vm.loginResponsePending = true;
        auth.login(credentials).then(function() {
          auth.followRedirect();
        }).catch(function(error) {
          vm.loginResponsePending = false;
          // server error must be cleared after form re-interaction
          // $pristine must be reset after submit so that html can again hide if $pristine later becomes falsy.
          vm.loginForm.$setPristine();
          return updateServerError(error);
        });
      }
      
      function updateServerError(error) {
        vm.serverError = {};
        if (error.data && error.data.name) {
          if (error.data.name == 'UnauthorizedError') {
            vm.serverError.authFailure = true;
            vm.serverErrorMessage = error.data.message;
            if (error.data.message.substr(-1) != '.') { vm.serverErrorMessage +=  '.'; }
            return error;
          }
          if (error.data.name == 'TooManyRequestsError') {
            vm.serverError.tooManyTries = true;
            vm.serverErrorMessage = 'Maybe try again later?';
            return error;
          }
        }
        vm.serverError.serverError = true;
        vm.serverErrorMessage = 'Uh-oh. Something went wrong.';
        return error;        
      }

    }

  }

})();