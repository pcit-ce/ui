function mouseoutMethod(el) {
  $(el).css({
    color: '#000',
    'border-bottom-style': 'none',
  });
}

function mouseoverMethod(el) {
  $(el).css({
    //color: 'green',
    'border-bottom-color': '#d1d5da',
    'border-bottom-style': 'solid',
  });
}

function more_options_click_handler(id) {
  if (id === 'trigger_build') {
    return;
  }

  $('#pull_requests').after(() => {
    let span_el = $(
      '<span id="column_more_options" class="col-md-1 col-12 text-center"></span>',
    );

    return span_el.append(id.slice(0, 1).toUpperCase() + id.slice(1));
  });
}

module.exports = {
  mouseoutMethod,
  mouseoverMethod,
  column_span_click: (id) => {
    let span_el = $('column > #' + id);
    span_el.css('color', 'green');
    span_el.css({
      'border-bottom-style': 'solid',
      'border-bottom-color': 'green',
    });
  },
  column_click_handle: (id) => {
    // build job 导航栏
    if (-1 !== $.inArray(id, ['buildNav', 'jobNav'])) {
      id === 'buildNav' &&
        $('#buildNav').show().css({
          color: 'green',
          'border-bottom-style': 'solid',
        });

      if (id === 'jobNav') {
        $('#buildNav').show();
        $('#jobNav').show().css({
          color: 'green',
          'border-bottom-style': 'solid',
        });
      }

      return;
    }

    let column_el = $('.column .main');

    if (
      -1 !==
      $.inArray(id, ['', 'settings', 'requests', 'caches', 'trigger_build'])
    ) {
      more_options_click_handler(id);
      // 点击 more_options main 去色
      column_el.css('color', '#000000').css('border-bottom-style', 'none');
      $('.column #column_more_options').css({
        color: 'green',
        'border-bottom-style': 'solid',
      });

      // 启用 main 导航鼠标移出事件
      column_el.off('mouseout').on({
        mouseout() {
          mouseoutMethod($(this));
        },
      });

      return;
    }

    // 移除其他元素的颜色
    column_el.css({ color: '#000000', 'border-bottom-style': 'none' });
    // 启用其他元素的鼠标移出事件
    column_el.off('mouseout').on({
      mouseout() {
        mouseoutMethod($(this));
      },
    });

    // 关闭该元素的鼠标移出事件
    $(`#${id}`).off('mouseout');

    // 最后对被点击元素上色
    $(`#${id}`).css({
      color: 'green',
      'border-bottom-style': 'solid',
      'border-bottom-color': 'green',
    });
  },
  column_remove: () => {
    // 移除四个主要元素之外的元素
    $('#buildNav').hide();
    $('#jobNav').hide();
    $('#column_ico').remove();
    $('#column_more_options').remove();
  },
};
