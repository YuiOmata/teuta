
var App = Vue.extend({})
var router = new VueRouter()

//var URL_BASE = 'https://yuitaso-ok.herokuapp.com';
var song_name = [ 'kinigayo', 'hamamizuki', 'natuiro'];
var create_url_roma = function(song_id){
  return 'public/data/' + song_name[song_id] + '_r.txt';
};

var create_url_kana = function(song_id){
  return 'public/data/' + song_name[song_id] + '_k.txt';
};

Vue.component("links", {
  template: "#links",
  props: ['path'],
});

router.map({
    '/': {
      component: Vue.extend({
        created: function () {
          router.go('/top');
        }
      })
    },
    '/top': {
      component:  Vue.extend({
        template: '#top'
      })
    },
    '/songs': {
      component:  Vue.extend({
        template: '#songs'
      })
    },
    '/game/:song_id': {
      auth: true,
      component: Vue.extend({
        template: '#game',
        data: function(){
          return{
              allKashi: "",//歌詞全体
              allGuid: "",//日本語歌詞全体
              phrases: ['init1', 'init2'],//行ごとに分割した配列
              guitPhrases: []
          };
        },
        created: function () {
          this.loadAllKashi();
        },
        methods: {
          loadAllKashi: function() {
            var self = this;
            $.get(create_url_roma(self.$route.params.song_id), function(data){
              self.allKashi = data;
              //self.phrases = allKashi.split(/\r\n|\r|\n/);
              //console.log(phrases);
              console.log('readed');
            }).fail(function(){
              console.log('fail');
              // alert("Sorry cant load file: click to go select page");
              // router.go('/sands');
            });
            $.get(create_url_kana(self.$route.params.song_id), function(data){
              self.allGuid = data;
              //self.phrases = allKashi.split(/\r\n|\r|\n/);
              //console.log(phrases);
              console.log('readed');
            }).fail(function(){
              console.log('fail');
              // alert("Sorry cant load file: click to go select page");
              // router.go('/sands');
            });

          }
        }
      })
    }
});

router.start(App, '#app')
