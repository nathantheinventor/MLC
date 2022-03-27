import React, { useEffect, useState } from 'react';
import { MLCFader } from '../MLCFader/MLCFader';
import { Fixture } from '../MLCSettings/MLCSettings';
import { listenWS, sendMessage } from '../../services/connection';

interface Scene {
  id: number;
  name: string;
  recallTime: number;
  levels: number[];
}

export const MLCScenes: React.FC = () => {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);

  useEffect(() => {
    listenWS('settings', (msg) => {
      setFixtures(msg.settings.fixtures);
    });
    sendMessage('getSettings');
  }, []);

  return <div id='mlc-scenes'></div>;
};
