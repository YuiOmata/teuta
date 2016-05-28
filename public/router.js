
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
        template: '#game'
      }),
      method: {

      }

    }
})

router.start(App, '#app')
