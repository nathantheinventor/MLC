import * as WebSocket from 'ws';
import { getSettings, saveSettings, saveSettingsPartial } from './settingsManager';
import { getMidiOptions, setMidiPort } from './midi';
import { getSerialOptions, setLevels, setSerialPort } from './serial';

const webSockets: WebSocket[] = [];
export function broadcast(type: string, message?: any) {
  for (const ws of webSockets) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type, ...message }));
    }
  }
}

export function setupServer() {
  const wss = new WebSocket.Server({ port: 8234 });
  wss.on('connection', (ws: WebSocket) => {
    webSockets.push(ws);
    ws.on('message', async (msg) => {
      const message = JSON.parse(msg.toString());
      switch (message.type) {
        case 'getSettings':
          return ws.send(JSON.stringify({ type: 'settings', settings: getSettings() }));
        case 'saveSettings':
          return saveSettings(message.settings);
        case 'saveSettingsPartial':
          return saveSettingsPartial(message.settings);
        case 'getMidiOptions':
          return ws.send(JSON.stringify({ type: 'midiOptions', options: getMidiOptions() }));
        case 'setMidiPort':
          return setMidiPort(message.port);
        case 'getSerialOptions':
          return ws.send(JSON.stringify({ type: 'serialOptions', options: await getSerialOptions() }));
        case 'setSerialPort':
          return setSerialPort(message.port);
        case 'sendLevels':
          return setLevels(message.levels);
      }
    });
  });
}
