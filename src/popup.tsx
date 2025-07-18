import React, { useEffect, useState } from 'react';
import { Button } from '~components/ui/button';
import '~style.css';

const IndexPopup = () => {
  const [status, setStatus] = useState('');

  const getMicAccess = async () => {
    console.log('Sending GET_MIC_ACCESS message...');
    setStatus('Requesting microphone access...');
    try {
      await chrome.runtime.sendMessage({ type: 'GET_MIC_ACCESS' });
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('Error: ' + error);
    }
  };

  const revokeMicAccess = async () => {
    console.log('Sending REVOKE_MIC_ACCESS message...');
    setStatus('Revoking microphone access...');
    try {
      await chrome.runtime.sendMessage({ type: 'REVOKE_MIC_ACCESS' });
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('Error: ' + error);
    }
  };

  useEffect(() => {
    const messageListener = (message: any) => {
      console.log('Popup received message:', message);
      if (message.type === 'MIC_ACCESS_RESULT') {
        setStatus(message.message);
        // Clear status after 3 seconds
        setTimeout(() => setStatus(''), 3000);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  return (
    <div className="flex h-full w-[300px] flex-col items-center justify-center gap-4 p-4">
      <div className="flex gap-4">
        <Button
          onClick={getMicAccess}
          className="bg-green-500 px-6 py-3 text-white hover:bg-green-600"
        >
          Get Mic Access
        </Button>
        <Button
          onClick={revokeMicAccess}
          className="bg-red-500 px-6 py-3 text-white hover:bg-red-600"
        >
          Revoke Mic Access
        </Button>
      </div>
      {!!status && (
        <div
          className={`rounded p-2 text-sm ${status.includes('Failed') || status.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}
        >
          {status}
        </div>
      )}
    </div>
  );
};

export default IndexPopup;
