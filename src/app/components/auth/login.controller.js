(function() {
  'use strict';

  angular
    .module('glass.auth')
    .controller('GlassLoginController', GlassLoginController);

  /** @ngInject */
  function GlassLoginController(auth) {
    var vm = this;
    vm.responsePending = false;
    vm.login = login;
    
    function login() {
      vm.loginResponsePending = true;
      auth.login(vm.credentials).catch(function(error) {
        vm.loginResponsePending = false;
        // $pristine is reset so that server error can be cleared after form entered.
        vm.loginForm.$setPristine();
        vm.serverError = getPrettyServerError(error);
        return error;
      });
    }
    
    function getPrettyServerError(error) {
      var serverError = {};
      if (!error.data) {
        serverError.serverError = true;
        serverError.message = 'Uh-oh. Something went wrong.';
        return serverError;
      }
      if (error.data.name === 'UnauthorizedError') {
        serverError.authFailure = true;
        serverError.message = error.data.message;
        if (serverError.message.substr(-1) != '.') { serverError.message +=  '.'; }
        return serverError;
      }
      if (error.data.name === 'TooManyRequestsError') {
        serverError.tooManyTries = true;
        serverError.message = 'Maybe try again later?';
        return serverError;
      }
      serverError.serverError = true;
      serverError.message = 'The unexpected happened.';
      return serverError;
    }

  }

})();