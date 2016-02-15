var gulp = require('gulp');
var postcss = require('gulp-postcss');
var jade = require('gulp-jade');
var coffee = require('gulp-coffee');

gulp.task('templates', function() {
    var YOUR_LOCALS = {};

    gulp.src('./src/jade/*.jade')
        .pipe(jade({
            locals: YOUR_LOCALS
        }))
        .pipe(gulp.dest('./build/'));
});

gulp.task('css', function () {
    return gulp.src('./src/css/*.css').pipe(
        postcss([
            require('precss')({ /* options */ })
        ])
    ).pipe(
        gulp.dest('./build/')
    );
});

gulp.task('coffee', function() {
    gulp.src('./src/coffee/*.coffee')
        .pipe(coffee({bare: true}))
        .pipe(gulp.dest('./client/'));
});

gulp.task('default', ['css', 'templates'], function() {});

gulp.task('watch', function(){
    gulp.watch('./src/css/*.css', ['css']);
    gulp.watch('./src/jade/*.jade', ['templates']);
    gulp.watch('./src/coffee/*.coffee', ['coffee']);
});
