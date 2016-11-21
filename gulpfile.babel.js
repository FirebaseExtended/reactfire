/*
 * REQUIRES
 */
/* eslint-disable import/no-extraneous-dependencies */
import gulp from 'gulp';
import runSequence from 'run-sequence';

// File IO
import exit from 'gulp-exit';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';
import uglify from 'gulp-uglify';
import extReplace from 'gulp-ext-replace';
import babelRegister from 'babel-register';

// Testing
import mocha from 'gulp-mocha';
import istanbul from 'gulp-istanbul';
/* eslint-enable import/no-extraneous-dependencies */


/*
 * FILE PATHS
 */
const paths = {
  destDir: 'dist',

  srcFiles: [
    'src/reactfire.js',
  ],

  testFiles: [
    'tests/helpers.js',
    'tests/reactfire.spec.js',
  ],
};


/*
 * TASKS
 */
// Lints the JavaScript files
gulp.task('lint', () => {
  // Temporarily skip linting of source and test files on teh ReactFire 2.0 branch
  // const filesToLint = paths.srcFiles.concat(paths.testFiles).concat(['gulpfile.js']);
  const filesToLint = ['gulpfile.js'];
  return gulp.src(filesToLint)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});


/* Builds the distribution files */
gulp.task('build', () => {
  gulp.src(paths.srcFiles)
    // Convert to ES5
    .pipe(babel({
      presets: ['react', 'es2015'],
    }))

    // Write un-minified version
    .pipe(gulp.dest(paths.destDir))

    // Minify
    .pipe(uglify({
      preserveComments: 'some',
    }))

    // Change the file extension
    .pipe(extReplace('.min.js'))

    // Write minified version
    .pipe(gulp.dest(paths.destDir));
});

// Runs the Mocha test suite
gulp.task('test', () => {
  gulp.src(paths.srcFiles)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', () => {
      gulp.src(paths.testFiles)
        .pipe(mocha({
          compilers: {
            js: babelRegister,
          },
          reporter: 'spec',
          timeout: 5000,
        }))
        .pipe(istanbul.writeReports())
        .pipe(exit());
    });
});

// Re-lints and re-builds every time a source file changes
gulp.task('watch', () => {
  gulp.watch([paths.srcFiles], ['lint', 'build']);
});

// Default task
gulp.task('default', (done) => {
  runSequence('lint', 'build', 'test', (error) => {
    done(error && error.err);
  });
});
