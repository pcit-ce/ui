/**
 *
 * @param string time 2020-02-19T10:22:48
 */
function getTime(time) {
  if (!time || time === '') {
    return 0;
  }
  let year = time.substr(0, 4);
  let month = time.substr(5, 2);
  let day = time.substr(8, 2);
  let hour = time.substr(11, 2);
  let min = time.substr(14, 2);
  let sec = time.substr(17, 2);
  let date = new Date();
  date.setFullYear(year, month - 1, day);
  date.setHours(hour, min, sec);
  return date.getTime();
}

let Ansi_convert = require('ansi-to-html');
let ansi_convert = new Ansi_convert();

module.exports = {
  show: (log, env) => {
    // console.log('show log');
    if (!log) {
      log = '{"pending": "Build log is empty"}';
    }

    if (!env) {
      env = 'this build not include global or matrix env';
    }

    let pre_el = $('<div class="build_log"></div>');
    let log_obj;
    try {
      log_obj = JSON.parse(log);
    } catch (e) {
      log_obj = { log };
    }

    log_obj = Object.assign({}, { env }, log_obj);

    if ($('.build_log').length) {
      // console.log('empty old log');
      pre_el = $('.build_log');
      pre_el.html(null);
    }

    for (let pipeline in log_obj) {
      let log = log_obj[pipeline];
      if (log === null) {
        log = '';
      }
      let line = log.split('\n');

      let build_step_log = '';

      let startSec = 0;
      let time;

      line.forEach((element, index) => {
        // 遍历每行 log
        time = element.substr(0, 30);
        let content;
        if (time.substr(-1) === 'Z') {
          time = time.substr(0, 19);
          if (index === 0) {
            startSec = getTime(time);
          }
          content = element.substr(30);
        } else {
          // content is env
          time = '';
          content = element;
        }

        content = ansi_convert.toHtml(content);

        let build_step_log_line = `<span class="build_log_item_line">${
          index + 1
        }</span>`;
        let build_step_log_time = `<code class="build_log_item_time">${time}</code>`;
        let build_step_log_content = `<code class="build_log_item_content">${content}</code>`;

        build_step_log +=
          build_step_log_line +
          build_step_log_time +
          build_step_log_content +
          '<br>';
      });

      let run_time = parseInt((getTime(time) - startSec) / 1000) + 's';

      pre_el.append(
        `<details class="build_log_item" id="${pipeline}">` +
          `<summary><h5 style="display: inline">${pipeline}</h5>` +
          `<span class="build_log_item_run_time">${run_time}</span></summary>` +
          `<pre class="build_log_item">${build_step_log}</pre></details>`,
      );
    }

    if ($('.build_log').length) {
      let job_id = location.pathname.split('/').pop();
      let arr = [];

      $('.build_log_item').on('toggle', null, (res) => {
        let el_id = res.currentTarget.id;

        if (arr[el_id] === undefined) {
          // 展开
          arr[el_id] = true;
          history.replaceState('', '', `#${el_id}`);
        } else {
          arr[el_id] = undefined;
          history.replaceState('', '', `${job_id}`);
        }
      });
      return;
    }

    let display_el = $('#display');

    display_el.append(pre_el);
    // .innerHeight(pre_el.innerHeight() + 70);

    let job_id = location.pathname.split('/').pop();
    let arr = [];

    $('.build_log_item').on('toggle', null, (res) => {
      let el_id = res.currentTarget.id;

      if (arr[el_id] === undefined) {
        // 展开
        arr[el_id] = true;
        history.replaceState('', '', `#${el_id}`);
      } else {
        arr[el_id] = undefined;
        history.replaceState('', '', `${job_id}`);
      }
    });
  },
};
