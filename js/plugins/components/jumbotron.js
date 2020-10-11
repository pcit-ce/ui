import Vue from 'vue';

export default Vue.component('jumbotron', {
  data: function () {
    return {
      lead: 'Find more plugins to help you build.',
      description: 'PCIT plugin is compatible with Github Action.',
      website: 'https://docs.ci.khs1994.com/plugins/',
      github: 'https://github.com/pcit-plugins',
      classObj: {
        'btn-primary': true,
      },
    };
  },
  template: `
<div class="container" style="margin-bottom:100px">
    <h1 class="display-4">PCIT Plugins</h1>
    <p class="lead">{{lead}}</p>
    <hr class="my-4">
    <p>{{description}}</p>
    <a target="_blank" :class="classObj" class="btn btn-lg" :href="website" role="button">Learn
      more</a>
    <a target="_blank" :class="classObj" class="btn btn-lg" :href="github" role="button">GitHub</a>
</div>
`,
});
