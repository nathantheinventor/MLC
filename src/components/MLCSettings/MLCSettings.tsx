import './MLCSettings.scss';
import React, { useEffect, useState } from 'react';
import { listenWS, sendMessage } from '../../services/connection';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fixture } from '../../services/show-scene';
import { updateFixtures, updateMidiPort, updateSerialPort, useSettings } from '../../services/settings';

export const MLCSettings: React.FC = () => {
  const [midiOptions, setMidiOptions] = useState<string[]>([]);
  const [serialOptions, setSerialOptions] = useState<string[]>([]);
  const settings = useSettings();

  useEffect(() => {
    listenWS('midiOptions', (msg) => setMidiOptions(msg.options));
    listenWS('serialOptions', (msg) => setSerialOptions(msg.options));
    sendMessage('getMidiOptions');
    sendMessage('getSerialOptions');
  }, []);

  function setFixtureChannel(i: number, channel: string) {
    settings.fixtures[i].channel = Number(channel);
    updateFixtures(settings.fixtures);
  }

  function setFixtureName(i: number, name: string) {
    settings.fixtures[i].name = name;
    updateFixtures(settings.fixtures);
  }

  function createFixture() {
    const fixture = { channel: 0, name: 'Fixture' };
    updateFixtures(settings.fixtures.concat(fixture));
  }

  return (
    <div id='mlc-settings'>
      <h1>Settings</h1>
      <label>Midi Port</label>
      <select value={settings.midiPort} onChange={(event) => updateMidiPort(event.target.value)}>
        <option value=''>-</option>
        {midiOptions.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
      <label>Serial Port</label>
      <select value={settings.serialPort} onChange={(event) => updateSerialPort(event.target.value)}>
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
          {settings.fixtures.map((fixture, i) => (
            <tr key={`${i}|${fixture.channel}|${fixture.name}`}>
              <td>
                <input defaultValue={fixture.channel} type='number' onBlur={(event) => setFixtureChannel(i, event.target.value)} />
              </td>
              <td>
                <input defaultValue={fixture.name} onBlur={(event) => setFixtureName(i, event.target.value)} />
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
