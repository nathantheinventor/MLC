import { useEffect, useState } from 'react';
import { listenWS, sendMessage } from './connection';

interface Scene {
  id: number;
  name: string;
  recallTime: number;
  levels: number[];
}

interface Fixture {
  channel: number;
  name: string;
}

interface Settings {
  scenes: Scene[];
  fixtures: Fixture[];
  serialPort: string;
  midiPort: string;
}

let currentSettings: Settings = { scenes: [], fixtures: [], serialPort: '', midiPort: '' };
let loaded = false;
let loading = false;
const settingsHandles: ((settings: Settings) => void)[] = [];

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(currentSettings);
  useEffect(() => {
    settingsHandles.push(setSettings);
    if (!loading) {
      loading = true;
      listenWS('settings', (msg) => {
        settingsHandles.forEach((handle) => handle(msg.settings));
        loaded = true;
        currentSettings = JSON.parse(JSON.stringify(msg.settings));
      });
      sendMessage('getSettings');
    }
  }, []);
  return settings;
};

function updateSettings(settings: Settings) {
  if (!loaded) return;
  currentSettings = JSON.parse(JSON.stringify(settings));
  settingsHandles.forEach((handle) => handle(currentSettings));
  sendMessage('saveSettingsPartial', { settings });
}

export const updateScenes = (scenes: Scene[]) => updateSettings({ ...currentSettings, scenes });
export const updateFixtures = (fixtures: Fixture[]) => updateSettings({ ...currentSettings, fixtures });
export const updateSerialPort = (serialPort: string) => {
  updateSettings({ ...currentSettings, serialPort });
  sendMessage('setSerialPort', { port: serialPort });
};
export const updateMidiPort = (midiPort: string) => {
  updateSettings({ ...currentSettings, midiPort });
  sendMessage('setMidiPort', { port: midiPort });
};
