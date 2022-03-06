// @ts-ignore
import midi from 'midi';
import os from 'os';
import { getSettings, saveSettingsPartial } from './settingsManager';
import { broadcast } from './server';

const input = new midi.Input();
input.on('message', (_: number, message: number[]) => {
  broadcast('setScene', { scene: message[0] });
});
export function getMidiOptions(): string[] {
  const options: string[] = [];
  if (os.platform() !== 'win32') {
    options.push('MLC (virtual port)');
  }

  for (let i = 0; i < input.getPortCount(); i++) {
    options.push(input.getPortName(i));
  }

  return options;
}

export function setMidiPort(port: string) {
  if (input.isPortOpen()) {
    input.closePort();
  }
  if (port === 'MLC (virtual port)') {
    input.openVirtualPort('MLC');
  } else {
    for (let i = 0; i < input.getPortCount(); i++) {
      if (input.getPortName(i) === port) {
        input.openPort(i);
      }
    }
  }
  saveSettingsPartial({ midiPort: port });
}

const settings = getSettings();
if (settings.midiPort) {
  setMidiPort(settings.midiPort);
}
