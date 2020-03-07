import Vue from 'vue';

Vue.component('appx', {
  props: ['repo'],
  template: '<li>{{repo.name}}</li>',
});

var app = new Vue({
  el: '#app1',
  data: {
    repos: [
      { name: 'repo1', status: 'pending' },
      { name: 'repo2', status: 'success' },
    ],
  },
  methods: {},
});
