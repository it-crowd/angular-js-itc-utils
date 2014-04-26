/*global require*/
(function ()
{
    'use strict';

    var gulp = require('gulp');
    var jshint = require('gulp-jshint');
    var uglify = require('gulp-uglify');
    var clean = require('gulp-clean');
    var concat = require('gulp-concat');
    var rename = require('gulp-rename');

    gulp.task('dist', function ()
    {
        var result = gulp.src('src/**/*.js');
        result = result.pipe(jshint('.jshintrc'));
        result = result.pipe(jshint.reporter('default'));
        result = result.pipe(concat('angular-itc-utils.js'));
        result = result.pipe(uglify());
        result = result.pipe(rename({suffix: '.min'}));
        result = result.pipe(gulp.dest('dist'));
        return result;
    });

    gulp.task('clean', function ()
    {
        return gulp.src(['dist', 'target'], {read: false}).pipe(clean());
    });
})();
