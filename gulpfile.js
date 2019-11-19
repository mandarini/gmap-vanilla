const gulp = require("gulp");
const browserSync = require("browser-sync");
const uglify = require("gulp-uglify");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const watchify = require("watchify");
const tsify = require("tsify");
const fancy_log = require("fancy-log");
const sourcemaps = require("gulp-sourcemaps");
const buffer = require("vinyl-buffer");
const babel = require("gulp-babel");
const sass = require("gulp-sass");
var cleanCSS = require("gulp-clean-css");
var concat = require("gulp-concat");

sass.compiler = require("node-sass");

function copy() {
  return gulp
    .src([
      "app/*.html",
      "app/favicon.ico",
      "app/**/*.jpg",
      "app/**/*.png",
      "app/**/*.json",
      "app/assets/markerclusterer.js",
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

function sassCompile() {
  return gulp
    .src("app/styles/*.scss")
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS())
    .pipe(concat("main.css"))
    .pipe(concat("main.min.css"))
    .pipe(gulp.dest("docs/styles"));
}

gulp.task("sassCompile", sassCompile);

gulp.task(
  "build-serve",
  gulp.series(gulp.parallel("copy", "sassCompile"), bundle, serve)
);

gulp.task("build", gulp.series(gulp.parallel("copy", "sassCompile"), bundle));

watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", fancy_log);

function watch() {
  gulp.watch("app/index.html", copy);
  gulp.watch("app/scripts/*.ts", bundle);
  gulp.watch("app/styles/*.scss", sassCompile);
}

gulp.task("watch", watch);

// gulp.task(
//   "buildAndServe",
//   gulp.series(processJs, processTs, sassCompile, copy, serve)
// );
// gulp.task("build", gulp.series(processJs, sassCompile, copy));
