import React, { useState, MouseEvent, useRef } from 'react';
import './MLCFader.scss';

interface MLCFaderProps {
  name: string;
  value: number;
  onChange(val: number): void;
}

export const MLCFader: React.FC<MLCFaderProps> = ({ name, value, onChange }) => {
  const [dragging, setDragging] = useState(false);
  const slider = useRef<HTMLDivElement>(null);

  function onMouseMove(event: MouseEvent<HTMLDivElement>) {
    if (!dragging) return;
    const rect = slider.current?.getBoundingClientRect();
    const y = Math.max(0, event.clientY - (rect?.y || 0));
    onChange(Math.max(0, 255 - y * 2));
  }

  return (
    <div
      className='mlc-fader'
      onMouseLeave={() => setDragging(false)}
      onMouseDown={() => setDragging(true)}
      onMouseUp={() => setDragging(false)}
      onMouseMove={onMouseMove}
    >
      <div className='fader-name'>{name}</div>
      <div className='fader'>
        <div className='slider-bar' ref={slider} />
        <div className='slider-tab' style={{ top: 128 - value / 2 }} />
      </div>
      <div className='fader-value'>{value}</div>
    </div>
  );
};
