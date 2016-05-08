(function() {
  'use strict';

  angular
    .module('glass')
    .directive('dynamicHeight', dynamicHeight);

  /** @ngInject */
  function dynamicHeight() {
    
    var directive = {
      restrict: 'A',
      link: link
    };
    
    function link(scope, element) {
      angular.element(element).css('height', element[0].parentNode.offsetHeight + 'px');
    }
    
    return directive;
    
  }

})();