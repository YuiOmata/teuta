
var App = Vue.extend({})
var router = new VueRouter()

//var URL_BASE = 'https://yuitaso-ok.herokuapp.com';
var song_name = [ 'kinigayo', 'hamamizuki', 'natuiro'];
var create_url = function(song_id){
console.log(song_id);
  return 'public/data/' + song_name[song_id] + '_r.txt';
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
              allKashi: 'init kashi',//歌詞全体
              phrases: ["init1", "init2"]//行ごとに分割した配列
          };
        },
        created: function () {
          //set_polling(this.loadText);
          this.loadText();
        },
        methods: {
          loadText: function() {
            var self = this;
            self.allKashi = "new data";
            $.get(create_url(self.$route.params.song_id), function(data){
              self.allKashi = data;
              //self.phrases = allKashi.split(/\r\n|\r|\n/);
              console.log('readed');
            }).fail(function(){
              console.log('fail');
              // alert("Sorry cant load file: click to go select");
              // router.go('/sands');
            });
          }
        }
      })
    }
});

router.start(App, '#app')
