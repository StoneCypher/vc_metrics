
var targets      = require('./config/targets.json'),
    dirs         = require('./config/dirs.json'),

    babel_cfg    = require('./config/babel.json');


var fs           = require('fs'),
    path         = require('path'),

    del          = require('del'),
    gulp         = require('gulp'),

    browserify   = require('browserify'),
    source       = require('vinyl-source-stream'),
    babel        = require('gulp-babel');


var production   = false,

    errorHandler = function(err) {
      console.log(err.toString());
      this.emit("end");
    };





gulp.task('clean', function(cb) {
  return del([dirs.build], cb);
});





gulp.task('copy', ['make-directories'], function() {

  return gulp.src([targets.html])
    .pipe(gulp.dest(dirs.built_html));

});





gulp.task('arrange', ['build'], function(cb) {

  gulp.src(targets.fe).pipe(gulp.dest(dirs.arrange));

  return cb();

});





gulp.task('build', ['browserify', 'copy']);





gulp.task('browserify', ['babel'], function() {

  var browserifyConfig = {
    "entries"    : [dirs.built_js + '/vcm.js'],
    "extensions" : [".jsx"]
  };

  var bpack = browserify(browserifyConfig, { "debug" : !production })

    // these should probably be externalized instead
    // todo: find time for love later, doctor jones
    .add(dirs.react_npm      + "/react.js",      { "expose" : "react" })
    .add(dirs.reactdom_npm   + "/react-dom.js",  { "expose" : "react-dom" })

    .add(dirs.built_js       + "/VcmRoot.js",    { "expose" : "VcmRoot" });

//  .add(dirs.sc_react_npm   + "/sc_react.js",   { "expose" : "sc_react" });

  return bpack
    .require(dirs.built_js   + "/vcm.js",        { "expose" : "vcm" })

    .bundle()
    .on("error", errorHandler)
    .pipe(source("vcm_bundle.js"))
    .pipe(gulp.dest(dirs.built_js));

  });





gulp.task('make-directories', ['clean'], function() {

  for (var key in dirs) {
    try      { fs.mkdirSync('.' + path.sep + path.normalize(dirs[key])); }
    catch(e) { if (e.code !== 'EEXIST') { console.log('caught ' + JSON.stringify(e) + ' while making dirs'); } }
  }

  // yes, this is supposed to not return anything

});





gulp.task('babel', ['make-directories'], function() {

  return gulp.src([targets.js, targets.jsx])
    .pipe(babel(babel_cfg))
    .pipe(gulp.dest(dirs.built_js));

});





gulp.task('default', ['arrange']);
