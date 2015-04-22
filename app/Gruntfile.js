module.exports = function(grunt) {

  grunt.initConfig({
    jade: {
          compile: {
            options: {
              data: {
                dev:true
              },
              pretty: true
            },
            files: {
              "public/index.html":"views/index.jade"
            }
        },
        release: {
            options: {
              data: {
                dev:false
              },
              pretty: true
            },
            files: {
              "public/index.html":"views/index.jade"
            }
        },
    },
    watch: {
      "jade:compile":{
        files:["views/*.jade"],
        tasks:["jade:compile"]
      }
    },
    // concat:{
    //   options:{
    //     seperator:";",
    //   },
    //   dist：{
    //     src: ['public/scripts/test-scatter.js','public/scripts/expandable.js'],
    //     dest: 'public/scripts/built.js'
    //   }
    // },
    uglify:{
      built:{
        files:{
          "public/dist/main.min.js":['public/scripts/test-scatter.js','public/scripts/expandable.js']
        }
      }
    },
    express:{
      dev:{
        options:{
          script:'index.js'
        }
      }
    },
    // requirejs: {
    //   compile: {
    //     options: {
    //       baseUrl: "public",
    //       name: "scripts/test-scatter",
    //       paths: {
    //           echarts: "./libraries/echarts/build/dist/echarts",
    //           scatter:"./libraries/echarts/build/dist/chart/scatter",
    //           app: "./scripts"
    //       },
    //       out: "dist/compiled"
    //     }
    //   }
    // }
  });

  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.registerTask('default', ['express:dev','watch']);
  grunt.registerTask('release',['jade:release','uglify']);
   // grunt.registerTask('r',['requirejs']);
};