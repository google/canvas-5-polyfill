// Copyright 2014 Google Inc. All rights reserved.
//
// Use of this source code is governed by a BSD-style
//  license that can be found in the LICENSE file.
//
// Karma configuration
// Generated on Fri Feb 07 2014 13:53:56 GMT-0500 (EST)

var browsers;
var os = require('os').type();
if (os === 'Darwin') {
  browsers = ['Chrome', 'ChromeCanaryExperimental', 'Firefox', 'Safari'];
} else if (os === 'Windows_NT') {
  browsers = ['Chrome', 'Firefox', 'IE'];
} else {
  browsers = ['Firefox', 'Chrome'];
}

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['mocha', 'chai'],


    // list of files / patterns to load in the browser
    files: [
      {pattern: 'canvas.js', included: true},

      {pattern: 'svgpath.js', included: true},

      'test/*.js',

    ],


    // list of files to exclude
    exclude: [
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['dots'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: false,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: browsers,


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
