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
const webpack4 = require('webpack');



gulp.task('default',function(){
    gulp.watch('./src/scss/**/*.scss',['styles'])
    gulp.watch('./src/js/**/*.js',['scripts'])
    gulp.watch('./src/img/*',['images'])
    gulp.watch('./src/sw.js', ['sw'])
    gulp.watch('./src/dbWorker.js', ['worker'])
})

gulp.task('scripts',function(){
    gulp.src('./src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./js'))
})

gulp.task('scripts-prod',function(){
    gulp.src('./src/js/**/*.js')
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest('./js'))
})

gulp.task('styles',function(){
    gulp.src('./src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error',sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./css"))
})

gulp.task('styles-prod',function(){
    gulp.src('./src/scss/**/*.scss')
        .pipe(sass({outputStyle:'compressed'}).on('error',sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
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

gulp.task('images-prod', function() {
    gulp.src('./src/img/*')
        .pipe(webp())
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()]
        }))
        .pipe(gulp.dest('img'))
});

gulp.task('worker',function(){
    return gulp.src('./src/dbWorker.js')
    .pipe(webpack({
        watch: false,
        output: {
            filename: 'dbWorker.js',
          },
    }))
    .pipe(gulp.dest('./js/'));
});

gulp.task('sw',function(){
    return gulp.src('./src/sw.js')
    .pipe(webpack({
        watch: false,
        output: {
            filename: 'sw.js',
          },
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('worker-prod',function(){
    return gulp.src('./src/dbWorker.js')
    .pipe(webpack({
        watch: false,
        mode:'production',
        output: {
            filename: 'dbWorker.js',
        }
    },
    webpack4))
    .pipe(gulp.dest('./'));
});

gulp.task('sw-prod',function(){
    return gulp.src('./src/sw.js')
    .pipe(webpack({
        watch: false,
        mode:'production',
        output: {
            filename: 'sw.js',
        }
    },
    webpack4))
    .pipe(gulp.dest('./'));
});