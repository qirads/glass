(function() {
  'use strict';

  describe('controllers', function(){
    var vm;

    beforeEach(angular.mocks.module('glass'));
    beforeEach(angular.mocks.inject(function(_$controller_) {
      vm = _$controller_('MainController');
    }));

    it('should exist', function() {
      expect(vm).toBeDefined();
    });

    xit('should have a timestamp creation date', function() {
      expect(vm.creationDate).toEqual(jasmine.any(Number));
    });

  });
})();
