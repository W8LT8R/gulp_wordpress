'use strict'


/* -------------------------------------------------------------------------
*           SETTING THEMS
---------------------------------------------------------------------------*/
var setTheme = {
    name: 'xxx',
    nameDirect: 'gulpWP', // имя директории проекта нужно для настройки сервера
    jsDirect: 'js',
    cssDirect: 'css',
    imgDirect: 'css/img',
    fontsDirect: 'fonts'
}

setTheme.src = {
    dev: 'dev/',
    build: '../wp-content/themes/'+ setTheme.name + '/',
}






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


//gulp-ssh — обеспечивает возможность подключения по SSH и SFTP.
//gulp-zip — архивирует папки и файлы.
//gulp-clean и gulp-copy — соответственно очищают и копируют указанные исходники. 
//gulp-filesize — отображает размеры файлов в удобном для чтения формате.





//  --------------------------------------------
//          OTHER TASK
//  ------------------------------------------


//  -----------------------------------------------------
//  directory created
//  ----------------------------------------------------=

gulp.task('init:direct', function(callback) {
    const folders = [
        'dev',
        'dev/css',
        'dev/css/libs',
        //'dev/css/img',           
        'dev/js',
        'dev/js/libs',
        'dev/fonts',
        'tmp',
        'files-for-project',        
        'files-for-project/img',
        'model',
        setTheme.src.build
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
    return gulp.src('dev/css/general.less')
    .pipe(sourcemaps.init())
    .pipe(plumber({errorHandler: notify.onError()}))
    .pipe(less())
    .pipe(debug())
    .pipe(rename('main.css'))
    .pipe(debug())
    .pipe(sourcemaps.write('logfile'))
    .pipe(gulp.dest('dev/css'));
});

gulp.task('delete:styles', function(callback) {
    del.sync(setTheme.src.build + '/css/**/*.css', {force: true});
    callback();
});

gulp.task('build:styles:normal',gulp.series('delete:styles','less', function() {
    return gulp.src('dev/css/**/*.css')
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        .pipe(gulp.dest(setTheme.src.build + '/css'));
}));

gulp.task('build:styles:mini',gulp.series('delete:styles','less', function() {
    return gulp.src('dev/css/**/*.css')
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        .pipe(cssnano())   
        .pipe(debug())     
        .pipe(gulp.dest(setTheme.src.build + '/css'));
}));


//  ----------------------------------------------------------
//          WORKING JAVASCRIPT
//  ----------------------------------------------------------
gulp.task('delete:js', function(callback) {
    del.sync(setTheme.src.build + '/js', {force: true});
    console.log('-- Delete /js --');
    callback();
})

gulp.task('dev:js', function() {
    return gulp.src('dev/js/**/*.js')
    .pipe(cached('dev:js'))
    .pipe(plumber({errorHandler: notify.onError()}))    
    .pipe(debug())
    .pipe(gulp.dest(setTheme.src.build + '/js'));

});

gulp.task('build:js:normal', gulp.series('delete:js',function(){
    
    return gulp.src('dev/js/**/*.js')
    .pipe(plumber({errorHandler: notify.onError()}))        
    .pipe(debug())     
    .pipe(gulp.dest(setTheme.src.build + '/js'));
}));

gulp.task('build:js:mini', gulp.series('delete:js',function(){
    
    return gulp.src('dev/js/**/*.js')
    .pipe(plumber({errorHandler: notify.onError()}))
    .pipe(debug())
    .pipe(uglify())   
    .pipe(debug())     
    .pipe(gulp.dest(setTheme.src.build + '/js'));
}));




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
        poxy: 'http://'+ setTheme.nameDirect +'/',
       
    });
    browserSync.watch('*.*').on('change', browserSync.reload);
});


//  ----------------------------------------------------------
//          FONTS
//  ----------------------------------------------------------
gulp.task('build:fonts',function(){
    del.sync(setTheme.src.build + '/fonts', {force: true});
    console.log('-- Delete /fonts');
    return gulp.src('dev/fonts/**/*.*')
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        .pipe(gulp.dest(setTheme.src.build + '/fonts'));
})

gulp.task('dev:fonts', function() {
    return gulp.src('dev/fonts/**/*.*')
    .pipe(cached('dev:fonts'))
    .pipe(plumber({errorHandler: notify.onError()}))    
    .pipe(debug())
    .pipe(gulp.dest(setTheme.src.build + '/fonts'));

});

