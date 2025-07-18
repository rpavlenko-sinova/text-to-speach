import OFFSCREEN_URL from 'url:~/src/offscreen.html';

async function ensureOffscreenDocument() {
  const isExist = await chrome.offscreen.hasDocument();
  if (isExist) {
    console.log('Offscreen document already exists');
    return;
  }

  console.log('Creating offscreen document...');
  await chrome.offscreen.createDocument({
    url: OFFSCREEN_URL,
    reasons: [chrome.offscreen.Reason.USER_MEDIA],
    justification: 'Need audio input for processing voice commands',
  });
  console.log('Offscreen document created successfully');
}

// Handle messages from popup and forward to offscreen document
chrome.runtime.onMessage.addListener((message) => {
  console.log('Background received message:', message);

  if (message.type === 'ENSURE_OFFSCREEN') {
    ensureOffscreenDocument();
  } else if (message.type === 'OFFSCREEN_READY') {
    console.log('Offscreen document is ready!');
  } else if (message.type === 'GET_MIC_ACCESS' || message.type === 'REVOKE_MIC_ACCESS') {
    console.log('Forwarding message to offscreen document:', message);
    // Forward the message to the offscreen document
    chrome.runtime
      .sendMessage(message)
      .then(() => {
        console.log('Message forwarded successfully to offscreen');
      })
      .catch((error) => {
        console.error('Error forwarding message to offscreen:', error);
      });
  }
});

// Also listen for messages from offscreen document and forward to popup
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'MIC_ACCESS_RESULT') {
    console.log('Background forwarding MIC_ACCESS_RESULT to popup:', message);
    // Forward the result back to the popup
    chrome.runtime.sendMessage(message).catch((error) => {
      console.error('Error forwarding result to popup:', error);
    });
  }
});

ensureOffscreenDocument();
