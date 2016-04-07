(function() {
  'use strict';

  angular
    .module('glass.auth')
    .provider('auth', authProvider);

  function authProvider() {
    
    var _redirectToState = null;
    var _redirectToParams = null;

    var _loginState = null;
    var _entryState = null;

    this.loginState = function(value) { _loginState = value; return this; };
    this.entryState = function(value) { _entryState = value; return this; };

    /** @ngInject */
    this.$get = function($rootScope, $http, $state, $timeout, $mdDialog, $log, backendURI, session) {
      
      $rootScope.$on('$stateChangeStart', onStateChangeStart);
      $rootScope.$on('storedObject:session:externalChange', onSessionChange);
      $rootScope.$on('Keepalive', onKeepalive);
      $rootScope.$on('IdleStart', onIdleStart);
      
      return {
        login: login,
        addAuthHeader: addAuthHeader,
        isLoggedIn: isLoggedIn,
        isAdmin: isAdmin,
        logout: logout,
        reset: reset
      };
      
      function login(credentials) {
        return $http.post(backendURI + '/login', { credentials: credentials }).then(function(result) {
          session.token = result.data.token;
          session.user = result.data.user;
          session.$create('sessionStorageWithMultiTabSupport');
          followRedirect();
        });
      }
      
      function addAuthHeader(config) {
        config.headers['Authorization'] = 'Bearer ' + session.token;
        return config;
      }
      
      function isLoggedIn() {
        return !!session.token;
      }
      
      function isAdmin() {
        return session.user && session.user.isAdmin;
      }
          
      function refresh() {
        return $http.post(backendURI + '/refresh').then(function(result) {
          session.token = result.data.token;
          session.$update();
        });
      }
          
      function logout(type) {
        return $http.post(backendURI + '/logout', { type: (type) ? type : 'logout' }).then(reset);
      }

      function reset() {
        session.$delete();
        $state.transitionTo(_loginState);
      }
                
      function registerRedirect(toState, toParams) {
        _redirectToState = toState;
        _redirectToParams = toParams;
      }
      
      function followRedirect() {
        if (_redirectToState) {
          $state.transitionTo(_redirectToState, _redirectToParams);
          _redirectToState = _redirectToParams = null;
        } else {
          $state.transitionTo(_entryState);
        }      
      }
      
      function onStateChangeStart(event, toState, toParams) {
        if (toState.name === _loginState && isLoggedIn()) {
          event.preventDefault();
          followRedirect();
        }
        if (toState.name != _loginState && toState.data && toState.data.authenticate && !isLoggedIn()) {
          event.preventDefault();
          registerRedirect(toState, toParams);
          $state.transitionTo(_loginState);
        }
      }
      
      function onSessionChange() {
        $timeout(function() {
          $state.reload();
        });
      }
            
      function onKeepalive() {
        if (isLoggedIn()) {
          refresh();
        }
      }
      
      function onIdleStart() {
        if (isLoggedIn()) {
          logout('timeout');
        }
      }
                  
    };
    
  }
  
})();