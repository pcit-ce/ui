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
const JSONFormatter = require('json-formatter-js');

const { Log: pcit_log } = require('@pcit/pcit-js');
const { Artifacts: pcit_artifacts } = require('@pcit/pcit-js');

const token = require('../../common/token');
const pcit_token = token.getToken(location.pathname.split('/')[1]);

let git_type = location.pathname.split('/')[1];
let username = location.pathname.split('/')[2];
let repo = location.pathname.split('/')[3];

let delete_svg = require('../../icon/delete');

//console.log(pcit_token);
module.exports = {
  show: (log, env, job_id = 0, config = null) => {
    //console.log(typeof(env));
    // console.log('show log');
    if (!log) {
      log = '{"pending": "Build log is empty"}';
    }

    let pre_el = $('<div class="build_log"></div>');
    let log_obj;
    try {
      log_obj = JSON.parse(log);
    } catch (e) {
      log_obj = { log };
    }

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

    if ($('.nav.nav-pills.card-header-pills').length) {
      let job_or_build_id = location.pathname.split('/').pop();
      let arr = [];

      $('.build_log_item').on('toggle', null, (res) => {
        let el_id = res.currentTarget.id;

        if (arr[el_id] === undefined) {
          // 展开
          arr[el_id] = true;
          history.replaceState('', '', `#${el_id}`);
        } else {
          arr[el_id] = undefined;
          history.replaceState('', '', `${job_or_build_id}`);
        }
      });
      return;
    }

    let display_el = $('#display');

    // display_el.append(pre_el);
    // .innerHeight(pre_el.innerHeight() + 70);

    let job_or_build_id = location.pathname.split('/').pop();
    let arr = [];

    $('.build_log_item').on('toggle', null, (res) => {
      let el_id = res.currentTarget.id;

      if (arr[el_id] === undefined) {
        // 展开
        arr[el_id] = true;
        history.replaceState('', '', `#${el_id}`);
      } else {
        arr[el_id] = undefined;
        history.replaceState('', '', `${job_or_build_id}`);
      }
    });

    display_el.append(`
<div class="card" style="margin-top: 20px">
    <div class="card-header">
      <ul class="nav nav-pills card-header-pills">
        <li class="nav-item">
          <a class="nav-link active" data-type=log>log</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" data-type=env>env</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" data-type=config>config</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" data-type=artifacts>artifacts</a>
        </li>
      </ul>
</div>
<div class="card-body" style="padding-left:0;padding-right:0;background-color: #24292e;">

    </div>
</div>
`);

    $('.card-header-pills .nav-link').on('click', null, (res) => {
      //console.log(res);
      $('.card-header-pills .nav-link').removeClass('active');
      $(res.currentTarget).addClass('active');

      if (res.currentTarget.dataset.type === 'log') {
        $('.card-body')
          .empty()
          .append(
            `
<div class="btn-group log_handler" role="group" aria-label="log_handler" style="padding-left:10px">
  <button type="button" class="btn btn-secondary" data-type="timestamps">Show timestamps</button>
  <button type="button" class="btn btn-secondary" data-type="raw">
    <a target="_blank" href="//${location.host}/api/job/${job_id}/log"
    style="color:#fff;"
    >View raw logs</a>
  </button>
  <button type="button" class="btn btn-secondary ${
    pcit_token ? null : 'disabled'
  }" data-type="remove">Remove Log</button>
</div>
`,
          )
          .append(pre_el);

        $('.log_handler .btn.btn-secondary').on('click', null, (res) => {
          if (res.currentTarget.dataset.type === 'timestamps') {
            $('.build_log_item_time').toggle();
          }

          if (res.currentTarget.dataset.type === 'remove') {
            new pcit_log(pcit_token, '').delete(job_id);
          }
        });
      }

      if (res.currentTarget.dataset.type === 'env') {
        $('.card-body').empty()
          .append(`<pre style="color: #f1f1f1;padding-left:10px">
${
  env !== 'null'
    ? JSON.stringify(JSON.parse(env), null, 4)
    : '<h5 class="card-title">this build not include global or matrix env</h5>'
}
</pre>
    `);
      }

      if (res.currentTarget.dataset.type === 'config') {
        //console.log(typeof(config));
        const formatter = new JSONFormatter(JSON.parse(config), 3, {
          theme: 'dark',
        });
        //console.log(formatter.render())
        $('.card-body').empty().append(formatter.render());
      }

      if (res.currentTarget.dataset.type === 'artifacts') {
        new pcit_artifacts('', '')
          .list(git_type, username, repo, job_id)
          .then((res) => {
            let basename = '';
            let size = `${size / 1024 / 1024} MB`;

            $('.card-body')
              .empty()
              .append($('<ul class="list-group artifacts-list"></ul>'));

            res.forEach((value, index) => {
              $('.artifacts-list').append(`
<li class="list-group-item">
  <a style="color:#0366d6" href="/api/${git_type}/${username}/${repo}/jobs/${job_id}/artifacts/${
                value.basename
              }/tgz" target="_blank">
          ${value.basename}
  </a>

  <div style="float: right">
    <span>${(value.size / 1024 / 1024).toFixed(2)} MB </span>
    <button type="button" class="btn btn-link" class="delete-artifact" data-name="${
      value.basename
    }" ${pcit_token ? null : 'hidden'}>${delete_svg}</button>
  </div>
</li>
                  `);
            });

            $('.delete-artifact').on('click', null, (res) => {
              const artifact_name = res.currentTarget.dataset.name;
              new pcit_artifacts('', '')
                .delete(git_type, username, repo, job_id, artifact_name)
                .then((res) => {
                  console.log(res);
                });
            });
          });
      }
    });
  },
};
