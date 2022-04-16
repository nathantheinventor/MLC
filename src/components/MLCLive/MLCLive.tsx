import React, { useEffect, useState } from 'react';
import './MLCLive.scss';
import { MLCFader } from '../MLCFader/MLCFader';
import { listenWS, sendMessage } from '../../services/connection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Fixture, recallScene, showScene, updateLevel, useCurrentLevels } from '../../services/show-scene';

interface Scene {
  id: number;
  name: string;
  recallTime: number;
  levels: number[];
}

export const MLCLive: React.FC = () => {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const levels = useCurrentLevels();

  useEffect(() => {
    listenWS('settings', (msg) => {
      const { fixtures, scenes } = msg.settings;
      setScenes(scenes);
      showScene(
        fixtures.map(() => 0),
        fixtures
      );
      setFixtures(fixtures);
    });
    sendMessage('getSettings');
  }, []);

  return (
    <div id='mlc-live'>
      <div id='levels'>
        {fixtures.map((fixture, i) => (
          <MLCFader key={i} name={fixture.name} value={levels[i]} onChange={updateLevel(i, fixtures)} />
        ))}
      </div>
      <div id='scenes'>
        {scenes.map((scene) => (
          <div key={scene.id} className='scene' onClick={() => recallScene(scene.levels, fixtures, scene.recallTime)}>
            <FontAwesomeIcon icon={faPlay} /> &nbsp;{scene.name}
          </div>
        ))}
      </div>
    </div>
  );
};
