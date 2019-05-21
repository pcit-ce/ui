// unixTime is php time()
// js time = php time() * 1000
const formatTime = unixTime => {
  const nowTime = new Date().getTime();

  const diff = nowTime / 1000 - unixTime;

  let int;

  // 秒
  if (diff < 0) {
    return '';
  }

  if (diff < 60) {
    return `${diff.toFixed(0)} s ago`;
  }
  // 分
  if (diff < 60 * 60) {
    int = Math.floor(diff / 60);

    return int <= 1 ? ' a minute ago' : int + ' minutes ago';
  }
  // 时
  if (diff < 60 * 60 * 24) {
    int = Math.floor(diff / 60 / 60);

    return int <= 1 ? ' a hour ago' : int + ' hours ago';
  }
  // 天
  if (diff < 60 * 60 * 24 * 30) {
    int = Math.floor(diff / 60 / 60 / 24);

    return int <= 1 ? 'a day ago' : int + ' days ago';
  }
  // 月
  if (diff < 60 * 60 * 24 * 30 * 12) {
    int = Math.floor(diff / 60 / 60 / 24 / 30);

    return int <= 1 ? ' a month ago' : int + ' months ago';
  }
  // 年
  int = Math.floor(diff / 60 / 60 / 24 / 365);

  return int <= 1 ? ' a year ago' : int + ' years ago';
};

const formatTotal = total => {
  // 秒
  if (total < 0) {
    return '';
  }

  if (total < 60) {
    return `${total.toFixed(0)} s`;
  }
  // 分
  if (total < 60 * 60) {
    let int = Math.floor(total / 60);

    return int <= 1 ? ' a minute' : int + ' minutes';
  }
  // 时
  if (total < 60 * 60 * 24) {
    let int = Math.floor(total / 60 / 60);

    return int <= 1 ? ' a hour' : int + ' hours';
  }
  // 天
  if (total < 60 * 60 * 24 * 30) {
    let int = Math.floor(total / 60 / 60 / 24);

    return int <= 1 ? 'a day' : int + ' days';
  }

  return '-';
};

module.exports = {
  formatTime,
  // 格式化总用时
  formatTotal,
};
