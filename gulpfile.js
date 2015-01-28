/**************/
/*  REQUIRES  */
/**************/
var gulp = require("gulp");

// File IO
var streamqueue = require("streamqueue");
var concat = require("gulp-concat");
var jshint = require("gulp-jshint");
var uglify = require("gulp-uglify");

// Testing
var karma = require("gulp-karma");

// Determine if this is being run in Travis
var travis = false;


/****************/
/*  FILE PATHS  */
/****************/
var paths = {
  destDir: "dist",

  scripts: {
    src: {
      dir: "src",
      files: [
        "src/*.js"
      ]
    },
    dest: {
      dir: "dist",
      files: {
        unminified: "reactfire.js",
        minified: "reactfire.min.js"
      }
    }
  },

  tests: {
    config: "tests/karma.conf.js",
    files: [
      "bower_components/firebase/firebase.js",
      "tests/phantomjs-es5-shim.js",
      "bower_components/react/react-with-addons.js",
      "bower_components/immutable/dist/immutable.js",
      "src/*.js",
      "tests/specs/*.spec.js"
    ]
  }
};


/***********/
/*  TASKS  */
/***********/
/* Lints, minifies, and concatenates the script files */
gulp.task("scripts", function() {
  // Concatenate all src files together
  var stream = streamqueue({ objectMode: true });
  stream.queue(gulp.src("build/header"));
  stream.queue(gulp.src(paths.scripts.src.files));
  stream.queue(gulp.src("build/footer"));

  // Output the final concatenated script file
  return stream.done()
    // Rename file
    .pipe(concat(paths.scripts.dest.files.unminified))

    // Lint
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish"))
    .pipe(jshint.reporter("fail"))
    .on("error", function(error) {
      if (travis) {
        throw error;
      }
    })

    // Write un-minified version
    .pipe(gulp.dest(paths.scripts.dest.dir))

    // Minify
    .pipe(uglify({
      preserveComments: "some"
    }))

    // Rename file
    .pipe(concat(paths.scripts.dest.files.minified))

    // Write minified version to the distribution directory
    .pipe(gulp.dest(paths.scripts.dest.dir));
});

/* Uses the Karma test runner to run the Jasmine tests */
gulp.task("test", function() {
  return gulp.src(paths.tests.files)
    .pipe(karma({
      configFile: paths.tests.config,
      browsers: travis ? ["Firefox"] : ["Chrome"],
      action: "run"
    }))
    .on("error", function(error) {
      throw error;
    });
});

/* Re-runs the "scripts" task every time a script file changes */
gulp.task("watch", function() {
  gulp.watch(["build/*", paths.scripts.src.dir + "/**/*"], ["scripts"]);
});

/* Builds the distribution files */
gulp.task("build", ["scripts"]);

/* Tasks to be run within Travis CI */
gulp.task("travis", function() {
  travis = true;
  gulp.start("build", "test");
});

/* Runs the "scripts" and "test" tasks by default */
gulp.task("default", ["build", "test"]);