//  ----------------------------------------------------------
//          html
//  ----------------------------------------------------------
gulp.task('build:html', function() {
    del.sync(setTheme.src.build + '/**/*.html', {force: true});
    console.log(' -- Dalete /**/*.html --');
    return gulp.src('dev/**/*.html')
    .pipe(plumber({errorHandler: notify.onError()}))
    .pipe(debug())
    .pipe(gulp.dest(setTheme.src.build));
});

gulp.task('dev:html', function() {
    return gulp.src('dev/**/*.html')
    .pipe(cached('dev:html'))
    .pipe(plumber({errorHandler: notify.onError()}))
    .pipe(debug())
    .pipe(gulp.dest(setTheme.src.build));
});


//  ----------------------------------------------------------
//          PHP
//  ----------------------------------------------------------
gulp.task('dev:php', function() {
    return gulp.src('dev/**/*.php')
    .pipe(cached('dev:php'))
    .pipe(plumber({errorHandler: notify.onError()}))
    .pipe(debug())
    .pipe(gulp.dest(setTheme.src.build));
});

gulp.task('build:php', function() {
    del.sync(setTheme.src.build + '/**/*.php', {force: true});
    console.log(' -- Dalete /**/*.php --');
    return gulp.src('dev/**/*.php')
    .pipe(plumber({errorHandler: notify.onError()}))
    .pipe(debug())
    .pipe(gulp.dest(setTheme.src.build));
});

//  ----------------------------------------------------------
//             Image
//  ----------------------------------------------------------
//  Optimization of images
gulp.task('build:img', function() {    
    return gulp.src('files-for-project/img/**/*.*', )
        .pipe(cached('build:img'))
        .pipe(plumber({errorHandler: notify.onError()}))      
        .pipe(debug())
        .pipe(imagemin())
        .pipe(debug())
        .pipe(gulp.dest(setTheme.src.build + 'css/img'))
});

gulp.task('delete:img', function(callback) {
    del.sync(setTheme.src.build + 'css/img' , {force: true});
    console.log('Delate css/img');
    callback();
});
gulp.task('reset:img',gulp.series('delete:img', 'build:img'));

//  ----------------------------------------------------------
//             BUILD PROJECT IN DIRECT 'public'
//  ----------------------------------------------------------


gulp.task('delete:all',function(callback){
    
    del.sync(setTheme.src.build + '**', {force: true});
    console.log('Delete all in direct theme');
    callback();
});

gulp.task('build:normal',gulp.series('delete:all', gulp.parallel('build:html','build:php','build:img','build:styles:normal','build:js:normal','build:fonts')));

gulp.task('build:mini',gulp.series('delete:all', gulp.parallel('build:html','build:php','build:img','build:styles:mini','build:js:normal','build:fonts')));
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
    //  less
    gulp.watch('dev/css/**/*.less', gulp.series('less'));

    //  img
    gulp.watch('files-for-project/img/**/*.*', gulp.series('build:img')).on('unlink', function(filepath) {
        console.log('\t--remove file css/img --');        
        delete  cached.caches['build:img'];
        del.sync(setTheme.src.build + 'css/img', {force: true});
        
    });

    //  fonts
    gulp.watch('dev/fonts/**/*.*', gulp.series('dev:fonts')).on('unlink', function(){
        console.log('\t--remove file fonts --');        
        delete  cached.caches['dev:fonts'];
        del.sync(setTheme.src.build + 'fonts', {force: true});
    });

    //  js
    gulp.watch('dev/js/**/*.js', gulp.series('dev:js')).on('unlink', function(){
        console.log('\t--remove file js --');        
        delete  cached.caches['dev:js'];
        del.sync(setTheme.src.build + 'js', {force: true});
    });
    
    //  php
    gulp.watch('dev/**/*.php', gulp.series('dev:php')).on('unlink', function(){
        console.log('\t--remove file php --');        
        delete  cached.caches['dev:php'];
        del.sync(setTheme.src.build + '/**/*.php', {force: true});
    });

    //  html
    gulp.watch('dev/**/*.html', gulp.series('dev:html')).on('unlink', function(){
        console.log('\t--remove file html --');        
        delete  cached.caches['dev:html'];
        del.sync(setTheme.src.build + '/**/*.html', {force: true});
    });
}));

gulp.task('dev:watch:test', function() {
   
});




