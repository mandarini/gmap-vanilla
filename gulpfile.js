const gulp = require("gulp");
const browserSync = require("browser-sync");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const cleanCSS = require("gulp-clean-css");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
var watchify = require("watchify");
var tsify = require("tsify");
var fancy_log = require("fancy-log");
var sourcemaps = require("gulp-sourcemaps");
var buffer = require("vinyl-buffer");
const babel = require("gulp-babel");

function copy() {
  return gulp
    .src([
      "app/*.html",
      "app/favicon.ico",
      "app/**/*.jpg",
      "app/**/*.png",
      "app/**/*.json",
      "./service-worker.js"
    ])
    .pipe(gulp.dest("docs"));
}
gulp.task("copy", copy);

function serve() {
  return browserSync.init({
    server: "docs",
    open: false,
    port: 3000
  });
}

var watchedBrowserify = watchify(
  browserify({
    basedir: ".",
    debug: true,
    entries: ["app/scripts/main.ts"],
    cache: {},
    packageCache: {}
  }).plugin(tsify)
);

function bundle() {
  return watchedBrowserify
    .bundle()
    .on("error", fancy_log)
    .pipe(source("bundle.js"))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(babel())
    .pipe(uglify())
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("docs/scripts"));
}

function processCss() {
  return gulp
    .src("app/styles/*.css")
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(gulp.dest("docs/styles"));
}

gulp.task("processCss", processCss);

gulp.task(
  "build-serve",
  gulp.series(gulp.parallel("copy", "processCss"), bundle, serve)
);

gulp.task("build", gulp.series(gulp.parallel("copy", "processCss"), bundle));

watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", fancy_log);

function watch() {
  gulp.watch("app/index.html", copy);
  gulp.watch("app/scripts/*.ts", bundle);
  gulp.watch("app/styles/*.css", processCss);
}

gulp.task("watch", watch);

// gulp.task(
//   "buildAndServe",
//   gulp.series(processJs, processTs, processCss, copy, serve)
// );
// gulp.task("build", gulp.series(processJs, processCss, copy));
