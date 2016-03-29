'use strict';

var dns = require('dns');

var utils = {
  offline: offline
};

function offline() {
  if (process.platform === 'win32') {
    if (!dns.lookupWithAddrConfigSupport) {
      dns.lookupWithAddrConfigSupport = dns.lookup;
      dns.lookup = lookupWithoutAddrConfigSupport;
    }
  }  
}

function lookupWithoutAddrConfigSupport(hostname, options, callback) {
  if (typeof options !== 'function' && options !== null && options.hints & dns.ADDRCONFIG) {
    options.hints &= ~dns.ADDRCONFIG;
  } 
  return dns.lookupWithAddrConfigSupport(hostname, options, callback);
}

module.exports = utils;