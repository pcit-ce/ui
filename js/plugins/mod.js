import Vue from 'vue';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery';
import 'popper.js';

import './components/jumbotron';
import './components/spinner-grow';
import './components/plugins';

let app = new Vue({
  el: '#app',
  data: {
    loading: true,
    plugins: [],
  },
  computed: {},
  watch: {},
});

fetch('/plugins/metadata')
  .then((res) => {
    return res.json();
  })
  .then((res) => {
    app.plugins = res;
    app.loading = false;
  });
