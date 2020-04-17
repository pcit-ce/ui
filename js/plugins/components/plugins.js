import Vue from 'vue';

export default Vue.component('plugins', {
  props: ['plugins'],
  template: `
<div class="row row-cols-1 row-cols-md-3">
  <div class="col mb-3" v-for="plugin in plugins">
    <div class="card border-info" style="width: 18rem;">
      <div class="card-header">{{plugin.tags}}</div>
      <div class="card-body text-info">
        <h5 class="card-title">{{plugin.$id}}</h5>
        <h6 class="card-subtitle mb-2 text-muted">{{plugin.author}}</h6>
        <p class="card-text">{{plugin.description}}</p>
        <a :href="plugin.github" class="card-link" target="_blank">GitHub</a>
        <a :href="plugin.comment" class="card-link" target="_blank">Website</a>
      </div>
    </div>
  </div>
</div>
`,
});
