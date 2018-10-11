var gulp = require('gulp');
var gls  = require('gulp-live-server');

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('watch-js', () => {
    gulp.watch(['./src/*.js'], () => {
        
    })
    server = gls('./src/server.js');
    server.start();

    // Watch for file changes
    gulp.watch(['./src/*.js'], function(file) {
        server.start.bind(server)();
        server.notify.bind(server)(file);
    });
})