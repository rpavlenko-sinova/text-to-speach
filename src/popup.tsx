/* eslint-disable react/jsx-no-leaked-render */
import { Settings } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Button } from '~components/ui/button';

import '~style.css';

const IndexPopup = () => {
  const [text, setText] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);

  const textToSpeech = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const startRecognition = async () => {
    try {
      // First, request microphone permission through offscreen document
      chrome.runtime.sendMessage({ type: 'REQUEST_MICROPHONE_PERMISSION' });

      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab.id) {
        alert('No active tab found');
        return;
      }

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          if (!('webkitSpeechRecognition' in window)) {
            alert('Speech recognition not supported in this browser.');
            return;
          }

          navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
              (window as any).audioStream = stream;

              const recognition = new (window as any).webkitSpeechRecognition();
              recognition.continuous = true;
              recognition.interimResults = true;
              recognition.lang = 'en-US';

              recognition.onresult = (event: any) => {
                let interim = '';
                let final = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                  const transcriptSegment = event.results[i][0].transcript;
                  if (event.results[i].isFinal) {
                    final += transcriptSegment;
                  } else {
                    interim += transcriptSegment;
                  }
                }

                chrome.runtime.sendMessage({
                  type: 'SPEECH_RESULT',
                  data: { final, interim },
                });
              };

              recognition.onerror = (e: any) => {
                console.error('Speech recognition error:', e);
                chrome.runtime.sendMessage({
                  type: 'SPEECH_ERROR',
                  data: { error: e.error },
                });
              };

              recognition.onend = () => {
                chrome.runtime.sendMessage({
                  type: 'SPEECH_END',
                });
              };

              (window as any).currentRecognition = recognition;
              recognition.start();
            })
            .catch((error) => {
              console.error('Error accessing microphone:', error);
              chrome.runtime.sendMessage({
                type: 'SPEECH_ERROR',
                data: { error: 'Microphone access denied' },
              });
            });
        },
      });

      setIsListening(true);
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      alert("Failed to start speech recognition. Make sure you're on a supported website.");
    }
  };

  const stopRecognition = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (tab.id) {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            if ((window as any).currentRecognition) {
              (window as any).currentRecognition.stop();
              (window as any).currentRecognition = null;
            }

            if ((window as any).audioStream) {
              (window as any).audioStream.getTracks().forEach((track: any) => track.stop());
              (window as any).audioStream = null;
            }
          },
        });
      }

      setIsListening(false);
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  };

  useEffect(() => {
    const messageListener = (message: any) => {
      if (message.type === 'SPEECH_RESULT') {
        setTranscript((prev) => prev + message.data.final + message.data.interim);
      } else if (message.type === 'SPEECH_ERROR') {
        console.error('Speech recognition error:', message.data.error);
        setIsListening(false);
      } else if (message.type === 'SPEECH_END') {
        setIsListening(false);
      } else if (message.type === 'MICROPHONE_PERMISSION_GRANTED') {
        console.log('Microphone permission granted');
        // Continue with speech recognition
      } else if (message.type === 'MICROPHONE_PERMISSION_DENIED') {
        console.error('Microphone permission denied:', message.data?.error);
        alert(
          'Microphone permission is required for speech-to-text functionality. Please grant permission in the offscreen document.',
        );
        setIsListening(false);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const openSettings = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div className="flex h-full w-[600px] items-center justify-center gap-2">
      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to speak..."
          className="px-3 py-2 border border-gray-300 rounded-md"
        />
        <Button onClick={textToSpeech}>Speak</Button>
      </div>
      <div className="flex flex-col gap-2">
        <div
          id="transcript"
          className="min-h-[100px] p-3 border border-gray-300 rounded-md bg-gray-50"
        >
          {transcript || 'Speech transcript will appear here...'}
        </div>
        <Button
          onClick={isListening ? stopRecognition : startRecognition}
          className={isListening ? 'bg-red-500 hover:bg-red-600' : ''}
        >
          {isListening ? 'Stop Listening' : 'Start Speech to Text'}
        </Button>
        <Button
          onClick={openSettings}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  );
};

export default IndexPopup;
