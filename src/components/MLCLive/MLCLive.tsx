import React, { useEffect, useRef, useState } from 'react';
import './MLCLive.scss';
import { MLCFader } from '../MLCFader/MLCFader';
import { listenWS, sendMessage } from '../../services/connection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Fixture, recallScene, showScene, updateLevel, useCurrentLevels } from '../../services/show-scene';
import { useSettings } from '../../services/settings';

interface Scene {
  id: number;
  name: string;
  recallTime: number;
  levels: number[];
}

export const MLCLive: React.FC = () => {
  const levels = useCurrentLevels();
  const settings = useSettings();
  const currentSettings = useRef(settings);
  currentSettings.current = settings;

  useEffect(() => {
    if (settings.fixtures.length)
      showScene(
        settings.fixtures.map(() => 0),
        settings.fixtures
      );
  }, [settings]);

  useEffect(() => {
    listenWS('recallScene', (msg) => {
      const settings = currentSettings.current;
      const scenes = settings.scenes.filter((s) => s.id === msg.id);
      if (scenes.length) recallScene(scenes[0].levels, settings.fixtures, scenes[0].recallTime);
    });
  }, []);

  return (
    <div id='mlc-live'>
      <div id='levels'>
        {settings.fixtures.map((fixture, i) => (
          <MLCFader key={i} name={fixture.name} value={levels[i]} onChange={updateLevel(i, settings.fixtures)} />
        ))}
      </div>
      <div id='scenes'>
        {settings.scenes.map((scene) => (
          <div key={scene.id} className='scene' onClick={() => recallScene(scene.levels, settings.fixtures, scene.recallTime)}>
            <FontAwesomeIcon icon={faPlay} /> &nbsp;{scene.name}
          </div>
        ))}
      </div>
    </div>
  );
};
