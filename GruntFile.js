/*
  Three type of builds : 
      build : Same as build-dev
      build-compressed : Generates build with compression
      build-dev : Generates build for development
      build-apk-dev : Preprocess files to build project in demo/www directory in uncompressed form
      build-apk : Generates build for Production
*/
module.exports = function(grunt) {

  grunt.initConfig({
    clean : {
      build_dev: [
        'build/*'
      ],
      build_apk_dev: [
        'cordova/demo/www/*'
      ]
    },
    copy : {
          build_dev : {
            files:[
              {expand: true,cwd: 'lib/',src: ['angularjs/*'], dest: 'build/lib/'},
              {expand: true,cwd: 'lib/',src: ['forcetk/*'], dest: 'build/lib/'},
              {expand: true,cwd: 'lib/',src: ['jquery/jquery-1.12.3.js'], dest: 'build/lib/'},
              {expand: true,cwd: 'lib/',src: ['jquery-mobile/jquery.mobile-1.4.5.js',
                                              'jquery-mobile/jquery.mobile-1.4.5.css'
                                              ], dest: 'build/lib/'},
              {expand: true,cwd: 'lib/',src: ['jquery-popup/*'], dest: 'build/lib/'},
              {expand: true,cwd: 'lib/',src: ['requirejs/*'], dest: 'build/lib/'},
              {expand: true,cwd: 'lib/',src: ['underscore/*'], dest: 'build/lib/'},
              {expand: true,cwd: 'lib/',src: ['xml2json/*'], dest: 'build/lib/'},


              //Src Copy
              {expand: true,cwd: 'src/',src: ['images/**/*'], dest: 'build/'},
              {expand: true,cwd: 'src/',src: ['img/**/*'], dest: 'build/'},
              ]
          },
          build_apk_dev : {
            files:[
              {expand: true,cwd: 'lib/',src: ['angularjs/*'], dest: 'cordova/demo/www/lib/'},
              {expand: true,cwd: 'lib/',src: ['forcetk/*'], dest: 'cordova/demo/www/lib/'},
              {expand: true,cwd: 'lib/',src: ['jquery/jquery-1.12.3.js'], dest: 'cordova/demo/www/lib/'},
              {expand: true,cwd: 'lib/',src: ['jquery-mobile/jquery.mobile-1.4.5.js',
                                              'jquery-mobile/jquery.mobile-1.4.5.css'
                                              ], dest: 'cordova/demo/www/lib/'},
              {expand: true,cwd: 'lib/',src: ['jquery-popup/*'], dest: 'cordova/demo/www/lib/'},
              {expand: true,cwd: 'lib/',src: ['requirejs/*'], dest: 'cordova/demo/www/lib/'},
              {expand: true,cwd: 'lib/',src: ['underscore/*'], dest: 'cordova/demo/www/lib/'},
              {expand: true,cwd: 'lib/',src: ['xml2json/*'], dest: 'cordova/demo/www/lib/'},


              //Src Copy
              {expand: true,cwd: 'src/',src: ['images/**/*'], dest: 'cordova/demo/www/'},
              {expand: true,cwd: 'src/',src: ['img/**/*'], dest: 'cordova/demo/www/'},
              ]
          }
    },
    preprocess: {
          build_dev: {
            options: {
              srcDir : 'src',
              context: {NODE_ENV: 'development',COMPRESS:false}  //NODE_ENV -- developement / apk
            },
            files: {
                "build/index.html": "src/index.html",
                "build/oauthcallback.html": "src/oauthcallback.html",
                "build/proxy.php": "src/proxy.php",
            }
          },
          build_css_dev : {
            options: {
                srcDir : 'src',
                context: {NODE_ENV: 'development',COMPRESS:false}  //NODE_ENV -- developement / apk
              },
              src : ["css/*.css","css/**/*.css"],
              cwd : "src",
              dest : "build",
              expand : true
          },
          build_js_dev : {
              options: {
                srcDir : 'src',
                context: {NODE_ENV: 'development',COMPRESS:false}  //NODE_ENV -- developement / apk
              },
              src : ["js/controller/*.js","js/helper/*.js", "js/sfdc/*.js","js/localDB/*.js", "js/*.js"],
              cwd : "src",
              dest : "build",
              expand : true
          },
          build_config_dev : {
            options: {
              srcDir : 'src',
              context: {NODE_ENV: 'development',COMPRESS:false}  //NODE_ENV -- developement / apk
            },
            files: {
                "build/config/appconfig.json": "src/config/appconfig.js",
                "build/config/appScope.json": "src/config/appScope.json",
                "build/config/sfObjectMapping.json": "src/config/sfObjectMapping.json"
            }
          },


          /* BUILD FOR ANDROID*/
          build_apk_dev: {
            options: {
              srcDir : 'src',
              context: {NODE_ENV: 'apk',COMPRESS:false}  //NODE_ENV -- developement / apk
            },
            files: {
                "cordova/demo/www/index.html": "src/index.html",
            }
          },
          build_css_apk_dev : {
            options: {
                srcDir : 'src',
                context: {NODE_ENV: 'apk',COMPRESS:false}  //NODE_ENV -- developement / apk
              },
              src : ["css/*.css","css/**/*.css"],
              cwd : "src",
              dest : "cordova/demo/www",
              expand : true
          },
          build_js_apk_dev : {
              options: {
                srcDir : 'src',
                context: {NODE_ENV: 'apk',COMPRESS:false}  //NODE_ENV -- developement / apk
              },
              src : ["js/controller/*.js","js/helper/*.js", "js/sfdc/*.js","js/localDB/*.js", "js/*.js"],
              cwd : "src",
              dest : "cordova/demo/www",
              expand : true
          },
          
          build_config_apk : {
            options: {
              srcDir : 'src',
              context: {NODE_ENV: 'apk',COMPRESS:false}  //NODE_ENV -- developement / apk
            },
            files: {
                "cordova/demo/www/config/appconfig.json": "src/config/appconfig.js",
                "cordova/demo/www/config/appScope.json": "src/config/appScope.json",
                "cordova/demo/www/bootconfig.json" : "src/config/bootconfig.json",
                "cordova/demo/www/config/sfObjectMapping.json": "src/config/sfObjectMapping.json"
            }
          }
    },
    watch:{
      scripts: {
        files:['src/js/**/*.js'],
        tasks:['preprocess:build_js_dev'],
        options:{spawn:false}
      },
      configs : {
        files:['src/config/*.js','src/config/*.json'],
        tasks:['preprocess:build_config_dev'],
        options:{spawn:false}
      },
      html: {
        files:['src/template/*.html','src/*.html'],
        tasks:['preprocess:build_dev'],
        options:{spawn:false}
      },
      css: {
        files:['src/css/*.css','src/css/**/*.css'],
        tasks:['preprocess:build_css_dev'],
        options:{spawn:false}
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks("grunt-preprocess");

  grunt.registerTask('build-dev',['copy:build_dev','preprocess:build_dev','preprocess:build_js_dev','preprocess:build_config_dev','preprocess:build_css_dev']);
  grunt.registerTask('build-apk-dev',['copy:build_apk_dev','preprocess:build_apk_dev','preprocess:build_js_apk_dev','preprocess:build_config_apk','preprocess:build_css_apk_dev']);
  grunt.registerTask('build',['build-apk-dev']);
  grunt.registerTask('default', 'Log some stuff.', function() {
    console.log('Please use following syntax');
    console.log('\t$ grunt build-chrome')
  });
};

/*
  grunt-contrib-copy Usage :
      // includes files within path 
      {expand: true, src: ['path/*'], dest: 'dest/', filter: 'isFile'},
 
      // includes files within path and its sub-directories 
      {expand: true, src: ['path/**'], dest: 'dest/'},
 
      // makes all src relative to cwd 
      {expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'},
 
      // flattens results to a single level 
      {expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'},

*/