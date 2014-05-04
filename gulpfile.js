var gulp = require("gulp");
var jshint = require("gulp-jshint");
var uglify = require("gulp-uglify");
var extReplace = require("gulp-ext-replace");

gulp.task("scripts", function() {
  // Load the code, and process it.
  var code = gulp.src("js/ReactFireMixin.js")
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish"))
    .pipe(uglify())
    .pipe(extReplace(".min.js"))
    .pipe(gulp.dest("js"));
});

gulp.task("default", ["scripts"]);