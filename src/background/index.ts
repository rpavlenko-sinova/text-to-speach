import OFFSCREEN_URL from 'url:~/src/offscreen.html';

async function ensureOffscreenDocument() {
  const isExist = await chrome.offscreen.hasDocument();
  if (isExist) {
    return;
  }

  await chrome.offscreen.createDocument({
    url: OFFSCREEN_URL,
    reasons: [chrome.offscreen.Reason.USER_MEDIA],
    justification: 'Need audio input for processing voice commands',
  });
}

ensureOffscreenDocument();
