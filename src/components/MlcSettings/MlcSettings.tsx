import './MlcSettings.scss';
import React, { useEffect, useState } from 'react';
import { listenWS, sendMessage } from '../../services/connection';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Fixture {
  channel: number;
  name: string;
}

export const MlcSettings: React.FC = () => {
  const [midiOptions, setMidiOptions] = useState<string[]>([]);
  const [midiPort, setMidiPort] = useState('');
  const [serialOptions, setSerialOptions] = useState<string[]>([]);
  const [serialPort, setSerialPort] = useState('');
  const [fixtures, setFixtures] = useState<Fixture[]>([]);

  useEffect(() => {
    listenWS('midiOptions', (msg) => setMidiOptions(msg.options));
    listenWS('serialOptions', (msg) => setSerialOptions(msg.options));
    listenWS('settings', (msg) => {
      setMidiPort(msg.settings.midiPort);
      setSerialPort(msg.settings.serialPort);
      setFixtures(msg.settings.fixtures);
    });
    sendMessage('getMidiOptions');
    sendMessage('getSerialOptions');
    sendMessage('getSettings');
  }, []);

  function setMidi(port: string) {
    setMidiPort(port);
    sendMessage('setMidiPort', { port });
  }

  function setSerial(port: string) {
    setSerialPort(port);
    sendMessage('setSerialPort', { port });
  }

  function setFixtureChannel(i: number, channel: string) {
    fixtures[i].channel = Number(channel);
    sendMessage('saveSettingsPartial', { settings: { fixtures } });
  }

  function setFixtureName(i: number, name: string) {
    fixtures[i].name = name;
    sendMessage('saveSettingsPartial', { settings: { fixtures } });
  }

  function createFixture() {
    const fixture = { channel: 0, name: 'Fixture' };
    setFixtures(fixtures.concat(fixture));
    sendMessage('saveSettingsPartial', { settings: { fixtures: fixtures.concat(fixture) } });
  }

  return (
    <div id='mlc-settings'>
      <h1>Settings</h1>
      <label>Midi Port</label>
      <select value={midiPort} onChange={(event) => setMidi(event.target.value)}>
        <option value=''>-</option>
        {midiOptions.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
      <label>Serial Port</label>
      <select value={serialPort} onChange={(event) => setSerial(event.target.value)}>
        <option value=''>-</option>
        {serialOptions.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
      <h2>Fixtures</h2>
      <table cellSpacing={0}>
        <thead>
          <tr>
            <th>Channel</th>
            <th>Name</th>
          </tr>
          {fixtures.map((fixture, i) => (
            <tr key={`${i}|${fixture.channel}|${fixture.name}`}>
              <td>
                <input defaultValue={fixture.channel} type='number' onChange={(event) => setFixtureChannel(i, event.target.value)} />
              </td>
              <td>
                <input defaultValue={fixture.name} onChange={(event) => setFixtureName(i, event.target.value)} />
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={2} style={{ cursor: 'pointer' }} onClick={createFixture}>
              <FontAwesomeIcon icon={faPlus} /> &nbsp;Create Fixture
            </td>
          </tr>
        </thead>
      </table>
    </div>
  );
};
