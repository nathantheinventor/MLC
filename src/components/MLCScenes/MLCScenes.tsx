import React, { useEffect, useState } from 'react';
import './MLCScenes.scss';
import { MLCFader } from '../MLCFader/MLCFader';
import { listenWS, sendMessage } from '../../services/connection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Fixture, showScene } from '../../services/show-scene';

interface Scene {
  id: number;
  name: string;
  recallTime: number;
  levels: number[];
}

export const MLCScenes: React.FC = () => {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [selectedScene, setSelectedScene] = useState<Scene>();
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    listenWS('settings', (msg) => {
      setFixtures(msg.settings.fixtures);
      setScenes(msg.settings.scenes);
    });
    sendMessage('getSettings');
  }, []);

  useEffect(() => {
    if (preview && selectedScene) showScene(selectedScene.levels, fixtures);
  }, [preview, selectedScene]);

  function addScene() {
    setSelectedScene({
      id: scenes.length + 1,
      name: 'Untitled Scene',
      levels: fixtures.map(() => 0),
      recallTime: 5000
    });
  }

  function save() {
    if (selectedScene!.id > scenes.length) scenes.push(selectedScene!);
    else scenes[selectedScene!.id - 1] = selectedScene!;
    setScenes(scenes.map((x) => x));
    sendMessage('saveSettingsPartial', { settings: { scenes } });
  }

  return (
    <div id='mlc-scenes'>
      <div id='scene-list'>
        {scenes.map((scene) => (
          <div key={scene.id} className='recall-scene' onClick={() => setSelectedScene(JSON.parse(JSON.stringify(scene)))}>
            {scene.name}
          </div>
        ))}
        <div className='add-scene' onClick={addScene}>
          <FontAwesomeIcon icon={faPlus} /> Add Scene
        </div>
      </div>
      {selectedScene ? (
        <div id='edit-scene'>
          <div id='scene-basics'>
            <div>
              <label>ID</label>
              <input value={selectedScene.id} disabled />
            </div>
            <div>
              <label>Scene Name</label>
              <input value={selectedScene.name} onChange={(event) => setSelectedScene({ ...selectedScene, name: event.target.value })} />
            </div>
            <div>
              <label>Recall Time [ms]</label>
              <input
                value={selectedScene.recallTime}
                type='number'
                onChange={(event) => setSelectedScene({ ...selectedScene, recallTime: Number(event.target.value) })}
              />
            </div>
            <div>
              <label>Preview</label>
              <input type='checkbox' checked={preview} onChange={(event) => setPreview(event.target.checked)} />
            </div>
            <div>
              <button onClick={save}>Save</button>
            </div>
          </div>
          <div id='faders'>
            {fixtures.map((fixture, i) => (
              <MLCFader
                key={i}
                name={fixture.name}
                value={selectedScene.levels[i]}
                onChange={(val) => {
                  while (selectedScene.levels.length < fixtures.length) {
                    selectedScene.levels.push(0);
                  }
                  selectedScene.levels[i] = val;
                  setSelectedScene({ ...selectedScene });
                }}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
