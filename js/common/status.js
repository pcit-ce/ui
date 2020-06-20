const token = require('./token');
const url = require('../builds/url').default;
const ucfirst = require('../common/util').ucfirst;
const pending_icon = require('../icon/steps/running');

function buttonChange(handle) {
  if (handle === 'cancel') {
    return { handle: 'restart', title: 'Restart' };
  }

  return { handle: 'cancel', title: 'Cancel' };
}

function getColor(status, backgroud) {
  let status_color;

  if (status === 'success') {
    status_color = backgroud ? '#deecdb' : '#39aa56';
  } else if (
    status === 'in_progress' ||
    status === 'pending' ||
    status === 'queued'
  ) {
    status_color = backgroud ? '#faf6db' : '#edde3f';
  } else if (status === 'cancelled') {
    status_color = backgroud ? '#f1f1f1' : '#9d9d9d';
  } else {
    status_color = backgroud ? '#fbe8e2' : '#db4545';
  }

  return status_color;
}

module.exports = {
  getColor: (status, backgroud = false) => {
    return getColor(status, backgroud);
  },

  getClassName(status) {
    let className = 'default';

    if (-1 !== $.inArray(status, ['passed', 'failed', 'canceled', 'errored'])) {
      className = status;
    }

    return className;
  },

  getIcon: (status) => {
    const passed_svg =
      '<svg t="1583507787749" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="28445" width="20" height="20"><path d="M136.24 550.608a19.552 19.552 0 0 1-1.632-24.48l22.88-31.12a15.648 15.648 0 0 1 22.096-3.28l155.648 119.28c21.024 16.128 54.592 15.424 74.848-1.44l435.072-362.448c6.736-5.616 17.344-5.104 23.648 1.12l18.992 18.768a15.872 15.872 0 0 1-0.016 22.608L396.064 773.536a31.696 31.696 0 0 1-45.008-0.624L136.24 550.608z" fill="#39aa56" p-id="28446"></path></svg>';
    switch (status) {
      case 'passed':
        return passed_svg;
      case 'failed':
        return '<svg t="1583507240107" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="19254" width="16" height="16"><path d="M579.89594179 507.94104382l409.91382033-407.79164695c19.38290755-19.28644459 19.48087729-50.53874467 0.19443123-69.92165222-19.33015428-19.42661724-50.52819429-19.48087729-69.91110187-0.19443122L510.07376756 437.86867005 103.62505644 30.18252818c-19.23972135-19.2849378-50.53573113-19.38290755-69.9186372-0.09796973-19.33769109 19.2849378-19.38441434 50.58245435-0.09796973 69.96536191l406.35074136 407.58817211L30.2428168 915.18104815c-19.38441434 19.28644459-19.48087729 50.53573113-0.19744624 69.92165222 9.64171552 9.69446734 22.34761774 14.58239639 35.05351993 14.58239639 12.60944073 0 25.22340175-4.78995933 34.86662405-14.38796517l409.81434235-407.64092539 410.16251158 411.39843557c9.64171552 9.69597558 22.30390804 14.54019495 35.00830348 14.54019493 12.65917898 0 25.26861821-4.84421938 34.91033372-14.4422252 19.33015428-19.2849378 19.38290755-50.52819429 0.09796974-69.91110185L579.89594179 507.94104382 579.89594179 507.94104382zM579.89594179 507.94104382" p-id="19255" fill="#db4545"></path></svg>';
      case 'errored':
        return '<svg t="1583506790867" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14219" width="20" height="20"><path d="M468.114 621.714c7.315 21.943 21.943 36.572 43.886 36.572s36.571-14.629 43.886-36.572l29.257-402.285c0-43.886-36.572-73.143-73.143-73.143-43.886 0-73.143 36.571-73.143 80.457l29.257 394.971zM512 731.43c-43.886 0-73.143 29.257-73.143 73.142s29.257 73.143 73.143 73.143 73.143-29.257 73.143-73.143S555.886 731.43 512 731.43z" p-id="14220" fill="#db4545"></path></svg>';
      case 'canceled':
        return '<svg t="1583507515894" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26673" width="20" height="20"><path d="M511.104 0C228.821333 0 0 228.821333 0 511.104c0 282.282667 228.821333 511.104 511.104 511.104 282.282667 0 511.104-228.842667 511.104-511.104C1022.208 228.821333 793.386667 0 511.104 0zM511.104 898.496c-213.973333 0-387.434667-173.44-387.434667-387.413333 0-213.952 173.44-387.413333 387.434667-387.413333 213.952 0 387.392 173.44 387.392 387.413333C898.496 725.056 725.056 898.496 511.104 898.496z" p-id="26674" fill="#9d9d9d"></path><path d="M236.437333 463.914667l549.333333 0 0 96.874667-549.333333 0 0-96.874667Z" p-id="26675" fill="#9d9d9d"></path></svg>';
    }

    return pending_icon;
  },

  change: (status) => {
    switch (status) {
      case 'in_progress':
        return 'started';
      case 'pending':
        return 'created';
      case 'queued':
        return 'created';
      case 'failure':
        return 'failed';
      case 'success':
        return 'passed';
      case 'error':
        return 'errored';
      case 'cancelled':
        return 'canceled';
    }

    return status;
  },

  getButton: (status) => {
    if (
      status === 'pending' ||
      status === 'in_progress' ||
      status === 'queued'
    ) {
      return { handle: 'cancel', title: 'Cancel' };
    }

    return { handle: 'restart', title: 'Restart' };
  },
  buttonChange: (handle) => {
    return buttonChange(handle);
  },
  buttonClick: (that) => {
    let handle = that.attr('handle');
    let type = that.attr('job_or_build'); // build or job
    let id = that.attr('event_id');

    that.attr('title', ucfirst(handle) + ' ' + type + ' ...');

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'post',
        headers: {
          Authorization: 'token ' + token.getToken(url.getGitType()),
        },
        url: '/api/' + [type, id, handle].join('/'),
        success: () => {
          let { handle: button_handle, title: button_title } = buttonChange(
            handle,
          );

          that.attr({
            handle: button_handle,
            title: button_title + type,
          });

          resolve();
        },
        error: (e) => {
          reject(e);
        },
      });
    });
  },
};
