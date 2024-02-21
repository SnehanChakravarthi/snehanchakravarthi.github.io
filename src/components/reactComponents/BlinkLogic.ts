import { useState, useEffect, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import type {
  SkinnedMesh,
  BufferGeometry,
  NormalBufferAttributes,
  Material,
  Object3DEventMap,
} from 'three';

const useBlink = (
  avatarMesh: RefObject<
    SkinnedMesh<
      BufferGeometry<NormalBufferAttributes>,
      Material | Material[],
      Object3DEventMap
    >
  >
) => {
  const [blinkTimings, setBlinkTimings] = useState(getRandomBlinkTimings());

  useEffect(() => {
    const timeoutId = setTimeout(
      () => setBlinkTimings(getRandomBlinkTimings()),
      blinkTimings.totalDuration * 1000
    );
    return () => clearTimeout(timeoutId);
  }, [blinkTimings.totalDuration]);

  useFrame((state) => {
    const { clock } = state;
    const elapsedTime = clock.getElapsedTime();
    const cycleTime = elapsedTime % blinkTimings.totalDuration;
    let influence = 0;

    if (
      avatarMesh.current?.morphTargetInfluences &&
      avatarMesh.current.morphTargetDictionary
    ) {
      const eyesClosedIndex =
        avatarMesh.current.morphTargetDictionary['eyesClosed'];
      if (typeof eyesClosedIndex === 'number') {
        influence = calculateBlinkInfluence(cycleTime, blinkTimings);
        avatarMesh.current.morphTargetInfluences[eyesClosedIndex] = influence;
      }
    }
  });
};

export default useBlink;

function getRandomBlinkTimings() {
  return {
    totalDuration: 3 + Math.random() * 3, // Random interval between 4 and 7 seconds
    blinkUpTime: 0.07, // Time to close eyes
    blinkDownTime: 0.05, // Time to reopen eyes
    blinkHoldTime: 0.1 + Math.random() * 0.1, // Random time eyes are closed
  };
}

function calculateBlinkInfluence(cycleTime: number, timings: any) {
  let influence = 0;
  if (cycleTime < timings.blinkUpTime) {
    influence = cycleTime / timings.blinkUpTime;
  } else if (cycleTime < timings.blinkUpTime + timings.blinkHoldTime) {
    influence = 1;
  } else if (
    cycleTime <
    timings.blinkUpTime + timings.blinkHoldTime + timings.blinkDownTime
  ) {
    influence =
      1 -
      (cycleTime - timings.blinkUpTime - timings.blinkHoldTime) /
        timings.blinkDownTime;
  }
  return influence;
}
