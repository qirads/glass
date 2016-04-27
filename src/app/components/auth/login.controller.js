(function() {
  'use strict';

  angular
    .module('glass.auth')
    .controller('GlassLoginController', GlassLoginController);

  /** @ngInject */
  function GlassLoginController(auth) {

    var self = this;    
    this.responsePending = false;
    this.login = login;
    
    function login() {
      this.loginResponsePending = true;
      auth.login(self.credentials).catch(function(error) {
        self.loginResponsePending = false;
        // $pristine is reset so that server error can be cleared after form entered.
        self.loginForm.$setPristine();
        self.serverError = getPrettyServerError(error);
        return error;
      });
    }
    
    function getPrettyServerError(error) {
      var serverError = {};
      if (!error.data) {
        serverError.serverError = true;
        serverErrorMessage = 'Uh-oh. Something went wrong.';
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