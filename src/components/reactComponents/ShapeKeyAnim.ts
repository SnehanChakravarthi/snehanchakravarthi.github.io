import { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';

function useMorphTargetAnimation(
  avatarMeshRef: React.RefObject<any>,
  shapeKeyName: string,
  targetInfluence: number,
  duration: number
) {
  const [isAnimating, setIsAnimating] = useState(false);
  const animationStart = useRef(0);

  useEffect(() => {
    if (isAnimating) {
      animationStart.current = performance.now();
    }
  }, [isAnimating]);

  useFrame((state, delta) => {
    if (!isAnimating || !avatarMeshRef.current) return;
    console.log('useMorphTargetAnimation');

    const elapsedTime = (performance.now() - animationStart.current) / 1000; // convert ms to seconds
    if (elapsedTime > duration) {
      setIsAnimating(false);
      return;
    }

    const morphTargetIndex =
      avatarMeshRef.current.morphTargetDictionary[shapeKeyName];
    if (typeof morphTargetIndex === 'number') {
      const progress = Math.min(elapsedTime / duration, 1); // ensure progress doesn't exceed 1
      avatarMeshRef.current.morphTargetInfluences[morphTargetIndex] =
        MathUtils.lerp(0, targetInfluence, progress);
    }
  });

  // Expose a function to start the animation
  const startAnimation = () => setIsAnimating(true);

  return startAnimation;
}

export default useMorphTargetAnimation;
