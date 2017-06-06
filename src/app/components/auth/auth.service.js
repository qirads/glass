(function() {
  'use strict';

  angular
    .module('glass.auth')
    .provider('auth', authProvider);

  function authProvider() {

    var _redirectToState = null;    
    var _loginState = null;
    var _entryState = null;

    this.loginState = function(value) { _loginState = value; return this; };
    this.entryState = function(value) { _entryState = value; return this; };

    /** @ngInject */
    this.$get = function($transitions, $state, $rootScope, $mdDialog, ServerSession, ServerUser, session) {
            
      return {
        init: init,
        login: login,
        addAuthHeader: addAuthHeader,
        changePassword: changePassword,
        isLoggedIn: isLoggedIn,
        loggedInUserName: loggedInUserName,
        loggedInUserId: loggedInUserId,
        hasAdminPrivileges: hasAdminPrivileges,
        logout: logout,
        reset: reset
      };
      
      function init() {
        $transitions.onFinish({ to: _loginState }, startUpIfLoggedIn);
        $transitions.onFinish({ to: requiresAuth }, redirectIfNotLoggedIn);
        /* eslint-disable angular/on-watch */
        $rootScope.$on('storedObject:session:externalChange', onSessionChange);
        $rootScope.$on('Keepalive', onKeepalive);
        $rootScope.$on('IdleStart', onIdleStart);
        /* eslint-enable angular/on-watch */
      }

      function startUpIfLoggedIn() {
        if (isLoggedIn()) {
          return startUp();
        }
      }

      function startUp() {
        if (_redirectToState) {
          var toState = _redirectToState
          _redirectToState = null;
          return $state.go(toState);
        } else {
          return $state.go(_entryState);
        }
      }

      function requiresAuth(state) {
        return state.data && state.data.authenticate;
      }

      function redirectIfNotLoggedIn(transition) {
        if (!isLoggedIn()) {
          _redirectToState = transition.$to();
          return $state.go(_loginState);
        }
      }

      function login(credentials) {
        return ServerSession.save({ credentials: credentials }).$promise.then(function(serverSession) {
          angular.extend(session, serverSession);
          session.$create('sessionStorageWithMultiTabSupport');
          ServerUser.get({ id: session.userId}).$promise.then(function(serverUser) {
            session.user = serverUser;
            session.$update();
            startUp();
          });
        });
      }

      function changePassword(userId, newPassword) {
        return ServerUser.update({ id: userId }, { password: newPassword }).$promise.then(function(serverUser) {
          if (userId === session.user.id) {
            session.token = serverUser.token;
            session.$update();            
          }
        });
      }
      
      function addAuthHeader(config) {
        config.headers['Authorization'] = 'Bearer ' + session.token;
        return config;
      }
      
      function isLoggedIn() {
        return !!session.token;
      }
      
      function hasLoggedInUser() {
        return !!session.user;
      }

      function loggedInUserName() {
        return hasLoggedInUser() ? session.user.userName : '';
      }

      function loggedInUserId() {
        return hasLoggedInUser() ? session.user.id : '';
      }
      
      function hasAdminPrivileges() {
        return isLoggedIn() ? session.hasAdminPrivileges : false;
      }
          
      function refresh() {
        return ServerSession.update({ id: session.id }, { state: 'open' }).$promise.then(function(serverSession) {
          session.token = serverSession.token;
          session.$update();
        });
      }
      
      function logout() {
        return ServerSession.update({ id: session.id }, { state: 'user-logged-out' }).$promise.then(reset);
      }

      function timeout() {
        return ServerSession.update({ id: session.id }, { state: 'user-timed-out' }).$promise.then(reset);
      }

      function reset() {
        session.$delete();
        $mdDialog.cancel();
        $state.go(_loginState);
      }
            
      function onSessionChange() {
        if ($state.current.name === _loginState && isLoggedIn()) {
          startUp();
        }
        if (requiresAuth($state.current) && !isLoggedIn()) {
          $state.go(_loginState);
        }
      }
            
      function onKeepalive() {
        if (isLoggedIn()) {
          refresh();
        }
      }
      
      function onIdleStart() {
        if (isLoggedIn()) {
          timeout();
        }
      }
      
    };
    
  }
  
})();