import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, Mesh } from 'three';

type AnimationConfig = {
	name: string;
	influence: number;
	speed: number;
	duration: number;
};

// Function to manage individual animation
const manageAnimation = (
	avatarMesh: React.RefObject<Mesh>,
	{ name, influence, speed, duration }: AnimationConfig,
	startAnimationCallback: () => void
) => {
	let animationStart = performance.now();
	let phase: 'forward' | 'waiting' | 'reverse' | 'done' = 'forward';

	return () => {
		if (!avatarMesh.current || phase === 'done') return;
		const morphTargetIndex = avatarMesh.current.morphTargetDictionary?.[name];
		if (
			typeof morphTargetIndex === 'undefined' ||
			avatarMesh.current.morphTargetInfluences === undefined
		)
			return;

		const elapsedTime = (performance.now() - animationStart) / 1000; // Convert ms to seconds
		let progress: number;

		switch (phase) {
			case 'forward':
				progress = Math.min(elapsedTime / speed, 1);
				avatarMesh.current.morphTargetInfluences[morphTargetIndex] = MathUtils.lerp(
					0,
					influence,
					progress
				);
				if (elapsedTime > speed) {
					phase = 'waiting';
					setTimeout(() => {
						phase = 'reverse';
						animationStart = performance.now();
					}, duration * 1000); // Transition to reverse after the duration
				}
				break;
			case 'reverse':
				const reverseElapsedTime = (performance.now() - animationStart) / 1000;
				progress = Math.min(reverseElapsedTime / speed, 1);
				avatarMesh.current.morphTargetInfluences[morphTargetIndex] = MathUtils.lerp(
					influence,
					0,
					progress
				);
				if (reverseElapsedTime >= speed) {
					avatarMesh.current.morphTargetInfluences[morphTargetIndex] = 0;
					phase = 'done'; // Mark the animation as completed
					startAnimationCallback(false); // Optionally, notify that the animation has completed
				}
				break;
		}
	};
};

// Hook to orchestrate multiple animations
function useMultipleMorphTargetAnimations(
	avatarMesh: React.RefObject<Mesh>,
	animations: AnimationConfig[]
) {
	const animationsRef = useRef<ReturnType<typeof manageAnimation>[]>([]);

	useEffect(() => {
		animations.forEach((animation) => {
			const startAnimationCallback = (isAnimating: boolean) => {
				// Implement logic to handle the state when animation starts or ends
				// This can be used to update a state or trigger other animations
			};
			const animationManager = manageAnimation(avatarMesh, animation, startAnimationCallback);
			animationsRef.current.push(animationManager);
		});

		return () => {
			animationsRef.current = [];
		};
	}, [animations, avatarMesh]);

	useFrame(() => {
		animationsRef.current.forEach((animate) => animate());
	});
}

export { useMultipleMorphTargetAnimations };
