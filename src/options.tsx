import { Mic, MicOff, Settings, Volume2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Button } from '~components/ui/button';

import '~style.css';

const OptionsPage = () => {
  const [microphonePermission, setMicrophonePermission] = useState<PermissionState | null>(null);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [settings, setSettings] = useState({
    autoStart: false,
    language: 'en-US',
    voiceSpeed: 1,
    voicePitch: 1,
    voiceVolume: 1,
  });

  useEffect(() => {
    requestMicrophonePermission();
  }, []);

  const requestMicrophonePermission = async () => {
    setIsRequestingPermission(true);
    try {
      const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      setMicrophonePermission(permission.state);

      if (permission.state === 'granted') {
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicrophonePermission('granted');

      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setMicrophonePermission('denied');
    } finally {
      setIsRequestingPermission(false);
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getPermissionStatusColor = () => {
    switch (microphonePermission) {
      case 'granted':
        return 'text-green-600';
      case 'denied':
        return 'text-red-600';
      case 'prompt':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPermissionStatusText = () => {
    switch (microphonePermission) {
      case 'granted':
        return 'Microphone access granted';
      case 'denied':
        return 'Microphone access denied';
      case 'prompt':
        return 'Microphone permission pending';
      default:
        return 'Checking microphone permission...';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <Settings className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Extension Settings</h1>
          </div>

          {/* Microphone Permission Section */}
          <div className="mb-8 p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              {microphonePermission === 'granted' ? (
                <Mic className="h-6 w-6 text-green-600" />
              ) : (
                <MicOff className="h-6 w-6 text-red-600" />
              )}
              <h2 className="text-lg font-semibold text-gray-900">Microphone Permission</h2>
            </div>

            <p className={`mb-4 ${getPermissionStatusColor()}`}>{getPermissionStatusText()}</p>

            {microphonePermission !== 'granted' && (
              <Button
                onClick={requestMicrophonePermission}
                disabled={isRequestingPermission}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isRequestingPermission ? 'Requesting...' : 'Grant Microphone Permission'}
              </Button>
            )}
          </div>

          {/* Speech Settings */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Speech Settings
            </h2>

            <div className="space-y-4">
              {/* Language Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Speech Recognition Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="es-ES">Spanish</option>
                  <option value="fr-FR">French</option>
                  <option value="de-DE">German</option>
                  <option value="it-IT">Italian</option>
                  <option value="pt-BR">Portuguese (Brazil)</option>
                  <option value="ja-JP">Japanese</option>
                  <option value="ko-KR">Korean</option>
                  <option value="zh-CN">Chinese (Simplified)</option>
                </select>
              </div>

              {/* Auto Start */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Auto-start speech recognition</label>
                <input
                  type="checkbox"
                  checked={settings.autoStart}
                  onChange={(e) => handleSettingChange('autoStart', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>

              {/* Voice Speed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voice Speed: {settings.voiceSpeed}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={settings.voiceSpeed}
                  onChange={(e) => handleSettingChange('voiceSpeed', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Voice Pitch */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voice Pitch: {settings.voicePitch}
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={settings.voicePitch}
                  onChange={(e) => handleSettingChange('voicePitch', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Voice Volume */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voice Volume: {Math.round(settings.voiceVolume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.voiceVolume}
                  onChange={(e) => handleSettingChange('voiceVolume', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={() => {
                // Save settings to storage
                chrome.storage.sync.set({ settings }, () => {
                  alert('Settings saved successfully!');
                });
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionsPage;
