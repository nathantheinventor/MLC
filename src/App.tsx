import React from 'react';
import './App.scss';
import { MLCTabs } from './components/MLCTabs/MLCTabs';
import { faCog, faPlay, faList } from '@fortawesome/free-solid-svg-icons';
import { MLCSettings } from './components/MLCSettings/MLCSettings';
import { MLCScenes } from './components/MLCScenes/MLCScenes';
import { MLCLive } from './components/MLCLive/MLCLive';

function App() {
  return (
    <div>
      <MLCTabs
        tabs={[
          { id: 'live', title: 'Live', icon: faPlay, render: () => <MLCLive /> },
          { id: 'scene-setup', title: 'Scene Setup', icon: faList, render: () => <MLCScenes /> },
          { id: 'settings', title: 'Settings', icon: faCog, render: () => <MLCSettings /> }
        ]}
      />
    </div>
  );
}

export default App;
