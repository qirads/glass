(function() {
  'use strict';

  angular
    .module('glass')
    .controller('MainController', MainController)

  /** @ngInject */
  function MainController(auth) {
    //this.creationDate = 1449374294108;
    this.logout = auth.logout;
  }
  
})();