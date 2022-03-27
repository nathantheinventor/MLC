import { sendMessage } from './connection';
import { useState } from 'react';

export interface Fixture {
  channel: number;
  name: string;
}

const now = () => new Date().getTime();

let recallTimer: number | null = null;

let currentLevels: number[] = [];
const levelHandles: ((levels: number[]) => void)[] = [];

export const useCurrentLevels = () => {
  const [levels, setLevels] = useState<number[]>(currentLevels);
  levelHandles.push(setLevels);
  return levels;
};

export function updateLevel(index: number, fixtures: Fixture[]) {
  return (level: number) => {
    if (recallTimer !== null) {
      clearInterval(recallTimer);
      recallTimer = null;
    }
    currentLevels[index] = level;
    for (const setLevels of levelHandles) {
      setLevels(currentLevels);
    }
    showScene(currentLevels, fixtures);
  };
}

export function recallScene(targetLevels: number[], fixtures: Fixture[], duration: number) {
  const initLevels = currentLevels.map((x) => x);
  const startTimestamp = now();
  if (recallTimer !== null) {
    clearInterval(recallTimer);
    recallTimer = null;
  }

  recallTimer = window.setInterval(() => {
    const n = now();
    if (n > startTimestamp + duration) {
      clearInterval(recallTimer!);
      recallTimer = null;
      showScene(targetLevels, fixtures);
      return;
    }
    const currentTarget = [];
    for (let i = 0; i < targetLevels.length; i++) {
      const delta = targetLevels[i] - initLevels[i];
      const change = Math.floor(((n - startTimestamp) / duration) * delta);
      currentTarget.push(initLevels[i] + change);
    }
    showScene(currentTarget, fixtures);
  }, 10);
}

export function showScene(rawLevels: number[], fixtures: Fixture[]) {
  const levels: number[] = [];
  currentLevels = rawLevels;
  for (const setLevels of levelHandles) {
    setLevels(rawLevels);
  }
  for (let i = 0; i < 512; i++) {
    levels.push(0);
  }
  for (let i = 0; i < fixtures.length; i++) {
    levels[fixtures[i].channel] = rawLevels[i];
  }
  sendMessage('sendLevels', { levels });
}
