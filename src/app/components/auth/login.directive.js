(function() {
  'use strict';

  angular
    .module('glass')
    .directive('glassLogin', glassLogin);

  /** @ngInject */
  function glassLogin() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/auth/login.template.html',
      controller: GlassLoginController,
      controllerAs: 'vm',
    };

    return directive;
    
    /** @ngInject */
    function GlassLoginController($log, auth) {
      var self = this;
      
      this.responsePending = false;
      this.login = login;
      
      function login(credentials) {
        self.loginResponsePending = true;
        auth.login(credentials).catch(function(error) {
          self.loginResponsePending = false;
          // $pristine is reset so that server error can be cleared after form entered.
          self.loginForm.$setPristine();
          return updateServerError(error);
        });
      }
      
      function updateServerError(error) {
        self.serverError = {};
        if (error.data && error.data.name) {
          if (error.data.name == 'UnauthorizedError') {
            self.serverError.authFailure = true;
            self.serverErrorMessage = error.data.message;
            if (error.data.message.substr(-1) != '.') { self.serverErrorMessage +=  '.'; }
            return error;
          }
          if (error.data.name == 'TooManyRequestsError') {
            self.serverError.tooManyTries = true;
            self.serverErrorMessage = 'Maybe try again later?';
            return error;
          }
        }
        self.serverError.serverError = true;
        self.serverErrorMessage = 'Uh-oh. Something went wrong.';
        return error;        
      }

    }

  }

})();