# 💀 error-notify

`error-notify`是一个用于监听线上 web 项目的错误信息的。 通过`error-notify`提供的错误消息， 我们可以讲错误信息发送到我们的服务器上记录并分析问题 。包含了浏览器信息、错误消息、错误类型、错误发生的时间、错误发生时所处的页面地址。

*: 目前版本只考虑到客户端渲染的情况。 不支持服务端渲染的项目使用。 不支持CommonJS导入方式

## install

`npm install error-notify -S`

## use

```js
import errorNotify from "error-notify";
import axios from "axios";

errorNotify.init((errorEvent) => {
  const url = "youself server api";
  // 可选axios
  const http = axios.create();
  // 防止接口报错导致循环执行这个回调函数
  if (event.url && event.url === url) {
    return;
  }
  http.post(url, { errorEvent });
});
```

```ts

// types
interface IErrorCallbackPayload {
  type: errorType;
  time: string;
  pageUrl: string;
  url?: string;
  ua: string;
  browserInfo: IBrowserInfo;
  errorMsg: any;
}

type errorType = "consoleError" | "errorEvent" | "promiseRejectionEvent";

interface IBrowserInfo {
  name: string;
  version: string;
}

```

## server
不成熟的测试api服务。 仅供参考， see: https://github.com/chouqing15/error-notify-server
