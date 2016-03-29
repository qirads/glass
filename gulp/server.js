'use strict';

//override node.js core modules (!!!) to allow offline local dns resolution on windows
if (process.env.NODE_ENV === 'development') { require('./utils').offline(); }

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

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
  require('ssl-root-cas/latest')
    .inject()
    .addFile(path.join(__dirname, '..', conf.certFilePaths.rootCertificate));
        
  server.middleware = proxyMiddleware(['/api', '/login', '/logout', '/refresh'], {
    target: 'https://' + conf.hostName + ':3000',
    changeOrigin: true,
    agent: require('https').globalAgent
  });

  browserSync.instance = browserSync.init({
    open: false,
    server: server,
    browser: browser,
    https: {
      key: conf.certFilePaths.privateKey,
      cert: conf.certFilePaths.certificate
    },
    ghostMode: false,
    port: 9000,
    ui: false,
    online: false
  }, function() {
    opn('https://' + conf.hostName + ':9000/');
  });
}

browserSync.use(browserSyncSpa({
  selector: '[ng-app]'// Only needed for angular apps
}));

gulp.task('serve', ['watch'], function () {
  browserSyncInit([path.join(conf.paths.tmp, '/serve'), conf.paths.src]);
});

gulp.task('serve:dist', ['build'], function () {
  browserSyncInit(conf.paths.dist);
});

gulp.task('serve:e2e', ['inject'], function () {
  browserSyncInit([conf.paths.tmp + '/serve', conf.paths.src], []);
});

gulp.task('serve:e2e-dist', ['build'], function () {
  browserSyncInit(conf.paths.dist, []);
});
