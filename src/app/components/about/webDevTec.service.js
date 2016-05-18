(function() {
  'use strict';

  angular
      .module('glass')
      .service('webDevTec', webDevTec);

  /** @ngInject */
  function webDevTec() {
    var data = [{
      title: 'AngularJS',
      url: 'https://angularjs.org/',
      description: 'HTML enhanced for web apps!',
      logo: 'angular.png'
    }, {
      title: 'BrowserSync',
      url: 'http://browsersync.io/',
      description: 'Time-saving synchronised browser testing.',
      logo: 'browsersync.png'
    }, {
      title: 'GulpJS',
      url: 'http://gulpjs.com/',
      description: 'The streaming build system.',
      logo: 'gulp.png'
    }, {
      title: 'Jasmine',
      url: 'http://jasmine.github.io/',
      description: 'Behavior-Driven JavaScript.',
      logo: 'jasmine.png'
    }, {
      title: 'Karma',
      url: 'http://karma-runner.github.io/',
      description: 'Spectacular Test Runner for JavaScript.',
      logo: 'karma.png'
    }, {
      title: 'Protractor',
      url: 'https://github.com/angular/protractor',
      description: 'End to end test framework for AngularJS applications built on top of WebDriverJS.',
      logo: 'protractor.png'
    }, {
      title: 'Angular Material',
      url: 'https://material.angularjs.org/#/',
      description: 'Angular reference implementation of Google\'s Material Design.',
      logo: 'angular-material.png'
    }, {
      title: 'MongoDB',
      url: 'https://www.mongodb.org',
      description: 'The Database for Giant Ideas.',
      logo: 'mongodb.png'
    }, {
      title: 'Redis',
      url: 'http://redis.io',
      description: 'An open source, in-memory data structure store.',
      logo: 'redis.png'
    }, {
      title: 'ExpressJS',
      url: 'http://expressjs.com',
      description: 'Fast, unopinionated, minimalist web framework for Node.js.',
      logo: 'express.png'
    }, {
      title: 'Node.js',
      url: 'https://nodejs.org',
      description: 'JavaScript runtime built on Chrome\'s V8 JavaScript engine.',
      logo: 'nodejs.png'
    }, {
      title: 'elasticsearch',
      url: 'https://www.elastic.co',
      description: 'Highly scalable open-source full-text search and analytics engine.',
      logo: 'elastic.png'
    }];

    this.getTec = getTec;

    function getTec() {
      return data;
    }
  }

})();
