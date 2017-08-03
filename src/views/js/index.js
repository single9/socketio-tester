import Vue from 'vue';
import VueRouter from 'vue-router'
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import autoTester from '../componets/tester/auto.vue';
import normalTester from '../componets/tester/normal.vue';
import bus from '../commons/bus.js';
import Socket from '../commons/socket.js';

const browserUrl = window.location.origin;
const serverSocket = new Socket(browserUrl);

const routes = [
  { name: 'Auto', path: '/tester/auto', component: autoTester, props: true },
  { name: 'Normal', path: '/tester/normal', component: normalTester, props: true }
];

const router = new VueRouter({
  linkActiveClass: 'uk-active',
  routes // short for `routes: routes`
});

Vue.use(VueRouter);

let vm = new Vue({
  el: '#main',
  data: {
    url: browserUrl,
    isOpened: false,
    socket: null,
    message: 'yee'
  },

  watch: {
    isOpened: 'opened',
    '$route': 'changeRoute'
  },

  created () {
  },

  router: router,

  methods: {
    openConnection () {
      if (this.url !== undefined) {
        this.socket = new Socket(this.url);
      }
    },

    setButtons () {
      setTimeout(()=>{
        let sendBtn = document.querySelector('button[name="send"]');
        let openBtn = document.querySelector('button[name="open"]');

        if (this.isOpened) {
          openBtn.innerText = 'Close';
          if (sendBtn) sendBtn.removeAttribute('disabled');
        } else {
          openBtn.innerText = 'Open';
          if (sendBtn) sendBtn.setAttribute('disabled', true);
        }
      }, 100);
    },

    opened () {

      if (this.isOpened) {

        let socketUrl = this.url || '';
        
        if (socketUrl.match(/^http(s{0,1}):\/\/.+/g)) {
          this.openConnection(socketUrl);
        } else {
          this.isOpened = false;
          bus.$emit('error', 'URL is not correct.')
        }

      } else if (typeof(this.socket) === 'object') {
        if (this.socket) this.socket.close();
      }

      this.setButtons();

    },

    changeRoute (p, c) {
      this.setButtons();
    }
  }
});

bus.$on('storage')

bus.$on('setButtons', () => {
  vm.setButtons();
});

bus.$on('error', (data) => {
  UIkit.notification({
      message: data,
      status: 'danger',
      timeout: 5000
  });
});

// loads the Icon plugin
UIkit.use(Icons);

UIkit.sticky('.sticky-bar', {});

// components can be called from the imported UIkit reference
serverSocket.on('reconnect', (data) => {
  location.reload();
});