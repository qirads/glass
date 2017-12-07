'use strict';

//override node.js core modules (!!!) to allow offline local dns resolution on windows
require('node-offline-localhost').always();

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var env = require('./env');

var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

var opn = require('opn');

var util = require('util');

var proxyMiddleware = require('http-proxy-middleware');

function browserSyncInit(baseDir, browser) {
  browser = browser === undefined ? 'default' : browser;

  var routes = null;
  if(baseDir === conf.paths.src || (util.isArray(baseDir) && baseDir.indexOf(conf.paths.src) !== -1)) {
    routes = {
      '/bower_components': 'bower_components'
    };
  }

  var server = {
    baseDir: baseDir,
    routes: routes
  };

  /*
   * You can add a proxy to your backend by uncommenting the line below.
   * You just have to configure a context which will we redirected and the target url.
   * Example: $http.get('/users') requests will be automatically proxified.
   *
   * For more details and option, https://github.com/chimurai/http-proxy-middleware/blob/v0.9.0/README.md
   */
  // server.middleware = proxyMiddleware('/users', {target: 'http://jsonplaceholder.typicode.com', changeOrigin: true});
  server.middleware = proxyMiddleware(['/api'], {
    target: 'http://' + conf.hostName + ':3000',
    changeOrigin: true
  });

  browserSync.instance = browserSync.init({
    open: false,
    server: server,
    browser: browser,
    ghostMode: false,
    port: 9000,
    ui: false,
    online: false
  }, function() {
    opn('http://' + conf.hostName + ':9000/');
  });
}

gulp.task('dev', env({
  BACKEND_URI: conf.devBackEndURI
}));

browserSync.use(browserSyncSpa({
  selector: '[ng-app]'// Only needed for angular apps
}));

gulp.task('serve', ['dev', 'watch'], function () {
  browserSyncInit([path.join(conf.paths.tmp, '/serve'), conf.paths.src]);
});

gulp.task('serve:dist', ['build'], function () {
  browserSyncInit(conf.paths.dist);
});

gulp.task('serve:e2e', ['dev', 'inject'], function () {
  browserSyncInit([conf.paths.tmp + '/serve', conf.paths.src], []);
});

gulp.task('serve:e2e-dist', ['build'], function () {
  browserSyncInit(conf.paths.dist, []);
});
