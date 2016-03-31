(function() {
  'use strict';

  angular
    .module('glass.auth')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope, $state, $timeout, Idle, auth) {

    $rootScope.$on('$stateChangeStart', onStateChangeStart);
    $rootScope.$on('storedObject:session:externalChange', onSessionChange);
    $rootScope.$on('Keepalive', onKeepalive);
    $rootScope.$on('IdleStart', onIdleStart);
    
    Idle.watch();

    function onStateChangeStart(event, toState, toParams) {
      if (toState.name === 'home.login' && auth.isLoggedIn()) {
        event.preventDefault();
        auth.followRedirect();
      }
      if (toState.data && toState.data.authenticate && !auth.isLoggedIn()) {
        if (toState.name != 'home.login') {
          event.preventDefault();
          auth.registerRedirect(toState, toParams);
          $state.transitionTo('home.login');
        }
      }
    }
        
    function onSessionChange() {
      $timeout(function() {
        $state.reload();
      });
    }
    
    function onKeepalive() {
      if (auth.isLoggedIn()) {
        auth.refresh();
      }
    }
    
    function onIdleStart() {
      if (auth.isLoggedIn()) {
        auth.logout('timeout');
      }
    }

  }

})();
