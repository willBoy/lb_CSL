/**
 * Created by Lingban on 2016/8/3.
 */
var pkg = require('./package.json');
var gulp = require('gulp');
var copy = require('copy');
var copyDir = require('copy-dir');
var concat = require('gulp-concat');//合并JS
var uglify = require('gulp-uglify');//通过UglifyJS来压缩JS文件
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');//重命名文件
var compass = require('gulp-compass');
var minifyCss = require('gulp-clean-css');
var templateCache = require('gulp-angular-templatecache');
var clean = require('gulp-clean');
var usemin = require('gulp-usemin');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var minifyHtml = require('gulp-minify-html');

var projectJS = [
    'scripts/app.js',
    'scripts/services/**/*.js',
    'scripts/directives/**/*.js',
    'scripts/filters/**/*.js',
    'scripts/controllers/**/*.js'
];

var dest = 'dist/';
var jsDest = 'dist/js';
var cssDest = 'dist/css';
var imgDest = 'dist/images';
var tmpJsDest = 'dist/tmpjs';
var tmpCssDest = 'dist/tmpcss';
var tmpImgDest = 'dist/tmpimg';
var revMF = 'dist/rev';

// 编译scss文件
gulp.task('compass', function() {
    gulp.src('styles/**/*.scss')
        .pipe(compass({
            css: cssDest,
            sass: 'styles',
            generated_images_path: imgDest
        }))
        .pipe(gulp.dest(cssDest));
});
// 复制不会生成雪碧图的图片和字体文件到dist
gulp.task('copy', function() {
    copy(['images/*.jpg', 'images/welcome/*.png'], imgDest, function(err, file) {
        //
    });
});

// 清除dist目录
gulp.task('clean', function() {
    gulp.src(dest)
        .pipe(clean());
});

// 校验语法
gulp.task('jshint', function() {
    gulp.src(projectJS)
        .pipe(jshint());
});

// 实时编译
gulp.task('watch', function() {
    gulp.watch(projectJS, function() {
        gulp.run('jshint');
    });
});

// 编译模板js
gulp.task('compileTpl', function() {
    gulp.src('views/**/*.html')
        .pipe(templateCache({module: 'lbApp', transformUrl: function(url) {return 'views/' + url;}}))
        .pipe(rename('templates.js'))
        .pipe(gulp.dest(tmpJsDest));
});

// 合并压缩文件
gulp.task('usemin', function() {
    gulp.src('./index.html')
        .pipe(usemin({
            css: [minifyCss],
            js: [function() { return uglify({compress: true, mangle: false})}],
            html: [minifyHtml],
            inlinejs: [uglify],
            inlinecss: [minifyCss]
        }))
        .pipe(gulp.dest(dest));
});

// 给静态资源添加指纹
gulp.task('rev', function() {
    gulp.src(tmpCssDest + '/*.css')
        .pipe(rev())
        .pipe(gulp.dest(cssDest))
        .pipe(rev.manifest())
        .pipe(gulp.dest(revMF + '/css'));
    gulp.src(tmpJsDest + '/*min.js')
        .pipe(rev())
        .pipe(gulp.dest(jsDest))
        .pipe(rev.manifest())
        .pipe(gulp.dest(revMF + '/js'));
    gulp.src([imgDest + '/**/*.png', imgDest + '/**/*.jpg'])
        .pipe(rev())
        .pipe(gulp.dest(tmpImgDest))
        .pipe(rev.manifest())
        .pipe(gulp.dest(revMF + '/img'));
});

// 替换静态资源路径
gulp.task('staRep', function() {
    var staticUrl = 'http://static.aiaas.ai/aiaas';
    gulp.src([revMF + '/**/*.json', jsDest + '**/*.js', cssDest + '**/*.css', dest + 'index.html'])
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: {
                'tmpcss': staticUrl + '/css',
                'tmpjs': staticUrl + '/js',
                '../images': staticUrl + '/images'
            }
        }))
        .pipe(gulp.dest(dest));
    // 删除imgDest中的内容
    gulp.src(imgDest + '/**/*', {read: false}).pipe(clean());
    // 将tmpImgDest中的内容复制到imgDest中
    gulp.src(tmpImgDest + '/**/*').pipe(gulp.dest(imgDest));
});

// 将打包好的静态文件放到一个dist/aiaas中，用于将来部署到cdn上
gulp.task('copyStaticFile', function() {
    copyDir('dist/js', 'dist/aiaas/js', function(err) {});
    copyDir('dist/css', 'dist/aiaas/css', function(err) {});
    copyDir('dist/images', 'dist/aiaas/images', function(err) {});
});

// 清除多余文件
gulp.task('end', function() {
    gulp.src([tmpJsDest, tmpCssDest, tmpImgDest, revMF, cssDest + '/project.css'], {read: false}).pipe(clean());
});

// 开发build（开发时，当SCSS文件、图片文件发生变化时，需要对相关的资源进行build以在查看效果）
gulp.task('dev', function() {
    gulp.run('clean', 'compass', 'copy');
});

// 提交测试环境进行build时：gulp clean; gulp compass; gulp compileTpl; gulp copy; gulp jshint; gulp usemin; gulp rev; gulp staRep; gulp copyStaticFile; gulp end