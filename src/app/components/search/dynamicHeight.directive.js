(function() {
  'use strict';

  angular
    .module('glass')
    .directive('dynamicHeight', dynamicHeight);

  /** @ngInject */
  function dynamicHeight() {
    
    var directive = {
      restrict: 'A',
      require: '^mdVirtualRepeatContainer',
      link: link
    };
        
    function link(scope, element, attributes, mdVirtualRepeatContainer) {
      
      angular.element(element).css('height', element[0].parentNode.clientHeight + 'px');
      scope.$watch(function () {
        return element[0].parentNode.clientHeight;
      }, function(value){
        angular.element(element).css('height', value + 'px');
        mdVirtualRepeatContainer.setSize_(value);
      });
    }
    
    return directive;
    
  }

})();