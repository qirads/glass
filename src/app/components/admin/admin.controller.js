(function() {
  'use strict';

  angular
    .module('glass')
    .controller('AdminController', AdminController);

  /** @ngInject */
  function AdminController(User, Session) {
    var vm = this;
    vm.users = User.query();
    vm.sessions = Session.query();
  }

})();