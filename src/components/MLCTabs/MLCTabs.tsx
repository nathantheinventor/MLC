import React, { ReactNode, useState } from 'react';
import './MLCTabs.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface MLCTabsProps {
  tabs: {
    id: string;
    title: string;
    icon: IconProp;
    render(): ReactNode;
  }[];
}

export const MLCTabs: React.FC<MLCTabsProps> = ({ tabs }) => {
  const [selectedTab, setSelectedTab] = useState(tabs[0].id);
  return (
    <div className='mlc-tabs'>
      <div className='tabs'>
        {tabs.map((tab) => (
          <div key={tab.id} className={'tab' + (selectedTab === tab.id ? ' selected' : '')} onClick={() => setSelectedTab(tab.id)}>
            <FontAwesomeIcon icon={tab.icon} /> &nbsp;{tab.title}
          </div>
        ))}
      </div>
      <div className='content'>{tabs.filter((t) => t.id === selectedTab)[0].render()}</div>
    </div>
  );
};
