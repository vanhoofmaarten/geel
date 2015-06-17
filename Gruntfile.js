/*!
 * Suitstrap's Gruntfile
 * http://suitstrap.maartenvanhoof.be/
 *
 * Copyright 2013-2014 Maarten Van Hoof
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

module.exports = function(grunt) {
	"use strict";

	/* Force use of Unix newlines */
	grunt.util.linefeed = '\n';

	RegExp.quote = function(string) {
		return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
	};

	var fs = require('fs');
	var path = require('path');



  	/* Project configuration. */
	grunt.initConfig({

		/* ==========================================================================
		 * Metadata
		 * ======================================================================== */
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*!\n' +
			' * Geel redesign prototype - <%= pkg.version %> - by @vanhoofmaarten\n' +
			' *\n' +
			' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
			' * Licensed under <%= _.pluck(pkg.licenses, "url").join(", ") %>\n' +
			' */\n',
		jqueryCheck: 'if (typeof jQuery === \'undefined\') { throw new Error(\'Suitstrap\\\'s JavaScript requires jQuery\') }\n\n',



		/* ==========================================================================
		 * Clean
		 * ======================================================================== */
		clean: {
			ghpages: '_gh_pages'
		},


		/* ==========================================================================
		 * Create a custom Modernizr
		 * ========================================================================== */
		modernizr: {

			dist: {
				// [REQUIRED] Path to the build you're using for development.
				"devFile": "remote",

				// [REQUIRED] Path to save out the built file.
				"outputFile": "<%= src %>js/Vendor/modernizr.custom.js",

				"extra": {
					"shiv": true,
					"printshiv": false,
					"load": true,
					"mq": false,
					"cssclasses": true
				},

				"extensibility": {
					"addtest": false,
					"prefixed": false,
					"teststyles": false,
					"testprops": false,
					"testallprops": false,
					"hasevents": false,
					"prefixes": false,
					"domprefixes": false
				},

				// By default, this task will crawl your project for references to Modernizr tests.
				// Set to false to disable.
				"parseFiles": true,

				"uglify": false,

				// When parseFiles = true, this task will crawl all *.js, *.css, *.scss files, except files that are in node_modules/.
				// You can override this by defining a "files" array below.
				"files": {
					"src": [
						"<%= src %>Sass/**/*.scss",
						"<%= src %>js/*.js"
					]
				},
			}

		},



		/* ==========================================================================
		 * JSHint
		 * ======================================================================== */
		jshint: {
			options: {
				jshintrc: 'js/.jshintrc'
			},
			grunt: {
				options: {
					jshintrc: 'grunt/.jshintrc'
				},
				src: ['Gruntfile.js', 'grunt/*.js']
			},
			core: {
				src: 'js/*.js'
			}
		},


		/* ==========================================================================
		 * JSCS // JavaScript Code Style checker
		 * ======================================================================== */
		jscs: {
			options: {
				config: 'js/.jscsrc'
			},
			grunt: {
				src: '<%= jshint.grunt.src %>'
			},
			core: {
				src: '<%= jshint.core.src %>'
			},
			assets: {
				options: {
					requireCamelCaseOrUpperCaseIdentifiers: null
				},
				src: '<%= jshint.assets.src %>'
			}
		},



		/* ==========================================================================
		 * Concat
		 * ======================================================================== */
		concat: {
			options: {
				banner: '<%= banner %>\n<%= jqueryCheck %>',
				stripBanners: false
			},

		},



		/* ==========================================================================
		 * Uglify
		 * ======================================================================== */
		uglify: {
			options: {
				banner: '<%= banner %>',
				report: 'min'
			},
			core: {
				src: '<%= concat.bootstrap.dest %>',
				dest: 'dist/js/<%= pkg.slug %>.min.js'
			},
		},



		/* ==========================================================================
		 * Sass
		 * ======================================================================== */
		sass: {
			compileCore: {
				options: {
					sourceMap: false
				},
				src: 'sass/core.scss',
				dest: 'css/core.css'
			},
		},



		/* ==========================================================================
		 * Autoprefixer
		 * ======================================================================== */
		autoprefixer: {
			options: {
				browsers: [
					'Android 2.3',
					'Android >= 4',
					'Chrome >= 20',
					'Firefox >= 24', // Firefox 24 is the latest ESR
					'Explorer >= 8',
					'iOS >= 6',
					'Opera >= 12',
					'Safari >= 6'
				]
			},
			core: {
				options: {
					map: false
				},
				src: 'css/core.css'
			}
		},



		/* ==========================================================================
		 * CSS Lint
		 * ======================================================================== */
		csslint: {
			options: {
				csslintrc: 'sass/.csslintrc'
			},
			dist: [
				'css/core.css',
			]
		},



		/* ==========================================================================
		 * Minify CSS
		 * ======================================================================== */
		cssmin: {
			options: {
				compatibility: 'ie8',
				keepSpecialComments: '*',
				noAdvanced: true,
				banner: '<%= banner %>',
			},
			minifyCore: {
				src: 'css/core.css',
				dest: 'css/core.min.css'
			},
		},



		/* ==========================================================================
		 * Validation
		 * ======================================================================== */
		validation: {
			options: {
				charset: 'utf-8',
				doctype: 'HTML5',
				failHard: true,
				reset: true,
				relaxerror: [
					'Bad value X-UA-Compatible for attribute http-equiv on element meta.',
					'Element img is missing required attribute src.',
					'Attribute autocomplete not allowed on element input at this point.',
					'Attribute autocomplete not allowed on element button at this point.'
				]
			},
			files: {
				src: '_gh_pages/**/*.html'
			}
		},



		/* ==========================================================================
		 * Find and replace
		 * ======================================================================== */
		sed: {
			versionNumber: {
				pattern: (function() {
					var old = grunt.option('oldver');
					return old ? RegExp.quote(old) : old;
				})(),
				replacement: grunt.option('newver'),
				recursive: true
			}
		},



		/* ==========================================================================
		 * Watch
		 * ======================================================================== */
		watch: {
			grunt : {
				files: '<%= jshint.grunt.src %>',
				tasks: ['jshint:grunt']
			},
			sass: {
				files: ["sass/**/*.scss"],
				tasks: ['styles']
			}
		},



	});



	/*  Define used plugins
		========================================================================== */
	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt, {
		scope: 'devDependencies'
	});



	/*  Define tasks
		========================================================================== */

	// Docs HTML validation task
	grunt.registerTask('default', ['watch']);
	grunt.registerTask('validate-html', ['jekyll', 'validation']);
	grunt.registerTask('styles', ['sass', 'autoprefixer']);

	//grunt.registerTask('docs', ['docs-css', 'lint-docs-css', 'docs-js', 'lint-docs-js', 'clean:docs', 'copy:docs', 'build-customizer']);

	grunt.registerTask('build', ['clean:ghpages', 'sass', 'autoprefixer', 'validation']);
};
