var gulp = require('gulp');
var gulpNgConf = require('gulp-ng-config')
var conf = require('./conf');
var b2v = require('buffer-to-vinyl');
var path = require('path');

module.exports = function(env) {
  return function() {
    return b2v.stream(new Buffer(JSON.stringify(env)), 'env.config.js')
    .pipe(gulpNgConf('glass.env', {
      wrap: true,
      pretty: true
    }))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));  
  };
};