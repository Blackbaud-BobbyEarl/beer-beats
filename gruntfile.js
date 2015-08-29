/*global module, require */

module.exports = function (grunt) {
    'use strict';
    
    grunt.initConfig({
        buildPath: grunt.option('buildpath') || 'build',
        concat_sourcemap: {
            options: {
                sourcesContent: true,
                sourceRoot: '../..'
            },
            libs: {
                files: {
                    '<%= buildPath %>/js/libs.js': [
                        'bower_components/jquery/dist/jquery.js',
                        'bower_components/bootstrap/dist/js/bootstrap.min.js',
                        'bower_components/angular/angular.js',
                        'bower_components/angular-animate/angular-animate.js',
                        'bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.js',
                        'bower_components/angular-ui-router/release/angular-ui-router.js'
                    ]
                }
            },
            app: {
                files: {
                    '<%= buildPath %>/js/app.js': [
                        'src/index.js',
                        'src/**/*.js',
                        'tmp/templates.js'
                    ]
                }
            }
        },
        copy: {
            html: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['index.html'],
                    dest: '<%= buildPath %>/'
                }]
            }
        },
        sass: {
            libs: {
                options: {
                    style: 'compressed'
                },
                files: {
                    '<%= buildPath %>/css/styles.css': 'src/scss/styles.scss'
                }
            }
        },
        html2js: {
            options: {
                module: 'singingbeer.templates',
                quoteChar: '\'',
                indentString: '    ',
                singleModule: true
            },
            main: {
                src: ['src/pages/**/*.html'],
                dest: 'tmp/templates.js'
            }
        },
        watch: {
            sass: {
                files: ['src/scss/*.scss'],
                tasks: ['sass']
            },
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['concat_sourcemap:app']
            },
            html: {
                files: ['src/index.html'],
                tasks: ['copy:html']
            },
            templates: {
                files: ['src/pages/**/*.html'],
                tasks: ['html2js', 'concat_sourcemap:app']
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concat-sourcemap');
    grunt.loadNpmTasks('grunt-html2js');
    
    grunt.registerTask('default', ['html2js', 'concat_sourcemap', 'sass', 'copy']);
    grunt.registerTask('build', ['default']);
    grunt.registerTask('buildfromsrc', ['copy:dist', 'build']);
};