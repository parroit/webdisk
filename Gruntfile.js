'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        watch: {
            test: {
                files: ['**/*.js'],
                tasks: ['mochaTest'],
                options: {
                    spawn: true
                }
            },
            server: {
                files: ['lib/**/*.js'],
                tasks: ['express'],
                options: {
                    spawn: false
                }
            }
        },
        
        express: {

            server: {
                options: {
                    script: 'lib/server.js'
                }
            }
        },

        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/**/*.js']
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-express-server');


    grunt.registerTask('server', 'watch:server');
    grunt.registerTask('test', 'mochaTest');
    grunt.registerTask('watch-test', 'watch:test');


};