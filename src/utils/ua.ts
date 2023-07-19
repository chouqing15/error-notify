export interface IBrowserMatchers {
  Firefox: RegExp;
  Chrome: RegExp;
  Safari: RegExp;
  Edge: RegExp;
  Opera: RegExp;
  InternetExplorer: RegExp;
}

export interface IBrowserInfo {
  name: string;
  version: string;
}

const userAgent: string = navigator.userAgent;

function getBrowserInfo(): IBrowserInfo {
  const browserInfo: IBrowserInfo = {
    name: "",
    version: "",
  };

  const browserMatchers: IBrowserMatchers = {
    Firefox: /Firefox\/([\d.]+)/,
    Chrome: /Chrome\/([\d.]+)/,
    Safari: /Version\/([\d.]+)/,
    Edge: /Edge\/([\d.]+)/,
    Opera: /(?:Opera|OPR)\/([\d.]+)/,
    InternetExplorer: /rv:([\d.]+)/,
  };

  let browser: keyof IBrowserMatchers;

  for (browser in browserMatchers) {
    if (browserMatchers.hasOwnProperty(browser)) {
      const regex: RegExp = browserMatchers[browser];
      if (regex.test(userAgent)) {
        const version: any[] = userAgent.match(regex) || [];
        browserInfo.name = browser;
        browserInfo.version = version[1] || "";
        break;
      }
    }
  }

  return browserInfo;
}

export default getBrowserInfo;
