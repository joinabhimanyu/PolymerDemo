var gulp = require('gulp'),
	rename = require('gulp-rename'),
	sass = require('gulp-ruby-sass'),
	minifycss = require('gulp-minify-css'),
	autoprefixer = require('gulp-autoprefixer');


function startExpress() {
	var express = require('express');
	var app = express();
	app.use(require('connect-livereload')({port: 4002}));
	app.use(express.static(__dirname));
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');

	var router = express.Router();

	router.use(function(req, res, next) {
		console.log(req.method, req.url);
		next();
	});

	router.get('/index', function(req, res) {
	res.sendfile('index.html');
	});

	app.use('/app', router);

	app.listen(4000, function() {
		console.log('server started');
	});
}

var tinylr;
function startLiveReload() {
	tinylr = require('tiny-lr')();
	tinylr.listen(4002);
}

function notifyLiveReload(event) {
	var fileName = require('path').relative(__dirname, event.path);

	tinylr.changed({
		body: {
			files: [fileName]
		}
	});
}

gulp.task('default', function() {
	startExpress();
	startLiveReload();
	gulp.watch('*.html', notifyLiveReload);
	gulp.watch('public/stylesheets/*.css', notifyLiveReload);
	gulp.watch('public/sass/*.scss', ['styles']);
});

gulp.task('styles', function() {
	return gulp.src('public/sass/*.scss')
    .pipe(sass({ style: 'expanded' }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(gulp.dest('public/stylesheets'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('public/stylesheets'));
});

