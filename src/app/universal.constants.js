import angular from 'angular';
import moment from 'moment';

const universal = angular.module('glass.universal', []);

universal
  .constant('moment', moment)
  .constant('BACKEND_URI', webpackBackendUri);

export default universal;