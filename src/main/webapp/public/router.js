var App = Vue.extend({})
var router = new VueRouter()

var song_name = [ 'kimigayo', 'hanamizuki', 'natsuiroegao'];
var create_pass_roma = function(song_id){
  return 'public/data/text/' + song_name[song_id] + '_r.txt';
};
var create_pass_kana = function(song_id){
  return 'public/data/text/' + song_name[song_id] + '_k.txt';
};

var BASE_URL = 'https://postgres://zcbumiblajsywg:lZzE-HfNK2qHipBBF_RW2pAAE1@ec2-54-243-249-56.compute-1.amazonaws.com:5432/d3vmush3j7ukme';
var create_url_database = function(){
  return 'BASE_URL' + '/scorebord';
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
      template: '#songs',
    })
  },
  '/startGame/:song_id':{
    component:  Vue.extend({
      template: '#startGame'
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
            isPlaying: true,//進行中フラグ
            isClear: false,//終了済みフラグ
            failInput: false,//誤字
            onfocus: 0,//打ち込み中の行
            onplaying: 0,//再生中の行
            inputString: '',
            inputChar: '',
            combo: 0,
            maxCombo: 0,
            fullCombo: 0
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
        playMusic: function(){
            document.write('<audio src=public/data/music/'
            + this.$route.params.song_id +
            '.mp3 autoplay></audio>')
        },
        loadAllKashi: function() {
          var self = this;
          $.get(create_pass_roma(self.$route.params.song_id), function(data){
            self.allKashi = data;
            self.phrases = self.allKashi.split(/\r\n|\r|\n/);
            self.phrases.pop();
            self.phrasesLength = self.phrases.length;
            self.fullCombo = self.allKashi.length - self.phrases.length;
            // console.log(self.phrases);
          }).fail(function(){
            console.log('fail to road data _r');
          });
          $.get(create_pass_kana(self.$route.params.song_id), function(data){
            self.allGuid = data;
            self.guidPhrases = self.allGuid.split(/\r\n|\r|\n/);
            self.guidPhrases.pop();
            // console.log(self.guidPhrases);
          }).fail(function(){
            console.log('fail to road data _k');
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
            if(this.combo > this.maxCombo) this.maxCombo = this.combo;
            this.combo = 0;
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
