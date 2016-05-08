(function() {
  'use strict';

  angular
    .module('glass')
    .controller('AboutController', AboutController);

  /** @ngInject */
  function AboutController(webDevTec) {
    var vm = this;
    vm.awesomeThings = webDevTec.getTec();
  }

})();