(function() {
  'use strict';

  angular
    .module('glass')
    .controller('AdminController', AdminController);

  /** @ngInject */
  function AdminController(ServerUser, ServerSession) {
    var vm = this;
    vm.users = ServerUser.query();
    vm.sessions = ServerSession.query();
  }

})();