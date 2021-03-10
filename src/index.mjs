export function createDialogService({
  path,
  getMessage,
  width: defaultWidth = 520,
  height: defaultHeight = 320
}) {
  async function open({
    width = defaultWidth,
    height = defaultHeight,
    default: default_,
    ...options
  }) {
    const id = `${location.href}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const {promise, resolve} = defer();
    
    const handleMessage = message => {
      if (message.method === "dialogInit" && message.id === id) {
        return Promise.resolve(options);
      }
      if (message.method === "dialogResolve" && message.id === id) {
        resolve(message.value);
      }
    };
    
    browser.runtime.onMessage.addListener(handleMessage);
    
    let w;
    try {
      w = await browser.windows.create({
        width,
        height,
        url: browser.runtime.getURL(path) + `?id=` + encodeURIComponent(id)
      });
      return await Promise.race([
        promise,
        waitTab(w.tabs[0].id).then(() => default_)
      ]);
    } catch (err) {
      console.error(err);
      return default_;
    } finally {
      browser.runtime.onMessage.removeListener(handleMessage);
      if (w) {
        try {
          await browser.windows.remove(w.id);
        } catch (err) {
          console.warn(err);
        }
      }
    }
  }
  
  return {
    open,
    alert: message => open({
      // type: "alert",
      buttons: [{
        text: getMessage("ok")
      }],
      message
    }),
    confirm: message => open({
      // type: "confirm",
      buttons: [{
        text: getMessage("ok"),
        value: true
      }, {
        text: getMessage("cancel"),
        value: false
      }],
      message,
      default: false
    }),
    prompt: (message, value) => open({
      // type: "prompt",
      prompt: true,
      buttons: [{
        text: getMessage("ok")
      }, {
        text: getMessage("cancel"),
        value: null
      }],
      message,
      default: null,
      value
    })
  };
}

function waitTab(id) {
  return new Promise(resolve => {
    browser.tabs.onRemoved.addListener(function handle(removedId) {
      if (id === removedId) {
        browser.tabs.onRemoved.removeListener(handle);
        resolve();
      }
    });
  });
}

function defer() {
  const o = new Promise((resolve, reject) => {
    o.resolve = resolve;
    o.reject = reject;
  });
  return o;
}
