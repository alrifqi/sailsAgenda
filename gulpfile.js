var gulp = require('gulp'), gutil = require('gulp-util'), uglify = require('gulp-uglify'), watch = require('gulp-watch'), concat = require('gulp-concat'), compass = require('gulp-compass'), minifyCSS = require('gulp-minify-css'), notify = require('gulp-notify'), ncp = require('ncp'), sourcemaps = require('gulp-sourcemaps'), less = require('gulp-less');

gulp.task('sass', function() {
	gulp.src('./app/styles/**/*.scss').pipe(compass({
            css: 'css',
            sass: 'sass'            
        })).pipe(minifyCSS()).pipe(gulp.dest('./assets/styles')).pipe(notify({
      		message : "Sass files are processed!"
    	}));
});


gulp.task('bowerjs', function() {
	// main app js file
	var vendorjs = ['./app/bower_components/angular/angular.js',
		'./app/bower_components/angular-route/angular-route.js',
		'./app/bower_components/hammerjs/hammer.js',
		'./app/bower_components/angular-hammer/angular-hammer.js',
		'./app/bower_components/json3/lib/json3.js',
		'./app/bower_components/modernizr/modernizr.js',
		'./app/bower_components/moment/min/moment.min.js',
		// './app/bower_components/angular-strap/dist/angular-strap.js',
		// './app/bower_components/angular-strap/dist/angular-strap.tpl.js',
		'./app/bower_components/angular-bootstrap/ui-bootstrap.min.js',
		'./app/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
		'./app/bower_components/smart-table/Smart-Table.debug.js',
		'./app/bower_components/angular-file-model/angular-file-model.js',
		'./app/bower_components/angular-sails/dist/angular-sails.js',
		'./app/bower_components/angular-sails/ng-socket-io.min.js'];
	
	gulp.src(vendorjs,{base:'app/bower_components/'}).pipe(uglify()).pipe(concat('bower-vendor.min.js')).pipe(gulp.dest('./assets/js/abower/')).pipe(notify({
      message : "Bower Component JS files are now processed!"
    }));
});

gulp.task('sailsbasejs', function(){
	var sailsbasejs = ['./assets/js/socket.io.js',
		'./assets/js/sails.io.js',
		'./assets/js/app.js'];

	gulp.src(sailsbasejs, {base:'assets/js/'}).pipe(concat('sailsbase.min.js')).pipe(gulp.dest('./assets/js/sailsmin/')).pipe(notify({
		message:"Sails Base JS are now processed!"
	}));
});

gulp.task('angularviews', function(){
	ncp('./app/views', './assets/views/', function(err){
		if(err) {
			throw err;
		} else {
			notify({
				message:"Angular Views Copied"
			});
		}
	});
});

gulp.task('angularappjs', function(){
	var angularjsapp = ['./app/scripts/app.js',
		'./app/scripts/models/*.js',
		'./app/scripts/controllers/*.js']

	gulp.src(angularjsapp, {base:'app/scripts/'}).pipe(concat('agendaapp.min.js')).pipe(gulp.dest('./assets/js/agendaapp/')).pipe(notify({
		message:"AgendaApp Angular App JS are now processed!"
	}));
});


gulp.task('watch', function() {
	// watch scss files
	gulp.watch('./app/**/*.scss', function() {
		gulp.run('sass');
	});

	gulp.watch('./app/**/*.js', function() {
		gulp.run('bowerjs');
		gulp.run('angularappjs');
		gulp.run('sailsbasejs');
	});

	gulp.watch('./app/**/*.html', function(){
		gulp.run('angularviews');
	});
});

gulp.task('default', ['sass', 'sailsbasejs', 'angularappjs', 'bowerjs', 'angularviews', 'watch']);