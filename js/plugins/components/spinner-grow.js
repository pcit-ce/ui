import Vue from 'vue';

export default Vue.component('spinner-grow', {
  data: function () {
    return {};
  },
  props: [],
  template: `
<div class="spinner-grow" role="status">
  <span class="sr-only"></span>
</div>
`,
});
