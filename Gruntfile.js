module.exports = function(grunt){

  require('time-grunt')(grunt);

  var projectName = 'Bump';

  var port      = 3006;
  var host      = 'localhost';
  
  var srcDir    = 'src/';
  var distDir   = 'dist/';
  var webDir    = 'website/';
  var publicDir = webDir + 'public/';
  var nodeDir   = 'node_modules/';
  var docDir    = 'doc/';
  var zipDir    = 'zip/';

  var src       = [ srcDir + projectName.toLowerCase() + '.js',
                    srcDir + 'physics.js',
                    srcDir + 'collision.js',
                    srcDir + 'scene.js',
                  ];
  
  var dependencies = ['Type6js/dist/*.js'];
  
  var banner    = '/** MIT License\n' +
    '* \n' +
    '* Copyright (c) 2011 Ludovic CLUBER \n' +
    '* \n' +
    '* Permission is hereby granted, free of charge, to any person obtaining a copy\n' +
    '* of this software and associated documentation files (the "Software"), to deal\n' +
    '* in the Software without restriction, including without limitation the rights\n' +
    '* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n' +
    '* copies of the Software, and to permit persons to whom the Software is\n' +
    '* furnished to do so, subject to the following conditions:\n' +
    '*\n' +
    '* The above copyright notice and this permission notice shall be included in all\n' +
    '* copies or substantial portions of the Software.\n' +
    '*\n' +
    '* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n' +
    '* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n' +
    '* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n' +
    '* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n' +
    '* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n' +
    '* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\n' +
    '* SOFTWARE.\n' +
    '*\n' +
    '* http://' + projectName.toLowerCase() + 'js.lcluber.com\n' +
    '*/\n';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      lib:{
        src: [  distDir + '*',
                publicDir + 'js/*'
              ]
      },
      web:{
        src: [  docDir    + '*',
                zipDir    + '*',
                webDir    + 'static/*',
                webDir    + 'sass/build/*',
                publicDir + 'js/*',
                publicDir + 'css/*',
                publicDir + 'fonts/*'
              ]
      }
    },
    jshint: {
      options: {
        jshintrc: 'config/.jshintrc'
      },
      lib: [ 'Gruntfile.js', srcDir + '**/*.js'],
      web: [ webDir + 'js/**/*.js'],
    },
    sass: {
      dist: {
        options: {
          trace:true
        },
        files: [{
          expand: true,
          cwd: webDir + 'sass/',
          src: ['*.scss'],
          dest: webDir + 'sass/build/',
          ext: '.css'
        }]
      }
    },
    csslint: {
      dist: {
        options: {
          import: false
        },
        src: [webDir + 'sass/build/**/*.css']
      }
    },
    cssmin:{
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: [{
          src: webDir  + 'sass/build/**/*.css',
          dest: publicDir + 'css/style.min.css'
        }]
      }
    },
    jsdoc: {
      dist : {
        src: src,
        config: 'config/jsdoc-conf.json'
      }
    },
    pug: {
      compile: {
        options: {
          namespace   : 'JST',
          separator   : '\n\n',
          amd         : false,
          client      : false,
          pretty      : true,
          self        : false,
          debug       : false,
          compileDebug: true,
          globals     : []
        },
        files: [ {
          cwd: webDir + 'views',
          src: ['**/*.pug', '!**/_*.pug'],
          dest: webDir + 'static',
          expand: true,
          ext: '.htm'
        } ]
      }
    },
    htmlmin: {
      static: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        expand: true,
        cwd: webDir + 'static',
        src: ['**/*.htm'],
        dest: webDir + 'static/'
      }
    },
    uglify: {
      lib: {
        options: {
          beautify: true,
          banner: banner,
          mangle: false,
          compress:false,
        },
        src: src,
        dest: distDir + projectName.toLowerCase() + '.js'
      },
      libmin: {
        options: {
          sourceMap: false,
          sourceMapName: srcDir + 'sourcemap.map',
          banner: banner,
          mangle: {
            except: [projectName.toUpperCase()],
          },
          compress: {
            sequences: true,
            properties: true,
            dead_code: true,
            unsafe: false,
            conditionals:true,
            comparisons:true,
            booleans:true,
            loops:true,
            unused: true,
            hoist_funs:true,
            if_return:true,
            join_vars:true,
            cascade:true,
            warnings: true,
            drop_console: false,
            keep_fargs: false,
            keep_fnames: false
          }
        },
        src: src,
        dest: distDir + projectName.toLowerCase() + '.min.js'
      },
      web: {
        options: {
          sourceMap: false,
          sourceMapName: srcDir + 'sourcemap.map',
          mangle: {
            except: ['jQuery']
          },
          banner: '',
          compress: {
            sequences: true,
            properties: true,
            dead_code: true,
            unsafe: false,
            conditionals:true,
            comparisons:true,
            booleans:true,
            loops:true,
            unused: true,
            hoist_funs:true,
            if_return:true,
            join_vars:true,
            cascade:true,
            warnings: true,
            drop_console: false,
            keep_fargs: false,
            keep_fnames: false
          }
        },
        files: [{
          src  : [
            nodeDir + 'jquery-easing/jquery.easing.1.3.js',
            webDir  + 'js/**/*.js'
          ],
          dest : publicDir + 'js/main.min.js'
        }]
      }
    },
    concat:{
      webjs: {
        options: {
          separator: '',
          stripBanners: true,
          banner: ''
        },
        src: [nodeDir   + 'jquery/dist/jquery.min.js',
              nodeDir   + 'bootstrap/dist/js/bootstrap.min.js',
              nodeDir   + 'Taipanjs/dist/taipan.min.js',
              nodeDir   + 'FrameRatjs/dist/framerat.min.js',
              distDir   + 'dependencies/*.min.js',
              distDir   + projectName.toLowerCase() + '.min.js',
              publicDir + 'js/main.min.js'
            ],
        dest: publicDir + 'js/main.min.js'
      },
      webcss: {
        options: {
          separator: '',
          stripBanners: true,
          banner: ''
        },
        src: [nodeDir + 'font-awesome/css/font-awesome.min.css',
              nodeDir + 'bootstrap/dist/css/bootstrap.min.css',
              publicDir + 'css/style.min.css'
            ],
        dest: publicDir + 'css/style.min.css'
      }
    },
    symlink: {
      options: {
        overwrite: false,
        force: false
      },
      dependencies:{
        expand: true,
        cwd: nodeDir,
        src: dependencies,
        dest: distDir + 'dependencies/',
        flatten: true,
        filter: 'isFile'
      },
      fonts:{
        expand: true,
        cwd: nodeDir + 'bootstrap/dist/',
        src: ['fonts/**/*'],
        dest: publicDir,
        filter: 'isFile'
      },
      fontAwesome:{
        expand: true,
        cwd: nodeDir + 'font-awesome/',
        src: ['fonts/**/*'],
        dest: publicDir,
        filter: 'isFile'
      },
      public: {
        expand: true,
        cwd: publicDir,
        src: ['**/*'],
        dest: webDir + 'static/public/'
      },
      doc: {
        expand: true,
        cwd: docDir,
        src: ['**/*'],
        dest: webDir + 'static/' + docDir
      }
    },
    compress: {
      main: {
        options: {
          archive: zipDir + projectName.toLowerCase() + 'js.zip'
        },
        files: [
          {expand: true, cwd: webDir + 'static/', src: '**', dest: '/'},
          {expand: true, cwd: publicDir, src: '**', dest: '/public'},
          {src: [ distDir + '**',
                  docDir + '**',
                  'LICENCE.md',
                  'README.md',
                  'RELEASE_NOTES.md'
                ],
                dest: '/', filter: 'isFile'}
        ]
      }
    },
    nodemon: {
      dev: {
        script: 'bin/www',
        options: {
          //nodeArgs: ['--debug'],
          delay:1000,
          watch: ['website/routes', 'website/app.js'],
          ext: 'js,scss'
        }
      }
    },
    open: {
      all: {
        path: 'http://' + host + ':' + port
      }
    },
    watch: {
      lib: {
        files: srcDir + '**/*.js',
        tasks: ['src', 'doc'],  
      },
      webpug:{
        files: webDir + 'views/**/*.pug'
      },
      webjs: {
        files: webDir + 'js/**/*.js',
        tasks: ['website:js'],
      },
      webcss: {
        files: webDir + 'sass/**/*.scss',
        tasks: ['website:css', 'static'],
      },
      options: {
        interrupt: true,
        spawn: false,
        livereload: true,
        livereloadOnError:false
      }
    },
    // run watch and nodemon at the same time
    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      tasks: [ 'nodemon', 'watch', 'open' ]
    }
  });

  grunt.loadNpmTasks( 'grunt-contrib-clean' );
  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
  grunt.loadNpmTasks( 'grunt-contrib-uglify' );
  grunt.loadNpmTasks( 'grunt-contrib-csslint' );
  grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
  grunt.loadNpmTasks( 'grunt-contrib-concat' );
  grunt.loadNpmTasks( 'grunt-contrib-pug' );
  grunt.loadNpmTasks( 'grunt-contrib-sass' );
  grunt.loadNpmTasks( 'grunt-contrib-htmlmin' );
  grunt.loadNpmTasks( 'grunt-contrib-symlink' );
  grunt.loadNpmTasks( 'grunt-contrib-compress' );
  grunt.loadNpmTasks( 'grunt-contrib-watch' );
  grunt.loadNpmTasks( 'grunt-jsdoc' );
  grunt.loadNpmTasks( 'grunt-concurrent' );
  grunt.loadNpmTasks( 'grunt-nodemon' );
  grunt.loadNpmTasks( 'grunt-open' );
  

  grunt.registerTask( 'dist',
                      'build release distribution for prosuction',
                      [ 'jshint', 'clean', 'jsdoc', 'sass', 'cssmin', 'pug', 'uglify', 'symlink:dependencies', 'symlink:fonts', 'symlink:fontAwesome', 'concat', 'symlink:public', 'symlink:doc', 'htmlmin', 'compress' ]
                    );

  grunt.registerTask( 'serve',
                      'serve files, open website and watch for changes.',
                      [ 'jshint', 'clean', 'jsdoc', 'sass', 'cssmin', 'pug', 'uglify', 'symlink:dependencies', 'symlink:fonts', 'symlink:fontAwesome', 'concat', 'symlink:public', 'symlink:doc', 'compress', 'concurrent' ]
                    );

  grunt.registerTask( 'doc',
                      'build jsdoc into /doc',
                      [ 'jsdoc' ]
                    );

  grunt.registerTask( 'src',
                      'build library into /dist',
                      [ 'jshint:lib', 'clean:lib', 'uglify', 'symlink:dependencies', 'concat:webjs' ]
                    );

  grunt.registerTask( 'website:js',
                      'build necessary js files for website into /website/public/js',
                      [ 'jshint:web', 'uglify:web', 'symlink:dependencies', 'concat:webjs' ]
                    );

  grunt.registerTask( 'website:css',
                      'build sass for website into /website/public/css',
                      [ 'sass', 'csslint', 'cssmin', 'concat:webcss' ]
                    );

  grunt.registerTask( 'website:static',
                      'build static version of the website into /website/static',
                      [ 'pug', 'htmlmin', 'symlink:fonts', 'symlink:fontAwesome', 'symlink:public', 'symlink:doc' ]
                    );

  grunt.registerTask( 'zip',
                      'create the  package',
                      ['compress']
                    );
};
