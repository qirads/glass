(function() {
  'use strict';

  angular
    .module('glass.auth')
    .factory('auth', auth);

  /** @ngInject */
  function auth($http, $state, backendURI, session) {
    
    var _redirectToState = null;
    var _redirectToParams = null;
    
    return {
      login: login,
      refresh: refresh,
      isLoggedIn: isLoggedIn,
      logout: logout,
      registerRedirect: registerRedirect,
      followRedirect: followRedirect
    };  
    
    function login(credentials) {
      return $http.post(backendURI + '/login', { credentials: credentials }).then(function(result) {
        session.token = result.data.token;
        session.loggedInUser = result.data.user;
        session.$create('sessionStorageWithMultiTabSupport');
      });
    }
    
    function isLoggedIn() {
      return !!session.token;
    }
    
    function refresh() {
      return $http.post(backendURI + '/refresh').then(function(result) {
        session.token = result.data.token;
        session.$update();
      });
    }
        
    function logout(type) {
      return $http.post(backendURI + '/logout', { type: (type) ? type : 'logout' }).then(function() {
        session.$delete();
        $state.transitionTo('login');
      });
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
        $state.transitionTo('home');
      }      
    }
         
  }
  
})();