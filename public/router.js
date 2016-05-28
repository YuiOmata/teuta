
var App = Vue.extend({})
var router = new VueRouter()

var URL_BASE = 'https://yuitaso-ok.herokuapp.com';

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
        // data: function () {
        //   return {
        //     textData: ''
        //   };
        // },
        created: function () {
          //set_polling(this.loadText);
          this.loadText();
        },
        methods: {
          loadText: function() {
            $.get("data/kashi_roma.txt", function(data){
              $("#read_text").text(data);
            })
          }
        }
      })
    }
});

router.start(App, '#app')
