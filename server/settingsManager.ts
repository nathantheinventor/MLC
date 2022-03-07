import * as fs from 'fs';

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

const SETTINGS_FILE = 'settings.json';

export function getSettings(): Settings {
  if (fs.existsSync(SETTINGS_FILE)) {
    return JSON.parse(fs.readFileSync(SETTINGS_FILE).toString());
  }
  return { scenes: [], fixtures: [], serialPort: '', midiPort: '' };
}

export function saveSettings(settings: Settings) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings));
}

export function saveSettingsPartial(partial: Partial<Settings>) {
  const settings = { ...getSettings(), ...partial };
  console.log('saving settings', settings, partial);
  saveSettings(settings);
}
