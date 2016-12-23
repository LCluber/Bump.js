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
    '* http://' + projectName.toLowerCase() + '.lcluber.com\n' +
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
                webDir    + 'static/*',
                publicDir + 'js/*',
                publicDir + 'css/*',
                webDir    + 'sass/build/*',
                publicDir + 'fonts/*',
                zipDir    + '*'
              ]
      }
    },
    copy: {
      main: {
        files: [
          { expand: true,
            cwd: nodeDir + 'bootstrap/dist/fonts/',
            src: ['**'],
            dest: publicDir + 'fonts/',
            filter: 'isFile'
          },
          { expand: true,
            cwd: nodeDir + 'font-awesome/fonts/',
            src: ['**'],
            dest: publicDir + 'fonts/',
            filter: 'isFile'
          }
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
          banner: '',
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
          banner: '',
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
      lib: {
        options: {
          separator: '\n',
          stripBanners: false,
          banner: banner
        },
        src: [nodeDir + 'Type6js/dist/type6.js', distDir + projectName.toLowerCase() + '.js'],
        dest: distDir + projectName.toLowerCase() + '.js'
      },
      libmin: {
        options: {
          separator: '\n',
          stripBanners: true,
          banner: banner
        },
        src: [nodeDir + 'Type6js/dist/type6.min.js', distDir + projectName.toLowerCase() + '.min.js'],
        dest: distDir + projectName.toLowerCase() + '.min.js'
      },
      webjs: {
        options: {
          separator: '',
          stripBanners: true,
          banner: ''
        },
        src: [nodeDir   + 'jquery/dist/jquery.min.js',
              nodeDir   + 'bootstrap/dist/js/bootstrap.min.js',
              nodeDir   + 'FrameRatjs/dist/framerat.min.js',
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
          { src: [distDir + '*'], dest: '/', filter: 'isFile'},
          { src: [docDir + '**'], dest: '/', filter: 'isFile'},
          { expand: true, cwd: webDir + 'static/', src: '**', dest: '/'},
          { expand: true, cwd: publicDir, src: '**', dest: '/public'},
          { src: ['LICENCE.txt'], dest: '/'},
          { src: ['README.md'], dest: '/'},
          { src: ['RELEASE_NOTES.md'], dest: '/'},
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
        tasks: ['js'],
      },
      webcss: {
        files: webDir + 'sass/**/*.scss',
        tasks: ['css', 'static'],
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
  grunt.loadNpmTasks( 'grunt-contrib-copy' );
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
  

  grunt.registerTask('default', [ 'jshint', 'clean', 'copy', 'jsdoc', 'sass', 'cssmin', 'pug', 'uglify', 'concat', 'symlink', 'compress' ]); //build all for release

  grunt.registerTask('prod', [ 'clean:web', 'copy', 'jsdoc', 'sass', 'cssmin', 'pug', 'uglify:web', 'concat', 'htmlmin', 'compress' ]); //build for prod on the server
  
  grunt.registerTask('serve', [ 'concurrent' ]); //serve files, open website watch for changes and.

  grunt.registerTask('doc', [ 'jsdoc' ]); //build jsdoc into /doc
  grunt.registerTask('src', [ 'jshint:lib', 'clean:lib', 'uglify', 'concat:lib', 'concat:libmin', 'concat:webjs' ]); //build library into /dist
  //website
  grunt.registerTask('js', [ 'jshint:web', 'uglify:web', 'concat:webjs' ]); //build js into /website/public/js
  grunt.registerTask('css', [ 'sass', 'csslint', 'cssmin', 'concat:webcss' ]); //build sass into /website/public/css
  grunt.registerTask('static', [ 'pug', 'htmlmin', 'symlink' ]); //build static website into /website/static

  grunt.registerTask('zip', [ 'compress' ]); //compress the project in a downloadable static package

};
