(function() {
  'use strict';

  angular
    .module('glass')
    .controller('AddDateTimeCriterionDialogController', AddDateTimeCriterionDialogController);

  /** @ngInject */
  function AddDateTimeCriterionDialogController($mdDialog, moment) {
    var vm = this;
    vm.cancel = cancel;
    vm.submit = submit;
    
    vm.title = vm.object === 'study' ? 'Set Study Timing' : 'Set Report Timing';
    
    if (vm.method === 'within' || vm.method === 'within:last') {
      vm.unitOptions = ['years', 'months', 'weeks', 'days', 'minutes', 'hours'];
      vm.withinAmount = 3;
      vm.withinUnits = 'days';
    }

    vm.date = moment().toDate();
    if (vm.method === 'between') {
      vm.additionalDate = moment().toDate();
    }
        
    function cancel() {
      $mdDialog.cancel();
    }
    
    function submit() {
      var chip = '';
      if (vm.object === 'report') { chip += 'reported-'; }
      switch (vm.method) {
        case 'on':
          chip += 'on:';
          chip += moment(vm.date).format('MM/DD/YYYY');
          break;
        case 'within:last':
          chip += 'within:last:';
          chip += vm.withinAmount + ' ' + vm.withinUnits;
          break;
        case 'within':
          chip += 'within:';
          chip += vm.withinAmount + ' ' + vm.withinUnits + ':of:' + moment(vm.date).format('MM/DD/YYYY');
          if (vm.time) { chip += ' ' + moment(vm.time).format('HH:MM'); }
          break;
        case 'before':
          chip += 'before:';
          chip += moment(vm.date).format('MM/DD/YYYY');
          if (vm.time) { chip += ' ' + moment(vm.time).format('HH:MM'); }
          break;
        case 'after':
          chip += 'after:';
          chip += moment(vm.date).format('MM/DD/YYYY');
          if (vm.time) { chip += ' ' + moment(vm.time).format('HH:MM'); }
          break;
        case 'between':
          chip += 'between:';
          chip += moment(vm.date).format('MM/DD/YYYY');
          if (vm.time) { chip += ' ' + moment(vm.time).format('HH:MM'); }
          chip += ':and:';
          chip += moment(vm.additionalDate).format('MM/DD/YYYY');
          if (vm.time) { chip += ' ' + moment(vm.additionalTime).format('HH:MM'); }
          break;
      }
      $mdDialog.hide(chip);
    }
        
  }

})();