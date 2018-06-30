var gulp = require('gulp')
var sass = require('gulp-sass')
var autoprefixer = require('gulp-autoprefixer')
var uglify = require('gulp-uglify-es').default
var babel = require('gulp-babel')
var sourcemaps = require('gulp-sourcemaps')
var pngquant = require('imagemin-pngquant')
var imagemin = require('gulp-imagemin')
var webp = require('gulp-webp')
const webpack = require('webpack-stream');


gulp.task('default',function(){
    gulp.watch('./src/scss/**/*.scss',['styles'])
    gulp.watch('./src/js/**/*.js',['scripts'])
    gulp.watch('./src/img/*',['images'])
})
gulp.task('scripts',function(){
    gulp.src('./src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./js'))
})
gulp.task('styles',function(){
    gulp.src('./src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle:'compressed'}).on('error',sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./css"))
})
gulp.task('images', function() {
    gulp.src('./src/img/*')
        .pipe(webp())
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()]
        }))
        .pipe(gulp.dest('img'))
});
gulp.task('sw',function(){
    return gulp.src('./src/sw.js')
    .pipe(webpack({
        watch: true,
        output: {
            filename: 'sw.js',
          },
    }))
    .pipe(gulp.dest('./'));
});