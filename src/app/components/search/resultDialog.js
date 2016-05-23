(function() {
  'use strict';

  angular
    .module('glass')
    .controller('ResultDialogController', ResultDialogController);

  /** @ngInject */
  function ResultDialogController($mdDialog, moment) {
    var vm = this;
    vm.cancel = cancel;
    vm.prettify = prettify;

    vm.options = {
      attrs: {
        insert: { class: 'insertion' },
        delete: { class: 'deletion' }        
      }
    };

    vm.title = vm.result.description + ' from ' + vm.result.institution;
    vm.title += ', unit ' + vm.result.unit + ' (performed ' + prettify(vm.result.timestamp) + ')';
    
    function cancel() {
      $mdDialog.hide();
    }
    
    function prettify(timestamp) {
      return moment(timestamp).format('M/D/YYYY, HH:mm');
    }
    
  }

})();