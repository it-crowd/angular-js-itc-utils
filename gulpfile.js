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
    var subtree = require('gulp-subtree');

    function dist()
    {
        var result = gulp.src('src/**/*.js');
        result = result.pipe(concat('angular-itc-utils.js'));
        result.pipe(gulp.dest('dist'));

        result = gulp.src('src/**/*.js');
        result = result.pipe(concat('angular-itc-utils.min.js'));
        result = result.pipe(uglify());
        result.pipe(gulp.dest('dist'));

        result = gulp.src(['src/**/*.js', 'bower.json']);
        result.pipe(gulp.dest('dist'));
    }

    function doClean()
    {
        return gulp.src(['dist', 'target'], {read: false}).pipe(clean());
    }

    function doJSHint()
    {
        return gulp.src('src/**/*.js').pipe(jshint('.jshintrc')).pipe(jshint.reporter('default'));
    }

    function doSubtree()
    {
        return gulp.src('dist').pipe(subtree({branch: 'bower'})).pipe(clean());
    }

    gulp.task('clean', doClean);
    gulp.task('dist', ['clean'], dist);
    gulp.task('jshint', doJSHint);
    gulp.task('bower', doSubtree);
    gulp.task('default', ['clean', 'jshint', 'dist']);
})();
