import { SerialPort } from 'serialport';
import { getSettings } from './settingsManager';

let port: SerialPort;

export async function getSerialOptions(): Promise<string[]> {
  const ports = await SerialPort.list();
  return ports.filter((port) => port.vendorId === '0403' && port.productId === '6001').map((port) => port.path);
}

export function setSerialPort(path: string) {
  if (port) port.close();
  port = new SerialPort({ path, baudRate: 57600 });
}

export function setLevels(levels: number[]) {
  const levels2 = new Uint8Array(518);
  levels2[0] = 0x7e; // Values from DmxPy
  levels2[1] = 6;
  levels2[2] = 1;
  levels2[3] = 2;
  levels2[517] = 0xe7;
  for (let i = 0; i < Math.min(levels.length, 513); i++) {
    levels2[i + 4] = Math.min(255, Math.max(0, Math.floor(levels[i])));
  }
  if (port) port.write(levels2);
}

const settings = getSettings();
if (settings.serialPort) {
  setSerialPort(settings.serialPort);
}
