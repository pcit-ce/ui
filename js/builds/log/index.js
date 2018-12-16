module.exports = {
  show: (log, env) => {
    if (!log) {
      log = '{"pending": "Build log is empty"}';
    }

    if (!env) {
      log = {};
    }

    let pre_el = $('<div class="build_log"></div>');
    let log_obj;
    try {
      log_obj = JSON.parse(log);
    } catch (e) {
      log_obj = { log };
    }

    log_obj = Object.assign({}, { env }, log_obj);

    for (let pipeline in log_obj) {
      pre_el.append(`<details class="build_log_item" id="${pipeline}">
<summary><h5 style="display: inline">${pipeline}</h3></summary>
<pre class="build_log_item"><code>${log_obj[pipeline]}</code></pre>
</details>`);
    }

    let display_el = $('#display');

    display_el.append(pre_el);
    // .innerHeight(pre_el.innerHeight() + 70);
  },
};
