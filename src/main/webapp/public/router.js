var App = Vue.extend({})
var router = new VueRouter()

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
    '/initPage/:song_id':{
      component:  Vue.extend({
        template: '#initPage'
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
              phrasesLength: 0,//
              stillStart: false,//以下ふらぐ共
              isPlaying: true,
              isClear: false,
              failInput: false,
              onfocus: 0,//処理中の行
              inputString: '',
              inputChar: '',
              combo: 0,
              maxCombo: 0
          };
        },
        created: function () {
          this.loadAllKashi();
        },
        computed: {
          inputStringCurrent: function(index){
            return this.inputString;
          },
          getCombo: function(){
            return this.combo;
          },
          getMaxCombo: function(){
            return this.maxCombo;
          }
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
              this.stillStart = false;
              this.isPlaying = true;
          },
          innerRange: function(index){
            return (index>=this.onfocus && index < this.onfocus+3) ? true: false;
          },
          checkLastInput: function(index){
            if( this.inputChar ==  this.phrases[ index ][ this.inputString.length ] ){//入力正誤判定
              this.inputString = this.inputString + this.inputChar;
              this.failInput = '';
              this.combo++;
            }
            else {
              this.failInput = this.inputChar;
              if(this.combo > this.maxCombo)
                this.maxCombo = this.combo;
              this.combo = 0;
            }
            this.inputChar = '';

            if( this.inputString == this.phrases[ index ] ){//行終了判定
              this.onfocus++;
              this.inputString = '';
            }
            if( this.onfocus == this.phrasesLength ){//クリア判定
              this.isPlaying = false;
              this.isClear = true;
            }
          }
        }
      })
    },
    '/setRanking': {
      component: Vue.extend({
        template: '#clear'
      })
    }
});

router.start(App, '#app')
