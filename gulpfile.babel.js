/**
 * Created by Yangwook Ryoo on 1/28/16.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
'use strict';

import gulp from 'gulp';
import browserify from 'browserify';
import babelify from 'babelify';
import watchify from 'watchify';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import assign from 'lodash.assign';
import babel from 'gulp-babel';
import source from 'vinyl-source-stream';
import del from 'del';
import nodemon from 'gulp-nodemon';
import eslint from 'gulp-eslint';
import gutil from 'gulp-util';
import buffer from 'vinyl-buffer';
import mocha from 'gulp-mocha';
import istanbul from 'gulp-istanbul';
import path from 'path';
import * as config from './tools/config.js';
const isparta = require('isparta');

/* clean dist/public directory before start */
gulp.task('clean', () => {
  return del(['dist/public/*', 'dist/server.js.map', '!dist/public/*.js']);
});

/* copy static files and server.js */
gulp.task('copy', ['clean'], () => {
  return gulp.src('src/public/*')
    .pipe(gulp.dest('dist/public/'));
});

//TODO minify CSS and img

/* lint js/jsx files */
gulp.task('lint', () => {
  return gulp.src(['src/**/*.jsx'],['src/**/*.js'])
    .pipe(eslint(config.lintConfig))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
  //TODO need to customize rules and scope
});

//bundle functions
function bundleApp(bundler) {
  return bundler.transform('babelify', {presets: ['es2015', 'react']}) //es6
    .bundle()   //bundle
    .on('error', gutil.log.bind(gutil, 'Browserify Error')) //error logging
    .pipe(source('app.js'))  //name
    .pipe(buffer())             //buffer
    .pipe(gulp.dest('dist/public'))   //destination
    .pipe(rename('app.min.js'))
    .pipe(sourcemaps.init({ loadMaps: true }))
    // capture sourcemaps from transforms
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/public'));
}

function bundleServer(bundler) {
  return bundler.transform('babelify', {presets: ['es2015']}) //es6
    .bundle()   //bundle
    .on('error', gutil.log.bind(gutil, 'Browserify Error')) //error logging
    .pipe(source('server.js'))  //name
    .pipe(buffer())             //buffer
    .pipe(gulp.dest('dist'))   //destination
    .pipe(sourcemaps.init({ loadMaps: true }))
    // capture sourcemaps from transforms
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
}


/* bundle client js files */
gulp.task('bundleApp', ['lint'], () => {
  return bundleApp(browserify(config.browserifyAppConfig)); //configure watchify and browserify
  //TODO if env is staging, debug on
});

/* bundle server.js files */
gulp.task('bundleServer', ['lint'], () => {
  return bundleServer(browserify(config.browserifyServerConfig));    //configure watchify and browserify
});

//configure watchify and browserify
let bApp = watchify(browserify(assign({ debug:true }, watchify.args, config.browserifyAppConfig)));
let bServer = watchify(browserify(assign({ debug:true }, watchify.args, config.browserifyServerConfig)));

/* bundle and watch client js files */
gulp.task('watchifyApp', ['lint'], () => {
  return bundleApp(bApp);
});
gulp.task('watchifyServer', ['lint'], () => {
  return bundleServer(bServer);
});

bApp.on('log', gutil.log); // output build logs to terminal
bApp.on('update', () => {
  bundleApp(bApp);
}); // on any dep update, runs the bundler
bServer.on('log', gutil.log); // output build logs to terminal
bServer.on('update', () => {
  bundleServer(bServer);
}); // on any dep update, runs the bundler

/* watch change of source except client js/jsx files */
gulp.task('watch', ['watchifyServer', 'watchifyApp'], () => {
  gulp.watch(['src/public/*'], ['copy']);       //public file change -> rerun copy
});


/* remove all unit test report files */
gulp.task('clean-coverage', function(cb) {
  return del('dist/coverage', cb);
});

/* prepare unit test */
gulp.task('istanbul', ['clean-coverage'], cb => {
  gulp.src(['./tools/test/Rectangle.js'])
    .pipe(istanbul({
      instrumenter: isparta.Instrumenter,
      includeUntested: true,
      babel: {
        presets: ["es2015"]
      }
    }))
    .pipe(istanbul.hookRequire())
    .on('finish', cb);
});

/* unit test and generate report to dist/coverage */
gulp.task('test', ['istanbul'], () => {
  return gulp.src('tools/test/test.js')
    .pipe(mocha({
      reporter: 'spec'
    }))
    .pipe(istanbul.writeReports({
      dir: 'dist/coverage',
      reportOpts: {dir: 'dist/coverage'},
      reporters: ['text', 'text-summary', 'html']
    })); //report is in dist/coverage
  //TODO make unit test for every case.
});

/* bundle/build for deploy */
gulp.task('start',['bundleApp', 'bundleServer', 'copy', 'test'], () => {
  return console.log("bundle/transpile done");
});

/* run application in localhost by default */
gulp.task('default',['watch', 'copy', 'test'], () => {
  nodemon({
    script: 'dist/server.js',
    ext: 'js html css',
    watch: ['dist/**/*.*'],
    env: {
      'NODE_ENV': 'development',
      'NODE_PATH': path.join(__dirname+'/dist')
      }
  });   //run nodemon to start server
});
