'use strict'


/* -------------------------------------------------------------------------
*           SETTING THEMS
---------------------------------------------------------------------------*/
var setTheme = {
    name: 'xxx',
    nameDirect: 'gulpWP', // имя директории проекта нужно для настройки сервера
    //  директории разработки
    jsDevDirect: 'js/',
    stylesDevDirect: 'styles/',
    imgDevDirect: 'files-for-project/img/',
    fontsDevDirect: 'fonts/',
    //  продакшн директории
    jsDirect: 'js/',
    stylesDirect: 'css/',
    imgDirect: 'css/img/',
    fontsDirect: 'fonts/'
}
//  Установка базовых директорий проекта
setTheme.src = {
    dev: 'dev/',    //  директория разработки
    build: '../wp-content/themes/'+ setTheme.name + '/', // директория готового проекта
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
        setTheme.src.dev,
        setTheme.src.dev + setTheme.stylesDevDirect,
        setTheme.src.dev+ setTheme.stylesDevDirect +'/libs',
        //'dev/css/img',           
        setTheme.src.dev+ setTheme.jsDevDirect,
        setTheme.src.dev + setTheme.jsDevDirect +'/libs',
        setTheme.src.dev + setTheme.fontsDevDirect,
        'tmp',
        'files-for-project',
        setTheme.imgDevDirect,                
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
    return gulp.src(setTheme.src.dev + setTheme.stylesDevDirect + '/general.less')
    .pipe(sourcemaps.init())
    .pipe(plumber({errorHandler: notify.onError()}))
    .pipe(less())
    .pipe(debug())
    .pipe(rename('main.css'))
    .pipe(debug())
    .pipe(sourcemaps.write('logfile'))
    .pipe(gulp.dest(setTheme.src.dev + setTheme.stylesDevDirect));
});

gulp.task('delete:styles', function(callback) {
    del.sync(setTheme.src.build + setTheme.stylesDirect +'**/*.css', {force: true});
    callback();
});

gulp.task('build:styles:normal',gulp.series('delete:styles','less', function() {
    gulp.src(setTheme.src.dev + '*.css')
    .pipe(plumber({errorHandler: notify.onError()}))
    .pipe(debug())
    .pipe(gulp.dest(setTheme.src.build));
    
    return gulp.src(setTheme.src.dev + setTheme.stylesDevDirect + '**/*.css')
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        .pipe(gulp.dest(setTheme.src.build + setTheme.stylesDirect));
}));

gulp.task('build:styles:mini',gulp.series('delete:styles','less', function() {
    gulp.src(setTheme.src.dev + '*.css')
    .pipe(plumber({errorHandler: notify.onError()}))
    .pipe(debug())
    .pipe(gulp.dest(setTheme.src.build));

    return gulp.src(setTheme.src.dev + setTheme.stylesDevDirect + '**/*.css')
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        .pipe(cssnano())   
        .pipe(debug())     
        .pipe(gulp.dest(setTheme.src.build + setTheme.stylesDirect));
}));


//  ----------------------------------------------------------
//          WORKING JAVASCRIPT
//  ----------------------------------------------------------
gulp.task('delete:js', function(callback) {
    del.sync(setTheme.src.build + setTheme.jsDirect , {force: true});
    console.log('-- Delete /js --');
    callback();
})

gulp.task('dev:js', function() {
    return gulp.src(setTheme.src.dev + setTheme.jsDevDirect + '**/*.js')
    .pipe(cached('dev:js'))
    .pipe(plumber({errorHandler: notify.onError()}))    
    .pipe(debug())
    .pipe(gulp.dest(setTheme.src.build + setTheme.jsDirect));

});

gulp.task('build:js:normal', gulp.series('delete:js',function(){
    
    return gulp.src(setTheme.src.dev + setTheme.jsDevDirect +'**/*.js')
    .pipe(plumber({errorHandler: notify.onError()}))        
    .pipe(debug())     
    .pipe(gulp.dest(setTheme.src.build + setTheme.jsDirect));
}));

gulp.task('build:js:mini', gulp.series('delete:js',function(){
    
    return gulp.src(setTheme.src.dev + setTheme.jsDevDirect + '**/*.js')
    .pipe(plumber({errorHandler: notify.onError()}))
    .pipe(debug())
    .pipe(uglify())   
    .pipe(debug())     
    .pipe(gulp.dest(setTheme.src.build + setTheme.jsDirect));
}));




//  ------------------------------------------------------------
//          Browser - Sync
//  ------------------------------------------------------------

