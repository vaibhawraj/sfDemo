/*
  Three type of builds : 
      build : Same as build-dev
      build-compressed : Generates build with compression
      build-dev : Generates build for development
      build-apk-dev : Preprocess files to build project in demo/www directory in uncompressed form
      build-apt : Generates build for Production
*/
module.exports = function(grunt) {

  grunt.initConfig({
    clean : {
      build_dev: [
        'build/*'
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

          //** BUILD FOR ANDROID **//
          build_config_apk : {
            options: {
              srcDir : 'src',
              context: {NODE_ENV: 'apk',COMPRESS:false}  //NODE_ENV -- developement / apk
            },
            files: {
                "build/config/appconfig.json": "src/config/appconfig.json",
                "build/config/appScope.json": "src/config/appScope.json",
                "build/bootconfig.json" : "src/config/bootconfig.json",
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
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks("grunt-preprocess");

  grunt.registerTask('build-dev',['copy:build_dev','preprocess:build_dev','preprocess:build_js_dev','preprocess:build_config_dev']);
  grunt.registerTask('build',['build-dev']);
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