/* global $inline */
import React, {createRef} from "jsx-dom";

const id = new URLSearchParams(location.search).get("id");

browser.runtime.sendMessage({
  method: "dialogInit",
  id
})
  .then(init)
  .catch(console.error);

function init({prompt, message, value, buttons}) {
  const valueEl = createRef();
  const css = $inline('style.css|cssmin|stringify');
  
  document.body.append(
    <form class={['webext-dialog-container', prompt && 'webext-dialog-prompt']}>
      <span class='webext-dialog-message'>{message}</span>
      <textarea class='webext-dialog-value' ref={valueEl}>{value || ''}</textarea>
      <div class='webext-dialog-button-bar'>
        {buttons.map(({text, value}) =>
          <button type="button" onClick={() => handleClick(value)}>{text}</button>
        )}
      </div>
      <style>{css}</style>
    </form>
  );
  
  function handleClick(buttonValue) {
    if (buttonValue === undefined && prompt) {
      buttonValue = valueEl.current.value;
    }
    browser.runtime.sendMessage({
      method: "dialogResolve",
      id,
      value: buttonValue
    }).catch(console.error);
  }
}
