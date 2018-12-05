'use strict'
const gulp =        require('gulp');

//          Working with Files 
const rename       = require('gulp-rename'); // Подключаем библиотеку для переименования файлов
const del =         require('del');
const path =        require('path');
const fs   = require('fs');
//          Working with Streams
const concat =      require('gulp-concat');
const newer =       require('gulp-newer'); // Слечает дату модификации файлов в директориях откуда и куда
const cached =      require('gulp-cached');
const remember =    require('gulp-remember');

//          Working with Styles
const stylus =      require('gulp-stylus');
const less =        require('gulp-less');
const cssnano =     require('gulp-cssnano');
const autoprefixer= require('gulp-autoprefixer');

//      Working with JavaScript
const uglify       = require('gulp-uglifyjs'); // Подключаем gulp-uglifyjs (для сжатия JS)

//          Working with images
const imagemin =    require('gulp-imagemin');

//          Browser - Sync
const browserSync = require('browser-sync').create();

//          Testing tool


//          Debug plagin
const debug =       require('gulp-debug');
const sourcemaps = require('gulp-sourcemaps');
var gulpif =        require('gulp-if');
const notify =      require('gulp-notify'); //Выводит подсвеченный синтаксис ошибки в потоке и попап окно 
//      Вешает обработчики событий на все этпы в потоке 
//      что позволяет выдать сообщение на том этапе где произошла ошибка
const plumber =     require('gulp-plumber');
//     еще пару дебагеров
//      объединяет потоки в один что позволяет повесть на него один стандартный 
//      обработчик событий
//       multipipe
//       stream-combinear2

var isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'true';

//gulp-ssh — обеспечивает возможность подключения по SSH и SFTP.
//gulp-zip — архивирует папки и файлы.
//gulp-clean и gulp-copy — соответственно очищают и копируют указанные исходники. 
//gulp-filesize — отображает размеры файлов в удобном для чтения формате.





//  --------------------------------------------
//          OTHER TASK
//  ------------------------------------------
gulp.task('isDev',function(callback) {
    process.env.NODE_ENV == 'false'
    console.log(isDevelopment);
    callback();
});

//  -----------------------------------------------------
//  directory created
//  ----------------------------------------------------=

gulp.task('init:direct', function(callback) {
    const folders = [
        'dev',
        'dev/styles',
        'dev/styles/libs',
        'dev/img',
        'dev/img',
        'dev/img',
        'dev/js',
        'dev/js/libs',
        'dev/fonts',
        'tmp',
        'files-for-project',
        //'files-for-project/styles',
        'files-for-project/img',
        //'files-for-project/img',
        //'files-for-project/img',
        //'files-for-project/js',
        //'files-for-project/other',
        //'public'
        'model',
    ];

    folders.forEach(dir => {
        if(!fs.existsSync(dir))     
            fs.mkdirSync(dir), 
            console.log('folder created:', dir);        
    });    
    callback();
});

//  ----------------------------------------------------------
//          WORKING CSS LESS SASS STYLES
//  ----------------------------------------------------------

gulp.task('less',function(){
    console.log('For Developer: ' + isDevelopment);
    return gulp.src('dev/styles/general.less')
    .pipe(gulpif(isDevelopment, sourcemaps.init()))
    .pipe(plumber({errorHandler: notify.onError()}))
    .pipe(less())
    .pipe(debug())
    .pipe(rename('main.css'))
    .pipe(debug())
    .pipe(gulpif(isDevelopment, sourcemaps.write('logfile')))
    .pipe(gulp.dest('dev/styles'));
});

gulp.task('clearAll:styles', function(callback) {
    del.sync('public/styles');
    callback();
});

gulp.task('build:styles:normal',gulp.series('clearAll:styles','less', function() {
    return gulp.src('dev/styles/**/*.css')
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        .pipe(gulp.dest('public/styles'));
}));

gulp.task('build:styles:mini',gulp.series('clearAll:styles','less', function() {
    return gulp.src('dev/styles/**/*.css')
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        .pipe(cssnano())   
        .pipe(debug())     
        .pipe(gulp.dest('public/styles'));
}));

