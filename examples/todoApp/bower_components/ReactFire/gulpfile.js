var gulp = require("gulp");
var jshint = require("gulp-jshint");
var uglify = require("gulp-uglify");
var extReplace = require("gulp-ext-replace");

gulp.task("scripts", function() {
  var code = gulp.src("js/ReactFireMixin.js")
    // Lint
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish"))

    // Minify
    .pipe(uglify())

    // Change extensions
    .pipe(extReplace(".min.js"))

    // Write output
    .pipe(gulp.dest("js"));
});

gulp.task("default", ["scripts"]);