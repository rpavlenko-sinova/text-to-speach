console.log('👻 Offscreen document loaded');

// Test message to verify offscreen document is working
chrome.runtime.sendMessage({ type: 'OFFSCREEN_READY' }).catch((error) => {
  console.error('Error sending ready message:', error);
});

let currentStream: MediaStream | null = null;

chrome.runtime.onMessage.addListener((msg) => {
  console.log('Message in offscreen:', msg);

  if (msg.type === 'GET_MIC_ACCESS') {
    console.log('Handling GET_MIC_ACCESS in offscreen...');
    handleGetMicAccess();
  } else if (msg.type === 'REVOKE_MIC_ACCESS') {
    console.log('Handling REVOKE_MIC_ACCESS in offscreen...');
    handleRevokeMicAccess();
  } else {
    console.log('Unknown message type in offscreen:', msg.type);
  }
});

async function handleGetMicAccess() {
  try {
    console.log('Requesting microphone access...');

    // Request microphone permission
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    currentStream = stream;
    console.log('Microphone access granted!');

    // Send success message back to popup
    chrome.runtime.sendMessage({
      type: 'MIC_ACCESS_RESULT',
      success: true,
      message: 'Microphone access granted successfully!',
    });
  } catch (error) {
    console.error('Failed to get microphone access:', error);

    // Send error message back to popup
    chrome.runtime.sendMessage({
      type: 'MIC_ACCESS_RESULT',
      success: false,
      message: `Failed to get microphone access: ${error}`,
    });
  }
}

function handleRevokeMicAccess() {
  try {
    console.log('Revoking microphone access...');

    if (currentStream) {
      // Stop all tracks in the stream
      currentStream.getTracks().forEach((track) => {
        track.stop();
      });
      currentStream = null;
      console.log('Microphone access revoked successfully!');

      // Send success message back to popup
      chrome.runtime.sendMessage({
        type: 'MIC_ACCESS_RESULT',
        success: true,
        message: 'Microphone access revoked successfully!',
      });
    } else {
      console.log('No active microphone stream to revoke');

      // Send info message back to popup
      chrome.runtime.sendMessage({
        type: 'MIC_ACCESS_RESULT',
        success: true,
        message: 'No active microphone stream to revoke',
      });
    }
  } catch (error) {
    console.error('Failed to revoke microphone access:', error);

    // Send error message back to popup
    chrome.runtime.sendMessage({
      type: 'MIC_ACCESS_RESULT',
      success: false,
      message: `Failed to revoke microphone access: ${error}`,
    });
  }
}
