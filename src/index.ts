import { formatDateTime } from "./utils";
import getBrowserInfo from "./utils/ua";
import type { IBrowserInfo } from "./utils/ua";

export type IErrorCallback = (event: IErrorCallbackPayload) => void;

export interface IErrorCallbackPayload {
  type: errorType;
  time: string;
  pageUrl: string;
  url?: string;
  ua: string;
  browserInfo: IBrowserInfo;
  errorMsg: any;
}

export type errorType = "consoleError" | "errorEvent" | "promiseRejectionEvent";

export interface IConsoleErrorEvent {
  arguments: any[];
}

/**
 * 谁在什么时间什么地点， 做了什么事情， 引发的错误， 发生的错误类型
 *
 * 做了什么事还没实现
 *
 * “谁”是业务系统处理
 */

class ErrorMonitoring {
  public callback: IErrorCallback = null!;

  public init = (callback: IErrorCallback): void => {
    if (!callback) {
      throw new Error("callback is required");
    }
    this.callback = callback;
    this.overrideConsoleErr();
    window.addEventListener("error", this.errorListener);
    window.addEventListener("unhandledrejection", this.promiseRejectListener);
    window.addEventListener(
      "consoleError",
      this.consoleErrorListener as EventListener
    );
  };

  public overrideConsoleErr = (): void => {
    const originalError: typeof console.error = console.error;
    console.error = (...args: any[]): void => {
      originalError.apply(console, args);
      const errorEvent = new CustomEvent<IConsoleErrorEvent>("consoleError", {
        detail: {
          arguments: Array.from(args),
        },
      });
      window.dispatchEvent(errorEvent);
    };
  };

  public generatorErrorLog = (
    errorLog: Omit<
      IErrorCallbackPayload,
      "pageUrl" | "time" | "ua" | "browserInfo"
    >
  ): IErrorCallbackPayload => {
    const { errorMsg = "Uncaught error", type, url } = errorLog;
    const time = new Date();
    const pageUrl = document.location.href || "The page address was not obtained";
    const browserInfo: IBrowserInfo = getBrowserInfo();

    return {
      time: formatDateTime(time),
      pageUrl,
      url,
      errorMsg,
      ua: navigator.userAgent,
      browserInfo,
      type,
    };
  };

  public consoleErrorListener = (
    error: CustomEvent<IConsoleErrorEvent>
  ): void => {
    this.callback(
      this.generatorErrorLog({
        errorMsg: error.detail.arguments.join("|"),
        type: "consoleError",
      })
    );
  };

  public errorListener = (error: ErrorEvent): void => {
    this.callback(
      this.generatorErrorLog({
        errorMsg: error.message,
        type: "errorEvent",
      })
    );
  };

  public promiseRejectListener = (error: PromiseRejectionEvent): void => {
    this.callback(
      this.generatorErrorLog({
        errorMsg: error.reason,
        url: error.reason?.config?.url || null,
        type: "promiseRejectionEvent",
      })
    );
  };

  public clearAllListener = (): void => {
    window.removeEventListener("error", this.errorListener);
    window.removeEventListener(
      "unhandledrejection",
      this.promiseRejectListener
    );
    window.removeEventListener(
      "consoleError",
      this.consoleErrorListener as EventListener
    );
  };
}

export default new ErrorMonitoring();
