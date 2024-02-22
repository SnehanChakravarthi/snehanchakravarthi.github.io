import { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';

function useMorphTargetAnimation(
	avatarMeshRef: React.RefObject<any>,
	shapeKeyName: string,
	targetInfluence: number,
	speed: number,
	duration: number
) {
	const [isAnimating, setIsAnimating] = useState(false);
	// Track whether we are in the forward, waiting, or reverse phase of the animation
	const animationPhase = useRef<'forward' | 'waiting' | 'reverse' | 'none'>('none');
	const animationStart = useRef(0);

	useEffect(() => {
		if (isAnimating) {
			animationStart.current = performance.now();
			animationPhase.current = 'forward';
		}
	}, [isAnimating]);

	useFrame(() => {
		if (!isAnimating || !avatarMeshRef.current || animationPhase.current === 'none') return;

		const elapsedTime = (performance.now() - animationStart.current) / 1000; // convert ms to seconds

		const morphTargetIndex = avatarMeshRef.current.morphTargetDictionary[shapeKeyName];
		let newInfluence;

		switch (animationPhase.current) {
			case 'forward':
				if (elapsedTime <= speed) {
					const progress = elapsedTime / speed;
					newInfluence = MathUtils.lerp(0, targetInfluence, progress);
					avatarMeshRef.current.morphTargetInfluences[morphTargetIndex] = newInfluence;
				} else {
					animationPhase.current = 'waiting';
					animationStart.current = performance.now();
					setTimeout(() => {
						animationPhase.current = 'reverse';
						animationStart.current = performance.now();
					}, duration * 1000); // Wait for the duration before starting reverse
				}
				break;
			case 'reverse':
				const reverseTime = (performance.now() - animationStart.current) / 1000;
				if (reverseTime <= speed) {
					const progress = reverseTime / speed;
					newInfluence = MathUtils.lerp(targetInfluence, 0, progress);
					avatarMeshRef.current.morphTargetInfluences[morphTargetIndex] = newInfluence;
				} else {
					// End the animation smoothly without resetting abruptly
					setIsAnimating(false);
					animationPhase.current = 'none';
					avatarMeshRef.current.morphTargetInfluences[morphTargetIndex] = 0; // Ensure it ends at 0
				}
				break;
			// No action needed for 'waiting' phase, just let the timeout handle the transition
		}
	});

	// Expose a function to start the animation
	const startAnimation = () => setIsAnimating(true);

	return startAnimation;
}

export default useMorphTargetAnimation;
