
var gulp = require('gulp'),
	rename = require('gulp-rename'),
	cache = require('gulp-cache'),
	uglify = require('gulp-uglify'),
	notify = require('gulp-notify'),

	csslint = require('gulp-csslint'),
	minifyCSS = require('gulp-minify-css'),
	csscss = require('gulp-csscss'),

	jshint = require('gulp-jshint'),
	concat = require('gulp-concat'),

	htmlhint = require("gulp-htmlhint"),
	htmlmin = require('gulp-htmlmin'),

	buildConfig = require('./build.json')
;

// Lint Task
gulp.task('lint', function() {
	gulp.src([ 'js/**/*.js', '!js/vendor/**/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(notify(function(file) {
			if(file.jshint.success) return false;

			return "JSHint failed";
		}));
	gulp.src('css/*.css')
		.pipe(csslint({
			"adjoining-classes": false,
			"box-sizing": false,
			"box-model": false,
			"compatible-vendor-prefixes": false,
			"duplicate-background-images": false,
			"floats": false,
			"font-sizes": false,
			"gradients": false,
			"important": false,
			"known-properties": false,
			"outline-none": false,
			"qualified-headings": false,
			"regex-selectors": false,
			"shorthand": false,
			"text-indent": false,
			"unique-headings": false,
			"universal-selector": false,
			"unqualified-attributes": false
		}))
		.pipe(csslint.reporter())
		.pipe(notify(function(file) {
			if(file.csslint.success) return false;

			return "CSSLint failed";
		}));
});

// Minify HTML
gulp.task('minify-html', function() {
	gulp.src('pages/*.html')
		.pipe(htmlmin({
			collapseWhitespace: true
		}))
		.pipe(gulp.dest('site/'))
});

// Concatenate & Minify CSS
gulp.task('minify-css', function() {
	gulp.src([ 'css/*.css', '!css/ie.css' ])
		.pipe(concat('style.css'))
		.pipe(gulp.dest('site/css'))
		.pipe(minifyCSS({
			keepBreaks:false
		}))
		.pipe(rename('style.min.css'))
		.pipe(gulp.dest('site/css'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
	gulp.src([ 'js/**/*.js', '!js/vendor/piwik.js'])
		.pipe(concat('scripts.js'))
		.pipe(gulp.dest('site/js'))
		.pipe(rename('scripts.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('site/js'));
});

// HTML Hint
gulp.task('htmlhint', function() {
	gulp.src('pages/*.html')
	.pipe(htmlhint())
	.pipe(htmlhint.reporter())
});

gulp.task('extras', function() {
	gulp.src(buildConfig.assets.extras, { base: './' })
		.pipe(gulp.dest('site'));
});


// Watch Files For Changes
gulp.task('watch', function() {
	gulp.watch('css/*.css', ['lint', 'minify-css']);
	gulp.watch([ 'js/**/*.js' ], [ 'scripts' ]);
	gulp.watch('pages/*.html', ['minify-html']);
	gulp.watch('site/**/*.html', function(e) {
		gulp.src(e.path)
			.pipe(htmlhint())
			.pipe(htmlhint.reporter())
			.pipe(notify(function(file) {
				if(file.htmlhint.success) return false;

				return "HTMLHint failed";
			}));
	});

	gulp.watch(buildConfig.assets.extras, [ 'extras' ]);
});

// Default Task
gulp.task('default', ['lint', 'htmlhint', 'minify-css', 'minify-html', 'scripts', 'watch']);
