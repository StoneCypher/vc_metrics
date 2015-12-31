
var targets   = require('./config/targets.json'),
    dirs      = require('./config/dirs.json'),

    babel_cfg = require('./config/babel.json');


var fs        = require('fs'),
    path      = require('path'),

    del       = require('del'),
    gulp      = require('gulp'),
    babel     = require('gulp-babel');





gulp.task('clean', function(cb) {
  return del([dirs.build], cb);
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





gulp.task('default', function() {
  console.log('wheee');
})
