const { column_span_click } = require('../common');
const error_info = require('../error/error').error_info;
import pcit from '@pcit/pcit-js';
// const pcit = require('@pcit/pcit-js');
import branch_icon from '../../icon/branch';

function display(data) {
  let display_element = $('#display').empty().hide();

  if (0 === data.length) {
    display_element
      .append(
        error_info('Not Build Yet, branches not find !', '', '', 'primary'),
      )
      .fadeIn(500);
    // display_element.innerHeight(55);
  } else {
    // console.log(data);

    // display_element.innerHeight(data.length * 20);

    $.each(data, function (num, branch) {
      display_element.append(branch_icon + branch);

      $.each(status, function (id, status) {
        id = id.replace('k', '');

        let stopped_at = status[3];

        if (null == stopped_at) {
          stopped_at = 'Pending';
        } else {
          let d;
          d = new Date(stopped_at * 1000);
          stopped_at = d.toLocaleString();
        }

        display_element.append(`<tr>
<td><a href="" target='_blank'># ${id} </a></td>
<td>${status[0]}</td>
<td>${status[2]}</td>
<td>${stopped_at}</td>
<td><a href="${status[4]}" target='_black'>${status[1]}</a></td>
</tr>
`);
      });

      display_element.append('<hr>');
    });

    // display_element.slideDown(1000);
    display_element.fadeIn(500);
  }
}

export default {
  handle: (url) => {
    // TODO: loading
    $('#display').empty().append(`
<div class="spinner-grow text-secondary" role="status">
    <span class="sr-only"></span>
</div>
`);

    column_span_click('branches');
    const repo = new pcit('', '/api').repo;

    (async () => {
      try {
        let data = await repo.branches.list(
          url.getGitType(),
          url.getRepoFullName(),
        );
        display(data);
      } catch (e) {
        display('');
      }
    })();
  },
};
