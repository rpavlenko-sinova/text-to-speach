console.log('👻 Offscreen document loaded');

chrome.runtime.onMessage.addListener((msg) => {
  console.log('Message in offscreen:', msg);
});