gulp.task('server:singlepage', function(){
    browserSync.init({
        server: setTheme.src.dev
    });
    browserSync.watch(setTheme.src.dev + '**/*.*').on('change', browserSync.reload);
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
    del.sync(setTheme.src.build + setTheme.fontsDirect, {force: true});
    console.log('-- Delete /fonts');
    return gulp.src(setTheme.src.dev + setTheme.fontsDevDirect + '**/*.*')
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        .pipe(gulp.dest(setTheme.src.build + setTheme.fontsDirect));
})

gulp.task('dev:fonts', function() {
    return gulp.src(setTheme.src.dev + setTheme.fontsDevDirect + '**/*.*')
    .pipe(cached('dev:fonts'))
    .pipe(plumber({errorHandler: notify.onError()}))    
    .pipe(debug())
    .pipe(gulp.dest(setTheme.src.build + setTheme.fontsDirect));

});

//  ----------------------------------------------------------
//          html
//  ----------------------------------------------------------
gulp.task('build:html', function() {
    del.sync(setTheme.src.build + '**/*.html', {force: true});
    console.log(' -- Dalete /**/*.html --');
    return gulp.src(setTheme.src.dev + '**/*.html')
    .pipe(plumber({errorHandler: notify.onError()}))
    .pipe(debug())
    .pipe(gulp.dest(setTheme.src.build));
});

gulp.task('dev:html', function() {
    return gulp.src(setTheme.src.dev + '**/*.html')
    .pipe(cached('dev:html'))
    .pipe(plumber({errorHandler: notify.onError()}))
    .pipe(debug())
    .pipe(gulp.dest(setTheme.src.build));
});


//  ----------------------------------------------------------
//          PHP
//  ----------------------------------------------------------
gulp.task('dev:php', function() {
    return gulp.src(setTheme.src.dev + '**/*.php')
    .pipe(cached('dev:php'))
    .pipe(plumber({errorHandler: notify.onError()}))
    .pipe(debug())
    .pipe(gulp.dest(setTheme.src.build));
});

gulp.task('build:php', function() {
    del.sync(setTheme.src.build + '**/*.php', {force: true});
    console.log(' -- Dalete /**/*.php --');
    return gulp.src(setTheme.src.dev + '**/*.php')
    .pipe(plumber({errorHandler: notify.onError()}))
    .pipe(debug())
    .pipe(gulp.dest(setTheme.src.build));
});

//  ----------------------------------------------------------
//             Image
//  ----------------------------------------------------------
//  Optimization of images
gulp.task('build:img', function() {    
    return gulp.src(setTheme.imgDevDirect + '**/*.*')
        .pipe(cached('build:img'))
        .pipe(plumber({errorHandler: notify.onError()}))      
        .pipe(debug())
        .pipe(imagemin())
        .pipe(debug())
        .pipe(gulp.dest(setTheme.src.build + setTheme.imgDirect))
});

gulp.task('delete:img', function(callback) {
    del.sync(setTheme.src.build + setTheme.imgDirect , {force: true});
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
    gulp.watch(setTheme.src.dev + setTheme.stylesDevDirect +'**/*.less', gulp.series('less'));

    //  img
    gulp.watch(setTheme.imgDevDirect + '**/*.*', gulp.series('build:img')).on('unlink', function(filepath) {
        console.log('\t--remove file /img --');        
        delete  cached.caches['build:img'];
        del.sync(setTheme.src.build + setTheme.stylesDirect, {force: true});
        
    });

    //  fonts
    gulp.watch(setTheme.src.dev + setTheme.fontsDevDirect + '**/*.*', gulp.series('dev:fonts')).on('unlink', function(){
        console.log('\t--remove file fonts --');        
        delete  cached.caches['dev:fonts'];
        del.sync(setTheme.src.build + setTheme.fontsDirect, {force: true});
    });

    //  js
    gulp.watch(setTheme.src.dev + setTheme.jsDevDirect + '**/*.js', gulp.series('dev:js')).on('unlink', function(){
        console.log('\t--remove file js --');        
        delete  cached.caches['dev:js'];
        del.sync(setTheme.src.build + setTheme.jsDirect, {force: true});
    });
    
    //  php
    gulp.watch(setTheme.src.dev + '**/*.php', gulp.series('dev:php')).on('unlink', function(){
        console.log('\t--remove file php --');        
        delete  cached.caches['dev:php'];
        del.sync(setTheme.src.build + '**/*.php', {force: true});
    });

    //  html
    gulp.watch(setTheme.src.dev + '**/*.html', gulp.series('dev:html')).on('unlink', function(){
        console.log('\t--remove file html --');        
        delete  cached.caches['dev:html'];
        del.sync(setTheme.src.build + '**/*.html', {force: true});
    });
}));

gulp.task('dev:watch:test', function() {
   
});