//  ----------------------------------------------------------
//          WORKING JAVASCRIPT
//  ----------------------------------------------------------
gulp.task('build:js:normal', function(){
    del.sync('public/js');
    console.log('-- Delete public/js --')
    return gulp.src('dev/js/**/*.js')
    .pipe(plumber({errorHandler: notify.onError()}))        
    .pipe(debug())     
    .pipe(gulp.dest('public/js'));
});

gulp.task('build:js:mini', function(){
    del.sync('public/js');
    console.log('-- Delete public/js --')
    return gulp.src('dev/js/**/*.js')
    .pipe(plumber({errorHandler: notify.onError()}))
    .pipe(debug())
    .pipe(uglify())   
    .pipe(debug())     
    .pipe(gulp.dest('public/js'));
});




//  ------------------------------------------------------------
//          Browser - Sync
//  ------------------------------------------------------------

gulp.task('server:singlepage', function(){
    browserSync.init({
        server: 'dev'
    });
    browserSync.watch('dev/**/*.*').on('change', browserSync.reload);
});

gulp.task('server:proxy',function() {
    browserSync.init({
        poxy: 'http://wp-proj1/',
       
    });
    browserSync.watch('*.*').on('change', browserSync.reload);
});


//  ----------------------------------------------------------
//          FONTS
//  ----------------------------------------------------------
gulp.task('build:fonts',function(){
    del.sync('public/fonts');
    console.log('-- Delete public/fonts');
    return gulp.src('dev/fonts/**/*.*')
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        .pipe(gulp.dest('public/fonts'));
})



//  ----------------------------------------------------------
//             BUILD PROJECT IN DIRECT 'public'
//  ----------------------------------------------------------

//  Optimization of images
gulp.task('build:img', function() {
    del.sync('public/img');
    return gulp.src('dev/img/**/*.*', )
        //.pipe(cached('build:img'))
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        //.pipe(imagemin())
        .pipe(debug())
        .pipe(gulp.dest('public/img'))
});


gulp.task('dev:img', function() {
    return gulp.src('files-for-project/img/**/*.*', )
        .pipe(cached('dev:img'))
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        .pipe(imagemin())
        .pipe(debug())
        .pipe(gulp.dest('dev/img'))
});

gulp.task('clearAll:img', function(callback) {
    del.sync('dev/img');
    console.log('Delate dev/img');
    callback();
});

gulp.task('reset:img',gulp.series('clearAll:img', 'dev:img'));

gulp.task('build:html', function() {
    del.sync('public/**/*.html');
    console.log(' -- Dalete public/**/*.html --');
    return gulp.src('dev/**/*.html')
    .pipe(plumber({errorHandler: notify.onError()}))
    .pipe(debug())
    .pipe(gulp.dest('public/'));
});

gulp.task('build:php', function() {
    del.sync('public/**/*.php');
    console.log(' -- Dalete public/**/*.php --');
    return gulp.src('dev/**/*.php')
    .pipe(plumber({errorHandler: notify.onError()}))
    .pipe(debug())
    .pipe(gulp.dest('public/'));
});
gulp.task('clear:public',function(callback){
    del.sync('public');
    callback();
})

gulp.task('build:normal',gulp.series('clear:public', gulp.parallel('build:html','build:php','build:img','build:styles:normal','build:js:normal','build:fonts')));

gulp.task('build:mini',gulp.series('clear:public', gulp.parallel('build:html','build:php','build:img','build:styles:mini','build:js:normal','build:fonts')));
//  ----------------------------------------------------------
//     TESTING     
//  ----------------------------------------------------------




//  ----------------------------------------------------------
//          
//  ----------------------------------------------------------




//  ----------------------------------------------------------
//          
//  ----------------------------------------------------------






//  ----------------------------------------------------------
//         Developer watcher 
//  ----------------------------------------------------------

gulp.task('dev:watch', gulp.series('less', function(){
    gulp.watch('dev/styles/**/*.less', gulp.series('less'));
    gulp.watch('files-for-project/img/**/*.*', gulp.series('dev:img')).on('unlink', function(filepath) {
        console.log('\t--remove file dev/img --');        
        delete  cached.caches['dev:img'];
        del.sync('dev/img');
        
    });;    
}));






