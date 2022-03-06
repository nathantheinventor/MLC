import * as WebSocket from 'ws';
import { getSettings, saveSettings, saveSettingsPartial } from './settingsManager';
import { getMidiOptions, setMidiPort } from './midi';

const webSockets: WebSocket[] = [];
export function broadcast(type: string, message?: any) {
  for (const ws of webSockets) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send({ type, ...message });
    }
  }
}

export function setupServer() {
  const wss = new WebSocket.Server({ port: 8234 });
  wss.on('connection', (ws: WebSocket) => {
    webSockets.push(ws);
    ws.on('message', (msg) => {
      const message = JSON.parse(msg.toString());
      switch (message.type) {
        case 'getSettings':
          return ws.send(JSON.stringify({ type: 'getSettings', settings: getSettings() }));
        case 'saveSettings':
          return saveSettings(message.settings);
        case 'saveSettingsPartial':
          return saveSettingsPartial(message.settings);
        case 'getMidiOptions':
          return ws.send(JSON.stringify({ type: 'midiOptions', settings: getMidiOptions() }));
        case 'setMidiPort':
          return setMidiPort(message.port);
      }
    });
  });
}
