var App = Vue.extend({})
var router = new VueRouter()

var song_name = [ 'kimigayo', 'hanamizuki', 'natsuiroegao'];
var fullScore = [5760, 17840, 35840];
var create_path_roma = function(song_id){
  return 'public/data/text/' + song_name[song_id] + '_r.txt';
};
var create_path_kana = function(song_id){
  return 'public/data/text/' + song_name[song_id] + '_k.txt';
};

var URL_BASE = "http://yuitaso-ok-api.herokuapp.com/users";
//var URL_BASE = "http://localhost:3000/users";
var create_url = function(endpoint){
  return URL_BASE + endpoint;
};

Vue.component("g-header", {
  template: "#g-header",
  props: ['title', 'path'],
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
            failInput: '',//誤字
            onfocus: 0,//打ち込み中の行
            onplaying: 0,//再生中の行
            inputString: '',
            inputChar: '',
            combo: 0,
            maxCombo: 0,
            fullCombo: 0,
            totalInputChars: 0,
            score: 4323
        };
      },
      created: function () {
        this.loadAllKashi();
        //this.playMusic();
      },
      computed: {
        inputStringCurrent: function(index){
          return this.inputString;
        },
        getCombo: function(){
          return this.combo;
        }
      },
      methods: {
        playMusic: function(){
            document.write(
              '<audio id="sound" src="public/data/music/' +
              + this.$route.params.song_id +
              '.mp3" autoplay></audio>'
            );
            document.write("<script type=\"text/javascript\">"
              + "if(window.name!=\"load\"){location.reload();"
              + "window.name=\"load\"};</script>"
            );
        },
        loadAllKashi: function() {
          var id = this.$route.params.song_id;
          var self = this;
          $.get(create_path_roma(id), function(data){
            self.allKashi = data;
            self.phrases = self.allKashi.split(/\r\n|\r|\n/);
            self.phrases.pop();
            self.phrasesLength = self.phrases.length;
            self.fullCombo = self.allKashi.length - self.phrases.length;
            console.log(self.fullCombo);
          }).fail(function(){
            console.log('fail to road data _r');
          });
          $.get(create_path_kana(id), function(data){
            self.allGuid = data;
            self.guidPhrases = self.allGuid.split(/\r\n|\r|\n/);
            self.guidPhrases.pop();
            // console.log(self.guidPhrases);
          }).fail(function(){
            console.log('fail to road data _k');
          });
        },
        innerRange: function(index){
          return (index>=this.onfocus && index < this.onfocus+3) ? true : false;
        },
        checkLastInput: function(index){
          if( this.inputChar ==  this.phrases[ index ][ this.inputString.length ] ){//入力正誤判定
            this.inputString = this.inputString + this.inputChar;
            this.failInput = '';
            this.combo++;
            this.totalInputChars++;
          }
          else
          {
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
            this.score = (this.maxCombo * 50 + this.totalInputChars*30 ) / fullScore[ this.$route.params.song_id ] * 100000;//得点
            this.score = Math.floor(this.score);
            console.log(this.score);
            this.isPlaying = false;
            this.isClear = true;
          }
        },
        unload: function(){
          // document.write(
          //     "<script type=\"text/javascript\">"
          //   + "function onUnload(){"
          //   + "window.name = 0;}"
          //   + "</script>"
          // );
        }
      }
    })
  },
  '/setRanking/:score': {
    component: Vue.extend({
      template: '#setRanking',
      data: function(){
        return {
          score: this.$route.params.score,
          name2: ''
        };
      },
      methods: {
        setScore: function(){
          var self = this
          // console.log("set score");
          $.ajax({
            url: create_url('/setRank'),
            type: 'POST',
            scriptCharset:"UTF-8",
            dataType: 'json',
            data: JSON.stringify({
              name: self.name2,
              score: self.score
            })
          }).done(function (data) {
            console.log("sucsess to connect DB!");
            router.go('/lookRanking');
          }).fail(function(){
            console.log("fail sed ranking");
            router.go('/setRanking/' + self.$route.params.score);
          });
          //router.go('/lookRanking');
        }
      }
    })
  },
  '/lookRanking': {
    component: Vue.extend({
      template: "#lookRanking",
      data: function(){
        return{
          users: []
        }
      },
      created: function(){
        this.fetch_users();
      },
      methods: {
        fetch_users: function(){
          var self = this;
          $.ajax({
            url: create_url('/getRank'),
            type: 'GET',
            dataType: 'json'
          }).done(function (data) {
            self.users = data;
            console.log(self.users);
          }).fail(function () {
            console.log("fail to load json");
          });

        }
      }
    })
  }
});

router.start(App, '#app')
