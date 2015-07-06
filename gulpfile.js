'use strict';

/**************/
/*  REQUIRES  */
/**************/
var gulp = require('gulp');
var runSequence = require('run-sequence');

// File IO
var exit = require('gulp-exit');
var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');
var extReplace = require('gulp-ext-replace');

// Testing
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');


/****************/
/*  FILE PATHS  */
/****************/
var paths = {
  destDir: 'dist',

  srcFiles: [
    'src/reactfire.js'
  ],

  testFiles: [
    'tests/helpers.js',
    'tests/reactfire.spec.js'
  ]
};


/***********/
/*  TASKS  */
/***********/
// Lints the JavaScript files
gulp.task('lint', function() {
  var filesToLint = paths.srcFiles.concat(paths.testFiles).concat(['gulpfile.js']);
  return gulp.src(filesToLint)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});


/* Builds the distribution files */
gulp.task('build', function() {
  return gulp.src(paths.srcFiles)
    // Write un-minified version
    .pipe(gulp.dest(paths.destDir))

    // Minify
    .pipe(uglify({
      preserveComments: 'some'
    }))

    // Change the file extension
    .pipe(extReplace('.min.js'))

    // Write minified version
    .pipe(gulp.dest(paths.destDir));
});

// Runs the Mocha test suite
gulp.task('test', function() {
  return gulp.src(paths.srcFiles)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function() {
      gulp.src(paths.testFiles)
        .pipe(mocha({
          reporter: 'spec',
          timeout: 5000
        }))
        .pipe(istanbul.writeReports())
        .pipe(exit());
    });
});

// Re-lints and re-builds every time a source file changes
gulp.task('watch', function() {
  gulp.watch([paths.srcFiles], ['lint', 'build']);
});

// Default task
gulp.task('default', function(done) {
  runSequence('lint', 'build', 'test', function(error) {
    done(error && error.err);
  });
});
