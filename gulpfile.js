var src = "./src";
var dist = "dist/";
var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject  = ts.createProject('./tsconfig.json', { noImplicitAny: true });
gulp.task('tsc', function () {
    gulp.src([src+'**/*.ts'])
        .pipe(tsProject())
        .pipe(gulp.dest(dist));
});
gulp.task('watch',()=>{
    gulp.watch([src+'**/*.ts'],['tsc'])
})
gulp.task('default',['tsc','watch']);