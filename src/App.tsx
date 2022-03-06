import React from 'react';
import './App.scss';
import { MLCTabs } from './components/MLCTabs/MLCTabs';
import { faCog, faPlay, faList } from '@fortawesome/free-solid-svg-icons';
import { MlcSettings } from './components/MlcSettings/MlcSettings';

function App() {
  return (
    <div>
      <MLCTabs
        tabs={[
          { id: 'live', title: 'Live', icon: faPlay, render: () => <MlcSettings /> },
          { id: 'scene-setup', title: 'Scene Setup', icon: faList, render: () => <MlcSettings /> },
          { id: 'settings', title: 'Settings', icon: faCog, render: () => <MlcSettings /> }
        ]}
      />
    </div>
  );
}

export default App;
