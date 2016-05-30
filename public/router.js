
var App = Vue.extend({})
var router = new VueRouter()

//var URL_BASE = 'https://yuitaso-ok.herokuapp.com';
var song_name = [ 'kinigayo', 'hanamizuki', 'natuiro'];
var create_url_roma = function(song_id){
  return 'public/data/' + song_name[song_id] + '_r.txt';
};
var create_url_kana = function(song_id){
  return 'public/data/' + song_name[song_id] + '_k.txt';
};


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
              phrases: [],//行ごとに分割した配列
              guidPhrases: [],
              isPlaying: false,
              isFinish: false,
              failInput: false,
              finalInput: '',
              onfocus: 0,
              phrasesLength: 0,
              inputString: ['', '', '', '', '', '', '', ''],
              inputChar: '',
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
              self.phrases = self.allKashi.split(/\r\n|\r|\n/);
              self.phrases.pop();
              self.phrasesLength = self.phrases.length;
            }).fail(function(){
              console.log('fail_roma');
            });
            $.get(create_url_kana(self.$route.params.song_id), function(data){
              self.allGuid = data;
              self.guidPhrases = self.allGuid.split(/\r\n|\r|\n/);
              self.guidPhrases.pop();

              //console.log(phrases);
            }).fail(function(){
              console.log('fail_kana');
            });
          },
          gameStart: function(){
              this.isPlaying = true;
          },
          innerRange: function(index){
            return (index>=this.onfocus && index < this.onfocus+3) ? true: false;
          },
          chackLastInput: function(index){
            if( this.inputChar ==  this.phrases[index][this.inputString[index].length]){
              this.inputString[index] = this.inputString[index] + this.inputChar;
            }
            this.inputChar = '';

            console.log(this.inputString[index] + " key up now!" + this.inputString[index].length);

            if( this.phrases[index] == this.inputString[index] )
              this.onfocus++;
            if(this.phrasesLength == this.onfocus){
              this.isPlaying = false;
              this.isFinish = true;
            }
            console.log(this.onfocus);
          }
        }
      })
    },
    'clear': {
      component: Vue.extend({
        template: '#clear'
      })
    }
});

router.start(App, '#app')
