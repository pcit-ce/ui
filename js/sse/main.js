function connectSSE() {
  let sse = new EventSource('/sse/server');
  let reconnectTimeout;
  sse.onopen = function () {
    document.getElementById('sse').innerHTML = 'open';
  };

  sse.onmessage = async function (evt) {
    document.getElementById('sse').innerHTML = `
data: ${evt.data} <br>
lastEventId: ${evt.lastEventId} <br>
readyState: ${sse.readyState} <br>
`;

    clearTimeout(reconnectTimeout);
  };

  sse.onerror = function () {
    document.getElementById('sse').innerHTML = 'error';
  };

  // 对应服务器发来的消息的 event: foo 字段
  sse.addEventListener('foo', (event) => {
    document.getElementById('sse').innerHTML = 'foo event ' + event.data;
    sse.close();

    const reconnectTime = +e.data;
    const currentTime = +new Date();

    // 返回一个 id,后续使用 clearTimeout() 取消执行
    // 如果方法还未被执行，我们可以使用 clearTimeout() 来阻止它。
    reconnectTimeout = setTimeout(() => {
      connectSSE();
    }, reconnectTime - currentTime);
  });

  sse.addEventListener('close', () => {
    console.log('sse close');
    sse.close();
  });
}

connectSSE();
