try {
  fetch('');
} catch (e) {
  $('body').empty();
  alert('PCIT 只支持现代浏览器，老古板不是 PCIT 的目标用户！！！');

  $('body').html(
    `
    <h1>请下载最新版的 <a href="https://www.google.cn/chrome/">Chrome</a>
    或 <a href="http://www.firefox.com.cn/">火狐浏览器</a>
    使用 PCIT</h1><br><h1>已经安装？复制地址到
    <a>Chrome</a> |
    <a>火狐浏览器</a> |
    <a href="Microsoft-edge:` +
      location.href +
      '">EDGE</a> 打开</h1>',
  );
}
