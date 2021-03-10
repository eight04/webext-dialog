webext-dialog
=============

![Github Build](https://github.com/eight04/webext-dialog/workflows/.github/workflows/test.yml/badge.svg)

![Windows 10, Firefox 87](https://i.imgur.com/RUI5Yhg.png)
![Windows 10, Chrome 89](https://i.imgur.com/9aFY1lI.png)

A dialog service built with popups.

Installation
------------

```
npm install webext-dialog
```

Permission
-----------

This library doesn't use extra permissions. Only `browser.tabs` and `browser.windows` are used.

Usage examples
--------------

The dialog UI is built inside a popup. You have to create an HTML file and load the setup script. For example, create `my-dialog.html`:

```html
<html>
<script type="module">
import "webext-dialog/popup"; // suppose your bundler can handle this correctly
</script>
</html>
```

In extension scripts, you can use it like:

```js
import {createDialogService} from "webext-dialog";

const dialog = createDialogService({path: "my-dialog.html"});

await dialog.alert("Alert");

console.log(await dialog.confirm("Are you sure?"));

console.log(await dialog.prompt("Write some text", "default value"));
```

There are also pre-built bundles that can be included as scripts directly. Example:

*my-dialog.html*
```html
<html>
<script src="path/to/webext-dialog/dist/browser/webext-dialog-popup.js"></script>
<html>
```

*manifest.json*
```json
{
  background: {
    scripts: [
      "path/to/webext-dialog/dist/browser/webext-dialog.js",
      "background.js"
    ]
  }
}
```

*background.js*
```js
const dialog = webextDialog.createDialogService({ // access the module with global variable
  path: "my-dialog.html"
});

await dialog.alert("Alert");
```

API Reference
-------------

`webext-dialog` exports following members:

* `createDialogService` - create a dialog service.

`webext-dialog/popup` exports nothing. By importing this module, it setups dialog UI and event handler that will work with the dialog service.

### createDialogService

```js
createDialogService({
  path: String,
  getMessage: (key: String) => String,
  width?: Number,
  height?: Number
}) => DialogService
```

`path` should point to your popup HTML. See the usage part for more examples.

`getMessage` accepts a key and return an i18n string. This library uses following keys:

| Key    | Default message |
|--------|-----------------|
| ok     | OK              |
| cancel | Cancel          |

`width` and `height` decides the size of the popup. Default: `520`, `320`.

### DialogService

#### open

```js
async open({
  width?: Number,
  height?: Number,
  default?: any,
  prompt?: Boolean,
  buttons: Array<{text: String, value?: any}>,
  message: String
}) => DialogResult
```

`width` and `height` would overwrite default width and height.

`default` is the default value that will be returned when the popup is closed without clicking any button.

If `prompt` is `true` then display a `<textarea>` in the dialog.

`buttons` array is used to build button bar. `text` is the content of the button and `value` will be returned when clicked. If `value` is `undefined` and `prompt` is `true`, it will use the value of `<textarea>`.

`message` is the dialog message.

#### alert, confirm, prompt

```js
async alert(text)
async confirm(text) => Boolean
async prompt(text, defaultValue) => String | null
```

They work like builtin prompts.

Changelog
---------

* 0.1.0 (Next)

    - First release.
