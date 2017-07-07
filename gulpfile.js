var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var closureCompiler = require('gulp-closure-compiler');
var uglify = require('gulp-uglifyjs');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var runSequence = require('run-sequence');
var header = require('gulp-header');
var fs = require('fs');

var target = 'hidden-blocks.js';
var targetUgly = 'hidden-blocks.ugly.min.js';
var targetUglyReadable = 'hidden-blocks.ugly.readable.js';
var destination = './dist/';
var copyrightStatement = '\/*!\n* Created by Steven Bouma <stevenbouma@gmail.com>\n* 2017\n*\/\n\n';

gulp.task('debug', function(callback) {
  runSequence('debug-build','copy-debug-build', callback);
});

gulp.task('release', function(callback) {
  runSequence('debug-build', 'release-build', 'beautify', 'copy-release-build', callback);
});

// watch changes in TS files and start DEBUG build + copy
gulp.task('watch-debug', function () {
    watch('source/**/*.ts', batch(function (events, done) {
        gulp.start('debug', done);
    }));
});

// watch changes in TS files and start release build + copy
gulp.task('watch-release', function () {
    watch('source/**/*.ts', batch(function (events, done) {
        gulp.start('release', done);
    }));
});

// perform standard Typescript build, based on tsconfig.json
gulp.task('debug-build', function () {
    return tsProject.src()
        .pipe(tsProject())
        // add copyright statement to the compiled js
        .pipe(header(copyrightStatement))
        .pipe(gulp.dest('./'));
});

// use google closure compiler to obfuscate the result from the Typescript compiler (tsc)
gulp.task('release-build', function() {
  return gulp.src('dist/' + target)
    .pipe(closureCompiler({
      compilerPath: './node_modules/google-closure-compiler/compiler.jar',
      fileName: targetUgly,
      compilerFlags: {
        compilation_level: 'WHITESPACE_ONLY',
        language_in: 'ECMASCRIPT6',
        language_out: 'ECMASCRIPT6',
        externs: [
          './externs/*.js'
        ],
        warning_level: 'QUIET' // QUIET, DEFAULT, VERBOSE
      },

      continueWithWarning: true

    }))
    // add copyright statement to the compiled js
    .pipe(header(copyrightStatement))
    .pipe(gulp.dest('dist'));
});

// beautify the result of google closure compiler, this makes it easier to see what has been renamed
gulp.task('beautify', function() {
  // gulp.src(['dist/' + targetUgly])
  //   .pipe(uglify(targetUglyReadable, {
  //     mangle: false,
  //     output: {
  //       beautify: true
  //     }
  //   }))
  //   .pipe(gulp.dest('dist'))
});

gulp.task('copy-release-build', function() {
   gulp.src(['dist/' + targetUgly])
   .pipe(gulp.dest(destination));
});

gulp.task('copy-debug-build', function() {
   gulp.src(['dist/' + target])
   .pipe(gulp.dest(destination));
});
